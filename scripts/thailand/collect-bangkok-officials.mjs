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
  { name: '수쿰빗-중심', lat: 13.7400, lng: 100.5600 },
  { name: '실롬-방락',   lat: 13.7260, lng: 100.5330 },
  { name: '후아이쾅-라마9', lat: 13.7560, lng: 100.5680 },
  { name: '파야타이-랏차테위', lat: 13.7541, lng: 100.5331 },
  { name: '방나-프라웻', lat: 13.6680, lng: 100.6050 },
  { name: '돈므앙',      lat: 13.9100, lng: 100.5990 },
  { name: '짜뚜짝-방수', lat: 13.8185, lng: 100.5496 },
  { name: '통부리-방콕야이', lat: 13.7277, lng: 100.4815 },
  { name: '카오산-프라나콘', lat: 13.7609, lng: 100.4963 },
  { name: '아이콘시암-클롱산', lat: 13.7267, lng: 100.5105 },
];

const KEYWORDS = [
  '대한민국 대사관 방콕',
  'Korean embassy Bangkok',
  'police station Bangkok',
  '경찰서 방콕',
  'tourist police Bangkok',
  'KOTRA Bangkok',
  '한국문화원 방콕',
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
          radius: 5000.0,
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

  const { data: existingData } = await supabase.from('businesses').select('google_place_id').not('google_place_id', 'is', null).limit(100000);
  const existingIds = new Set((existingData || []).map(b => b.google_place_id));

  const seen = new Set();
  const toInsert = [];

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
          toInsert.push({
            google_place_id: p.id,
            name: p.displayName?.text ?? '',
            name_ko: p.displayName?.text ?? '',
            primary_type_ko: p.primaryTypeDisplayName?.text ?? null,
            category: '관공서',
            address: p.formattedAddress ?? '',
            phone: p.internationalPhoneNumber ?? null,
            lat: p.location?.latitude ?? null,
            lng: p.location?.longitude ?? null,
            city: 'bangkok',
            google_rating: p.rating ?? null,
            pending_approval: false,
            is_verified: false,
            is_korean_run: false,
            registration_type: 'script',
          });
        }
        console.log(`${places.length}개 중 신규 ${newCount}개`);
      } catch (e) {
        console.log('에러:', e.message);
      }
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`
총 신규: ${toInsert.length}개`);
  console.log('\n=== 수집된 업체 목록 ===');
  toInsert.forEach((b, i) => {
    console.log(`${i + 1}. [${b.google_place_id}] ${b.name} | ${b.primary_type_ko ?? ''} | ${b.address} | ${b.phone ?? '전화없음'} | ⭐${b.google_rating ?? '-'} | lat:${b.lat} lng:${b.lng}`);
  });
}

main().catch(console.error);