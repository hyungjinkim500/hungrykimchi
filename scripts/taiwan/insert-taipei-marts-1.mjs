import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 필요'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  { google_place_id: 'ChIJaTnbywmpQjQRSVmuLz08gqg', name: '百昌韓貨商行', name_ko: '백창한화상행 百昌韓貨商行', category: '마트/슈퍼', address: 'No. 201號, Xining Rd, Wanhua District, Taipei', phone: '+886 2 2382 1833', lat: 25.0411113, lng: 121.5061136, city: 'taipei', google_rating: 4.6, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ0XN1O-qpQjQRfQrCi4H9XNk', name: '韓國商行', name_ko: '한국상행 韓國商行', category: '마트/슈퍼', address: 'No. 23號, Zhongxing St, Yonghe District, New Taipei City', phone: '+886 2 2929 5264', lat: 25.0120188, lng: 121.5160253, city: 'taipei', google_rating: 4.3, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJCWui09qrQjQRGkC4A9t_Br0', name: '首爾商行-서울상회', name_ko: '서울상회 首爾商行', category: '마트/슈퍼', address: 'No. 31號, Lane 101, Section 4, Zhongxiao E Rd, Da\'an District, Taipei', phone: '+886 2 2772 1528', lat: 25.0430102, lng: 121.5482111, city: 'taipei', google_rating: 4.2, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJJ-csrQmpQjQRYRAqHHdi9W0', name: '韓聯企業有限公司', name_ko: '한련기업 韓聯企業', category: '마트/슈퍼', address: 'No. 8號, Lane 82, Xining S Rd, Wanhua District, Taipei', phone: '+886 2 2312 1010', lat: 25.0423075, lng: 121.5055917, city: 'taipei', google_rating: 4.5, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJKVSZt0yqQjQR7n9GPPuB_d0', name: '韓品屋', name_ko: '한품옥 韓品屋', category: '마트/슈퍼', address: 'No. 370, Wuxing St, Xinyi District, Taipei', phone: '+886 2 2758 8660', lat: 25.0252146, lng: 121.5668235, city: 'taipei', google_rating: 4.7, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJjflCNgipQjQRUKuV7lhV2k0', name: '高麗商行', name_ko: '고려상행 高麗商行', category: '마트/슈퍼', address: 'No. 54號, Neijiang St, Wanhua District, Taipei', phone: '+886 2 2331 5190', lat: 25.041494, lng: 121.5051540, city: 'taipei', google_rating: 4.2, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJkUHiI2OrQjQRIqvZko1FhOQ', name: 'Obbamart我的韓國世界', name_ko: '오빠마트 Obbamart', category: '마트/슈퍼', address: 'No. 276號, Chongyang Rd, Nangang District, Taipei', phone: '+886 966 590 902', lat: 25.057598, lng: 121.604489, city: 'taipei', google_rating: null, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJA5alDiYCaDQR0ED2hRkeYKc', name: '韓濟名味品有限公司', name_ko: '한제명미품 韓濟名味品', category: '마트/슈퍼', address: 'No. 49號, Anfeng Rd, Xindian District, New Taipei City', phone: '+886 2 2211 3679', lat: 24.9547084, lng: 121.4998543, city: 'taipei', google_rating: 4.7, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJtcem8e2pQjQRTswpcINQjrA', name: 'K-MONSTAR', name_ko: 'K-MONSTAR', category: '마트/슈퍼', address: 'No. 7號, Lane 49, Chifeng St, Datong District, Taipei', phone: '+886 2 2550 9089', lat: 25.0557764, lng: 121.5199396, city: 'taipei', google_rating: 4.4, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJd5YdYdmrQjQRzmvMRZYpdR0', name: '韓州企業有限公司', name_ko: '한주기업 韓州企業', category: '마트/슈퍼', address: 'No. 44, Lane 300, Section 2, Bade Rd, Zhongshan District, Taipei', phone: '+886 2 2751 2588', lat: 25.0459432, lng: 121.5424709, city: 'taipei', google_rating: null, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJQY9xcjSnQjQRsqjXJ7eyYHs', name: '可麗雅韓國食品 코리아 한국 마트', name_ko: '코리아 한국 마트 可麗雅韓國食品', category: '마트/슈퍼', address: 'No. 378號, Zhongzheng Rd, Linkou District, New Taipei City', phone: '+886 2 2601 1193', lat: 25.0778552, lng: 121.3857045, city: 'taipei', google_rating: 4.9, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJ38Q_JA4DaDQRI20jmECtjuk', name: '대한상회 台韓商會', name_ko: '대한상회 台韓商會', category: '마트/슈퍼', address: 'No. 110-1號, Danuan Rd, Tucheng District, New Taipei City', phone: '+886 955 598 527', lat: 24.9580934, lng: 121.4219755, city: 'taipei', google_rating: 4.5, pending_approval: true, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJtYuyiGCoQjQR4bNGl5uIwcA', name: 'K-Mart', name_ko: 'K-Mart 산충점', category: '마트/슈퍼', address: 'No. 14號, Lane 609, Section 5, Chongxin Rd, Sanchong District, New Taipei City', phone: '+886 2 2999 7546', lat: 25.045889, lng: 121.467733, city: 'taipei', google_rating: 4.3, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJG-kzE8oDaDQRjjNTxVv1EGU', name: '愛韓購', name_ko: '애한구 愛韓購', category: '마트/슈퍼', address: 'No. 3號, Lane 278, Chongqing Rd, Banqiao District, New Taipei City', phone: '+886 2 2957 8288', lat: 24.9995565, lng: 121.4627300, city: 'taipei', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJKb2SV7UDaDQRp6K1pQWBPwk', name: 'WOW韓國代購 生活雜貨', name_ko: 'WOW 한국대구 생활잡화', category: '마트/슈퍼', address: 'No. 61號, Citizen St, Zhonghe District, New Taipei City', phone: '+886 2 2964 6939', lat: 25.0012962, lng: 121.4667893, city: 'taipei', google_rating: 5.0, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJE9yLqhWoQjQRfwrSGUpW7Cg', name: '韓購網(韓購有限公司)', name_ko: '한구망 韓購網', category: '마트/슈퍼', address: 'No. 161號, Siwei Rd, Banqiao District, New Taipei City', phone: '+886 2 2257 9606', lat: 25.025759, lng: 121.4647332, city: 'taipei', google_rating: 4.5, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJO-yFOuqpQjQREzg3SEvQhKo', name: '勝美商行', name_ko: '승미상행 勝美商行', category: '마트/슈퍼', address: 'No. 35號, Zhongxing St, Yonghe District, New Taipei City', phone: '+886 2 2922 6269', lat: 25.0119598, lng: 121.5162619, city: 'taipei', google_rating: 4.4, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJUVcWh7erQjQRc20epcstBkk', name: '偶然成為社長', name_ko: '우연성위사장 偶然成為社長', category: '마트/슈퍼', address: 'No. 235號, Jingxing Rd, Wenshan District, Taipei', phone: '+886 2 8663 8358', lat: 24.9912323, lng: 121.5437438, city: 'taipei', google_rating: 4.9, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJw9MQVAYiaDQR9IyxtW8gGv0', name: '韓國商行', name_ko: '한국상행 韓國商行 중리점', category: '마트/슈퍼', address: 'No. 256號, Rongan 13th St, Zhongli District, Taoyuan City', phone: '+886 973 370 491', lat: 24.9617709, lng: 121.2586778, city: 'taipei', google_rating: 4.6, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJA9f-ax8faDQRk4GdImDkm3E', name: '見晴日韓', name_ko: '견청일한 見晴日韓', category: '마트/슈퍼', address: 'No. 132-1號, Zhongshan Rd, Taoyuan District, Taoyuan City', phone: '+886 3 335 5066', lat: 24.9938205, lng: 121.3095420, city: 'taipei', google_rating: 4.2, pending_approval: true, is_verified: false, is_korean_run: false, registration_type: 'script' },
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