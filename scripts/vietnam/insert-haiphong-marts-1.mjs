import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  { google_place_id: 'ChIJdVa9waF6SjER1FxiOTvKKLA', name: '한국 마트', name_ko: '한국마트', category: '마트/슈퍼', subcategory: null, primary_type_ko: '아시아 식료품점', address: '100 P. Văn Cao, Hải Phòng', phone: '0225 3653 879', lat: 20.8374976, lng: 106.7005843, city: 'haiphong', google_rating: 4.0, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJhZ9WWAB7SjER2ziQm-p5J90', name: 'Kmarket Hai Phong 케이마켓 하이퐁 반까오점', name_ko: '케이마켓 하이퐁 반까오점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: '174 P. Văn Cao, Hải Phòng', phone: '0225 3282 886', lat: 20.836158, lng: 106.7010118, city: 'haiphong', google_rating: 4.0, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJlVI6FhV7SjER-eEsAAiJusw', name: 'Fresh K Mart', name_ko: '프레시 케이마트', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '176 P. Văn Cao, Hải Phòng', phone: '0368 958 659', lat: 20.8359061, lng: 106.7010464, city: 'haiphong', google_rating: 4.4, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJCx6Fz557SjERJSvhA8cJ9-s', name: 'Khoai Kpop Store', name_ko: '코아이 케이팝 한국식품점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: '135B P. Đông Khê, Hải Phòng', phone: '0948 898 998', lat: 20.8504467, lng: 106.6963815, city: 'haiphong', google_rating: 4.7, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJL_PEmDVxSjERgaTSspd66kM', name: 'PlusMart 플러스마트 하이퐁점', name_ko: '플러스마트 하이퐁점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: 'Ng. 174 Văn Cao, Hải Phòng', phone: '0985 798 313', lat: 20.8358468, lng: 106.7006585, city: 'haiphong', google_rating: 4.2, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJ_ZLTXad7SjERRiNJ6lOYqVs', name: 'OK MART 24 Van Cao', name_ko: 'OK마트 24 반까오점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '할인 슈퍼마켓', address: '43/183 Van Cao, Hải Phòng', phone: '0384 188 408', lat: 20.8367656, lng: 106.7031485, city: 'haiphong', google_rating: 4.7, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ81x10VZ7SjERTLmPXkA1rMU', name: 'OK MART 24 FOOD SERVICE H.P 하이퐁', name_ko: 'OK마트 24 푸드서비스 하이퐁', category: '마트/슈퍼', subcategory: null, primary_type_ko: '할인 슈퍼마켓', address: '1 P. Văn Cao, Hải Phòng', phone: '0384 188 408', lat: 20.841135, lng: 106.7006463, city: 'haiphong', google_rating: 4.8, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJETPkDbt6SjER_-BAO3Uu8rE', name: '고 하이퐁', name_ko: '고(GO) 하이퐁', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: 'Lô 1, Ngã Năm Sân Bay, Hải Phòng', phone: null, lat: 20.8454971, lng: 106.7074223, city: 'haiphong', google_rating: 4.1, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJt5S1H_1xSjER4L3tQb88tck', name: 'Fresh K mart 미나토점', name_ko: '프레시 케이마트 미나토점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: 'Waterfront City, Hải Phòng', phone: '0368 958 659', lat: 20.823470, lng: 106.6916686, city: 'haiphong', google_rating: 3.8, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJy_M__SdxSjERFzqvCY-GBIk', name: 'Siêu Thị Hàn Quốc K-MART', name_ko: '한국 슈퍼마켓 케이마트 호앙후이몰점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: 'B4-01 Hoàng Huy Mall, Hải Phòng', phone: null, lat: 20.8288056, lng: 106.6864915, city: 'haiphong', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJ9bNqPABxSjERwyDXlpcl3us', name: 'K마켓 하이퐁 미나토점', name_ko: 'K마켓 미나토점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: 'Waterfront City, Hải Phòng', phone: '0225 3888 179', lat: 20.8240238, lng: 106.691454, city: 'haiphong', google_rating: null, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJD2Fogol6SjERWcpkXEO5jXA', name: 'K+ Store Hải Phòng', name_ko: 'K+ 스토어 하이퐁', category: '마트/슈퍼', subcategory: null, primary_type_ko: '상점', address: '200A P. Tô Hiệu, Hải Phòng', phone: '0225 3822 428', lat: 20.851147, lng: 106.6799313, city: 'haiphong', google_rating: 4.8, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJ8TjG3e16SjERwpx2l7qlatQ', name: 'Đồ Hàn K-Foods', name_ko: '한국식품 K-Foods', category: '마트/슈퍼', subcategory: null, primary_type_ko: '음식점', address: '32 P.Điện Biên Phủ, Hải Phòng', phone: '0904 122 205', lat: 20.8616903, lng: 106.6897482, city: 'haiphong', google_rating: null, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJwTkr7qF6SjERaP2GSWniV7A', name: 'SIÊU THỊ ACE-MART', name_ko: '에이스마트', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '149 P. Văn Cao, Hải Phòng', phone: '0225 3728 856', lat: 20.8371752, lng: 106.7010163, city: 'haiphong', google_rating: 4.2, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ0T_EUwB7SjERyCl-TSCR_FY', name: 'Yến giang korea mart', name_ko: '연장 코리아마트', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: 'Vinhome Imperia, Hải Phòng', phone: null, lat: 20.8595448, lng: 106.6669923, city: 'haiphong', google_rating: null, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJAfMwLgB3NTERtqpEBPe1g_E', name: 'Tiến Hiệp Korea Mart', name_ko: '띠엔히엡 코리아마트', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '151a Đặng Tính, TT. Phả Lại, Chí Linh, Hải Phòng', phone: null, lat: 21.1156027, lng: 106.3233035, city: 'haiphong', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ4bl2oDRlSjERrQusxx_i2_o', name: 'Siêu Thị Hàn Quốc', name_ko: '한국 슈퍼마켓', category: '마트/슈퍼', subcategory: null, primary_type_ko: '상점', address: 'WP6V+HPJ, Mai Đình Nghiễm, Phục Lễ, Nam Triệu, Hải Phòng', phone: null, lat: 20.9114713, lng: 106.7442742, city: 'haiphong', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
];

async function main() {
  const { data: existingData } = await supabase
    .from('businesses')
    .select('google_place_id')
    .limit(10000);

  const { data: deletedData } = await supabase
    .from('deleted_places')
    .select('google_place_id')
    .limit(10000);

  const existingIds = new Set((existingData || []).map((r) => r.google_place_id));
  const deletedIds = new Set((deletedData || []).map((r) => r.google_place_id));

  const toInsert = DATA.filter(
    (d) => !existingIds.has(d.google_place_id) && !deletedIds.has(d.google_place_id)
  );

  console.log(`전체 ${DATA.length}개 중 ${toInsert.length}개 삽입 예정`);

  let success = 0;
  let skip = 0;

  for (const item of toInsert) {
    const { error } = await supabase.from('businesses').insert([item]);
    if (error) {
      console.error(`❌ ${item.name}: ${error.message}`);
      skip++;
    } else {
      console.log(`✅ ${item.name}`);
      success++;
    }
  }

  console.log(`\n완료: 성공 ${success}개, 실패/스킵 ${skip}개`);
}

main().catch(console.error);