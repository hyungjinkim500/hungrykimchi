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
  { lat: 20.8449, lng: 106.6881 }, // 하이퐁 중심
  { lat: 20.8600, lng: 106.6800 }, // 홍방 구
  { lat: 20.8300, lng: 106.7100 }, // 레쩐 구
  { lat: 20.8500, lng: 106.7300 }, // 응오꾸옌 구
  { lat: 20.8700, lng: 106.6600 }, // 끼엔안 구
  { lat: 20.8200, lng: 106.6600 }, // 도선 방향
  { lat: 20.8450, lng: 106.7500 }, // 동쪽 외곽
  { lat: 20.8800, lng: 106.7000 }, // 북쪽 외곽
];

const KEYWORDS = [
  '한식당', '한국식당', '한국음식', '한국 음식점', '한국 레스토랑',
  'Korean restaurant', 'Korean food', 'Korean BBQ', 'Korean cuisine',
  '삼겹살', '갈비', '치킨', '분식', '순대', '떡볶이', '김치찌개', '된장찌개',
  'nhà hàng Hàn Quốc', 'ẩm thực Hàn Quốc', 'cơm Hàn Quốc',
  '한국 치킨', '한국 카페', 'K-food',
  'Hai Phong Korean', '하이퐁 한식',
];

async function searchPlaces(keyword, zone) {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const body = {
    textQuery: `${keyword} Hai Phong Vietnam`,
    languageCode: 'ko',
    locationBias: {
      circle: {
        center: { latitude: zone.lat, longitude: zone.lng },
        radius: 2000.0,
      },
    },
    maxResultCount: 20,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.nationalPhoneNumber,places.primaryTypeDisplayName',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data.places || [];
}

async function main() {
  const { data: existingData } = await supabase
    .from('businesses')
    .select('google_place_id')
    .eq('city', 'haiphong')
    .limit(10000);

  const { data: deletedData } = await supabase
    .from('deleted_places')
    .select('google_place_id')
    .limit(10000);

  const existingIds = new Set((existingData || []).map((r) => r.google_place_id));
  const deletedIds = new Set((deletedData || []).map((r) => r.google_place_id));

  const seen = new Set();
  const results = [];
  let index = 1;

  for (const zone of ZONES) {
    for (const keyword of KEYWORDS) {
      const places = await searchPlaces(keyword, zone);
      for (const place of places) {
        const pid = place.id;
        if (seen.has(pid) || existingIds.has(pid) || deletedIds.has(pid)) continue;
        seen.add(pid);

        const name = place.displayName?.text || '';
        const nameKo = place.displayName?.languageCode === 'ko' ? name : '';
        const type = place.primaryTypeDisplayName?.text || '';
        const address = place.formattedAddress || '';
        const phone = place.nationalPhoneNumber || '';
        const rating = place.rating || '';
        const lat = place.location?.latitude || '';
        const lng = place.location?.longitude || '';

        console.log(
          `${index}. [${pid}] ${name} | ${nameKo} | ${type} | ${address} | ${phone} | ${rating} | ${lat} ${lng}`
        );
        results.push({ pid, name, nameKo, type, address, phone, rating, lat, lng });
        index++;
      }
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log(`\n총 ${results.length}개 수집 완료`);
}

main().catch(console.error);