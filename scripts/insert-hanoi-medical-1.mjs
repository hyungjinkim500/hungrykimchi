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
    google_place_id: 'ChIJSc1n36tUNDERVUCjKTQcC-w',
    name: 'IMD CLINIC( 내과,정형통증,피부비뇨기과,하노이 한의원,AI검진,中医院)',
    name_ko: '다사랑 한방종합병원',
    category: '의료', primary_type_ko: '한방병원',
    address: '2f Tòa nhà HH4, sông Đà Twin Tower, Phạm Hùng, Mỹ Đình, Hà Nội',
    phone: '+84 334 457 949', lat: 21.0173151, lng: 105.7807596,
    city: 'hanoi', google_rating: 4.9, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJHUvFykGrNTERCh55YwbdJ1I',
    name: 'H PLUS Hanoi - H PLUS 국제의료센터',
    name_ko: 'H PLUS 국제의료센터',
    category: '의료', primary_type_ko: '국제의료센터',
    address: '7F & 8F, Lotte Mall Tây Hồ, 272 Võ Chí Công, Tây Hồ, Hà Nội',
    phone: '+84 24 7306 9889', lat: 21.0770571, lng: 105.8133613,
    city: 'hanoi', google_rating: 4.9, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJ28kG7viqNTER8TAeJ28rLOY',
    name: 'Raffles Medical International Clinic in Hanoi',
    name_ko: '래플스메디칼 Raffles Medical',
    category: '의료', primary_type_ko: '국제클리닉',
    address: '51 Đ. Xuân Diệu, Quảng An, Tây Hồ, Hà Nội',
    phone: '+84 24 3676 2222', lat: 21.06374, lng: 105.8274019,
    city: 'hanoi', google_rating: 4.2, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJVzibK9VVNDERLsNXnlOm-C4',
    name: '누리팜한국약국',
    name_ko: '누리팜 한국약국',
    category: '의료', primary_type_ko: '약국',
    address: '59 P. Đỗ Đình Thiện, Mỹ Đình, Hà Nội',
    phone: '+84 375 368 559', lat: 21.0165874, lng: 105.7789592,
    city: 'hanoi', google_rating: 4.4, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJYSbJ2e9VNDERAw0eu0SUmUw',
    name: '블루오션 미딩한국 약국',
    name_ko: '블루오션 미딩한국약국',
    category: '의료', primary_type_ko: '약국',
    address: '121 P. Trần Văn Lai, Mỹ Đình, Hà Nội',
    phone: '+84 982 253 816', lat: 21.0165621, lng: 105.7772007,
    city: 'hanoi', google_rating: 4.3, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJn-Tbi8yrNTER-sWnxY7LoxY',
    name: '미소치과MISO DENTAL',
    name_ko: '미소치과',
    category: '의료', primary_type_ko: '치과',
    address: '291 Đ. Nguyễn Khang, Yên Hòa, Hà Nội',
    phone: '+84 24 6296 5833', lat: 21.0241705, lng: 105.797304,
    city: 'hanoi', google_rating: 4.8, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJffNJR6CsNTERD56E4OF7rw8',
    name: '베한치과',
    name_ko: '베-한클리닉',
    category: '의료', primary_type_ko: '치과',
    address: '218 P. Hoàng Ngân, Trung Hoà, Hà Nội',
    phone: '+84 24 6293 0350', lat: 21.0100508, lng: 105.8041688,
    city: 'hanoi', google_rating: 4.6, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJ0eR74XmsNTERtumOeSyIXcE',
    name: '하노이프랑스병원',
    name_ko: '베트남프랑스국제병원',
    category: '의료', primary_type_ko: '종합병원',
    address: '1 Phương Mai, Kim Liên, Hà Nội',
    phone: '+84 24 3577 1100', lat: 21.0040056, lng: 105.840022,
    city: 'hanoi', google_rating: 4.1, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJaXx6HOtVNDER8sez1xhHWaI',
    name: 'Seoul Ace Dental Clinic',
    name_ko: '서울에이스 치과',
    category: '의료', primary_type_ko: '치과',
    address: '1-TT1/KĐT, Sông Đà, Từ Liêm, Hà Nội',
    phone: '+84 24 7309 8889', lat: 21.0173334, lng: 105.7753440,
    city: 'hanoi', google_rating: 4.8, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJ1WwLsnWrNTER3JjTtmVrE8Q',
    name: '쭝낀 - Nha Khoa Seoul',
    name_ko: '서울치과 (쭝낀점)',
    category: '의료', primary_type_ko: '치과',
    address: '58 P. Trung Kính, Trung Hoà, Hà Nội',
    phone: '+84 24 2200 7186', lat: 21.0140968, lng: 105.7971792,
    city: 'hanoi', google_rating: 5.0, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJf5ol3sqtNTEROmgSCNTchs4',
    name: 'Bệnh Viện Đa Khoa Sun Medical Việt Nam',
    name_ko: '선병원',
    category: '의료', primary_type_ko: '종합병원',
    address: '35 Đ. Lê Văn Lương, Nhân Chính, Thanh Xuân, Hà Nội',
    phone: '+84 911 572 702', lat: 21.0026350, lng: 105.8015572,
    city: 'hanoi', google_rating: 5.0, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJkxxfQWZVNDERXL7_GneL5dI',
    name: '수치과',
    name_ko: '수&스마일 치과',
    category: '의료', primary_type_ko: '치과',
    address: 'The Manor Hà Nội, P. Đỗ Đình Thiện, Hà Nội',
    phone: '+84 827 698 860', lat: 21.0148006, lng: 105.776113,
    city: 'hanoi', google_rating: 4.3, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJDYeMfWFVNDERLZCjpBIG4UE',
    name: '아이메디케어 병원',
    name_ko: '아이메디케어 병원',
    category: '의료', primary_type_ko: '종합클리닉',
    address: 'Tầng 1, 더 가든 쇼핑센터, Mễ Trì, Từ Liêm, Hà Nội',
    phone: '+84 813 400 101', lat: 21.0146447, lng: 105.7773185,
    city: 'hanoi', google_rating: 4.5, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJUYQn462rNTERhGVWGHra8E8',
    name: 'Japan International Eye Hospital',
    name_ko: '일본국제안과',
    category: '의료', primary_type_ko: '안과',
    address: '32 Phó Đức Chính, Ba Đình, Hà Nội',
    phone: '+84 24 3715 3666', lat: 21.0491284, lng: 105.8399959,
    city: 'hanoi', google_rating: 4.7, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJC-6mXgBVNDERU8CFW_kbE8k',
    name: 'Joo Clinic Goldmark 주피부과 골드마크',
    name_ko: '주클리닉 (골드마크점)',
    category: '의료', primary_type_ko: '피부과',
    address: '5F, Đ. Hoàng Công Chất, Phú Diễn, Hà Nội',
    phone: '+84 358 285 695', lat: 21.0446315, lng: 105.7668832,
    city: 'hanoi', google_rating: 5.0, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJg7IxRXJVNDERCFBDVyJvUzk',
    name: 'K Medi Lounge',
    name_ko: '케이메디라운지 (한국의료 상담센터)',
    category: '의료', primary_type_ko: '의료상담센터',
    address: 'Tầng G, 더 가든 쇼핑센터, Mễ Trì, Từ Liêm, Hà Nội',
    phone: null, lat: 21.0151696, lng: 105.7776755,
    city: 'hanoi', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJX3MLxi-rNTER3Lr-Uft6KAA',
    name: 'Phòng Khám K CLINIC Hà Nội',
    name_ko: '케이클리닉 (K CLINIC)',
    category: '의료', primary_type_ko: '종합클리닉',
    address: '3F Landmark 72 Tower, Mễ Trì, Hà Nội',
    phone: '+84 24 3202 0888', lat: 21.0167331, lng: 105.7841791,
    city: 'hanoi', google_rating: 4.6, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJ89t5-6CsNTERM8kHEpS7V1g',
    name: 'Phòng Khám Đa Khoa KIMS Clinic and Health Care',
    name_ko: '킴스클리닉 (KIMS CLINIC)',
    category: '의료', primary_type_ko: '종합클리닉',
    address: 'Tầng 3, Golden Palace, 99 Mễ Trì, Từ Liêm, Hà Nội',
    phone: '+84 24 6128 1041', lat: 21.0121945, lng: 105.7755704,
    city: 'hanoi', google_rating: 4.5, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJsaBpQHOrNTERj3i2DDLEczA',
    name: '패밀리메디컬병원',
    name_ko: '패밀리 메디컬 병원 (FMP)',
    category: '의료', primary_type_ko: '종합병원',
    address: '298I P. Kim Mã, Ngọc Hà, Hà Nội',
    phone: '+84 24 3843 0748', lat: 21.0310992, lng: 105.8181221,
    city: 'hanoi', google_rating: 4.3, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJdfd3KMFVNDERyFb8ucDuw1I',
    name: '하노이서울한의원( Hanoi Seoul Clinic),中医诊所',
    name_ko: '하노이 서울 한의원',
    category: '의료', primary_type_ko: '한의원',
    address: 'KĐT TT1, Mỹ Đình 1, Nam Từ Liêm, Hà Nội',
    phone: '+84 369 657 606', lat: 21.0171032, lng: 105.7758775,
    city: 'hanoi', google_rating: 4.9, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJnxcb3aCsNTERql1S5XCpN20',
    name: '행림 한의원',
    name_ko: '행림한의원',
    category: '의료', primary_type_ko: '한의원',
    address: 'Ng. 26 P. Đỗ Quang, Trung Hòa, Hà Nội',
    phone: '+84 24 3221 6170', lat: 21.0099938, lng: 105.8013061,
    city: 'hanoi', google_rating: 4.2, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJidBLk1SrNTER-WtekE0VkqU',
    name: '경남 랜드마크타워 10층',
    name_ko: 'HONG NGOC 병원 (경남 랜드마크점)',
    category: '의료', primary_type_ko: '종합병원',
    address: 'Tầng 10, Keangnam Hanoi Landmark Tower, Đ. Phạm Hùng, Hà Nội',
    phone: '+84 24 3927 5568', lat: 21.0167331, lng: 105.7841791,
    city: 'hanoi', google_rating: 4.0, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJET6le7qrNTERqTwRwEO9fVg',
    name: 'Hong Ngoc General Hospital',
    name_ko: 'HONG NGOC 종합병원 (본원)',
    category: '의료', primary_type_ko: '종합병원',
    address: '55 P. Yên Ninh, Quán Thánh, Ba Đình, Hà Nội',
    phone: '+84 24 3927 5568', lat: 21.0424822, lng: 105.8441768,
    city: 'hanoi', google_rating: 4.5, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script',
  },
  {
    google_place_id: 'ChIJd7js2gSsNTERTMtPtgIeHu8',
    name: '빈멕국제종합병원',
    name_ko: '빈멕 국제종합병원',
    category: '의료', primary_type_ko: '종합병원',
    address: '458 P. Minh Khai, Khu đô thị Times City, Hà Nội',
    phone: '+84 24 3974 3556', lat: 20.9962152, lng: 105.8669144,
    city: 'hanoi', google_rating: 3.9, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script',
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