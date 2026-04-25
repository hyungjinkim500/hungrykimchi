import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  { google_place_id: 'ChIJO4jrY3IPNTERD9rtaF5iDnw', name: 'K-Market Nguyen Cao (K마켓 응우엔까오점)', name_ko: 'K마켓 응우엔까오점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '아시아 식료품점', address: '126 Nguyễn Cao, Kinh Bắc, Bắc Ninh', phone: '+84 222 3559 228', lat: 21.1751978, lng: 106.0594862, city: 'bacninh', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJib08DG4NNTER4r7DK0qfpN0', name: 'K마켓 비엣롱 (K-MARKET VIETLONG)', name_ko: 'K마켓 비엣롱', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '30 Đ. Lý Thái Tổ, Kinh Bắc, Bắc Ninh', phone: '+84 337 878 284', lat: 21.175201, lng: 106.0657914, city: 'bacninh', google_rating: 4.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJx8P1DsIPNTERsF_p3H0vvs4', name: '케이마켓 박닌 1호점(KMarket Bac Ninh Nga 4)', name_ko: '케이마켓 박닌 1호점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '66-68 Đ. Lý Thái Tổ, Võ Cường, Bắc Ninh', phone: '+84 971 064 385', lat: 21.1728918, lng: 106.0623013, city: 'bacninh', google_rating: 3.6, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJg8mlenoJNTERbWQSeD6D2W8', name: 'K-Market Ngoc Han (K마켓 응옥한점)', name_ko: 'K마켓 응옥한점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '아시아 식료품점', address: '342 Ngọc Hân Công Chúa, Võ Cường, Bắc Ninh', phone: '+84 222 3636 022', lat: 21.1699791, lng: 106.0550127, city: 'bacninh', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJHzMiZGEJNTEReCYkYst1Aks', name: 'OK MART 24 FOOD SERVICE B.N 식자재마트 박닌본점', name_ko: 'OK마트 24 식자재마트 박닌본점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: '162 Nguyễn Cao, Võ Cường, Bắc Ninh', phone: '+84 964 027 895', lat: 21.1721029, lng: 106.0549383, city: 'bacninh', google_rating: 4.5, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ5ZGfLRMNNTERwAgD0jqiRPM', name: 'K-MARKET VINCOM BẮC NINH', name_ko: 'K마켓 빈컴 박닌', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '10 Đ. Lý Thái Tổ, Kinh Bắc, Bắc Ninh', phone: '+84 222 3903 371', lat: 21.17918, lng: 106.0724722, city: 'bacninh', google_rating: 4.5, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJKT79Zo4JNTERH9m2XLdKCuY', name: 'K-MARKET 직영점 식자재매장', name_ko: 'K마켓 직영점 식자재매장', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '342 Ngọc Hân Công Chúa, Võ Cường, Bắc Ninh', phone: '+84 337 878 284', lat: 21.1699791, lng: 106.0550127, city: 'bacninh', google_rating: 4.6, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJSxAX8ZwJNTERnEozqawhDMw', name: '홈마트', name_ko: '홈마트 박닌', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '53C4+249, Ngọc Hân Công Chúa, Võ Cường, Bắc Ninh', phone: '+84 962 924 768', lat: 21.1700368, lng: 106.0553582, city: 'bacninh', google_rating: 4.2, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJlX-G0WkNNTER3Dmt4BfzXU8', name: 'ALLBIT KOREA(AK F&T)', name_ko: '올빗 코리아', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: 'Đ. Văn Miếu, Đại Phúc, Võ Cường, Bắc Ninh', phone: '+84 981 004 024', lat: 21.1744462, lng: 106.0683044, city: 'bacninh', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJrbAoTWQNNTERFn8XZzBprmM', name: '케이마켓 박장', name_ko: '케이마켓 박장', category: '마트/슈퍼', subcategory: null, primary_type_ko: '아시아 식료품점', address: '743G+45W, QL37, Nếnh, Bắc Ninh', phone: '+84 204 3661 662', lat: 21.2528515, lng: 106.1254467, city: 'bacninh', google_rating: 4.5, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJiYTcqG0JNTERC6cx5wjNvGw', name: 'SEOUL MART', name_ko: '서울마트', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '5355+V5V, Đ. Lý Thánh Tông, Võ Cường, Bắc Ninh', phone: null, lat: 21.159745, lng: 106.0579368, city: 'bacninh', google_rating: 4.8, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ3UtrwAEMNTER8rzHcN1R0M8', name: 'Cửa hàng tiện lợi OKAY MART', name_ko: '오케이마트', category: '마트/슈퍼', subcategory: null, primary_type_ko: '백화점', address: '66 Ngọc Hân Công Chúa, Kinh Bắc, Bắc Ninh', phone: '+84 969 812 688', lat: 21.1763874, lng: 106.0652754, city: 'bacninh', google_rating: 4.3, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ5fKjUKsONTERBqI3q52AqnQ', name: 'CU편의점', name_ko: 'CU 편의점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: '53F5+CCG, Đ Ng Tất Tố, Võ Cường, Bắc Ninh', phone: '+84 968 815 573', lat: 21.1735547, lng: 106.0585782, city: 'bacninh', google_rating: 4.7, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJJ7_8bz8PNTERGfwOcZe2ehk', name: '코리아마트', name_ko: '코리아마트 옌쫑', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '5XXV+CPV, Long Châu, Yên Trung, Bắc Ninh', phone: '+84 222 3699 033', lat: 21.1986066, lng: 105.9942968, city: 'bacninh', google_rating: 4.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJV3TN8kMJNTERN5O93UUsNRE', name: '서울마트', name_ko: '서울마트 응옥한', category: '마트/슈퍼', subcategory: null, primary_type_ko: '생활용품점', address: '278 Ngọc Hân Công Chúa, Võ Cường, Bắc Ninh', phone: '+84 869 790 400', lat: 21.1713195, lng: 106.0571617, city: 'bacninh', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJZ7VTu6oONTER8zZTJLnzirE', name: 'PlusMart 플러스마트 박닌점', name_ko: '플러스마트 박닌점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '29n10 Lý Nhân Tông, Võ Cường, Bắc Ninh', phone: '+84 961 668 949', lat: 21.1715826, lng: 106.0584303, city: 'bacninh', google_rating: 4.2, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJPSIiTmgJNTERAzsuT16i2GE', name: 'e&mart', name_ko: '이마트 박닌', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '260 Ngọc Hân Công Chúa, Võ Cường, Bắc Ninh', phone: '+84 916 191 155', lat: 21.1717517, lng: 106.0579207, city: 'bacninh', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJM4oIJd0PNTERZ2ZFnOzLgX0', name: '케이마켓 옌퐁 박닌', name_ko: '케이마켓 옌퐁점', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: 'Yen Trung, Bac Ninh', phone: '+84 222 3680 689', lat: 21.2050108, lng: 105.9959292, city: 'bacninh', google_rating: 4.7, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ-75Yb1MJNTERn9jJjU_lR-U', name: 'Cửa Hàng Tiện Ích Okay Mart 2', name_ko: '오케이마트 2호', category: '마트/슈퍼', subcategory: null, primary_type_ko: '백화점', address: '28N3 Ngọc Hân Công Chúa, Võ Cường, Bắc Ninh', phone: '+84 969 812 688', lat: 21.1713321, lng: 106.0571556, city: 'bacninh', google_rating: 3.3, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJU8_2g1UJNTERzjUBM6BuAI4', name: 'OK 한국 식자재 유아용품 센터', name_ko: 'OK 한국식자재 센터', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: '406 Nguyễn Trãi, Võ Cường, Bắc Ninh', phone: '+84 384 188 408', lat: 21.1691526, lng: 106.0634823, city: 'bacninh', google_rating: 4.3, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJXbmXa-wJNTERN5L0nG--ihM', name: 'KHANH HOA KOREA MART', name_ko: '칸호아 코리아마트', category: '마트/슈퍼', subcategory: null, primary_type_ko: '식료품점', address: 'Nội Viên, Tân Chi, Bắc Ninh', phone: '+84 974 857 093', lat: 21.1195048, lng: 106.0660377, city: 'bacninh', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJzfYiJN8NNTER8HyGsaYzVyI', name: 'Nhân Sâm Hàn Quốc Bắc Ninh', name_ko: '한국 인삼 박닌', category: '마트/슈퍼', subcategory: null, primary_type_ko: '슈퍼마켓', address: '264 Đ. Nguyễn Gia Thiều, Kinh Bắc, Bắc Ninh', phone: '+84 961 936 536', lat: 21.181287, lng: 106.0661195, city: 'bacninh', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
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

  console.log('전체 ' + DATA.length + '개 중 ' + toInsert.length + '개 삽입 예정');

  let success = 0;
  let skip = 0;

  for (const item of toInsert) {
    const { error } = await supabase.from('businesses').insert([item]);
    if (error) {
      console.error('❌ ' + item.name + ': ' + error.message);
      skip++;
    } else {
      console.log('✅ ' + item.name);
      success++;
    }
  }

  console.log('완료: 성공 ' + success + '개, 실패/스킵 ' + skip + '개');
}

main().catch(console.error);