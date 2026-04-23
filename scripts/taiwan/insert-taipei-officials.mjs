import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 필요'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  { google_place_id: 'ChIJ0VVs-MSrQjQRCXsMdHhPdTg', name: '주타이베이 대한민국 대표부', name_ko: '주타이베이 대한민국 대표부', category: '관공·긴급', primary_type_ko: '대사관/대표부', address: 'Rm. 1506, 15F, No. 333, Sec. 1, Keelung Rd, Xinyi District, Taipei', phone: '+886-2-2758-8320', lat: 25.0404, lng: 121.5648, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJ6fauq8arQjQRuSXCLhHilog', name: 'KOTRA 타이베이 무역관', name_ko: 'KOTRA 타이베이 무역관', category: '관공·긴급', primary_type_ko: '무역관', address: 'Rm. 1806, 18F, No. 333, Sec. 1, Keelung Rd, Xinyi District, Taipei', phone: '+886-2-2725-2324', lat: 25.0404, lng: 121.5648, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJN3e3_serQjQRUiGxRRRRPEk', name: '한국관광공사 타이베이지사', name_ko: '한국관광공사 타이베이지사', category: '관공·긴급', primary_type_ko: '관광공사', address: 'Rm. 3208, 32F, No. 333, Sec. 1, Keelung Rd, Xinyi District, Taipei', phone: '+886-2-2772-1330', lat: 25.0404, lng: 121.5648, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJd2mFj8qpQjQRrBZfp0NLPEY', name: '타이베이 경찰국 (110)', name_ko: '타이베이 경찰국 (110)', category: '관공·긴급', primary_type_ko: '경찰서', address: 'No. 96, Yanping S Rd, Zhongzheng District, Taipei', phone: '+886-2-2381-7494', lat: 25.0447, lng: 121.5107, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJa1gWR5apQjQRaHsDs5w8fig', name: '타이베이시 소방국 (119)', name_ko: '타이베이시 소방국 (119)', category: '관공·긴급', primary_type_ko: '소방서/구급', address: 'No. 1, Zhongxiao E Rd, Sec. 1, Zhongzheng District, Taipei', phone: '+886-2-2381-3611', lat: 25.0451, lng: 121.5188, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJSw3muhmrQjQRoYJGjPqFmYY', name: '타이베이 관광경찰 (0800-024-111)', name_ko: '타이베이 관광경찰 (0800-024-111)', category: '관공·긴급', primary_type_ko: '관광경찰', address: 'No. 2, Zhongxiao W Rd, Sec. 1, Zhongzheng District, Taipei', phone: '+886-800-024-111', lat: 25.0477, lng: 121.5170, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJR8RpYvGpQjQRYGiD5QevUt0', name: '타이베이 중정경찰서', name_ko: '타이베이 중정경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: 'No. 21, Zhonghua Rd, Sec. 1, Zhongzheng District, Taipei', phone: '+886-2-2361-3341', lat: 25.0425, lng: 121.5092, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJLXFApzWrQjQRvB2p2b1Bkq4', name: '타이베이 다안경찰서', name_ko: '타이베이 다안경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: 'No. 1, Lane 52, Sec. 3, Xinyi Rd, Da\'an District, Taipei', phone: '+886-2-2708-3251', lat: 25.0333, lng: 121.5337, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJE5a6teerQjQRNKrFnpCKbyY', name: '타이베이 신이경찰서', name_ko: '타이베이 신이경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: 'No. 100, Songren Rd, Xinyi District, Taipei', phone: '+886-2-2758-5151', lat: 25.0395, lng: 121.5678, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJeaF3z3apQjQRJ0X9oPYUjeY', name: '타이베이 중산경찰서', name_ko: '타이베이 중산경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: 'No. 51, Zhongshan N Rd, Sec. 2, Zhongshan District, Taipei', phone: '+886-2-2595-1111', lat: 25.0581, lng: 121.5235, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJp7JFi9erQjQR3FbxJRHmrMI', name: '타이베이 쑹산경찰서', name_ko: '타이베이 쑹산경찰서', category: '관공·긴급', primary_type_ko: '경찰서', address: 'No. 168, Nanjing E Rd, Sec. 5, Songshan District, Taipei', phone: '+886-2-2760-1161', lat: 25.0513, lng: 121.5689, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJBZf4kvepQjQRwLcVIPV8XiA', name: '재대만한인회', name_ko: '재대만한인회', category: '관공·긴급', primary_type_ko: '한인회', address: 'No. 333, Sec. 1, Keelung Rd, Xinyi District, Taipei', phone: '+886-2-2873-3073', lat: 25.0404, lng: 121.5648, city: 'taipei', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
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