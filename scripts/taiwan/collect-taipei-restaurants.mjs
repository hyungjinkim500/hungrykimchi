// scripts/taiwan/collect-taipei-restaurants.mjs

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
          content: `다음 음식점 이름을 한국어 발음으로 변환하고 원문을 병기해줘. 형식: "한국어발음 원문이름" (예: "서울 가든 Seoul Garden"). 이름만 답해줘, 설명 없이.
이름: ${name}`,
        }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text?.trim() ?? name;
  } catch (e) {
    return name;
  }
}

// 타이베이 한인 밀집 지역
const ZONES = [
  { name: '중산-민생',        lat: 25.0610, lng: 121.5365 },
  { name: '신이-101',         lat: 25.0330, lng: 121.5654 },
  { name: '다안-동취',        lat: 25.0269, lng: 121.5436 },
  { name: '중정-시먼',        lat: 25.0452, lng: 121.5063 },
  { name: '네이후-내호',      lat: 25.0797, lng: 121.5874 },
  { name: '송산-라오송',      lat: 25.0504, lng: 121.5773 },
  { name: '원산-타이베이역',  lat: 25.0478, lng: 121.5170 },
  { name: '티엔무-천모',      lat: 25.1324, lng: 121.5268 },
];

const KEYWORDS = [
  '한국식당',
  '한식',
  '고기집',
  'korean restaurant',
  'korean bbq',
  'korean food',
  '삼겹살',
  '치킨',
  '순두부',
  '김치찌개',
  '한국분식',
  'Korean',
  '곱창',
  '막창',
  '매운탕',
  '횟집',
  '냉면',
  '갈비',
  '불고기',
  '된장찌개',
  '부대찌개',
  '삼계탕',
  '낙지',
  '보쌈',
  '족발',
  '떡볶이',
  '라면',
  '김밥',
  '포차',
  '한국치킨',
  'korean fried chicken',
  'korean pork belly',
  'korean soup',
  'kimchi',
  '해장국',
  '감자탕',
  '설렁탕',
  '순대',
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
      textQuery: `${keyword} taipei`,
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
            city: 'taipei',
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

  console.log(`
총 신규: ${toInsert.length}개`);
  console.log('=== 수집된 업체 목록 ===');
  toInsert.forEach((b, i) => {
    console.log(`${i + 1}. [${b.google_place_id}] ${b.name} | ${b.name_ko} | ${b.primary_type_ko ?? ''} | ${b.address} | ${b.phone ?? '전화없음'} | ⭐${b.google_rating ?? '-'} | lat:${b.lat} lng:${b.lng}`);
  });
}

main().catch(console.error);