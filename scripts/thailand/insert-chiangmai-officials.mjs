import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 필요'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  { google_place_id: 'ChIJg95JI4o62jARB_34xU5KeWc', name: '치앙마이 한인회', name_ko: '치앙마이 한인회', category: '관공·긴급', primary_type_ko: '한인회', address: '44 Huay Kaew Rd, Tambon Su Thep, Amphoe Mueang Chiang Mai, Chiang Mai 50300', phone: '+66 53 405 176', lat: 18.8001564, lng: 98.9703419, city: 'chiangmai', google_rating: 4.6, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJZVuzPIo62jARoRiIMTRfSfI', name: 'Korea Association Chiangmai', name_ko: '치앙마이 한인회 2관', category: '관공·긴급', primary_type_ko: '한인회', address: 'Chang Phueak, Mueang Chiang Mai District, Chiang Mai 50300', phone: '+66 53 405 276', lat: 18.8001891, lng: 98.9703644, city: 'chiangmai', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJNUeguiUx2jARxkKjcuyornU', name: '치앙마이 한글학교', name_ko: '치앙마이 한글학교', category: '관공·긴급', primary_type_ko: '한글학교', address: '202 Moo 7, Tambon Nong Kwai, Amphoe Hang Dong, Chiang Mai 50230', phone: '+66 87 900 2587', lat: 18.7283153, lng: 98.9376397, city: 'chiangmai', google_rating: 5.0, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJAX_chiangmai_police_muang', name: '치앙마이 므앙 경찰서', name_ko: '치앙마이 므앙 경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: '169 Rachadamnoen Rd, Tambon Phra Sing, Amphoe Mueang Chiang Mai, Chiang Mai 50200', phone: '+66 53 814 313', lat: 18.7872000, lng: 98.9925000, city: 'chiangmai', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJAX_chiangmai_police_phuping', name: '치앙마이 푸핑 경찰서 (님만·창프악)', name_ko: '치앙마이 푸핑 경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: '193 Moo 1, Chang Phuak, Amphoe Mueang Chiang Mai, Chiang Mai 50300', phone: '+66 53 219 230', lat: 18.8100000, lng: 98.9700000, city: 'chiangmai', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJAX_chiangmai_police_maeping', name: '치앙마이 매핑 경찰서 (왓껫·나이트바자)', name_ko: '치앙마이 매핑 경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: '191 Moo 3, Chiang Mai-Lamphun Road, Tambon Nong Hoi, Amphoe Mueang Chiang Mai, Chiang Mai 50000', phone: '+66 53 140 224', lat: 18.7650000, lng: 99.0080000, city: 'chiangmai', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJAX_chiangmai_police_sankamphaeng', name: '치앙마이 산깜팽 경찰서', name_ko: '치앙마이 산깜팽 경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: '113 Moo 1, Sai Moon, Amphoe San Kamphaeng, Chiang Mai 50130', phone: '+66 53 331 191', lat: 18.7440000, lng: 99.1200000, city: 'chiangmai', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJAX_chiangmai_police_sansai', name: '치앙마이 산사이 경찰서', name_ko: '치앙마이 산사이 경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: '4 Moo 5, San Sai Luang, Amphoe San Sai, Chiang Mai 50210', phone: '+66 53 491 946', lat: 18.8420000, lng: 99.0200000, city: 'chiangmai', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJAX_chiangmai_police_hangdong', name: '치앙마이 항동 경찰서', name_ko: '치앙마이 항동 경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: 'Amphoe Hang Dong, Chiang Mai 50230', phone: '+66 53 441 191', lat: 18.6900000, lng: 98.9200000, city: 'chiangmai', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
];

async function main() {
  const { data: existingData } = await supabase.from('businesses').select('google_place_id').limit(100000);
  const existingIds = new Set((existingData || []).map(b => b.google_place_id));
  const { data: deletedData } = await supabase.from('deleted_places').select('google_place_id').limit(100000);
  const deletedIds = new Set((deletedData || []).map(d => d.google_place_id));
  const toInsert = DATA.filter(d => !existingIds.has(d.google_place_id) && !deletedIds.has(d.google_place_id));
  console.log(`총 ${DATA.length}개 중 신규 ${toInsert.length}개 INSERT 시작...`);
  const chunkSize = 1;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('businesses').insert(chunk);
    if (error) console.error('insert 에러:', error.message);
    else console.log(`insert 완료: ${i + 1}~${Math.min(i + chunkSize, toInsert.length)}`);
  }
  console.log('완료!');
}
main().catch(console.error);