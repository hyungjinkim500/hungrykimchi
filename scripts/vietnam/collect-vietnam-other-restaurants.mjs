import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!SUPABASE_KEY || !GOOGLE_API_KEY) {
  console.error('환경변수 누락: SUPABASE_KEY, GOOGLE_API_KEY 필요');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateNameKo(name) {
  const hasKorean = /[가-힣]/.test(name);
  if (hasKorean) return name;
  if (!ANTHROPIC_API_KEY) return name;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `다음 음식점 이름을 한국어 발음으로 변환하고 원문을 병기해줘. 형식: "한국어발음 원문이름" (예: "서울 가든 Seoul Garden"). 이름만 답해줘, 설명 없이.\n이름: ${name}`,
        }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text?.trim() ?? name;
  } catch (e) {
    return name;
  }
}

const ZONES = [
  { name: '나트랑중심',   cityQuery: 'Nha Trang',   lat: 12.2388, lng: 109.1967 },
  { name: '나트랑남부',   cityQuery: 'Nha Trang',   lat: 12.2100, lng: 109.1900 },
  { name: '푸꾸옥중심',   cityQuery: 'Phu Quoc',    lat: 10.2899, lng: 103.9840 },
  { name: '푸꾸옥남부',   cityQuery: 'Phu Quoc',    lat: 10.1833, lng: 103.9667 },
  { name: '달랏중심',     cityQuery: 'Da Lat',       lat: 11.9465, lng: 108.4419 },
  { name: '달랏외곽',     cityQuery: 'Da Lat',       lat: 11.9200, lng: 108.4200 },
  { name: '하이퐁중심',   cityQuery: 'Hai Phong',   lat: 20.8449, lng: 106.6881 },
  { name: '하이퐁외곽',   cityQuery: 'Hai Phong',   lat: 20.8100, lng: 106.7200 },
  { name: '박닌중심',     cityQuery: 'Bac Ninh',    lat: 21.1861, lng: 106.0763 },
  { name: '빈증중심',     cityQuery: 'Binh Duong',  lat: 10.9800, lng: 106.6520 },
  { name: '빈증북부',     cityQuery: 'Binh Duong',  lat: 11.0667, lng: 106.6333 },
];

const KEYWORDS = [
  '한국식당', '한식', '고기집', '한국음식',
  'korean restaurant', 'korean bbq', 'korean food',
  '삼겹살', '치킨', '순두부', '김치찌개', '한국분식',
  'nhà hàng Hàn Quốc', 'đồ ăn Hàn Quốc', 'thịt nướng Hàn Quốc',
  'Korean fried chicken', 'Korean ramen',
  '포장마차', '호프', '냉면', '비빔밥',
  'quán ăn Hàn Quốc',
];

async function searchPlaces(keyword, cityQuery, lat, lng) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.formattedAddress,places.internationalPhoneNumber,places.rating,places.primaryTypeDisplayName',
    },
    body: JSON.stringify({
      textQuery: `${keyword} ${cityQuery} Vietnam`,
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

  const { data: existingData } = await supabase.from('businesses').select('google_place_id').not('google_place_id', 'is', null).limit(10000);
  const existingIds = new Set((existingData || []).map(b => b.google_place_id));

  const seen = new Set();
  const toInsert = [];

  for (const zone of ZONES) {
    for (const keyword of KEYWORDS) {
      process.stdout.write(`검색중: [${zone.name}] ${keyword} ... `);
      try {
        const places = await searchPlaces(keyword, zone.cityQuery, zone.lat, zone.lng);
        let newCount = 0;
        for (const p of places) {
          if (!p.id || seen.has(p.id) || deletedIds.has(p.id) || existingIds.has(p.id)) continue;
          seen.add(p.id);
          newCount++;
          const nameKo = await generateNameKo(p.displayName?.text ?? '');
          toInsert.push({
            google_place_id: p.id,
            name: p.displayName?.text ?? '',
            name_ko: nameKo,
            primary_type_ko: p.primaryTypeDisplayName?.text ?? null,
            category: '음식점',
            address: p.formattedAddress ?? '',
            phone: p.internationalPhoneNumber ?? null,
            lat: p.location?.latitude ?? null,
            lng: p.location?.longitude ?? null,
            city: 'vietnam-other',
            google_rating: p.rating ?? null,
            pending_approval: true,
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

  console.log(`\n총 신규: ${toInsert.length}개`);
  console.log('\n=== 수집된 업체 목록 ===');
  toInsert.forEach((b, i) => {
    console.log(`${i + 1}. [${b.google_place_id}] ${b.name} | ${b.name_ko} | ${b.primary_type_ko ?? ''} | ${b.address} | ${b.phone ?? '전화없음'} | ⭐${b.google_rating ?? '-'} | lat:${b.lat} lng:${b.lng}`);
  });
}

main().catch(console.error);