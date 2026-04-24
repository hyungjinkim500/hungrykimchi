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
  { name: '님만해민-중심',     lat: 18.7990, lng: 98.9680 },
  { name: '님만해민-북',       lat: 18.8100, lng: 98.9680 },
  { name: '올드시티-중심',     lat: 18.7880, lng: 98.9870 },
  { name: '올드시티-동',       lat: 18.7880, lng: 99.0000 },
  { name: '창클란-나이트바자', lat: 18.7800, lng: 99.0000 },
  { name: '산티탐',            lat: 18.8050, lng: 98.9930 },
  { name: '수언독-메조',       lat: 18.7950, lng: 98.9770 },
  { name: '한인타운-가오라오', lat: 18.7880, lng: 98.9780 },
];

const KEYWORDS = [
  '한국식당',
  '한식',
  '한국 음식점',
  'korean restaurant',
  'korean bbq',
  'korean food',
  'korean fried chicken',
  'korean cuisine',
  '삼겹살',
  '치킨',
  '순두부',
  '김치찌개',
  'ร้านอาหารเกาหลี',
  'บาร์บีคิวเกาหลี',
  'ไก่ทอดเกาหลี',
  '된장찌개',
  '냉면',
  '고기구이',
  '한국 BBQ',
  '부대찌개',
  '족발',
  '감자탕',
  '떡볶이',
  '한국 분식',
  '소주',
  '포차',
  '곱창',
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
      textQuery: `${keyword} chiang mai`,
      languageCode: 'ko',
      locationBias: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: 2000.0,
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

  console.log(`
총 ${results.length}개 수집 완료
`);
  results.forEach((p, i) => {
    console.log(`${i + 1}. [${p.google_place_id}] ${p.name} | ${p.primary_type_ko} | ${p.address} | ${p.phone} | ${p.rating} | ${p.lat} ${p.lng}`);
  });
}

main().catch(console.error);