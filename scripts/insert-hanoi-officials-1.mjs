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
    google_place_id: 'ChIJecgrU9qqNTERlioVCeagL_8',
    name: '주베트남 대한민국 대사관',
    name_ko: '주베트남 대한민국 대사관',
    category: '관공·긴급',
    primary_type_ko: '대한민국 대사관',
    address: 'Lô SQ4, P. Nguyễn Xuân Khoát, Khu Ngoại giao đoàn, Xuân Đỉnh, Hà Nội',
    phone: '+84 24 3771 0404',
    lat: 21.0668748,
    lng: 105.7967778,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: true,
    is_korean_run: true,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJV1hjPoerNTERm0eEPLtHFRA',
    name: '하노이출입국관리국',
    name_ko: '하노이 출입국관리사무소',
    category: '관공·긴급',
    primary_type_ko: '출입국관리사무소',
    address: '44 P. Phạm Ngọc Thạch, Kim Liên, Hà Nội',
    phone: null,
    lat: 21.0106374,
    lng: 105.8361620,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJYWP5Qe2qNTERlPJBLZY3M8c',
    name: '떠이호군경찰서',
    name_ko: '떠이호 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '739 Đ. Lạc Long Quân, Tây Hồ, Hà Nội',
    phone: null,
    lat: 21.0789927,
    lng: 105.8158637,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJDz1xnzurNTER0lpuPMFI7Hg',
    name: 'Cau Giay District Police',
    name_ko: '꺼우저이 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '62 Đ. Nguyễn Văn Huyên, Nghĩa Đô, Hà Nội',
    phone: null,
    lat: 21.0440128,
    lng: 105.7982337,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJbfF45BNVNDERAR5zIWj0feM',
    name: 'Nam Tu Liem Police Department',
    name_ko: '남뜨리엠 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: 'ngõ 25 P. Nguyễn Cơ Thạch, Mỹ Đình, Hà Nội',
    phone: '+84 24 3764 3288',
    lat: 21.0365921,
    lng: 105.7682018,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJ1zUJ9tdSNDERaXZM_GYFg8Y',
    name: 'Ha Dong Police',
    name_ko: '하동 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '15 Ngô Thì Nhậm, Quang Trung, Hà Đông, Hà Nội',
    phone: '+84 24 3939 7233',
    lat: 20.9675479,
    lng: 105.7695435,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJDz0rlZSrNTERHlm8_bkD-TM',
    name: '호안끼엠군경찰서',
    name_ko: '호안끼엠 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '2 P. Tràng Thi, Hoàn Kiếm, Hà Nội',
    phone: '+84 24 3825 6227',
    lat: 21.0261620,
    lng: 105.8514509,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJrTUX7aKrNTERNDZxlQY-4xs',
    name: '바딘군경찰서',
    name_ko: '바딘 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '37 Điện Biên Phủ, Ba Đình, Hà Nội',
    phone: '+84 24 3845 2543',
    lat: 21.0330786,
    lng: 105.8383641,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJ_ZZm6YKrNTERhRYqAOgGHPQ',
    name: 'Dong Da District Police',
    name_ko: '동다 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '382 P. Khâm Thiên, Đống Đa, Hà Nội',
    phone: null,
    lat: 21.0194181,
    lng: 105.8310797,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJmUaBiYurNTERmBDMaIoOHEk',
    name: 'Hai Ba Trung Police',
    name_ko: '하이바쯩 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '96 P. Tô Hiến Thành, Hai Bà Trưng, Hà Nội',
    phone: null,
    lat: 21.0134191,
    lng: 105.8479267,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJQcOADL2pNTERNJi9qKKphTc',
    name: 'Long Bien Police',
    name_ko: '롱비엔 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '1 Phố Đoàn Khuê, Việt Hưng, Hà Nội',
    phone: '+84 24 3827 2758',
    lat: 21.0632509,
    lng: 105.9010564,
    city: 'hanoi',
    google_rating: null,
    pending_approval: false,
    is_verified: false,
    is_korean_run: false,
    registration_type: 'script',
  },
  {
    google_place_id: 'ChIJAdeLHUysNTERm-NQYJ0Hqsk',
    name: 'Công an quận Hoàng Mai',
    name_ko: '호앙마이 경찰서',
    category: '관공·긴급',
    primary_type_ko: '경찰서',
    address: '6 P. Bùi Huy Bích, Hoàng Mai, Hà Nội',
    phone: null,
    lat: 20.9669793,
    lng: 105.8456467,
    city: 'hanoi',
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