// scripts/philippines/insert-cebu-medical-1.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  console.error('환경변수 누락: SUPABASE_KEY 필요');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  // 종합/국제병원
  { google_place_id: 'ChIJC-BH3pKXqTMRkbEBvsziQfA', name: 'Dae han medical clinic', name_ko: '대한 메디컬 클리닉 Dae Han Medical', subcategory: '종합/국제병원', primary_type_ko: '건강', address: '필리핀 Cebu, Mandaue, Coast Pacific Road', phone: '+63 918 667 2902', lat: null, lng: null, google_rating: 3.8 },
  { google_place_id: 'ChIJX_SCsrGQqTMR1g5nKprmmls', name: 'Cebu Dae Han Medical Center', name_ko: '세부 대한 메디컬 센터 Cebu Dae Han', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: 'M.L. Quezon National Highway, Maribago, Lapu-Lapu, 6015 Cebu, 필리핀', phone: '+63 918 667 2902', lat: 10.2903218, lng: 123.99804130000001, google_rating: 5.0 },
  { google_place_id: 'ChIJh0nW8aWRqTMRv9Zip6E_-qc', name: 'ARC International Medical Service Center(IMSC) 세부국제의료센터', name_ko: 'ARC 세부국제의료센터', subcategory: '종합/국제병원', primary_type_ko: '건강', address: 'Sitio Malinao, Lapu-Lapu, 6015 Cebu, 필리핀', phone: '+63 995 188 6198', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJXd5JwrOQqTMR9N7zBrrvm_M', name: 'MactanMed (Mactan Optimal Medical Center)', name_ko: '막탄메드 국제의료센터 MactanMed', subcategory: '종합/국제병원', primary_type_ko: '종합병원', address: '필리핀 6015 세부 라푸-라푸 아구스', phone: '+63 32 260 9189', lat: null, lng: null, google_rating: 3.9 },
  { google_place_id: 'ChIJSxBCsguZqTMR1f0mj3G_jjw', name: 'Nordic Medical Clinic Cebu', name_ko: '노르딕 메디컬 클리닉 세부 Nordic Medical', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: 'Ground Floor, Don Alfredo D. Gothong Centre, Sergio Osmeña Blvd, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 353 0211', lat: null, lng: null, google_rating: 4.8 },
  { google_place_id: 'ChIJKeA6oOiZqTMRiWB8EkUJYD8', name: 'HealthFirst Clinic Cebu', name_ko: '헬스퍼스트 클리닉 세부 HealthFirst', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: 'Level 1, i2 Building, Jose Maria del Mar Street Cebu IT Park, Cebu City, 6000 Cebu, 필리핀', phone: '+63 917 868 0142', lat: 10.3286835, lng: 123.9072414, google_rating: 4.6 },
  { google_place_id: 'ChIJy1oL7hqZqTMRSCa3wQoTcbg', name: 'Clinica Prime Oakridge', name_ko: '클리니카 프라임 오크리지 Clinica Prime', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: '2F, Oakridge IT Center, 880 A. S. Fortuna St, Mandaue, 6014 Cebu, 필리핀', phone: '+63 917 770 2258', lat: null, lng: null, google_rating: 4.1 },
  { google_place_id: 'ChIJk_3tatKZqTMR7cDnwhiSuKk', name: 'Clinica Prime Mactan', name_ko: '클리니카 프라임 막탄점 Clinica Prime', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: 'City Times Square Mactan, Basak-Marigondon Rd, Lapu-Lapu, 6015 Cebu, 필리핀', phone: '+63 917 184 2579', lat: null, lng: null, google_rating: 4.3 },
  { google_place_id: 'ChIJFZTrzOaYqTMRuTM3I3q0HJ8', name: 'Dong in Dang Medical Clinic', name_ko: '동인당 메디컬 클리닉 Dong In Dang', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: 'Ground Floor, Northgate Centre, Gov. M. Cuenco Ave, Cebu City, 6000 Cebu, 필리핀', phone: null, lat: null, lng: null, google_rating: null },
  { google_place_id: 'ChIJH_PbVgmZqTMRaVyg2nBBoGc', name: 'Asian Oriental Medical Clinic', name_ko: '아시안 오리엔탈 메디컬 클리닉', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: '필리핀 6000 세부 세부 시티', phone: '+63 942 411 9296', lat: null, lng: null, google_rating: 4.9 },
  // 치과
  { google_place_id: 'ChIJP0YfTFSYqTMRQN03wZaQMdA', name: '로빈슨 스타화이트치과', name_ko: '로빈슨 스타화이트치과', subcategory: '치과', primary_type_ko: '종합병원', address: 'B110, Robinsons Galleria Cebu, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 887 7661', lat: null, lng: null, google_rating: 4.2 },
  { google_place_id: 'ChIJO_-kOACZqTMRxQyFP8_x-u4', name: 'R starwhite dental 스타화이트치과', name_ko: '스타화이트치과 갤러리아점', subcategory: '치과', primary_type_ko: '치과 진료소', address: '필리핀 6000 Cebu, Cebu City, Robinsons Galleria', phone: '+63 915 915 5597', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJG8JgubGZqTMRDz8mLg97w3U', name: 'Cebu International Dental Clinic', name_ko: '세부 인터내셔널 치과 Cebu International Dental', subcategory: '치과', primary_type_ko: '치과 진료소', address: 'Second Floor A-209, City time square, Mantawe Ave, Mandaue, 6014 Cebu, 필리핀', phone: '+63 945 617 5301', lat: null, lng: null, google_rating: 4.8 },
  { google_place_id: 'ChIJVfnKLD-ZqTMRfss1c0R3Q6M', name: 'Affinity Dental Clinics Cebu', name_ko: '어피니티 치과 세부 Affinity Dental', subcategory: '치과', primary_type_ko: '치과 진료소', address: 'G/F, Lahug IT Park, eBloc 2 Tower, V. Padriga St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 917 632 5718', lat: null, lng: null, google_rating: 4.6 },
  { google_place_id: 'ChIJNWUNyh-ZqTMR1rfPdTgPvTU', name: 'The Dental Hub', name_ko: '더 덴탈 허브 The Dental Hub', subcategory: '치과', primary_type_ko: '치과 진료소', address: 'Crossroads Mall, Cebu City, 6000 Cebu, 필리핀', phone: '+63 917 124 8499', lat: null, lng: null, google_rating: 4.4 },
  { google_place_id: 'ChIJ0dxepaqZqTMRX6gaXz6c7kM', name: 'Joon Dental Family Care', name_ko: '준 덴탈 패밀리 케어 Joon Dental', subcategory: '치과', primary_type_ko: '치과 진료소', address: 'The Persimmon Plus Bldg 3, M. J. Cuenco Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 273 6452', lat: null, lng: null, google_rating: 4.5 },
  { google_place_id: 'ChIJp-023eyZqTMRg2IyY08D2yg', name: 'Near Dental Clinic - Mabolo', name_ko: '니어 치과 마볼로점 Near Dental', subcategory: '치과', primary_type_ko: '치과 진료소', address: '2nd floor, MLC Building, M. J. Cuenco Ave, Mabolo, Cebu City, 6000 Cebu, 필리핀', phone: '+63 945 520 3888', lat: null, lng: null, google_rating: 4.9 },
  { google_place_id: 'ChIJZdeeW0-ZqTMRPQPN53dzKak', name: 'Cebu Dental Care Center', name_ko: '세부 덴탈 케어 센터 Cebu Dental Care', subcategory: '치과', primary_type_ko: '치과 진료소', address: 'Unit 13, R Aboitiz St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 253 3206', lat: null, lng: null, google_rating: 4.8 },
  // 피부과
  { google_place_id: 'ChIJSYTZ5KuXqTMRGFtNOussOfc', name: 'By JIN Beauty Clinic', name_ko: '바이진 뷰티 클리닉 By JIN', subcategory: '피부과', primary_type_ko: '피부관리실', address: 'Uptown Suites, 7F M. P. Yap St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 956 028 9847', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJpdVmM0mZqTMRdN3-EFAq0SM', name: 'ALO Dermatology', name_ko: 'ALO 피부과', subcategory: '피부과', primary_type_ko: '피부관리실', address: 'Building B - Escario Central Mall, N Escario St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 917 831 1712', lat: null, lng: null, google_rating: 4.7 },
  { google_place_id: 'ChIJRRk4CQWZqTMRL5gPHS5Z53M', name: 'Skin911 Medical', name_ko: '스킨911 메디컬 Skin911', subcategory: '피부과', primary_type_ko: '피부관리실', address: 'Archbishop Reyes Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 915 044 9296', lat: null, lng: null, google_rating: 4.7 },
  { google_place_id: 'ChIJlcsGV6KZqTMR8IIWw7DrlaA', name: 'Skin 911 Lahug', name_ko: '스킨911 라훅점 Skin911', subcategory: '피부과', primary_type_ko: '피부관리실', address: 'RM 201, MIT Bldg, 117 Gorordo Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 232 2134', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJUVKc3JOZqTMRJH9_fLK4ufo', name: 'Skin Doctors Dermatologic and Aesthetic Medicine', name_ko: '스킨닥터스 피부과 Skin Doctors', subcategory: '피부과', primary_type_ko: '피부관리실', address: '2nd Floor, Verve Point, Banilad Rd, Cebu City, 6000 Cebu, 필리핀', phone: '+63 932 520 3490', lat: null, lng: null, google_rating: 4.1 },
  { google_place_id: 'ChIJvbhsgtuZqTMRRagjwiErW5k', name: 'CenterCity Dermatology Cebu Clinic', name_ko: '센터시티 피부과 세부 CenterCity Dermatology', subcategory: '피부과', primary_type_ko: '의사', address: '2F, City Times Square, Mantawe Ave, Mandaue, 6014 Cebu, 필리핀', phone: '+63 999 475 4898', lat: null, lng: null, google_rating: 4.6 },
  { google_place_id: 'ChIJYWMH5EKdqTMRb5eP6QgQ-X8', name: 'Kskin Philippines - SM Seaside City Cebu', name_ko: 'K스킨 SM씨사이드점 Kskin', subcategory: '피부과', primary_type_ko: '피부관리실', address: 'Cebu South Coastal Rd, Antuwanga, Cebu City, 6000 Cebu, 필리핀', phone: null, lat: null, lng: null, google_rating: 4.9 },
  { google_place_id: 'ChIJq4luOACXqTMRJZ5F2sMGYt4', name: 'K-스킨케어', name_ko: 'K-스킨케어 막탄점', subcategory: '피부과', primary_type_ko: '피부관리실', address: 'Ibapu, Lapu-Lapu, Cebu, 필리핀', phone: '+63 945 594 6506', lat: null, lng: null, google_rating: 4.9 },
  // 안과
  { google_place_id: 'ChIJxWizhp-ZqTMRGxW4Fg1ucaE', name: 'Focal Sight UC Banilad', name_ko: '포컬사이트 UC바닐라드점 Focal Sight', subcategory: '안과', primary_type_ko: '진료소', address: 'UNIT 3, University Of Cebu, BANILAD CAMPUS, Gov. M. Cuenco Ave, Cebu City, 6000 Cebu, 필리핀', phone: '+63 942 389 3044', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJEcPI7jqZqTMRvZKAJUoS96E', name: 'Focal Sight Ayala Center Cebu', name_ko: '포컬사이트 아얄라점 Focal Sight', subcategory: '안과', primary_type_ko: '진료소', address: 'Level 2, Ayala Center Cebu, Cebu City, 6000 Cebu, 필리핀', phone: '+63 2394846', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJtWPxaQCZqTMR3481zVuEXqI', name: 'Focal Sight Eye Center', name_ko: '포컬사이트 아이센터 Focal Sight', subcategory: '안과', primary_type_ko: '진료소', address: 'V.Albano, Mandaue, Cebu, 필리핀', phone: '+63 956 968 4841', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJR0Bltb-ZqTMRCOF96OodHqY', name: 'Ruiz Vision Eye Clinic', name_ko: '루이즈 비전 안과 Ruiz Vision', subcategory: '안과', primary_type_ko: '진료소', address: 'G.O.D Arcade, S. Osmeña Street, Poblacion, Lapu-Lapu, Cebu, 필리핀', phone: '+63 32 513 6077', lat: null, lng: null, google_rating: 5.0 },
  // 정형외과
  { google_place_id: 'ChIJK0z10_2ZqTMRoZ1ODFnutiA', name: 'Asian Orthopedics - Spine and Joints Center | Movement Lab', name_ko: '아시안 오소피딕스 척추관절센터 Asian Orthopedics', subcategory: '정형외과', primary_type_ko: '의료원/종합병원', address: 'Unit A3, Constellation Business Plaza, Mandaue, 6014 Cebu, 필리핀', phone: '+63 966 911 9630', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJadXLK0yZqTMRCeUXGljHgaE', name: 'Cebu Orthopaedic Institute', name_ko: '세부 정형외과 연구소 Cebu Orthopaedic', subcategory: '정형외과', primary_type_ko: '진료소', address: 'Room 401, 4th Floor, Robinson\'s Cybergate, Don Gil Garcia St, Cebu City, 6000 Cebu, 필리핀', phone: '+63 32 239 2443', lat: null, lng: null, google_rating: 4.4 },
  { google_place_id: 'ChIJiQ6cgTqZqTMRCYG5cNeSW5w', name: 'Spine & Orthopaedics Cebu', name_ko: '스파인 & 오소피딕스 세부', subcategory: '정형외과', primary_type_ko: '진료소', address: '938, Chong Hua Hospital, Medical Arts Building, Mantawi International Drive, Tipolo, Mandaue, 6014 Cebu, 필리핀', phone: '+63 917 177 5670', lat: null, lng: null, google_rating: 3.9 },
  // 한의원
  { google_place_id: 'ChIJO5PIXhCZqTMRqKwlFE4OSPY', name: 'Integramed Acupuncture Clinic', name_ko: '인테그라메드 침술 클리닉', subcategory: '한의원', primary_type_ko: '진료소', address: 'Room 1122, Chong Hua Medical Mall, C. Rodriguez Street, Cebu City, 6000 Cebu, 필리핀', phone: '+63 917 787 4898', lat: null, lng: null, google_rating: 5.0 },
  { google_place_id: 'ChIJ6_dlwSWZqTMRF-9UP6UMws0', name: 'Abiera Acupuncture & Traditional Chinese Medicine Clinic', name_ko: '아비에라 침술 & 한방클리닉', subcategory: '한의원', primary_type_ko: '진료소', address: 'Unit 504-A, Winland Tower Condominium, Juana Osmeña Extension Rd, Cebu City, 6000 Cebu, 필리핀', phone: '+63 917 653 5999', lat: null, lng: null, google_rating: 5.0 },
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
      category: '의료',
      subcategory: item.subcategory,
      primary_type_ko: item.primary_type_ko,
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