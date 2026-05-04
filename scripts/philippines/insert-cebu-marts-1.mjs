// scripts/philippines/insert-cebu-marts-1.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  console.error('환경변수 누락: SUPABASE_KEY 필요');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  { google_place_id: 'ChIJe7unCZiZqTMRz2Za0TU5534', name: '아이고마트 세부', name_ko: '아이고마트 세부', address: 'Salinas Dr, Cebu City, 6000 Cebu, 필리핀', phone: '+63 949 367 5770', lat: 10.329087099999999, lng: 123.9019488, google_rating: 4.2 },
  { google_place_id: 'ChIJd_UgdCSZqTMRAD2PxIn90hY', name: 'Big Plus Mart', name_ko: '빅플러스마트 Big Plus Mart', address: '8WH2+JQP, Salinas Dr, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 384 1111', lat: 10.3290876, lng: 123.90194849999999, google_rating: 4.1 },
  { google_place_id: 'ChIJ7d9VPeGYqTMRr03IxohZUa0', name: 'Pusan MART', name_ko: '부산마트 Pusan MART', address: 'Gov. M. Cuenco Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 945 380 5269', lat: 10.3377439, lng: 123.9116401, google_rating: 4.3 },
  { google_place_id: 'ChIJlwcBn-iYqTMRKQVDFg7VJPM', name: '한국식품 코리아나', name_ko: '한국식품 코리아나', address: '1st floor, One Paseo Compound, Gov. M. Cuenco Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 343 9693', lat: 10.343921900000002, lng: 123.9121099, google_rating: 4.2 },
  { google_place_id: 'ChIJ0zELMhmZqTMRJa1pQnYs2Yg', name: 'Seoul Minimart', name_ko: '서울 미니마트 Seoul Minimart', address: '88th Avenue Gov. M. Cuenco Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 969 465 7777', lat: null, lng: null, google_rating: 3.3 },
  { google_place_id: 'ChIJPZ8CNdOZqTMR8ZSryvCezOk', name: 'KOA MART', name_ko: 'KOA마트 KOA MART', address: 'Pope John Paul II Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 916 521 2307', lat: null, lng: null, google_rating: 4.0 },
  { google_place_id: 'ChIJpxDV9BaZqTMRJqisoY0TEs0', name: '아씨마트 (ASSI MART)', name_ko: '아씨마트 ASSI MART', address: '3 F. Cabahug St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 422 4114', lat: 10.3209197, lng: 123.91108379999999, google_rating: 3.9 },
  { google_place_id: 'ChIJn7137ImZqTMRP_ZPvEQSOsc', name: 'Funhan Mart Cebu', name_ko: '펀한마트 세부 Funhan Mart', address: 'Horizons, 101 General Maxilom Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 945 785 8355', lat: 10.310905199999999, lng: 123.89800229999999, google_rating: 4.2 },
  { google_place_id: 'ChIJVwGXeyaZqTMRgg9pbnqln_Y', name: "Mom's Hand - Orange Mart", name_ko: "맘스핸드 오렌지마트 Mom's Hand Orange Mart", address: '8WV6+F5G, Paseo Saturnino, Cebu City, 6000 Cebu, 필리핀', phone: null, lat: null, lng: null, google_rating: 4.0 },
  { google_place_id: 'ChIJQygeegCZqTMRqQ4pqwjMunw', name: 'The Morning Calm', name_ko: '더 모닝캄 The Morning Calm', address: 'F. Cabahug St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 255 1947', lat: null, lng: null, google_rating: 4.1 },
  { google_place_id: 'ChIJ8Zo0VSGdqTMRva4M2mtBrpk', name: 'Kimchi Cebu Korean Mini Mart', name_ko: '김치 세부 한국 미니마트 Kimchi Cebu', address: '1207 Tres de Abril St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 915 582 3028', lat: 10.2946729, lng: 123.87045080000001, google_rating: 4.6 },
  { google_place_id: 'ChIJ1z8KBdaZqTMRcffhmga-BgE', name: 'Assi fresh plaza', name_ko: '아씨 프레시 플라자 Assi Fresh Plaza', address: 'Northgate Center, Gov. M. Cuenco Ave, Cebu City, 6000 Cebu, 필리핀', phone: null, lat: null, lng: null, google_rating: null },
  { google_place_id: 'ChIJmVJuyZ2ZqTMRwDlqMZjl32o', name: 'Autokim Korean Food', name_ko: '오토킴 한국식품 Autokim Korean Food', address: 'E Zone, F. Cabahug St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 916 736 8005', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJ7TA5xqaXqTMRGRVM2vwM8r0', name: 'HMART', name_ko: 'H마트 막탄 HMART', address: '필리핀 Cebu, Lapu-Lapu, LGJT HUU-INN BLDG, IBAPU, MACTAN', phone: '+63 32 495 0698', lat: 10.3064474, lng: 124.00929130000002, google_rating: 4.3 },
  { google_place_id: 'ChIJTz9D1eaZqTMR9WKO7ewRQCU', name: 'JJs Korean Food & Grocery', name_ko: 'JJ 한국식품&그로서리 JJs Korean Food', address: 'Ground Floor, P3 Homes, Don Pedro Cui, Street, Cebu City, 6000 Cebu, 필리핀', phone: '+63 999 157 5313', lat: 10.301929800000002, lng: 123.89936759999998, google_rating: 5.0 },
  { google_place_id: 'ChIJCSUOMc6ZqTMRynyGnl6IpdA', name: 'K-Food Mini Mart - Sanciangko', name_ko: 'K-푸드 미니마트 산시앙코점', address: 'Sanciangko Street, Corner Junquera St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 961 355 2674', lat: 10.2987256, lng: 123.89972949999999, google_rating: 5.0 },
  { google_place_id: 'ChIJ_xnEsfCZqTMR2JX505eVd0o', name: 'Shin Mikana Philippines Supermart Cebu', name_ko: '신미카나 슈퍼마트 세부 Shin Mikana', address: 'Ground Floor Unit 130A, One Paseo Saturnino, Banilad, Cebu City, 6000 Cebu, 필리핀', phone: '+63 906 448 6304', lat: null, lng: null, google_rating: 4.6 },
  { google_place_id: 'ChIJY_ZJNIiZqTMRDrTDBmiftxk', name: 'K MART 24', name_ko: 'K마트24 K MART 24', address: '147 A. S. Fortuna St, Mandaue, 6014 Cebu, 필리핀', phone: '+63 966 152 7277', lat: null, lng: null, google_rating: 3.5 },
  { google_place_id: 'ChIJt9fJI-aYqTMRUgL8yPgAyDc', name: 'Machiya Mart', name_ko: '마치야마트 Machiya Mart', address: '102 TPE Building Governor, 113 Gov. M. Cuenco Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 344 0355', lat: null, lng: null, google_rating: 4.2 },
  { google_place_id: 'ChIJjw3luROdqTMR9ZIcGMaKNTE', name: 'Danbam K-mart', name_ko: '단밤 K마트 Danbam K-mart', address: '2F Kong Central Square Bldg, Talisay, 6045 Cebu, 필리핀', phone: null, lat: null, lng: null, google_rating: 4.6 },
  { google_place_id: 'ChIJncPeLwCdqTMR6F5JH50U1Sc', name: 'Han Mart', name_ko: '한마트 Han Mart 누스타점', address: 'Upper Ground 04, The Mall of Nustar, Cebu City, 6000 Cebu, 필리핀', phone: '+63 915 842 8152', lat: null, lng: null, google_rating: 4.7 },
  { google_place_id: 'ChIJSTQVdQCZqTMR89ZiYHeBtH0', name: 'MyeongDong HMart', name_ko: '명동 H마트 MyeongDong HMart', address: '필리핀 세부 라푸-라푸 7WHP+7GG', phone: null, lat: null, lng: null, google_rating: 4.0 },
  { google_place_id: 'ChIJJ3QAXwCXqTMRMMBcvXpzLy0', name: 'Hmart Mini Marina Mall', name_ko: 'H마트 미니 마리나몰점 Hmart Mini', address: '8XGG+7P4, Lapu-Lapu, Cebu, 필리핀', phone: null, lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJL6WyDwCdqTMRwu3gJLe7bGM', name: 'Hmart Mini Seaside', name_ko: 'H마트 미니 씨사이드점 Hmart Mini', address: '7VMJ+6MF, Cebu South Coastal Rd, Cebu City, 6000 Cebu, 필리핀', phone: null, lat: null, lng: null, google_rating: null },
  { google_place_id: 'ChIJtzmfPACXqTMRzB7tXuZU79I', name: 'Hmart Mini Newtown', name_ko: 'H마트 미니 뉴타운점 Hmart Mini', address: '8 Newtown Boulevard, Mactan Newtown, Lapu-Lapu, 6015 Cebu, 필리핀', phone: null, lat: null, lng: null, google_rating: null },
  { google_place_id: 'ChIJv-bneQGaqTMRpKU-MBF0VuU', name: '에이치마트 아구스', name_ko: '에이치마트 아구스점 H마트', address: '7XPC+C28, Ibabao - Gisi - Agus Rd, Lapu-Lapu, Cebu, 필리핀', phone: '+63 954 248 8632', lat: null, lng: null, google_rating: 4.0 },
  { google_place_id: 'ChIJg1j6xIGZqTMRrmWcGpDFhdU', name: 'JJS Korean Food & Grocery Cebu', name_ko: 'JJS 한국식품&그로서리 만다우에점', address: '필리핀 세부 만다유 시티 9W8M+WM3', phone: null, lat: null, lng: null, google_rating: 4.3 },
  { google_place_id: 'ChIJL-xsHcadqTMRxMPWn4iZEHs', name: 'Kimchi & More Korean Mart', name_ko: '김치앤모어 한국마트 Kimchi & More', address: 'Salvador St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 967 053 0602', lat: 10.2993805, lng: 123.8788742, google_rating: null },
  { google_place_id: 'ChIJ4TFhGGmdqTMRI_B7L0QbOis', name: 'Kimchi Cebu Korean Mini Mart', name_ko: '김치 세부 한국 미니마트 탈리사이점', address: 'UP Lot, Lawaan 1, Talisay, 6045 Cebu, 필리핀', phone: '+63 915 669 8928', lat: 10.2535768, lng: 123.82791019999998, google_rating: 4.4 },
  { google_place_id: 'ChIJPy-JHbWQqTMRySRI4XCC0iE', name: '다딱 4거리', name_ko: '다딱 4거리 한인마트', address: '7XMV+MRC, Datag, Maribago, Lapu-Lapu, 6015 Cebu, 필리핀', phone: '+63 32 495 2488', lat: null, lng: null, google_rating: 3.7 },
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
      category: '마트/슈퍼',
      subcategory: null,
      primary_type_ko: '아시아 식료품점',
      address: item.address,
      phone: item.phone,
      lat: item.lat,
      lng: item.lng,
      city: 'cebu',
      google_rating: item.google_rating,
      pending_approval: true,
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