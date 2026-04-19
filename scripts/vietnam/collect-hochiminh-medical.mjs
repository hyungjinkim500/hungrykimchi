
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!SUPABASE_KEY || !GOOGLE_API_KEY) {
  console.error('환경변수 누락: SUPABASE_KEY, GOOGLE_API_KEY 필요');
  process.exit(1);
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateNameKo(name) {
  const hasKorean = /[가-힣]/.test(name);
  if (hasKorean) return name;
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
          content: `다음 병원/의료기관 이름을 한국어 발음으로 변환하고 원문을 병기해줘. 형식: "한국어발음 원문이름" (예: "우쩌우 치과 Nha Khoa Uc Chau"). 이름만 답해줘, 설명 없이.\n이름: ${name}`,
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
  { name: '1군-중심',       lat: 10.7769, lng: 106.7009 },
  { name: '1군-북',         lat: 10.7850, lng: 106.6980 },
  { name: '3군-중심',       lat: 10.7820, lng: 106.6850 },
  { name: '빈탄-중심',      lat: 10.8000, lng: 106.7150 },
  { name: '빈탄-북',        lat: 10.8120, lng: 106.7150 },
  { name: '푸뇬-중심',      lat: 10.7350, lng: 106.6950 },
  { name: '7군-중심',       lat: 10.7330, lng: 106.7220 },
  { name: '7군-푸미흥',     lat: 10.7280, lng: 106.7100 },
  { name: '2군(투득)-중심', lat: 10.7870, lng: 106.7470 },
  { name: '고밥-중심',      lat: 10.8500, lng: 106.6700 },
  { name: '탄빈-중심',      lat: 10.7550, lng: 106.6650 },
  { name: '빈짠-중심',      lat: 10.8150, lng: 106.6600 },
];

const KEYWORDS = [
  '병원',
  '의원',
  '치과',
  'hospital',
  'clinic',
  'dental',
  'bệnh viện',
  'phòng khám',
  'nha khoa',
  'Korean clinic',
  'Korean hospital',
  'international hospital',
  'family medical',
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
          const nameKo = await generateNameKo(p.displayName?.text ?? '');
          toInsert.push({
            google_place_id: p.id,
            name: p.displayName?.text ?? '',
            name_ko: nameKo,
            primary_type_ko: p.primaryTypeDisplayName?.text ?? null,
            category: '의료',
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
    console.log(`${i + 1}. [${b.google_place_id}] ${b.name} | ${b.primary_type_ko ?? ''} | ${b.address} | ${b.phone ?? '전화없음'} | lat:${b.lat} lng:${b.lng}`);
  });
}

main().catch(console.error);
