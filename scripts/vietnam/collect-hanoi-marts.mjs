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
  { name: '미딩-중심',     lat: 21.0245, lng: 105.7788 },
  { name: '미딩-북',       lat: 21.0320, lng: 105.7788 },
  { name: '미딩-남',       lat: 21.0170, lng: 105.7788 },
  { name: '미딩-동',       lat: 21.0245, lng: 105.7900 },
  { name: '호안끼엠-중심', lat: 21.0285, lng: 105.8542 },
  { name: '호안끼엠-북',   lat: 21.0380, lng: 105.8500 },
  { name: '호안끼엠-남',   lat: 21.0200, lng: 105.8500 },
  { name: '떠이호-중심',   lat: 21.0600, lng: 105.8230 },
  { name: '떠이호-동',     lat: 21.0600, lng: 105.8400 },
  { name: '떠이호-서',     lat: 21.0600, lng: 105.8050 },
  { name: '동다-중심',     lat: 21.0200, lng: 105.8430 },
  { name: '동다-북',       lat: 21.0300, lng: 105.8430 },
  { name: '까우저이-중심', lat: 21.0380, lng: 105.7980 },
  { name: '까우저이-북',   lat: 21.0480, lng: 105.7980 },
  { name: '까우저이-서',   lat: 21.0380, lng: 105.7850 },
  { name: '하동-중심',     lat: 20.9800, lng: 105.7800 },
  { name: '하동-북',       lat: 20.9950, lng: 105.7900 },
  { name: '롱비엔',        lat: 21.0450, lng: 105.8850 },
  { name: '탄쑤언-중심',   lat: 20.9950, lng: 105.8200 },
  { name: '탄쑤언-서',     lat: 20.9950, lng: 105.8050 },
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
      textQuery: `${keyword} 하노이`,
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