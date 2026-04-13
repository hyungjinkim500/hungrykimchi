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

// 하노이 주요 지역 좌표
const ZONES = [
  { name: '미딩',       lat: 21.0245, lng: 105.7788 },
  { name: '호안끼엠',   lat: 21.0285, lng: 105.8542 },
  { name: '떠이호',     lat: 21.0600, lng: 105.8230 },
  { name: '동다',       lat: 21.0200, lng: 105.8430 },
  { name: '까우저이',   lat: 21.0380, lng: 105.7980 },
  { name: '하동',       lat: 20.9800, lng: 105.7800 },
  { name: '롱비엔',     lat: 21.0450, lng: 105.8850 },
  { name: '탄쑤언',     lat: 20.9950, lng: 105.8200 },
];

// 검색 키워드
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
      textQuery: `${keyword} 하노이`,
      languageCode: 'ko',
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 3000.0,
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
  const seen = new Set();
  const toUpsert = [];

  for (const zone of ZONES) {
    for (const keyword of KEYWORDS) {
      process.stdout.write(`검색중: [${zone.name}] ${keyword} ... `);
      try {
        const places = await searchPlaces(keyword, zone.lat, zone.lng);
        let newCount = 0;
        for (const p of places) {
          if (!p.id || seen.has(p.id)) continue;
          seen.add(p.id);
          newCount++;
          toUpsert.push({
            google_place_id: p.id,
            name: p.displayName?.text ?? '',
            primary_type_ko: p.primaryTypeDisplayName?.text ?? null,
            category: '음식점',
            address: p.formattedAddress ?? '',
            phone: p.internationalPhoneNumber ?? null,
            lat: p.location?.latitude ?? null,
            lng: p.location?.longitude ?? null,
            city: 'hanoi',
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

  console.log(`
총 수집: ${toUpsert.length}개 upsert 시작...`);

  // 50개씩 나눠서 upsert
  const chunkSize = 50;
  for (let i = 0; i < toUpsert.length; i += chunkSize) {
    const chunk = toUpsert.slice(i, i + chunkSize);
    const { error } = await supabase
      .from('businesses')
      .upsert(chunk, { onConflict: 'google_place_id' });
    if (error) console.error(`upsert 에러 (${i}~${i+chunkSize}):`, error.message);
    else console.log(`upsert 완료: ${i+1}~${Math.min(i+chunkSize, toUpsert.length)}`);
  }

  console.log('완료!');
}

main().catch(console.error);