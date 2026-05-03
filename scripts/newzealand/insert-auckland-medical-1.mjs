import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 누락'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const data = [
  { google_place_id: 'ChIJK-ut38M5DW0RqgFw01iBZiU', name: '노스 쇼어 병원', name_ko: '노스 쇼어 병원', subcategory: '종합/국제병원', city: 'auckland', lat: -36.7878, lng: 174.7764, address: '124 Shakespeare Road, Takapuna, Auckland 0620 뉴질랜드', phone: '+64 9 486 8900', google_rating: 3.6 },
  { google_place_id: 'ChIJS_Xn2eBHDW0RYT4ASzgM6F4', name: '오클랜드 시립 병원', name_ko: '오클랜드 시립 병원', subcategory: '종합/국제병원', city: 'auckland', lat: -36.8600, lng: 174.7700, address: '2 Park Road, Grafton, Auckland 1023 뉴질랜드', phone: '+64 9 367 0000', google_rating: 3.7 },
  { google_place_id: 'ChIJE1oUMp45DW0RkJhpAT5s5YI', name: '노스 하버 서던 크로스 병원', name_ko: '노스 하버 서던 크로스 병원', subcategory: '종합/국제병원', city: 'auckland', lat: -36.7800, lng: 174.7200, address: '232 Wairau Road, Glenfield, Auckland 0627 뉴질랜드', phone: '+64 9 925 4400', google_rating: 4.5 },
  { google_place_id: 'ChIJy07o5DY5DW0REOcfbg2Rd0k', name: 'CareWell Clinic 케어웰 한의원', name_ko: '케어웰 한의원 CareWell Clinic', subcategory: '한의원', city: 'auckland', lat: -36.7800, lng: 174.7200, address: '1/418 Glenfield Road, Glenfield, Auckland 0629 뉴질랜드', phone: '+64 20 4197 3737', google_rating: 5.0 },
  { google_place_id: 'ChIJrRyEpehHDW0RF1oVDmxKVUQ', name: 'Choice Clinic', name_ko: '초이스 클리닉 Choice Clinic', subcategory: '내과/가정의학', city: 'auckland', lat: -36.8560, lng: 174.7633, address: '468 Queen Street, Auckland CBD 1010 뉴질랜드', phone: '+64 21 309 293', google_rating: 4.9 },
  { google_place_id: 'ChIJ4YtfI5tIDW0RRZ6Zz_yM0q4', name: '그린레인 클리니컬 센터', name_ko: '그린레인 클리니컬 센터', subcategory: '종합/국제병원', city: 'auckland', lat: -36.8928, lng: 174.7789, address: '214 Green Lane West, Epsom, Auckland 1051 뉴질랜드', phone: '+64 9 367 0000', google_rating: 3.7 },
  { google_place_id: 'ChIJXfgWZ907DW0R9u9XrzL-IJ0', name: 'Yulim Acupuncture Clinic', name_ko: '유림 침술원 Yulim Acupuncture Clinic', subcategory: '한의원', city: 'auckland', lat: -36.7414, lng: 174.7110, address: '243 Rosedale Road, Albany, Auckland 0632 뉴질랜드', phone: '+64 9 414 7929', google_rating: 5.0 },
  { google_place_id: 'ChIJxcQFNQo_DW0ROsorrdpKDhI', name: 'Little Clinic Massey (작은 한의원 메시)', name_ko: '작은 한의원 메시 Little Clinic Massey', subcategory: '한의원', city: 'auckland', lat: -36.8218, lng: 174.6079, address: '396B Don Buck Road, Massey, Auckland 0614 뉴질랜드', phone: '+64 21 916 550', google_rating: 5.0 },
  { google_place_id: 'ChIJnf-A2yo7DW0R7s7IhHryij0', name: 'Acu-Bodywave Clinic 수秀한의원', name_ko: '수한의원 Acu-Bodywave Clinic', subcategory: '한의원', city: 'auckland', lat: -36.7312, lng: 174.7209, address: 'B3/65 Greville Road, Pinehill, Auckland 0632 뉴질랜드', phone: '+64 21 356 866', google_rating: 5.0 },
  { google_place_id: 'ChIJKU8Jzp45DW0RzKTMZi5HH00', name: 'Grant acupuncture clinic/원광한의원', name_ko: '원광한의원 Grant Acupuncture Clinic', subcategory: '한의원', city: 'auckland', lat: -36.7640, lng: 174.7370, address: 'Unit5/54 View Road, Wairau Valley, Northshore 0627 뉴질랜드', phone: '+64 27 735 1075', google_rating: 5.0 },
  { google_place_id: 'ChIJn6FsmK45DW0RawygB0z8aBA', name: 'Daniel TCM Clinic 다니엘 한의원', name_ko: '다니엘 한의원 Daniel TCM Clinic', subcategory: '한의원', city: 'auckland', lat: -36.7967, lng: 174.7469, address: '147 Coronation Road, Hillcrest, Auckland 0627 뉴질랜드', phone: '+64 210 287 9202', google_rating: 5.0 },
  { google_place_id: 'ChIJ6XHQfR07DW0RkdWw2vCxUT8', name: 'K-Beauty Clinic', name_ko: 'K-뷰티 클리닉 K-Beauty Clinic', subcategory: '피부과', city: 'auckland', lat: -36.7680, lng: 174.7467, address: '19A Raines Avenue, Forrest Hill, Auckland 0620 뉴질랜드', phone: '+64 21 244 5633', google_rating: 5.0 },
  { google_place_id: 'ChIJ-10GQXpNDW0RbZ_TFUhEpas', name: 'Korea Beauty Clinic Auckland', name_ko: '코리아 뷰티 클리닉 Korea Beauty Clinic Auckland', subcategory: '피부과', city: 'auckland', lat: -36.9591, lng: 174.9018, address: '158A Flat Bush School Road, Flat Bush, Auckland 2019 뉴질랜드', phone: '+64 27 234 8888', google_rating: 4.9 },
  { google_place_id: 'ChIJMbFt91o_DW0RAspfsKJnWWY', name: 'Dr Sunee Kim, Medical Aesthetic and Skin Health', name_ko: '닥터 써니 킴 Dr Sunee Kim Medical Aesthetic', subcategory: '피부과', city: 'auckland', lat: -36.8110, lng: 174.6310, address: '124 Hobsonville Road, Hobsonville, Auckland 0616 뉴질랜드', phone: '+64 21 472 665', google_rating: 5.0 },
  { google_place_id: 'ChIJfVp0dQdIDW0RWjjWQLDJs0A', name: 'Yes Acupuncture Clinic (하늘숲한의원)', name_ko: '하늘숲한의원 Yes Acupuncture Clinic', subcategory: '한의원', city: 'auckland', lat: -36.8459, lng: 174.7720, address: 'Ground floor/68 Beach Road, Auckland CBD 1010 뉴질랜드', phone: '+64 21 686 354', google_rating: 4.9 },
  { google_place_id: 'ChIJnxVZz4c5DW0RoHuqo4CGix8', name: 'Dr Han Choi - Oral & Maxillofacial Surgeon', name_ko: '닥터 한 최 구강외과 Dr Han Choi Oral & Maxillofacial Surgeon', subcategory: '치과', city: 'auckland', lat: -36.7967, lng: 174.7469, address: '3 Akoranga Drive, Northcote, Auckland 0627 뉴질랜드', phone: '+64 800 245 413', google_rating: null },
  { google_place_id: 'ChIJI6zpUJs5DW0R4tHZ8pxObSs', name: "Kim's Dental Surgery", name_ko: "킴스 치과 Kim's Dental Surgery", subcategory: '치과', city: 'auckland', lat: -36.7640, lng: 174.7370, address: '1st floor/20A Link Drive, Glenfield, Auckland 0627 뉴질랜드', phone: '+64 9 443 3539', google_rating: 4.2 },
  { google_place_id: 'ChIJUzjK0QY7DW0RSv7_wbK1IAU', name: 'MoonStone Dental Care', name_ko: '문스톤 치과 MoonStone Dental Care', subcategory: '치과', city: 'auckland', lat: -36.7460, lng: 174.6936, address: 'Unit K/101 Apollo Drive, Rosedale, Auckland 0632 뉴질랜드', phone: '+64 9 475 6535', google_rating: 4.8 },
  { google_place_id: 'ChIJteVijeo7DW0ReYbz2XeiiLM', name: 'JJ Dental Care', name_ko: 'JJ 치과 JJ Dental Care', subcategory: '치과', city: 'auckland', lat: -36.7414, lng: 174.7121, address: '8A/331 Rosedale Road, Albany, Auckland 0632 뉴질랜드', phone: '+64 9 418 4189', google_rating: 5.0 },
  { google_place_id: 'ChIJRbBkgCw6DW0Rk1GRmaMgDas', name: 'Star Dental', name_ko: '스타 치과 Star Dental', subcategory: '치과', city: 'auckland', lat: -36.7460, lng: 174.6936, address: 'Unit B/46 Constellation Drive, Rosedale, Auckland 0632 뉴질랜드', phone: '+64 9 478 9466', google_rating: 4.9 },
  { google_place_id: 'ChIJ1VQAS3Q7DW0R-5-WVpWt6IE', name: '서경한의원 [Seo Gyeong Acu Clinic]', name_ko: '서경한의원 Seo Gyeong Acu Clinic', subcategory: '한의원', city: 'auckland', lat: -36.7597, lng: 174.7399, address: '46 Sequoia Place, Sunnynook, Auckland 0620 뉴질랜드', phone: '+64 210 518 749', google_rating: 5.0 },
  { google_place_id: 'ChIJ33kQBBc7DW0RBfT8ZDdHY0M', name: 'Sunset Road Acupuncture & Massage (썬셋로드 한의원)', name_ko: '썬셋로드 한의원 Sunset Road Acupuncture & Massage', subcategory: '한의원', city: 'auckland', lat: -36.7150, lng: 174.7480, address: '18/326 Sunset Road, Windsor Park, Auckland 0632 뉴질랜드', phone: '+64 22 454 3501', google_rating: 5.0 },
  { google_place_id: 'ChIJaaPvCcw7DW0RPxVNfumqujc', name: 'Vine Clinic (포도나무 한의원)', name_ko: '포도나무 한의원 Vine Clinic', subcategory: '한의원', city: 'auckland', lat: -37.0624, lng: 174.9436, address: '11 Bayvista Drive, Karaka 2113 뉴질랜드', phone: '+64 20 4011 9122', google_rating: 5.0 },
  { google_place_id: 'ChIJT7Aw2c47DW0RNsX2Xu9coks', name: 'Sherpa Wellness Centre - Acupuncture & Physiotherapy', name_ko: '셰르파 웰니스 한의원 Sherpa Wellness Centre', subcategory: '한의원', city: 'auckland', lat: -36.7460, lng: 174.6936, address: '9B Apollo Drive, Rosedale, Auckland 0632 뉴질랜드', phone: '+64 20 4095 9882', google_rating: 5.0 },
  { google_place_id: 'ChIJT-CKKUwjDW0Rne71AWDmlOU', name: '힐링타임 클리닉 (선금수 한의원)', name_ko: '힐링타임 클리닉 선금수 한의원', subcategory: '한의원', city: 'auckland', lat: -36.7680, lng: 174.7467, address: '97 Sunnynook Road, Forrest Hill, Auckland 0620 뉴질랜드', phone: '+64 9 440 9181', google_rating: 5.0 },
  { google_place_id: 'ChIJLT3fv3U7DW0RGFmRZsZFbOM', name: 'Soo Skincare', name_ko: '수 스킨케어 Soo Skincare', subcategory: '피부과', city: 'auckland', lat: -36.7460, lng: 174.7200, address: 'unit4/100 Rosedale Road, Rosedale, Auckland 0632 뉴질랜드', phone: '+64 21 818 419', google_rating: 5.0 },
  { google_place_id: 'ChIJ_64Ev-5HDW0RFfNmjAi6FMg', name: '큐어위드 한의원', name_ko: '큐어위드 한의원', subcategory: '한의원', city: 'auckland', lat: -36.7640, lng: 174.7370, address: '2/54 View Road, Wairau Valley, Auckland 0627 뉴질랜드', phone: '+64 9 379 6886', google_rating: 4.8 },
  { google_place_id: 'ChIJd_4Qzc9HDW0RSar2ZjQEckI', name: "Soojin's Acupuncture Clinic", name_ko: "수진 침술원 Soojin's Acupuncture Clinic", subcategory: '한의원', city: 'auckland', lat: -36.8780, lng: 174.7500, address: '235 Mount Eden Road, Mount Eden, Auckland 1024 뉴질랜드', phone: '+64 21 362 010', google_rating: 5.0 },
  { google_place_id: 'ChIJ5TyiHcxNDW0RN5zUA5zm0nY', name: 'HEH Acupuncture Clinic 천지인 한의원', name_ko: '천지인 한의원 HEH Acupuncture Clinic', subcategory: '한의원', city: 'auckland', lat: -36.9885, lng: 174.8817, address: 'Coner Carlie Street and, 488 Great South Road, Papatoetoe, Auckland 2025 뉴질랜드', phone: '+64 9 242 0907', google_rating: 5.0 },
  { google_place_id: 'ChIJnTEZSPpMDW0RgdWWNbBbKxY', name: 'HEH Acupuncture Clinic 천지인 한의원', name_ko: '천지인 한의원 플랫부시 HEH Acupuncture Clinic Flat Bush', subcategory: '한의원', city: 'auckland', lat: -36.9591, lng: 174.9018, address: '14 Fusion Road, Flat Bush, Auckland 2019 뉴질랜드', phone: '+64 21 411 323', google_rating: 5.0 },
  { google_place_id: 'ChIJ88SlLsRNDW0Ru0kBkC2OPqI', name: 'Physio Plus / Master Acupuncture 20년 경력의 한인여성 물리치료사 상주', name_ko: '피지오 플러스 한인 물리치료 Physio Plus Master Acupuncture', subcategory: '기타', city: 'auckland', lat: -36.9618, lng: 174.8997, address: '28/15 Bishop Lenihan Place, East Tāmaki, Auckland 2013 뉴질랜드', phone: '+64 21 288 2050', google_rating: 4.8 },
  { google_place_id: 'ChIJx4PhVMtLDW0RIpagd13QIcQ', name: '메디트리 한의원', name_ko: '메디트리 한의원', subcategory: '한의원', city: 'auckland', lat: -36.9618, lng: 174.8997, address: '20/15 Bishop Lenihan Place, East Tāmaki, Auckland 2013 뉴질랜드', phone: '+64 27 888 3000', google_rating: 5.0 },
  { google_place_id: 'ChIJdeb6ThQ5DW0RARhU9HbvPdY', name: 'Sunrise Midwifery - Midwife Yoomi Kim', name_ko: '선라이즈 산파 유미 김 Sunrise Midwifery Yoomi Kim', subcategory: '기타', city: 'auckland', lat: -36.7597, lng: 174.7399, address: '120 Sunnynook Road, Sunnynook, Auckland 0620 뉴질랜드', phone: '+64 210 200 9575', google_rating: 5.0 },
  { google_place_id: 'ChIJ_ay1Cjg5DW0RiQG-PMnV98Y', name: 'K-Medi Clinic', name_ko: 'K-메디 클리닉 K-Medi Clinic', subcategory: '내과/가정의학', city: 'auckland', lat: -36.7680, lng: 174.7467, address: '55 William Souter Street, Forrest Hill, Auckland 0620 뉴질랜드', phone: '+64 22 401 2486', google_rating: 5.0 },
  { google_place_id: 'ChIJrbl89DY7DW0R4sI8-iD_eEE', name: 'S BEAUTY CLINIC', name_ko: 'S 뷰티 클리닉 S BEAUTY CLINIC', subcategory: '피부과', city: 'auckland', lat: -36.7414, lng: 174.7121, address: '100 Rosedale Road, Albany, Auckland 0632 뉴질랜드', phone: '+64 9 880 2450', google_rating: 5.0 },
  { google_place_id: 'ChIJYb0mqFEhMm0ROythbMT05oY', name: 'K-massage&Skincare', name_ko: 'K-마사지&스킨케어 K-massage&Skincare', subcategory: '피부과', city: 'auckland', lat: -36.7150, lng: 174.7480, address: '3A Alexander Avenue, Torbay, Auckland 0630 뉴질랜드', phone: '+64 26 651 8050', google_rating: 5.0 },
  { google_place_id: 'ChIJs0CGLpBODW0RwMiiQ2HvAAU', name: 'Middlemore Hospital', name_ko: '미들모어 병원 Middlemore Hospital', subcategory: '종합/국제병원', city: 'auckland', lat: -36.9637449, lng: 174.8414784, address: 'Middlemore Hospital, Auckland 2025 뉴질랜드', phone: '+64 9 276 0000', google_rating: null },
  { google_place_id: 'ChIJK-ut38M5DW0RqgFw01iBZiU', name: '노스 쇼어 병원', name_ko: '노스 쇼어 병원', subcategory: '종합/국제병원', city: 'auckland', lat: -36.7819206, lng: 174.7564443, address: '124 Shakespeare Road, Takapuna, Auckland 0620 뉴질랜드', phone: '+64 9 486 8900', google_rating: 3.6 },
];

async function main() {
  console.log('총 ' + data.length + '개 INSERT 시작...');
  let success = 0;
  let skip = 0;
  for (const item of data) {
    const { error } = await supabase.from('businesses').insert({
      ...item,
      category: '의료',
      pending_approval: false,
      is_verified: false,
      is_korean_run: false,
      registration_type: 'script',
    });
    if (error) {
      if (error.code === '23505') {
        console.log('중복 스킵: ' + item.name);
        skip++;
      } else {
        console.log('에러 (' + item.name + '): ' + error.message);
      }
    } else {
      console.log('완료: ' + item.name_ko);
      success++;
    }
  }
  console.log('\n완료! 성공: ' + success + '개 / 중복스킵: ' + skip + '개');
}

main().catch(console.error);