import fetch from 'node-fetch';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('환경변수 누락: GOOGLE_API_KEY 필요');
  process.exit(1);
}

const TARGETS = [
  // 한국 공관
  { name: '주베트남 대한민국 대사관', query: 'Korean Embassy Hanoi 28 Dao Tan Ba Dinh' },
  { name: '주하노이 대한민국 총영사관', query: 'Korean Consulate General Hanoi' },

  // 출입국
  { name: '하노이 출입국관리사무소', query: 'Phòng Quản lý Xuất nhập cảnh Hà Nội' },

  // 구 경찰서 - 한인 밀집
  { name: '떠이호 경찰서', query: 'Công an Quận Tây Hồ Hanoi' },
  { name: '꺼우저이 경찰서', query: 'Công an Quận Cầu Giấy Hanoi' },
  { name: '남뜨리엠 경찰서', query: 'Công an Quận Nam Từ Liêm Hanoi' },
  { name: '하동 경찰서', query: 'Công an Quận Hà Đông Hanoi' },

  // 구 경찰서 - 중심부
  { name: '호안끼엠 경찰서', query: 'Công an Quận Hoàn Kiếm Hanoi' },
  { name: '바딘 경찰서', query: 'Công an Quận Ba Đình Hanoi' },

  // 구 경찰서 - 기타
  { name: '동다 경찰서', query: 'Công an Quận Đống Đa Hanoi' },
  { name: '하이바쯩 경찰서', query: 'Công an Quận Hai Bà Trưng Hanoi' },
  { name: '롱비엔 경찰서', query: 'Công an Quận Long Biên Hanoi' },
  { name: '호앙마이 경찰서', query: 'Công an Quận Hoàng Mai Hanoi' },
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