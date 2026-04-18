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
  { name: '1군-중심',      lat: 10.7769, lng: 106.7009 },
  { name: '1군-북',        lat: 10.7850, lng: 106.6980 },
  { name: '3군',           lat: 10.7850, lng: 106.6850 },
  { name: '5군-차이나타운', lat: 10.7530, lng: 106.6600 },
  { name: '7군-푸미흥',    lat: 10.7270, lng: 106.7180 },
  { name: '7군-북',        lat: 10.7400, lng: 106.7100 },
  { name: '빈탄-중심',     lat: 10.8030, lng: 106.7140 },
  { name: '빈탄-동',       lat: 10.8030, lng: 106.7300 },
  { name: '푸년',          lat: 10.7990, lng: 106.6880 },
  { name: '고밥',          lat: 10.8380, lng: 106.6650 },
  { name: '탄빈',          lat: 10.7600, lng: 106.6700 },
  { name: '빈짠-중심',     lat: 10.7530, lng: 106.6400 },
  { name: '2군-타오디엔',  lat: 10.8010, lng: 106.7450 },
  { name: '2군-안푸',      lat: 10.7890, lng: 106.7390 },
  { name: '9군',           lat: 10.8450, lng: 106.7820 },
  { name: '12군',          lat: 10.8650, lng: 106.6450 },
  { name: '터득',          lat: 10.6950, lng: 106.7200 },
  { name: '빈즈엉-중심',   lat: 10.9800, lng: 106.6500 },
  { name: '동나이',        lat: 10.9450, lng: 106.8250 },
];

const KEYWORDS = [
  '한국 마트',
  '한국 슈퍼',
  'Korean mart',
  'Korean supermarket',
  '코리아마트',
  '한아름마트',
  '한국식품',
  '한국 식재료',
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
            category: '마트/슈퍼',
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

  console.log(`\n총 신규: ${toInsert.length}개`);
  console.log('\n=== 수집된 업체 목록 ===');
  toInsert.forEach((b, i) => {
    console.log(`${i + 1}. [${b.google_place_id}] ${b.name} | ${b.primary_type_ko ?? '-'} | ${b.phone ?? '번호없음'} | ${b.address} | lat:${b.lat} lng:${b.lng}`);
  });
}

main().catch(console.error);