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

const CITY = 'taipei';
const CITY_LABEL = '타이베이';
const SEARCH_RADIUS = 3000;

const ZONES = [
  { name: '다안-신이',     lat: 25.0330, lng: 121.5654 },
  { name: '중산-중정',     lat: 25.0480, lng: 121.5200 },
  { name: '쑹산-내호',     lat: 25.0600, lng: 121.5500 },
  { name: '완화-다퉁',     lat: 25.0430, lng: 121.5050 },
  { name: '스린-베이터우', lat: 25.0950, lng: 121.5240 },
  { name: '신베이-반차오', lat: 25.0140, lng: 121.4680 },
  { name: '신베이-중허',   lat: 25.0000, lng: 121.5000 },
  { name: '타오위안',      lat: 24.9936, lng: 121.3010 },
];

const KEYWORDS = [
  '한국 마트 타이베이',
  '한국 슈퍼마켓 타이베이',
  'Korean grocery taipei',
  '한국식품 타이베이',
  'K-mart taipei',
  '한국 식재료 타이베이',
  '코리안 마트 타이베이',
  '한국 편의점 타이베이',
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
  const results = [];

  for (const zone of ZONES) {
    for (const keyword of KEYWORDS) {
      process.stdout.write(`검색중: [${zone.name}] ${keyword} ... `);
      try {
        const places = await searchPlaces(keyword, zone.lat, zone.lng);
        let newCount = 0;
        for (const p of places) {
          if (!p.id || seen.has(p.id) || deletedIds.has(p.id) || existingIds.has(p.id)) continue;
          seen.add(p.id);
          newCount++;
          results.push({
            google_place_id: p.id,
            name: p.displayName?.text ?? '',
            primary_type_ko: p.primaryTypeDisplayName?.text ?? null,
            address: p.formattedAddress ?? '',
            phone: p.internationalPhoneNumber ?? null,
            lat: p.location?.latitude ?? null,
            lng: p.location?.longitude ?? null,
            rating: p.rating ?? null,
          });
        }
        console.log(`${places.length}개 중 신규 ${newCount}개`);
      } catch (e) {
        console.log('에러:', e.message);
      }
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`\n총 ${results.length}개 수집 완료\n`);
  results.forEach((p, i) => {
    console.log(`${i + 1}. [${p.google_place_id}] ${p.name} | ${p.primary_type_ko} | ${p.address} | ${p.phone} | ${p.rating} | ${p.lat} ${p.lng}`);
  });
}

main().catch(console.error);