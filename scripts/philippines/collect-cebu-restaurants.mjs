// scripts/philippines/collect-cebu-restaurants.mjs

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
  { name: 'IT파크-업타운',      lat: 10.3310, lng: 123.9050 },
  { name: 'SM시티-아얄라',      lat: 10.3176, lng: 123.9054 },
  { name: '막탄-라푸라푸',      lat: 10.3103, lng: 123.9494 },
  { name: '코론달-망갈단',      lat: 10.3000, lng: 123.8950 },
  { name: '푸엔테-세부시티중심', lat: 10.3157, lng: 123.8960 },
  { name: '타불로그-반달라',    lat: 10.3540, lng: 123.9150 },
  { name: '베르토-민다나오',    lat: 10.2900, lng: 123.8800 },
  { name: '막탄공항-주변',      lat: 10.3073, lng: 123.9792 },
];

const KEYWORDS = [
  // 총칭
  '한국식당',
  '한식',
  'korean restaurant',
  'korean bbq',
  'korean food',
  // 고기구이
  '삼겹살',
  '갈비',
  '불고기',
  '곱창',
  '막창',
  '대창',
  '양구이',
  // 치킨/포차
  '치킨',
  '한국치킨',
  'korean fried chicken',
  '포차',
  '호프',
  // 국밥류
  '국밥',
  '설렁탕',
  '해장국',
  '감자탕',
  '순대국',
  '곰탕',
  '갈비탕',
  '육개장',
  // 찌개/전골
  '김치찌개',
  '순두부',
  '부대찌개',
  '된장찌개',
  '청국장',
  '전골',
  '샤브샤브',
  // 분식
  '떡볶이',
  '순대',
  '튀김',
  '김밥',
  '라면',
  '분식',
  // 족발/보쌈
  '족발',
  '보쌈',
  // 회/초밥
  '횟집',
  '회',
  '초밥',
  'sushi korean',
  // 중화요리
  '짜장면',
  '짬뽕',
  '양장피',
  '탕수육',
  '중화요리',
  // 냉면/기타
  '냉면',
  '막국수',
  '낙지',
  '쭈꾸미',
  '삼계탕',
  'kimchi',
];

const SEARCH_RADIUS = 1500;

async function searchPlaces(keyword, lat, lng) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.formattedAddress,places.internationalPhoneNumber,places.rating,places.primaryTypeDisplayName',
    },
    body: JSON.stringify({
      textQuery: keyword + ' cebu',
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
            city: 'cebu',
            google_rating: p.rating ?? null,
            pending_approval: true,
            is_verified: false,
            is_korean_run: false,
            registration_type: 'script',
          });
        }
        console.log(places.length + '개 중 신규 ' + newCount + '개');
      } catch (e) {
        console.log('에러: ' + e.message);
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