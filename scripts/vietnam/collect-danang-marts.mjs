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
  { name: '미케비치-중심',     lat: 16.0544, lng: 108.2475 },
  { name: '미케비치-북',       lat: 16.0680, lng: 108.2470 },
  { name: '미케비치-남',       lat: 16.0400, lng: 108.2460 },
  { name: '한강-동쪽',         lat: 16.0678, lng: 108.2236 },
  { name: '한강-서쪽',         lat: 16.0678, lng: 108.2100 },
  { name: '다낭-중심',         lat: 16.0471, lng: 108.2068 },
  { name: '다낭-북',           lat: 16.0800, lng: 108.2100 },
  { name: '응우옌반린-한인촌', lat: 16.0350, lng: 108.2400 },
  { name: '안투옹-한인촌',     lat: 16.0200, lng: 108.2300 },
  { name: '다낭-남부',         lat: 15.9900, lng: 108.2200 },
  { name: '호이안-올드타운',   lat: 15.8801, lng: 108.3380 },
  { name: '호이안-중심',       lat: 15.8794, lng: 108.3220 },
  { name: '호이안-해변',       lat: 15.8600, lng: 108.3500 },
];

const KEYWORDS = [
  '한국 마트',
  '한국 슈퍼',
  'Korean mart',
  'Korean supermarket',
  '코리아마트',
  '한국식품',
  '한국 식재료',
  'K-mart',
  'K-market',
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
            category: '마트/슈퍼',
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

  console.log(`\n총 신규: ${toInsert.length}개`);
  console.log('\n=== 수집된 업체 목록 ===');
  toInsert.forEach((b, i) => {
    console.log(`${i + 1}. [${b.google_place_id}] ${b.name} | ${b.primary_type_ko ?? '-'} | ${b.phone ?? '번호없음'} | ${b.address}`);
  });
}

main().catch(console.error);