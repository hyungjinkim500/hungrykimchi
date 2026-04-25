import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  // ===== 경찰 =====
  { google_place_id: 'ChIJjQRgPvF6SjERinqhPxv250Q', name: 'City Police Department. Haiphong', name_ko: '하이퐁 시 경찰청', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: 'Số 2 P. Lê Đại Hành, Hồng Bàng, Hải Phòng', phone: '+84 225 3842 298', lat: 20.8591, lng: 106.6812, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJGfPRNsR6SjERwXFX1Zf0iCs', name: 'Công an quận Ngô Quyền', name_ko: '응오꾸옌 구 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '10 P. Máy Tơ, Ngô Quyền, Hải Phòng', phone: '+84 225 3550 005', lat: 20.8570, lng: 106.6990, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJwQQluIt6SjERnmVft08NnZA', name: 'Le Chan District Police', name_ko: '레쩐 구 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '122 P. Hai Bà Trưng, Lê Chân, Hải Phòng', phone: null, lat: 20.8500, lng: 106.6800, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ9bUpIfR6SjER_HK7I9SItSg', name: 'Police of Hồng Bàng District', name_ko: '홍방 구 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '5 P. Bến Bính, Hồng Bàng, Hải Phòng', phone: '+84 225 3745 850', lat: 20.8591, lng: 106.6700, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJMcy1G6t6SjER6_vkg0ZYrnc', name: 'Công an quận Hải An', name_ko: '하이안 구 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: 'RPMC+8JW, Đ. Lê Hồng Phong, Hải An, Hải Phòng', phone: null, lat: 20.8320, lng: 106.7050, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJm62wgn57SjERQaqCKVc3sDE', name: 'Công An Thành phố Thủy Nguyên', name_ko: '투이응우옌 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: 'Thuy Nguyen, Hải Phòng', phone: null, lat: 20.9000, lng: 106.7000, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  // ===== 출입국 =====
  { google_place_id: 'ChIJy_iZh_J6SjERVce8JIHfLkg', name: 'Immigration Police Division Hai Phong', name_ko: '하이퐁 출입국 경찰', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '2 P.Trần Bình Trọng, Ngô Quyền, Hải Phòng', phone: null, lat: 20.8570, lng: 106.6980, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ06mMgvJ6SjERJrWsAbQGI-s', name: 'Phong Quan Ly Xuat Nhap Canh', name_ko: '하이퐁 출입국관리소', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '6 P.Trần Bình Trọng, Ngô Quyền, Hải Phòng', phone: '+84 225 3921 343', lat: 20.8570, lng: 106.6975, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  // ===== 소방 =====
  { google_place_id: 'ChIJUQ0IAnJ7SjERtWQtv3V2M8Y', name: 'Phòng Cảnh sát PCCC và CNCH - Công an thành phố Hải Phòng', name_ko: '하이퐁 소방구조대', category: '관공·긴급', subcategory: null, primary_type_ko: '소방서', address: '280 Lạch Tray, Lê Chân, Hải Phòng', phone: null, lat: 20.8380, lng: 106.6954, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJn77I3IV5SjER1J3Kxk872I0', name: 'Firefighting police KV4-PC07-Quán Toan District', name_ko: '꽌또안 소방서', category: '관공·긴급', subcategory: null, primary_type_ko: '소방서', address: 'VHHM+785, Bắc Sơn, An Dương, Hải Phòng', phone: '+84 225 3911 820', lat: 20.8600, lng: 106.5750, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
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