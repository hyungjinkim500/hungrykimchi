import fetch from 'node-fetch';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('환경변수 누락: GOOGLE_API_KEY 필요');
  process.exit(1);
}

const TARGETS = [
  { name: '다낭시 경찰청', query: 'Công an Thành phố Đà Nẵng police headquarters' },
  { name: '하이쩌우군 경찰서', query: 'Công an Quận Hải Châu Da Nang' },
  { name: '응우하인선군 경찰서', query: 'Công an Quận Ngũ Hành Sơn Da Nang' },
  { name: '선짜군 경찰서', query: 'Công an Quận Sơn Trà Da Nang' },
  { name: '다낭 출입국관리사무소', query: 'Phòng Quản lý Xuất nhập cảnh Đà Nẵng immigration' },
];

async function findPlace(query) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.internationalPhoneNumber',
    },
    body: JSON.stringify({ textQuery: query, languageCode: 'ko', maxResultCount: 1 }),
  });
  const data = await res.json();
  return data.places?.[0] || null;
}

async function main() {
  for (const target of TARGETS) {
    const place = await findPlace(target.query);
    if (place) {
      console.log(`✅ ${target.name}`);
      console.log(`   place_id: ${place.id}`);
      console.log(`   이름: ${place.displayName?.text}`);
      console.log(`   주소: ${place.formattedAddress}`);
      console.log(`   전화: ${place.internationalPhoneNumber || '-'}`);
      console.log(`   좌표: ${place.location?.latitude}, ${place.location?.longitude}`);
    } else {
      console.log(`❌ ${target.name} - 찾기 실패`);
    }
    console.log();
    await new Promise(r => setTimeout(r, 300));
  }
}

main().catch(console.error);