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

const CITY = 'haiphong';
const CITY_LABEL = '하이퐁';
const SEARCH_RADIUS = 1500;

const ZONES = [
  { name: '홍방-행정중심',     lat: 20.8591, lng: 106.6812 },
  { name: '반까오-한인거리',   lat: 20.8360, lng: 106.7010 },
  { name: '응오꾸옌-중심',     lat: 20.8570, lng: 106.6990 },
  { name: '레쩐-중심',         lat: 20.8450, lng: 106.6870 },
  { name: '하이안-중심',       lat: 20.8320, lng: 106.7050 },
  { name: '이온몰-주변',       lat: 20.8320, lng: 106.6830 },
  { name: '빈홈임페리아-주변', lat: 20.8630, lng: 106.6630 },
  { name: '투이응우옌',        lat: 20.9000, lng: 106.7000 },
  { name: '안즈엉-공단',       lat: 20.8600, lng: 106.5750 },
];

const KEYWORDS = [
  '경찰서',
  '하이퐁 경찰',
  'công an Hải Phòng',
  'police station Hai Phong',
  '한국 영사관',
  '한국 대사관',
  'Korean consulate Hai Phong',
  'Korean embassy Hai Phong',
  '출입국관리소',
  'immigration Hai Phong',
  'xuất nhập cảnh Hải Phòng',
  '소방서',
  'cảnh sát phòng cháy Hải Phòng',
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
      textQuery: `${keyword}`,
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
            category: '관공·긴급',
            address: p.formattedAddress ?? '',
            phone: p.internationalPhoneNumber ?? null,
            lat: p.location?.latitude ?? null,
            lng: p.location?.longitude ?? null,
            city: CITY,
            google_rating: p.rating ?? null,
            pending_approval: false,
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