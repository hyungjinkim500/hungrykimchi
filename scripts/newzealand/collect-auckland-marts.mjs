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
  { name: '노스코트-한인타운',    lat: -36.7967, lng: 174.7469 },
  { name: '타카푸나-중심',        lat: -36.7878, lng: 174.7764 },
  { name: '글렌필드-중심',        lat: -36.7800, lng: 174.7200 },
  { name: 'CBD-퀸스트리트',       lat: -36.8485, lng: 174.7633 },
  { name: '뉴마켓-브로드웨이',    lat: -36.8710, lng: 174.7760 },
  { name: '마운트웰링턴-중심',    lat: -36.9050, lng: 174.8430 },
  { name: '팬뮤어-중심',          lat: -36.8980, lng: 174.8500 },
  { name: '헨더슨-중심',          lat: -36.8700, lng: 174.6280 },
  { name: '보타니-이스트게이트',  lat: -36.9270, lng: 174.9140 },
  { name: '와이라우밸리-링크드라이브', lat: -36.7640, lng: 174.7370 },
  { name: '알바니-로즈데일',      lat: -36.7400, lng: 174.7200 },
  { name: '브라운스베이',         lat: -36.7150, lng: 174.7480 },
  { name: '마운트이든-도미니언',  lat: -36.8780, lng: 174.7500 },
  { name: '웨스트게이트-노스웨스트', lat: -36.8112, lng: 174.6045 },
];

const KEYWORDS = [
  '한국마트',
  '한국 식료품',
  'korean supermarket',
  'korean grocery',
  'korean food market',
  'H Mart',
  'Wang Korea',
  '한아름',
  'Asian grocery',
  'Asian supermarket',
  'Asian food market',
  'Asian mart',
  'international grocery',
  'oriental grocery',
  'kimchi market',
  '한국식품',
  'Korea food',
  'K-mart grocery',
  'Asian fresh market',
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
      textQuery: keyword + ' Auckland',
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

  const { data: existingData } = await supabase.from('businesses').select('google_place_id').not('google_place_id', 'is', null).limit(10000);
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
            category: '마트/슈퍼',
            address: p.formattedAddress ?? '',
            phone: p.internationalPhoneNumber ?? null,
            lat: p.location?.latitude ?? null,
            lng: p.location?.longitude ?? null,
            city: 'auckland',
            google_rating: p.rating ?? null,
          });
        }
        console.log(places.length + '개 중 신규 ' + newCount + '개');
      } catch (e) {
        console.log('에러:', e.message);
      }
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log('\n총 신규: ' + toInsert.length + '개');
  console.log('=== 수집된 업체 목록 ===');
  toInsert.forEach((b, i) => {
    console.log((i + 1) + '. [' + b.google_place_id + '] ' + b.name + ' | ' + (b.primary_type_ko ?? '') + ' | ' + b.address + ' | ' + (b.phone ?? '전화없음') + ' | ⭐' + (b.google_rating ?? '-'));
  });
}

main().catch(console.error);