import fetch from 'node-fetch';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('환경변수 누락: GOOGLE_API_KEY 필요');
  process.exit(1);
}

const TARGETS = [
  { name: '다사랑 한방종합병원', query: '다사랑 한방종합병원 하노이' },
  { name: '두라이프국제종합병원(한의원)', query: '두라이프 국제종합병원 하노이' },
  { name: '래플스메디칼 Raffles Medical', query: 'Raffles Medical Hanoi' },
  { name: '마음편히 심리상담클리닉', query: '마음편히 심리상담클리닉 하노이' },
  { name: '미딩한국약국', query: '미딩 한국약국 하노이' },
  { name: '미소치과', query: '미소치과 하노이' },
  { name: '베-한클리닉', query: '베한클리닉 하노이' },
  { name: '베트남프랑스국제병원', query: 'Bệnh viện Việt Pháp Hà Nội' },
  { name: '서울에이스 치과', query: '서울에이스 치과 하노이' },
  { name: '서울치과', query: '서울치과 하노이' },
  { name: '선병원', query: '선병원 하노이' },
  { name: '수&스마일 치과', query: '수앤스마일 치과 하노이' },
  { name: '신풍제약', query: '신풍제약 하노이' },
  { name: '심플라인킹치과', query: '심플라인킹 치과 하노이' },
  { name: '아이메디케어 병원(내과/소아과/이비인후과/산부인과)', query: '아이메디케어 병원 하노이' },
  { name: '아이메디케어 병원(치과)', query: '아이메디케어 치과 하노이' },
  { name: '아이메디케어 병원(통증 재활학과)', query: '아이메디케어 통증재활 하노이' },
  { name: '아이메디케어 병원(피부과/성형외과)', query: '아이메디케어 피부과 하노이' },
  { name: '오라클 피부과하노이점(롱비엔)', query: '오라클 피부과 롱비엔 하노이' },
  { name: '일본국제안과', query: '일본국제안과 하노이' },
  { name: '주클리닉(골드마크점)', query: '주클리닉 골드마크 하노이' },
  { name: '케이메디라운지(한국의료 상담센터)', query: '케이메디라운지 하노이' },
  { name: '케이클리닉(K CLINIC)', query: 'K Clinic 하노이' },
  { name: '킴스클리닉(KIMS CLINIC)', query: 'KIMS Clinic Hanoi' },
  { name: '패밀리 메디컬 병원', query: 'Family Medical Practice Hanoi' },
  { name: '패밀리 메디컬 소아과', query: 'Family Medical Practice pediatric Hanoi' },
  { name: '하노이 서울 한의원', query: '하노이 서울 한의원' },
  { name: '하노이 이만음치과', query: '이만음치과 하노이' },
  { name: '행림한의원', query: '행림한의원 하노이' },
  { name: 'FMP', query: 'FMP clinic Hanoi' },
  { name: 'HONG NGOC 병원(경남)(미딩)', query: 'Hong Ngoc Kinh Nam Hospital Hanoi My Dinh' },
  { name: 'International SOS Hanoi Clinic', query: 'International SOS Clinic Hanoi' },
  { name: 'VIN MEC', query: 'Vinmec Times City International Hospital Hanoi' },
];

async function findPlace(query) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.internationalPhoneNumber,places.rating',
    },
    body: JSON.stringify({ textQuery: query, languageCode: 'ko', maxResultCount: 3 }),
  });
  const data = await res.json();
  return data.places || [];
}

async function main() {
  for (const target of TARGETS) {
    const places = await findPlace(target.query);
    console.log(`🔍 ${target.name}`);
    if (!places || places.length === 0) {
      console.log(`   ❌ 찾기 실패`);
    } else {
      places.forEach((place, i) => {
        console.log(`   [${i + 1}] place_id: ${place.id}`);
        console.log(`       이름: ${place.displayName?.text}`);
        console.log(`       주소: ${place.formattedAddress}`);
        console.log(`       전화: ${place.internationalPhoneNumber || '-'}`);
        console.log(`       평점: ${place.rating || '-'}`);
        console.log(`       좌표: ${place.location?.latitude}, ${place.location?.longitude}`);
      });
    }
    console.log();
    await new Promise(r => setTimeout(r, 300));
  }
}

main().catch(console.error);