import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!SUPABASE_KEY || !GOOGLE_API_KEY) {
  console.error('환경변수 누락: SUPABASE_KEY, GOOGLE_API_KEY 필요');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ZONES = [
  { lat: 14.5547, lng: 121.0244 },
  { lat: 14.5502, lng: 121.0504 },
  { lat: 14.5710, lng: 120.9836 },
  { lat: 14.6760, lng: 121.0437 },
  { lat: 14.5328, lng: 120.9912 },
  { lat: 14.5794, lng: 121.0359 },
  { lat: 14.4793, lng: 121.0198 },
  { lat: 14.5924, lng: 120.9764 },
];

const KEYWORDS = [
  '한국마트', '코리안마트', 'Korean mart', 'Korean grocery',
  'K-mart Philippines', 'Korean supermarket',
  '한국식품', 'Korean food store', 'K-food mart',
  'Funhan Mart', 'Gangnam Mart', 'Korean market Manila',
  'CU convenience store Manila', 'Korean convenience',
];

async function searchPlaces(keyword, zone) {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const body = {
    textQuery: keyword + ' Manila Philippines',
    languageCode: 'ko',
    locationBias: {
      circle: {
        center: { latitude: zone.lat, longitude: zone.lng },
        radius: 1500.0,
      },
    },
    maxResultCount: 20,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.nationalPhoneNumber,places.primaryTypeDisplayName',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data.places || [];
}

async function main() {
  const { data: existingData } = await supabase
    .from('businesses')
    .select('google_place_id')
    .eq('city', 'manila')
    .limit(10000);

  const { data: deletedData } = await supabase
    .from('deleted_places')
    .select('google_place_id')
    .limit(10000);

  const existingIds = new Set((existingData || []).map((r) => r.google_place_id));
  const deletedIds = new Set((deletedData || []).map((r) => r.google_place_id));

  const seen = new Set();
  const results = [];
  let index = 1;

  for (const zone of ZONES) {
    for (const keyword of KEYWORDS) {
      const places = await searchPlaces(keyword, zone);
      for (const place of places) {
        const pid = place.id;
        if (seen.has(pid) || existingIds.has(pid) || deletedIds.has(pid)) continue;
        seen.add(pid);

        const name = place.displayName?.text || '';
        const nameKo = place.displayName?.languageCode === 'ko' ? name : '';
        const type = place.primaryTypeDisplayName?.text || '';
        const address = place.formattedAddress || '';
        const phone = place.nationalPhoneNumber || '';
        const rating = place.rating || '';
        const lat = place.location?.latitude || '';
        const lng = place.location?.longitude || '';

        console.log(
          index + '. [' + pid + '] ' + name + ' | ' + nameKo + ' | ' + type + ' | ' + address + ' | ' + phone + ' | ' + rating + ' | ' + lat + ' ' + lng
        );
        results.push({ pid, name, nameKo, type, address, phone, rating, lat, lng });
        index++;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log('\n총 ' + results.length + '개 수집 완료');
}

main().catch(console.error);