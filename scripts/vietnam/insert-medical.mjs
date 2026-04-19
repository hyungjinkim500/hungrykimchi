import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const medicalData = [
  { name: '다사랑 한방종합병원', phone: '033 445 7949' },
  { name: '두라이프국제종합병원(한의원)', phone: '0936-377-625' },
  { name: '래플스메디칼 Raffles Medical', phone: '024 3676 2222' },
  { name: '마음편히 심리상담클리닉', phone: '086 720 5763' },
  { name: '미딩한국약국', phone: '098 225 3816' },
  { name: '미소치과', phone: '024 6296 5833' },
  { name: '베트남프랑스국제병원', phone: '024 3577 1100' },
  { name: '베-한클리닉', phone: '086-748-0115' },
  { name: '서울치과', phone: '083 254 2828' },
  { name: '선병원', phone: '091 756 5016' },
  { name: '수&스마일 치과', phone: '082 769 8860' },
  { name: '신풍제약', phone: '097 918 0218' },
  { name: '심플라인킹치과', phone: '038 331 3997' },
  { name: '아이메디케어 병원(내과/소아과/이비인후과/산부인과)', phone: '081 340 0101' },
  { name: '아이메디케어 병원(피부과/성형외과)', phone: '081 933 0102' },
  { name: '아이메디케어 병원(통증 재활학과)', phone: '081 740 0103' },
  { name: '아이메디케어 병원(치과)', phone: '081 540 0104' },
  { name: '오라클 피부과하노이점(롱비엔)', phone: '034 586 9354' },
  { name: '일본국제안과', phone: '024 3715 2666' },
  { name: '주클리닉(골드마크점)', phone: '035-828-5695' },
  { name: '케이메디라운지(한국의료 상담센터)', phone: '0762 137 453' },
  { name: '케이클리닉(K CLINIC)', phone: '088 6092277' },
  { name: '킴스클리닉(KIMS CLINIC)', phone: '024 6128-1041' },
  { name: '하노이 이만음치과', phone: '091 157 2702' },
  { name: '하노이 서울 한의원', phone: '0369 657 606' },
  { name: '행림한의원', phone: '037 457 9016' },
  { name: '패밀리 메디컬 병원', phone: '024 3843-0748' },
  { name: '패밀리 메디컬 소아과', phone: '024 3726-5222' },
  { name: 'FMP', phone: '024 3843-0748' },
  { name: 'International SOS Hanoi Clinic', phone: '024 3934-0666' },
  { name: 'HONG NGOC 병원(경남)(미딩)', phone: '091 124 1661' },
  { name: 'VIN MEC', phone: '024 3974-3558' },
  { name: '서울에이스 치과', phone: '024 7309-8889' },
];

const records = medicalData.map(d => ({
  ...d,
  category: '의료',
  city: 'hanoi',
  address: '베트남 하노이',
  pending_approval: false,
  registration_type: 'script',
  is_verified: false,
  is_korean_run: false,
}));

const { error } = await supabase.from('businesses').insert(records);
if (error) {
  console.error('에러:', error.message);
} else {
  console.log(`✅ ${records.length}개 삽입 완료`);
}
