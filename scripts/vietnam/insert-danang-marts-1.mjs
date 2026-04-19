import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 필요'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  { google_place_id: 'ChIJ08DctikYQjERBxwPwDPRVMo', name: 'K-Mart', name_ko: 'K-마트', category: '마트/슈퍼', primary_type_ko: '아시아 식료품점', address: 'Lô 03 Phạm Văn Đồng, An Hải, Đà Nẵng', phone: '+84 236 3960 001', lat: 16.0544, lng: 108.2475, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJIXR1CMwXQjERxBMoXSdoZOo', name: '하이 마트', name_ko: '하이마트', category: '마트/슈퍼', primary_type_ko: '편의점', address: '55 Trần Bạch Đằng, Ngũ Hành Sơn, Đà Nẵng', phone: '+84 775 174 484', lat: 16.0489, lng: 108.2464, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJQzPSp9UXQjERf9RNyRsp33g', name: '케이마켓 다낭 VNG점 Kmarket Vo Nguyen Giap Da Nang(망고)', name_ko: '케이마켓 다낭 VNG점', category: '마트/슈퍼', primary_type_ko: '식료품점', address: '448 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng', phone: '+84 236 3818 111', lat: 16.0380, lng: 108.2464, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJH-oFSQAXQjERkSzbdVG48JI', name: 'K-market Le Quang Dao Da nang', name_ko: '케이마켓 레광다오 K-market Le Quang Dao', category: '마트/슈퍼', primary_type_ko: '식료품점', address: '88 Lê Quang Đạo, Ngũ Hành Sơn, Đà Nẵng', phone: '+84 918 249 588', lat: 16.0419, lng: 108.2464, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJD-hWMNkXQjERONzECr5Moao', name: 'K-Market', name_ko: '케이마켓 K-Market', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: 'A10 Phạm Văn Đồng, An Hải, Đà Nẵng', phone: '+84 869 771 579', lat: 16.0544, lng: 108.2380, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJk6DCsaAXQjER73Isacpt0GI', name: 'Kokoji Mart', name_ko: '코코지 마트 Kokoji Mart', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: '160 Đỗ Bá, Ngũ Hành Sơn, Đà Nẵng', phone: '+84 903 544 299', lat: 16.0390, lng: 108.2464, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJ9XqqM1UZQjERlBr6EnpEajM', name: '스타마트(Star Mart)', name_ko: '스타마트', category: '마트/슈퍼', primary_type_ko: '식료품점', address: '19 20 22 Phạm Văn Đồng, An Hải, Đà Nẵng', phone: '+84 867 069 044', lat: 16.0544, lng: 108.2300, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJgcw9OuAZQjERkMBCpKU6VCg', name: '케이마켓 다낭 모나치', name_ko: '케이마켓 다낭 모나치', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: '535 Đ. Trần Hưng Đạo, An Hải, Đà Nẵng', phone: '+84 236 3522 033', lat: 16.0471, lng: 108.2068, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJ8VnYK-QZQjERpZiaV6g7IFk', name: '롯데마트', name_ko: '롯데마트 다낭', category: '마트/슈퍼', primary_type_ko: '대형 슈퍼마켓', address: '6 Nại Nam, Hòa Cường, Đà Nẵng', phone: '+84 901 057 057', lat: 16.0360, lng: 108.2068, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJJ7JThEAZQjERX2XPJQoiQ3E', name: '공항한국마트', name_ko: '공항 한국마트', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: '07 Duy Tân, Hòa Cường, Đà Nẵng', phone: '+84 837 726 383', lat: 16.0471, lng: 108.2100, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJPV_MJ2sXQjERLiHvP7qt56o', name: '오마트', name_ko: '오마트', category: '마트/슈퍼', primary_type_ko: '편의점', address: '271 Hồ Nghinh, An Hải, Đà Nẵng', phone: '+84 903 696 820', lat: 16.0600, lng: 108.2400, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJn1WhHDUXQjERUFRl0bakkAs', name: 'Pullman K-mart', name_ko: '풀만 케이마트 Pullman K-mart', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: '436 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng', phone: null, lat: 16.0380, lng: 108.2500, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJaUUeNHYZQjER091mck7MvUg', name: 'KOREA.T-MARKET', name_ko: '코리아 티마켓 KOREA.T-MARKET', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: '2, 3 Nguyễn Phước Nguyên, An Khê, Đà Nẵng', phone: '+84 388 740 802', lat: 16.0500, lng: 108.1900, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJvZfXPIEXQjERZbXYtUlKqYo', name: 'Kmart Thương', name_ko: '케이마트 트엉 Kmart Thương', category: '마트/슈퍼', primary_type_ko: '백화점', address: '19 Phước Mỹ 3, An Hải, Đà Nẵng', phone: '+84 983 250 975', lat: 16.0544, lng: 108.2475, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJoXuDypcXQjERB9h-z_Gi7dI', name: 'Gyomu Japan', name_ko: '교무 재팬 Gyomu Japan', category: '마트/슈퍼', primary_type_ko: '아시아 식료품점', address: '14 Võ Văn Kiệt, An Hải, Đà Nẵng', phone: '+84 962 413 330', lat: 16.0544, lng: 108.2380, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJLcQxnTQZQjERm0PMAoFOLB8', name: 'HASHIKO MART - NGUYÊN LIỆU HÀN QUỐC', name_ko: '하시코 마트 한국식재료 HASHIKO MART', category: '마트/슈퍼', primary_type_ko: '편의점', address: '226 Trần Cao Vân, Thanh Khê, Đà Nẵng', phone: '+84 899 200 235', lat: 16.0700, lng: 108.2000, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJAbkutc8XQjERTwtztaUSaQ8', name: 'K-MART VÕ VĂN KIỆT', name_ko: '케이마트 보반끼엣 K-MART VÕ VĂN KIỆT', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: '139 Võ Văn Kiệt, An Hải, Đà Nẵng', phone: '+84 934 860 001', lat: 16.0544, lng: 108.2380, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJHUoECtMZQjER30aEvsqrqbg', name: 'HiMart Fhome점 하이마트 에프홈점', name_ko: '하이마트 에프홈점', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: '37 Lý Thường Kiệt, Hải Châu, Đà Nẵng', phone: '+84 795 726 518', lat: 16.0678, lng: 108.2100, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJzQWohrAZQjERRfthuaxpW9M', name: 'Sky Mart', name_ko: '스카이마트 Sky Mart', category: '마트/슈퍼', primary_type_ko: '아시아 식료품점', address: '15 Thi Sách, Hòa Cường, Đà Nẵng', phone: null, lat: 16.0360, lng: 108.2100, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJdbbp8aAZQjERd87bgDOe8iI', name: 'Joy Life Korea Mart Đà Nẵng - Cơ sở 2', name_ko: '조이라이프 코리아 마트 Joy Life Korea Mart', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: '62 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng', phone: '+84 236 3797 268', lat: 16.0800, lng: 108.2100, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJz3pLenQZQjERha_vaKrcrgE', name: 'Gyomu Japan', name_ko: '교무 재팬 Gyomu Japan (호아끄엉점)', category: '마트/슈퍼', primary_type_ko: '아시아 식료품점', address: '280-282 Lê Thanh Nghị, Hòa Cường, Đà Nẵng', phone: '+84 328 232 989', lat: 16.0360, lng: 108.2068, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
  { google_place_id: 'ChIJpQfrQ7ARQjERFkJjS9F3g_w', name: 'K Mart', name_ko: 'K마트 FPT시티점', category: '마트/슈퍼', primary_type_ko: '슈퍼마켓', address: 'Võ Quí Huân, Khu đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng', phone: '+84 854 858 858', lat: 15.9900, lng: 108.2200, city: 'danang', google_rating: null, pending_approval: true, is_verified: false, registration_type: 'script' },
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