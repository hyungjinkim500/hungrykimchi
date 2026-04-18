import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  console.error('환경변수 누락: SUPABASE_KEY 필요');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  {
    google_place_id: 'ChIJZfmIFTkvdTERS5zsptYP44s',
    name: '주호치민 대한민국 총영사관',
    name_ko: '주호치민 대한민국 총영사관',
    category: '관공·긴급',
    primary_type_ko: '대한민국 총영사관',
    address: '107 Nguyễn Du, Bến Thành, Hồ Chí Minh',
    phone: '+84 28 3822 5757',
    lat: 10.7743367,
    lng: 106.6957231,
    city: 'hochiminh',
    google_rating: null,
    pending_approval: false,
    is_verified: true,
    is_korean_run: true,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJS0fEFDwvdTERWIXbbwXVgVM',
    name: 'HCMC Immigration Department',
    name_ko: '호치민 출입국관리사무소',
    category: '관공·긴급',
    primary_type_ko: '출입국관리사무소',
    address: '161 Nguyễn Du, Bến Thành, Hồ Chí Minh',
    phone: null,
    lat: 10.7721005,
    lng: 106.6926214,
    city: 'hochiminh',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJ4_G7exUvdTERy2YXwG-OPGI',
    name: 'District 1 Police',
    name_ko: '1군 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '73 Yersin, Bến Thành, Hồ Chí Minh',
    phone: '+84 28 3829 7643',
    lat: 10.7669781,
    lng: 106.6972044,
    city: 'hochiminh',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJc0mt1WIldTERmI-yg7_BrDw',
    name: 'District 7 Police',
    name_ko: '7군 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '2 Hoàng Văn Thái, Tân Phú, Tân Mỹ, Hồ Chí Minh',
    phone: '+84 28 3785 1787',
    lat: 10.7329114,
    lng: 106.7262307,
    city: 'hochiminh',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJBWIAVcQodTERdKHGWE0jxto',
    name: 'Công An Quận Bình Thạnh',
    name_ko: '빈탄군 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '42 Xô Viết Nghệ Tĩnh, Thạnh Mỹ Tây, Hồ Chí Minh',
    phone: '+84 28 3841 4882',
    lat: 10.794377,
    lng: 106.709138,
    city: 'hochiminh',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJAdHRWqAndTERXMGZl9IQUxQ',
    name: 'Thủ Đức City Police',
    name_ko: '투득 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '371 Đoàn Kết, Thủ Đức, Hồ Chí Minh',
    phone: '+84 28 3897 2025',
    lat: 10.8488308,
    lng: 106.7686743,
    city: 'hochiminh',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
];

async function main() {
  const { data: deletedData } = await supabase.from('deleted_places').select('google_place_id');
  const deletedIds = new Set((deletedData || []).map(d => d.google_place_id).filter(Boolean));

  const { data: existingData } = await supabase.from('businesses').select('google_place_id').not('google_place_id', 'is', null);
  const existingIds = new Set((existingData || []).map(b => b.google_place_id));

  const toInsert = DATA.filter(item => {
    if (deletedIds.has(item.google_place_id)) {
      console.log(`🚫 삭제목록에 있음: ${item.name_ko}`);
      return false;
    }
    if (existingIds.has(item.google_place_id)) {
      console.log(`⏭ 이미 존재: ${item.name_ko}`);
      return false;
    }
    return true;
  });

  if (toInsert.length === 0) {
    console.log('INSERT할 데이터 없음');
    return;
  }

  const { error } = await supabase.from('businesses').insert(toInsert);
  if (error) {
    console.error('INSERT 에러:', error.message);
  } else {
    console.log(`완료! ${toInsert.length}개 INSERT됨`);
    toInsert.forEach(item => console.log(`  ✅ ${item.name_ko}`));
  }
}

main().catch(console.error);