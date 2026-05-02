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
          content: '다음 음식점 이름을 한국어 발음으로 변환하고 원문을 병기해줘. 형식: "한국어발음 원문이름" (예: "서울 가든 Seoul Garden"). 이름만 답해줘, 설명 없이.\n이름: ' + name,
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
  { name: '노스코트-한인타운',    lat: -36.7967, lng: 174.7469 },
  { name: '타카푸나-중심',        lat: -36.7878, lng: 174.7764 },
  { name: '타카푸나-북',          lat: -36.7750, lng: 174.7764 },
  { name: '글렌필드-중심',        lat: -36.7800, lng: 174.7200 },
  { name: '글렌필드-서',          lat: -36.7800, lng: 174.7050 },
  { name: 'CBD-퀸스트리트',       lat: -36.8485, lng: 174.7633 },
  { name: 'CBD-카랑가하페',       lat: -36.8600, lng: 174.7550 },
  { name: '뉴마켓-브로드웨이',    lat: -36.8710, lng: 174.7760 },
  { name: '마운트이든-도미니언',  lat: -36.8780, lng: 174.7500 },
  { name: '마운트웰링턴-중심',    lat: -36.9050, lng: 174.8430 },
  { name: '팬뮤어-중심',          lat: -36.8980, lng: 174.8500 },
  { name: '헨더슨-중심',          lat: -36.8700, lng: 174.6280 },
  { name: '보타니-이스트게이트',  lat: -36.9270, lng: 174.9140 },
  { name: '파파쿠라-중심',        lat: -37.0640, lng: 174.9440 },
];

const KEYWORDS = [
  '한식당',
  '한국식당',
  '한국 음식점',
  'korean restaurant',
  'korean bbq',
  'korean food',
  'korean fried chicken',
  '삼겹살',
  '치킨',
  '순두부찌개',
  '김치찌개',
  '된장찌개',
  '부대찌개',
  '냉면',
  '갈비',
  '불고기',
  '고기구이',
  '곱창',
  '보쌈',
  '족발',
  '떡볶이',
  '분식',
  '포차',
  '해장국',
  '감자탕',
  '삼계탕',
  '순대국',
  '설렁탕',
  '한국치킨',
  'kimchi',
  'Korean BBQ Auckland',
  'Korean restaurant Auckland',
  '오클랜드 한식',
  'Korean pork belly',
  'Korean soup',
  'bibimbap',
  '비빔밥',
  '라면',
  '돈까스',
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
            city: 'auckland',
            google_rating: p.rating ?? null,
            pending_approval: true,
            is_verified: false,
            is_korean_run: false,
            registration_type: 'script',
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
    console.log((i + 1) + '. [' + b.google_place_id + '] ' + b.name + ' | ' + b.name_ko + ' | ' + (b.primary_type_ko ?? '') + ' | ' + b.address + ' | ' + (b.phone ?? '전화없음') + ' | ⭐' + (b.google_rating ?? '-') + ' | lat:' + b.lat + ' lng:' + b.lng);
  });
}

main().catch(console.error);