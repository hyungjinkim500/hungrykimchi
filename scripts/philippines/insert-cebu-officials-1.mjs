// scripts/philippines/insert-cebu-officials-1.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  console.error('환경변수 누락: SUPABASE_KEY 필요');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  // 한국 영사관
  { google_place_id: 'ChIJqXsQXBWZqTMRBnE3TPnJdTY', name: '주 필리핀 대한민국 대사관 세부 분관', name_ko: '주 필리핀 대한민국 대사관 세부 분관', subcategory: '대사관·영사관', address: '12F Chinabank Corporate Center, Samar Loop, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 231 1516', lat: 10.3176, lng: 123.9054, google_rating: 4.6 },
  // 세부시티 경찰서
  { google_place_id: 'ChIJI7MgPEGZqTMRRAllJGb2o3I', name: 'PRO7 - Cebu City Police Office (CCPO)', name_ko: '세부시티 경찰청 CCPO', subcategory: '경찰서', address: 'Police Station, Camp Sotero Cabahug, Gorordo Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 231 5802', lat: 10.3157, lng: 123.8960, google_rating: null },
  { google_place_id: 'ChIJmUU8RCWZqTMRFjZxYI6QyQ4', name: 'Police Station 1 (Parian Police Station)', name_ko: '세부시티 경찰서 1 파리안 Parian Police', subcategory: '경찰서', address: '7WX3+P7G, Sikatuna St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 255 8404', lat: null, lng: null, google_rating: null },
  { google_place_id: 'ChIJpxNHM0eZqTMRfbcpdRVObrE', name: 'Police Station 2 - Abellana, Cebu City', name_ko: '세부시티 경찰서 2 아벨라나 Abellana Police', subcategory: '경찰서', address: 'Benz Bldg., 30 Osmeña Blvd, Cebu City, 6000 Cebu, 필리핀', phone: '+63 917 305 7336', lat: null, lng: null, google_rating: null },
  { google_place_id: 'ChIJu5dH8GyZqTMRrnd4KGzivF4', name: 'Police Station 4 (Mabolo Police Station)', name_ko: '세부시티 경찰서 4 마볼로 Mabolo Police', subcategory: '경찰서', address: '필리핀 6000 세부 세부 시티 8W68+X8M', phone: '+63 932 592 4464', lat: null, lng: null, google_rating: null },
  { google_place_id: 'ChIJV0tw38qeqTMRY0uqo9pX0fU', name: 'Police Station 9 Guadalupe Police Station', name_ko: '세부시티 경찰서 9 과달루페 Guadalupe Police', subcategory: '경찰서', address: '1112 V Rama Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 949 379 4350', lat: null, lng: null, google_rating: null },
  // 라푸라푸 경찰서
  { google_place_id: 'ChIJPwZhotqZqTMR-fW0rnHYwGU', name: 'Lapu-Lapu City Police Office', name_ko: '라푸라푸 경찰청 LLCPO', subcategory: '경찰서', address: '8X98+33V, Manggahan, Lapu-Lapu, 6015 Cebu, 필리핀', phone: null, lat: 10.3103, lng: 123.9494, google_rating: null },
  { google_place_id: 'ChIJcZSvfaeQqTMRjHAMk9khcME', name: 'Police Station - LLCPO', name_ko: '라푸라푸 경찰서 LLCPO 마리바고', subcategory: '경찰서', address: '7XGG+62M, Basak-Marigondon Rd, Lapu-Lapu, 6015 Cebu, 필리핀', phone: '+63 32 341 1811', lat: null, lng: null, google_rating: null },
  // 만다우에 경찰서
  { google_place_id: 'ChIJfaIYhASZqTMRRdyQ6zj5btA', name: 'Mandaue City Police Office', name_ko: '만다우에 경찰청 MCPO', subcategory: '경찰서', address: '8WHC+4M6, F. Cabahug St. Cor Hernan Cortes St, Mandaue, 6014 Cebu, 필리핀', phone: '+63 2 8344 1200', lat: 10.3310, lng: 123.9050, google_rating: 4.0 },
  // 출입국 관리소
  { google_place_id: 'ChIJqefSRACZqTMR1ZElK7cgh58', name: 'BUREAU OF IMMIGRATION CEBU DISTRICT OFFICE', name_ko: '세부 출입국관리소 Bureau of Immigration', subcategory: '출입국관리소', address: '8W56+GXP, A. Soriano Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 345 6441', lat: null, lng: null, google_rating: 2.6 },
  { google_place_id: 'ChIJQ4s6RsWZqTMRiDkXR-TYinw', name: 'Bureau of Immigration Mactan', name_ko: '막탄 출입국관리소 Bureau of Immigration', subcategory: '출입국관리소', address: 'Gaisano Mactan Island Mall, M.L. Quezon National Highway, Lapu-Lapu, 6015 Cebu, 필리핀', phone: '+63 32 495 2852', lat: null, lng: null, google_rating: 4.6 },
  { google_place_id: 'ChIJu0GSZ2OXqTMRkZ6Vwb3vqr8', name: 'Bureau of Immigration - Mactan Cebu International Airport', name_ko: '막탄세부공항 출입국관리소', subcategory: '출입국관리소', address: 'Mactan Cebu International Airport, Lapu-Lapu, 6016 Cebu, 필리핀', phone: '+63 32 340 1473', lat: null, lng: null, google_rating: 3.3 },
  // 공항
  { google_place_id: 'ChIJ3yW9O2GXqTMR_o_MEeaB84A', name: 'Mactan-Cebu International Airport Authority (MCIAA)', name_ko: '막탄세부 국제공항 MCIAA', subcategory: '공항', address: '8X7G+8FG, Lapu-Lapu Airport Rd, Lapu-Lapu, 6015 Cebu, 필리핀', phone: '+63 32 494 8020', lat: 10.3073, lng: 123.9792, google_rating: 4.2 },
];

async function main() {
  console.log('총 insert 대상: ' + DATA.length + '개');
  let success = 0;
  let skip = 0;
  let fail = 0;

  for (const item of DATA) {
    const row = {
      google_place_id: item.google_place_id,
      name: item.name,
      name_ko: item.name_ko,
      category: '관공·긴급',
      subcategory: item.subcategory,
      primary_type_ko: item.subcategory === '경찰서' ? '경찰서' : item.subcategory === '대사관·영사관' ? '대사관' : '관공서',
      address: item.address,
      phone: item.phone,
      lat: item.lat,
      lng: item.lng,
      city: 'cebu',
      google_rating: item.google_rating,
      pending_approval: false,
      is_verified: false,
      is_korean_run: false,
      registration_type: 'script',
    };

    const { error } = await supabase.from('businesses').insert(row);
    if (error) {
      if (error.code === '23505') {
        console.log('SKIP (중복): ' + item.name_ko);
        skip++;
      } else {
        console.log('FAIL: ' + item.name_ko + ' | ' + error.message);
        fail++;
      }
    } else {
      console.log('OK: ' + item.name_ko);
      success++;
    }
  }

  console.log('\n=== 완료 ===');
  console.log('성공: ' + success + '개');
  console.log('중복 skip: ' + skip + '개');
  console.log('실패: ' + fail + '개');
}

main().catch(console.error);