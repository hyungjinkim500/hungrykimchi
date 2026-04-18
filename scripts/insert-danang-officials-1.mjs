import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 필요'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  {
    google_place_id: 'ChIJjz24i-YZQjER4LQa4e7OVGM',
    name: '주다낭대한민국총영사관',
    name_ko: '주다낭 대한민국 총영사관',
    category: '관공·긴급',
    primary_type_ko: '대한민국 총영사관',
    address: 'Bùi Tá Hán, Khuê Mỹ, Ngũ Hành Sơn, Đà Nẵng',
    phone: '+84 236 3566 100',
    lat: 16.0380,
    lng: 108.2464,
    city: 'danang',
    google_rating: null,
    pending_approval: false,
    is_verified: true,
    is_korean_run: true,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJHY8i9zkYQjER6PoM55t1O9k',
    name: 'Da Nang City Police',
    name_ko: '다낭시 경찰청',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '80 Lê Lợi, Thạch Thang, Hải Châu, Đà Nẵng',
    phone: '+84 236 3822 300',
    lat: 16.0770760,
    lng: 108.2194710,
    city: 'danang',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJHY8i9zkYQjERTizC8-R2J_M',
    name: 'Công an Quận Hải Châu',
    name_ko: '하이쩌우군 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '16 Phan Đình Phùng, Hải Châu, Đà Nẵng',
    phone: '+84 236 3821 372',
    lat: 16.0706555,
    lng: 108.2231188,
    city: 'danang',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJZ4NaT7MQQjERxJvbrqYg8lg',
    name: 'Ngu Hanh Son district police',
    name_ko: '응우하인선군 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '492 Đ. Lê Văn Hiến, Khuê Mỹ, Ngũ Hành Sơn, Đà Nẵng',
    phone: '+84 236 3847 245',
    lat: 16.0148774,
    lng: 108.2546390,
    city: 'danang',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJmbXnFCkYQjERKeXtZ8T9YAE',
    name: 'Công an quận Sơn Trà',
    name_ko: '선짜군 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '36CM+2CQ, Huy Du, An Hải, Đà Nẵng',
    phone: '+84 236 3844 314',
    lat: 16.0700770,
    lng: 108.2335979,
    city: 'danang',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJ97SviDkYQjERJvn_RHCaw-w',
    name: 'Phòng Quản lý Xuất Nhập cảnh',
    name_ko: '다낭 출입국관리사무소',
    category: '관공·긴급',
    primary_type_ko: '출입국관리사무소',
    address: '78 Lê Lợi, Thạch Thang, Hải Châu, Đà Nẵng',
    phone: '+84 69 426 01 86',
    lat: 16.077075999999998,
    lng: 108.21947100000001,
    city: 'danang',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
];

async function main() {
  const { data: deletedData } = await supabase.from('deleted_places').select('google_place_id');
  const deletedIds = new Set((deletedData || []).map(d => d.google_place_id));
  const { data: existingData } = await supabase.from('businesses').select('google_place_id').not('google_place_id', 'is', null);
  const existingIds = new Set((existingData || []).map(b => b.google_place_id));
  const toInsert = DATA.filter(d => !deletedIds.has(d.google_place_id) && !existingIds.has(d.google_place_id));
  console.log(`총 ${DATA.length}개 중 신규 ${toInsert.length}개 INSERT 시작...`);
  const chunkSize = 50;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('businesses').insert(chunk);
    if (error) console.error(`insert 에러:`, error.message);
    else console.log(`insert 완료: ${i+1}~${Math.min(i+chunkSize, toInsert.length)}`);
  }
  console.log('완료!');
}
main().catch(console.error);
