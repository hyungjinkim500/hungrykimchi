import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 필요'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  { google_place_id: 'ChIJbVivuL4ZQjERuxTNCT0vc8I', name: '패밀리 병원 -다낭', name_ko: '패밀리 병원 다낭', category: '의료', primary_type_ko: '종합병원', address: '73 Nguyễn Hữu Thọ, Hòa Cường, Đà Nẵng', phone: '+84 1900 2250', lat: 16.0340, lng: 108.2120, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJUWL9Tb4ZQjERBqmqmfBGTPw', name: '하나약국', name_ko: '하나약국', category: '의료', primary_type_ko: '약국', address: '01a An Nhơn 1, An Hải, Đà Nẵng', phone: '+84 796 564 768', lat: 16.0520, lng: 108.2430, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJEW6bf9cXQjER6kisO2ce3-Q', name: 'Trustcare Clinic Danang', name_ko: '트러스트케어 클리닉 Trustcare Clinic', category: '의료', primary_type_ko: '종합클리닉', address: '02 Nguyễn Cao Luyện, An Hải, Đà Nẵng', phone: '+84 848 166 229', lat: 16.0544, lng: 108.2475, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJcTtzVZQZQjERKIfmREHZuuE', name: 'Vinmec Da Nang International Hospital', name_ko: '빈멕 다낭 국제병원', category: '의료', primary_type_ko: '종합병원', address: '30 Tháng 4, Hòa Cường, Đà Nẵng', phone: '+84 236 3711 111', lat: 16.0360, lng: 108.2068, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJpzlfl7UZQjER7oI_cRhwcJw', name: 'Hoan My Da Nang Hospital', name_ko: '호안미 다낭병원 Hoan My Hospital', category: '의료', primary_type_ko: '종합병원', address: '291 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng', phone: '+84 236 3650 676', lat: 16.0500, lng: 108.1900, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJLe5pC8oZQjER1_VBdmec3JY', name: 'Family Medical Practice - Danang', name_ko: '패밀리 메디컬 프랙티스 다낭 Family Medical Practice', category: '의료', primary_type_ko: '진료소', address: '96-98 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', phone: '+84 913 917 303', lat: 16.0471, lng: 108.2068, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJnyY_AQAZQjERJUSWsighkIE', name: 'Hana Medical Clinic - 하나 메디컬 클리닉', name_ko: '하나 메디컬 클리닉', category: '의료', primary_type_ko: '진료소', address: '1a An Nhơn 1, An Hải, Đà Nẵng', phone: null, lat: 16.0520, lng: 108.2430, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJcVoj6SMYQjERSG0J8LYLf9c', name: 'Công Ty Tnhh Lee Kang Sam Korea Clinic', name_ko: '이강삼 코리아 클리닉 Lee Kang Sam Korea Clinic', category: '의료', primary_type_ko: '종합클리닉', address: '128 Nguyễn Thị Định, An Hải, Đà Nẵng', phone: null, lat: 16.0544, lng: 108.2380, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJxRhbOoQZQjEREwtHSX00ct0', name: '스마일케어 치과병원 다낭', name_ko: '스마일케어 치과병원', category: '의료', primary_type_ko: '치과', address: '118 Phạm Cự Lượng, An Hải, Đà Nẵng', phone: '+84 889 298 858', lat: 16.0544, lng: 108.2300, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJF2SAhlcZQjERrYJMOxQYIgE', name: 'Australian Dental Clinic Danang', name_ko: '오스트레일리안 치과 Australian Dental Clinic', category: '의료', primary_type_ko: '치과', address: '51 Đ. 2 Tháng 9, Hòa Cường, Đà Nẵng', phone: '+84 906 200 434', lat: 16.0360, lng: 108.2068, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJt_nja8oZQjERiLfqZMuCwdA', name: 'Nha khoa Dentium - Dentium Clinic (Well International Dental Clinic)', name_ko: '덴티움 클리닉 Dentium Clinic', category: '의료', primary_type_ko: '치과', address: '461 Đ. Trần Hưng Đạo, An Hải, Đà Nẵng', phone: '+84 236 3822 257', lat: 16.0471, lng: 108.2200, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJERY6NAAZQjERWxj0NAp2Nv0', name: 'International Travel Clinic Vinmec Danang', name_ko: '빈멕 다낭 국제여행클리닉', category: '의료', primary_type_ko: '종합클리닉', address: '30 Tháng 4, Hòa Cường, Đà Nẵng', phone: '+84 236 3711 111', lat: 16.0360, lng: 108.2068, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJVTuToh8ZQjER1xzA5VtID8I', name: 'MSI Clinic Danang', name_ko: '엠에스아이 클리닉 MSI Clinic', category: '의료', primary_type_ko: '종합병원', address: '47 Lê Đình Lý, Thanh Khê, Đà Nẵng', phone: '+84 236 3692 522', lat: 16.0500, lng: 108.2000, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJl5YNIQAbQjERBpYj5wA3ZZc', name: 'Bệnh viện Quốc tế Đà Nẵng', name_ko: '다낭 국제병원', category: '의료', primary_type_ko: '종합병원', address: 'Hoà Quý, Ngũ Hành Sơn, Đà Nẵng', phone: null, lat: 16.0200, lng: 108.2300, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJHUoECtMZQjER30aEvsqrqbg', name: 'Pacific Hospital Hoi An', name_ko: '패시픽 병원 호이안 Pacific Hospital', category: '의료', primary_type_ko: '종합병원', address: '6 Phan Đình Phùng, Hội An, Đà Nẵng', phone: '+84 235 3921 656', lat: 15.8794, lng: 108.3220, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJdV1NttYNQjERIuDfyMAAcq4', name: 'Hoi An Hospital', name_ko: '호이안 병원 Hoi An Hospital', category: '의료', primary_type_ko: '종합병원', address: '4 Trần Hưng Đạo, Hội An, Đà Nẵng', phone: '+84 235 3914 660', lat: 15.8801, lng: 108.3380, city: 'danang', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
];

async function main() {
  const { data: deletedData } = await supabase.from('deleted_places').select('google_place_id');
  const deletedIds = new Set((deletedData || []).map(d => d.google_place_id));
  const { data: existingData } = await supabase.from('businesses').select('google_place_id').not('google_place_id', 'is', null).limit(1000000);
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