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
  { name: '1군-중심',       lat: 10.7769, lng: 106.7009 },
  { name: '1군-북',         lat: 10.7850, lng: 106.6980 },
  { name: '1군-남',         lat: 10.7700, lng: 106.7050 },
  { name: '3군-중심',       lat: 10.7820, lng: 106.6850 },
  { name: '3군-북',         lat: 10.7900, lng: 106.6850 },
  { name: '빈탄-중심',      lat: 10.8000, lng: 106.7150 },
  { name: '빈탄-북',        lat: 10.8120, lng: 106.7150 },
  { name: '빈탄-동',        lat: 10.8000, lng: 106.7300 },
  { name: '푸뇬-중심',      lat: 10.7350, lng: 106.6950 },
  { name: '푸뇬-북',        lat: 10.7480, lng: 106.6980 },
  { name: '7군-중심',       lat: 10.7330, lng: 106.7220 },
  { name: '7군-푸미흥',     lat: 10.7280, lng: 106.7100 },
  { name: '7군-북',         lat: 10.7450, lng: 106.7200 },
  { name: '2군(투득)-중심', lat: 10.7870, lng: 106.7470 },
  { name: '2군(투득)-남',   lat: 10.7750, lng: 106.7500 },
  { name: '고밥-중심',      lat: 10.8500, lng: 106.6700 },
  { name: '고밥-동',        lat: 10.8500, lng: 106.6900 },
  { name: '탄빈-중심',      lat: 10.7550, lng: 106.6650 },
  { name: '탄빈-북',        lat: 10.7650, lng: 106.6680 },
  { name: '빈짠-중심',      lat: 10.8150, lng: 106.6600 },
];

const KEYWORDS = [
  '한식당',
  '한국 음식점',
  'korean restaurant',
  '삼겹살',
  '치킨',
  '순두부',
  '냉면',
  '고기구이',
  '한국 BBQ',
  'nhà hàng Hàn Quốc',
  '곱창',
  '부대찌개',
  '족발',
  '감자탕',
  '떡볶이',
  '김치찌개',
  '된장찌개',
  '한국 분식',
  '소주',
  '포차',
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
      textQuery: `${keyword} 호치민`,
      languageCode: 'ko',
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 1500.0,
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
            primary_type_ko: p.primaryTypeDisplayName?.text ?? null,
            category: '음식점',
            address: p.formattedAddress ?? '',
            phone: p.internationalPhoneNumber ?? null,
            lat: p.location?.latitude ?? null,
            lng: p.location?.longitude ?? null,
            city: 'hochiminh',
            google_rating: p.rating ?? null,
            pending_approval: true,
            is_verified: false,
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

  console.log(`\n총 신규: ${toInsert.length}개 INSERT 시작...`);

  const chunkSize = 50;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('businesses').insert(chunk);
    if (error) console.error(`insert 에러 (${i}~${i+chunkSize}):`, error.message);
    else console.log(`insert 완료: ${i+1}~${Math.min(i+chunkSize, toInsert.length)}`);
  }

  console.log('완료!');
}

main().catch(console.error);