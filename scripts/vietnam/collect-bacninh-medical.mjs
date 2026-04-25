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

const CITY = 'bacninh';
const SEARCH_RADIUS = 1500;

const ZONES = [
  { name: '박닌-도심',       lat: 21.1861, lng: 106.0763 },
  { name: '박닌-북',         lat: 21.2000, lng: 106.0763 },
  { name: '박닌-남',         lat: 21.1700, lng: 106.0763 },
  { name: '박닌-동',         lat: 21.1861, lng: 106.0950 },
  { name: '박닌-서',         lat: 21.1861, lng: 106.0580 },
  { name: '삼성단지-옌퐁',   lat: 21.2100, lng: 106.0400 },
  { name: '삼성단지-옌퐁2',  lat: 21.1950, lng: 106.0200 },
  { name: '한인밀집-미호',    lat: 21.1750, lng: 106.0500 },
  { name: '뚜이선-공단주변',  lat: 21.1600, lng: 106.0900 },
  { name: '꽛쩌우-공단주변',  lat: 21.2200, lng: 106.1100 },
];

const KEYWORDS = [
  'Korean clinic Bac Ninh',
  'Korean hospital Bac Ninh',
  'international clinic Bac Ninh',
  'phòng khám Hàn Quốc Bắc Ninh',
  'phòng khám quốc tế Bắc Ninh',
  'nha khoa Bắc Ninh',
  'dental clinic Bac Ninh',
  'Korean dental Bac Ninh',
  '한국 병원 박닌',
  '한국 클리닉 박닌',
  '치과 박닌',
  '내과 박닌',
  '피부과 박닌',
  'phòng khám đa khoa Bắc Ninh',
  'bệnh viện Bắc Ninh',
];

async function searchPlaces(keyword, lat, lng) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.formattedAddress,places.internationalPhoneNumber,places.rating,places.primaryTypeDisplayName',
    },
    body: JSON.stringify({
      textQuery: keyword,
      languageCode: 'ko',
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: SEARCH_RADIUS,
        },
      },
      maxResultCount: 20,
    }),
  });
  if (!res.ok) { console.error('API 에러:', res.status, await res.text()); return []; }
  const data = await res.json();
  return data.places || [];
}

async function main() {
  const { data: deletedData } = await supabase.from('deleted_places').select('google_place_id');
  const deletedIds = new Set((deletedData || []).map(d => d.google_place_id));

  const { data: existingData } = await supabase.from('businesses').select('google_place_id').not('google_place_id', 'is', null);
  const existingIds = new Set((existingData || []).map(b => b.google_place_id));

  const seen = new Set();
  const toInsert = [];

  for (const zone of ZONES) {
    for (const keyword of KEYWORDS) {
      process.stdout.write('검색중: [' + zone.name + '] ' + keyword + ' ... ');
      try {
        const places = await searchPlaces(keyword, zone.lat, zone.lng);
        let newCount = 0;
        for (const p of places) {
          if (!p.id || seen.has(p.id) || deletedIds.has(p.id) || existingIds.has(p.id)) continue;
          seen.add(p.id);
          newCount++;
          toInsert.push({
            google_place_id: p.id,
            name: p.displayName?.text ?? '',
            primary_type_ko: p.primaryTypeDisplayName?.text ?? null,
            category: '의료',
            address: p.formattedAddress ?? '',
            phone: p.internationalPhoneNumber ?? null,
            lat: p.location?.latitude ?? null,
            lng: p.location?.longitude ?? null,
            city: CITY,
            google_rating: p.rating ?? null,
            pending_approval: false,
            is_verified: false,
            is_korean_run: false,
            registration_type: 'script',
          });
        }
        console.log(places.length + '개 중 신규 ' + newCount + '개');
      } catch (e) {
        console.log('에러: ' + e.message);
      }
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log('총 신규: ' + toInsert.length + '개');
  console.log('=== 수집된 업체 목록 ===');
  toInsert.forEach(function(b, i) {
    console.log((i + 1) + '. [' + b.google_place_id + '] ' + b.name + ' | ' + (b.primary_type_ko ?? '-') + ' | ' + (b.phone ?? '번호없음') + ' | ' + (b.google_rating ?? '') + ' | ' + b.lat + ' ' + b.lng + ' | ' + b.address);
  });
}

main().catch(console.error);