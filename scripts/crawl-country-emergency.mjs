import fetch from 'node-fetch';
import * as fs from 'fs';

// 0404.go.kr 국가별 idx 범위 (1~250 정도 시도)
const TOTAL = 250;
const DELAY = 500;

async function fetchCountryPage(idx) {
  const url = `https://0404.go.kr/dev/country_view.mofa?idx=${idx}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      timeout: 10000,
    });
    if (!res.ok) return null;
    const html = await res.text();
    return html;
  } catch (e) {
    return null;
  }
}

function extractText(html, label) {
  // 라벨 뒤 텍스트 추출
  const idx = html.indexOf(label);
  if (idx === -1) return null;
  const snippet = html.slice(idx, idx + 300);
  // 태그 제거
  const clean = snippet.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return clean.slice(0, 200);
}

function extractCountryName(html) {
  // <title> 또는 h1/h2 에서 국가명 추출
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].replace('외교부 해외안전여행', '').replace(/[>\|]/g, '').trim();
  }
  return null;
}

function parseEmergencyNumbers(html) {
  const result = {
    police: null,
    ambulance: null,
    fire: null,
    touristPolice: null,
  };

  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  // 경찰
  const policeMatch = text.match(/경찰[^0-9]*([0-9\-]+)/);
  if (policeMatch) result.police = policeMatch[1].trim();

  // 구급/응급
  const ambulanceMatch = text.match(/구급[^0-9]*([0-9\-]+)|응급[^0-9]*([0-9\-]+)|앰뷸런스[^0-9]*([0-9\-]+)/);
  if (ambulanceMatch) result.ambulance = (ambulanceMatch[1] || ambulanceMatch[2] || ambulanceMatch[3])?.trim();

  // 소방
  const fireMatch = text.match(/소방[^0-9]*([0-9\-]+)/);
  if (fireMatch) result.fire = fireMatch[1].trim();

  // 관광경찰
  const touristMatch = text.match(/관광경찰[^0-9]*([0-9\-]+)/);
  if (touristMatch) result.touristPolice = touristMatch[1].trim();

  return result;
}

function parseEmbassy(html) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const result = {
    address: null,
    phone: null,
    emergency: null,
    email: null,
  };

  // 대표번호
  const phoneMatch = text.match(/대표번호[^+\d]*([+\d\-\(\)\s]{6,30})/);
  if (phoneMatch) result.phone = phoneMatch[1].trim().slice(0, 30);

  // 긴급연락처
  const emergencyMatch = text.match(/긴급연락처[^+\d]*([+\d\-\(\)\s]{6,30})/);
  if (emergencyMatch) result.emergency = emergencyMatch[1].trim().slice(0, 30);

  // 이메일
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@mofa\.go\.kr)/);
  if (emailMatch) result.email = emailMatch[1];

  // 주소 (ㅇ 주소 : 이후)
  const addressMatch = text.match(/주소\s*:\s*([^ㅇ]{10,100})/);
  if (addressMatch) result.address = addressMatch[1].trim().slice(0, 100);

  return result;
}

async function main() {
  const results = [];

  for (let idx = 1; idx <= TOTAL; idx++) {
    process.stdout.write(`\r크롤링 중: ${idx}/${TOTAL}`);
    const html = await fetchCountryPage(idx);
    if (!html || html.length < 500) {
      await new Promise(r => setTimeout(r, DELAY));
      continue;
    }

    // 국가명 없으면 스킵
    const countryName = extractCountryName(html);
    if (!countryName || countryName.length < 2) {
      await new Promise(r => setTimeout(r, DELAY));
      continue;
    }

    const emergency = parseEmergencyNumbers(html);
    const embassy = parseEmbassy(html);

    results.push({
      idx,
      countryName,
      ...emergency,
      embassy,
    });

    await new Promise(r => setTimeout(r, DELAY));
  }

  console.log(`\n\n총 ${results.length}개 국가 수집 완료`);

  // JSON 파일로 저장
  fs.writeFileSync('scripts/country_emergency_raw.json', JSON.stringify(results, null, 2), 'utf-8');
  console.log('scripts/country_emergency_raw.json 저장 완료');

  // 콘솔 미리보기
  results.slice(0, 5).forEach(r => {
    console.log(`\n[${r.idx}] ${r.countryName}`);
    console.log(`  경찰: ${r.police} | 구급: ${r.ambulance} | 소방: ${r.fire} | 관광경찰: ${r.touristPolice}`);
    console.log(`  대사관 전화: ${r.embassy.phone}`);
    console.log(`  대사관 긴급: ${r.embassy.emergency}`);
    console.log(`  이메일: ${r.embassy.email}`);
  });
}

main().catch(console.error);