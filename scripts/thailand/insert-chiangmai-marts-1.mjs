import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 필요'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  { google_place_id: 'ChIJI8qwFCcl2jARUIicfN9d9nA', name: '지두방 한국마트', name_ko: '지두방 한국마트', category: '마트/슈퍼', address: '89 Moo 4, Tambon Nong Pa Khrang, Mueang Chiang Mai, Chiang Mai 50000', phone: '+66 92 396 3900', lat: 18.7986133, lng: 99.0240119, city: 'chiangmai', google_rating: 4.8, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJU56OKawx2jARxzJXs1WMmz8', name: 'OWhale CMU', name_ko: 'OWhale CMU 한국식품', category: '마트/슈퍼', address: 'Mueang Chiang Mai District, Chiang Mai 50200', phone: '+66 81 624 9342', lat: 18.8019407, lng: 98.9506497, city: 'chiangmai', google_rating: 4.9, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJA2UMr9ox2jARuJMmt6odM_Q', name: 'LP KOREAN STORE CNX', name_ko: 'LP KOREAN STORE CNX', category: '마트/슈퍼', address: 'KAD FARANG VILLAGE, 225/240, Tambon Ban Waen, Amphoe Hang Dong, Chiang Mai 50230', phone: '+66 65 515 9302', lat: 18.7011633, lng: 98.9313424, city: 'chiangmai', google_rating: 4.8, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJEymoASQ72jARoMRIQFVk4gw', name: 'SEOUL Chiangmai Thailand', name_ko: 'SEOUL Chiangmai Thailand 한국상점', category: '마트/슈퍼', address: 'Tambon Su Thep, Mueang Chiang Mai, Chiang Mai 50200', phone: '+66 91 306 8317', lat: 18.7875613, lng: 98.9725626, city: 'chiangmai', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJE7gTYtsv2jAR3yeKTYoBLxw', name: 'bio korea co.,ltd. 바이오 코리아', name_ko: '바이오 코리아 bio korea', category: '마트/슈퍼', address: 'Tambon Ton Pao, Amphoe San Kamphaeng, Chiang Mai 50130', phone: '+66 53 960 999', lat: 18.7749707, lng: 99.0852510, city: 'chiangmai', google_rating: 4.3, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
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