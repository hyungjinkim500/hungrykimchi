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

const CITY = 'danang';
const CITY_LABEL = '다낭';
const SEARCH_RADIUS = 1500;

const ZONES = [
  // 다낭 - 한인 밀집
  { name: '미케비치-중심',     lat: 16.0544, lng: 108.2475 },
  { name: '미케비치-북',       lat: 16.0680, lng: 108.2470 },
  { name: '미케비치-남',       lat: 16.0400, lng: 108.2460 },
  { name: '한강-동쪽',         lat: 16.0678, lng: 108.2236 },
  { name: '한강-서쪽',         lat: 16.0678, lng: 108.2100 },
  { name: '다낭-중심',         lat: 16.0471, lng: 108.2068 },
  { name: '다낭-북',           lat: 16.0800, lng: 108.2100 },
  { name: '손짜반도',          lat: 16.1000, lng: 108.2700 },
  { name: '응우옌반린-한인촌', lat: 16.0350, lng: 108.2400 },
  { name: '안투옹-한인촌',     lat: 16.0200, lng: 108.2300 },
  { name: '다낭-남부',         lat: 15.9900, lng: 108.2200 },

  // 호이안
  { name: '호이안-올드타운',   lat: 15.8801, lng: 108.3380 },
  { name: '호이안-중심',       lat: 15.8794, lng: 108.3220 },
  { name: '호이안-해변',       lat: 15.8600, lng: 108.3500 },
  { name: '호이안-북',         lat: 15.9000, lng: 108.3300 },
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
      textQuery: `${keyword} ${CITY_LABEL}`,
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
            city: CITY,
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
총 신규: ${toInsert.length}개 INSERT 시작...`);

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