import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 누락'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const data = [
  { google_place_id: 'ChIJD9_ukuVHDW0RspYAcVXM5HQ', name: '주 뉴질랜드 대한민국 대사관 오클랜드 분관', name_ko: '주오클랜드 대한민국 총영사관', city: 'auckland', lat: -36.8485, lng: 174.7633, address: '12/205 Queen Street, Auckland CBD 1010 뉴질랜드', phone: '+64 9 379 0818', google_rating: 4.0 },
  { google_place_id: 'ChIJ1zODZgBHDW0RPbCegGsGD_8', name: 'Auckland Central Police Station', name_ko: '오클랜드 센트럴 경찰서', city: 'auckland', lat: -36.8485, lng: 174.7633, address: '210 Federal Street, Auckland CBD 1010 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJ9yh5q-9HDW0R-FkQdJqGg-w', name: 'Auckland Central Police Station District Headquarters', name_ko: '오클랜드 센트럴 경찰서 본부', city: 'auckland', lat: -36.8560, lng: 174.7460, address: '13/15 College Hill, Freemans Bay, Auckland 1011 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJpZGlhURJDW0RmV6MpGPyTas', name: 'Newmarket Police Station', name_ko: '뉴마켓 경찰서', city: 'auckland', lat: -36.8710, lng: 174.7760, address: '14 Teed Street, Newmarket, Auckland 1023 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJg7dctkMUDW0RAJtbZZ6bwtk', name: 'Henderson Police Station', name_ko: '헨더슨 경찰서', city: 'auckland', lat: -36.8700, lng: 174.6280, address: '7 Buscomb Avenue, Henderson, Auckland 0610 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJW1PncWo4DW0RdrEOWO3UQgA', name: 'NZ Police Northcote', name_ko: '노스코트 경찰서', city: 'auckland', lat: -36.8011, lng: 174.7463, address: '28 Sulphur Beach Road, Northcote, Auckland 0627 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJT98S1khGDW0RwMEYkprZyPI', name: 'Balmoral Police Station', name_ko: '발모랄 경찰서', city: 'auckland', lat: -36.8780, lng: 174.7500, address: '1-3 Halston Road, Mount Eden, Auckland 1024 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJE1mCY5VNDW0Rwlg8spaSeaw', name: 'Counties Manukau Police Station', name_ko: '카운티스 마누카우 경찰서', city: 'auckland', lat: -36.9885, lng: 174.8817, address: '42 Manukau Station Road, Manukau City Centre, Auckland 2104 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJDdY77M5GDW0RJ8Egki80r9o', name: 'Avondale Police Station', name_ko: '아본데일 경찰서', city: 'auckland', lat: -36.9050, lng: 174.8430, address: '1832 Great North Road, Avondale, Auckland 1026 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJW-czndc5DW0RexLtGxpsFso', name: 'Takapuna Police Station', name_ko: '타카푸나 경찰서', city: 'auckland', lat: -36.7878, lng: 174.7764, address: '19 Anzac Street, Takapuna, Auckland 0622 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJXzJVOe9PDW0R9nsA_ddf814', name: '오클랜드 국제공항 경찰서', name_ko: '오클랜드 국제공항 경찰서', city: 'auckland', lat: -37.0064, lng: 174.7904, address: '7 Manu Tapu Drive, Māngere, Auckland 2022 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJK3R4adY5DW0R2TtsBqb4UV4', name: 'New Zealand Police Waitemata District Headquarters', name_ko: '와이테마타 경찰서 본부', city: 'auckland', lat: -36.7878, lng: 174.7764, address: '12 Northcroft Street, Takapuna, Auckland 0622 뉴질랜드', phone: '+64 9 488 9750', google_rating: null },
  { google_place_id: 'ChIJW6rHiLlODW0RDji1pISVyzQ', name: 'Otahuhu Police Station', name_ko: '오타후후 경찰서', city: 'auckland', lat: -36.9500, lng: 174.8430, address: '180 Great South Road, Ōtāhuhu, Auckland 1062 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJu-_it09BDW0Rd6I1ykqHlHo', name: 'New Lynn Police Station', name_ko: '뉴린 경찰서', city: 'auckland', lat: -36.9090, lng: 174.6839, address: '3092 Great North Road, New Lynn, Auckland 0600 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJ9e67KihKDW0RBu9_MGx3mz8', name: 'Glen Innes Police Station', name_ko: '글렌이니스 경찰서', city: 'auckland', lat: -36.8980, lng: 174.8500, address: 'Corner Of Taniwha Street And Line Road, Glen Innes, Auckland 1072 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJ_5gpR99LDW0RF8HdPL1WuVI', name: '노스쇼어 경찰서', name_ko: '노스쇼어 경찰서', city: 'auckland', lat: -36.7400, lng: 174.7200, address: '52 Parkway Drive, Rosedale, Auckland 0622 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJD2zfwLJIDW0RmNakRZy5l8w', name: 'Onehunga Police Station', name_ko: '오네훙아 경찰서', city: 'auckland', lat: -36.9217, lng: 174.7995, address: '126 Onehunga Mall, Onehunga, Auckland 1061 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJxRnQgjlMDW0RmUPCbRA4YwM', name: 'Ormiston Police Station', name_ko: '오미스톤 경찰서', city: 'auckland', lat: -36.9270, lng: 174.9140, address: '50 Ormiston Road, Flat Bush, Auckland 2019 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJr71YSS9LDW0RVWXzZ3WZehk', name: 'Howick Police Station', name_ko: '호윅 경찰서', city: 'auckland', lat: -36.9110, lng: 174.9375, address: '76 Cook Street, Howick, Auckland 2014 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJVT81k85GDW0RhXSjYGQqAqU', name: 'Browns Bay Community Policing Centre', name_ko: '브라운스베이 경찰서', city: 'auckland', lat: -36.7150, lng: 174.7480, address: 'Clyde Road, Browns Bay, Auckland 0630 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJjxpdtkMUDW0RXO85EItOwlE', name: 'Kumeu/Huapai Police Station', name_ko: '쿠메우 경찰서', city: 'auckland', lat: -36.7800, lng: 174.5600, address: '4 Matua Road, Kumeū 0810 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJ6RykqYBSDW0RK2AkcWRu4yU', name: 'Manurewa Police Station', name_ko: '마누레와 경찰서', city: 'auckland', lat: -37.0200, lng: 174.8990, address: '14 Halver Road, Manurewa, Auckland 2102 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJEWBaRgpPDW0RVDewq4Shkz0', name: 'Mangere Police Station', name_ko: '망게레 경찰서', city: 'auckland', lat: -36.9800, lng: 174.8000, address: '92 Bader Drive, Māngere, Manukau 2022 뉴질랜드', phone: null, google_rating: null },
  { google_place_id: 'ChIJU2wdIdSscm0R5gx_mEUVUHA', name: 'Papakura Central Police Station', name_ko: '파파쿠라 경찰서', city: 'auckland', lat: -37.0640, lng: 174.9440, address: '64 Wood Street, Papakura, Auckland 2110 뉴질랜드', phone: null, google_rating: null },
];

async function main() {
  console.log('총 ' + data.length + '개 INSERT 시작...');
  let success = 0;
  let skip = 0;
  for (const item of data) {
    const { error } = await supabase.from('businesses').insert({
      ...item,
      category: '관공·긴급',
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