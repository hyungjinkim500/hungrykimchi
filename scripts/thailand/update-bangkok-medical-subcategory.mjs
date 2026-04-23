import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const UPDATES = [
  // 종합/국제병원
  { google_place_id: 'ChIJi--JeVue4jARN-K5IqmpPQw', subcategory: '종합/국제병원' }, // 방콕병원
  { google_place_id: 'ChIJW3-qd-ae4jARd4ouXIbeqPg', subcategory: '종합/국제병원' }, // 범룽랏 국제병원
  { google_place_id: 'ChIJnQQCAuyf4jARwHWHl1aZieQ', subcategory: '종합/국제병원' }, // 방콕 국제병원
  { google_place_id: 'ChIJ2X9Pkiyf4jARDbEdXwoFGMs', subcategory: '종합/국제병원' }, // 방콕기독병원
  { google_place_id: 'ChIJCSMehC-f4jARHbCc-0dgxsQ', subcategory: '종합/국제병원' }, // 메드파크 병원
  { google_place_id: 'ChIJVaLgEVWe4jARdUsUqC_39Kk', subcategory: '종합/국제병원' }, // 싸미띠웻 수쿰윗
  { google_place_id: 'ChIJ-wD92C2f4jARtiPNjUSQ1mQ', subcategory: '종합/국제병원' }, // BNH 병원
  { google_place_id: 'ChIJA8ckj-Oe4jAR2VPsQwds5tM', subcategory: '종합/국제병원' }, // 범룽랏 건강검진센터
  { google_place_id: 'ChIJ5W5uIuie4jARg2n1sctSt5g', subcategory: '종합/국제병원' }, // 범룽랏 응급실
  { google_place_id: 'ChIJL9VrrwOf4jARdfjaij1ama8', subcategory: '종합/국제병원' }, // 방콕 심장병원
  { google_place_id: 'ChIJRWzudwNfHTERMFDoMvE399I', subcategory: '종합/국제병원' }, // WIH 국제병원
  { google_place_id: 'ChIJB9PG-jeZ4jAR2fK9fTwnawc', subcategory: '종합/국제병원' }, // 미션병원
  { google_place_id: 'ChIJSedJ9PSe4jARkuAlzDXNXLA', subcategory: '종합/국제병원' }, // 프라람9 병원
  { google_place_id: 'ChIJybuHwwGf4jARm878cc7ERRc', subcategory: '종합/국제병원' }, // BBH 병원
  { google_place_id: 'ChIJ6c7H8dGD4jARLMHC_Vd8Ozo', subcategory: '종합/국제병원' }, // BJH 방콕 병원
  { google_place_id: 'ChIJfSA2vPZ9HTERXuNYGTOJxv4', subcategory: '종합/국제병원' }, // B케어 메디컬 센터
  { google_place_id: 'ChIJ4ccniimf4jARwPXi46NPWNs', subcategory: '종합/국제병원' }, // 쭐라롱꼰 기념병원
  { google_place_id: 'ChIJyX91E1uf4jARgB4tOozdlkc', subcategory: '종합/국제병원' }, // ID 라이프 홀리스틱

  // 내과/가정의학
  { google_place_id: 'ChIJaQZV3lKf4jARbhu4gY9VtoU', subcategory: '내과/가정의학' }, // 서울유 클리닉
  { google_place_id: 'ChIJAbJHgcKf4jARBy8DvDFtupM', subcategory: '내과/가정의학' }, // 웰메드 방콕 왓타나
  { google_place_id: 'ChIJ1fpX856Z4jARzrsx_63IuG8', subcategory: '내과/가정의학' }, // 웰메드 방콕 실롬
  { google_place_id: 'ChIJJUdeF7Sf4jAR3BwwQSDuBSA', subcategory: '내과/가정의학' }, // 오케이 클리닉
  { google_place_id: 'ChIJgaXjG-Oe4jAR2VPsQwds5tM', subcategory: '내과/가정의학' }, // 글로벌 닥터 클리닉
  { google_place_id: 'ChIJ7ctNzeaf4jARELwSN-pY95A', subcategory: '내과/가정의학' }, // 프라임케어 클리닉
  { google_place_id: 'ChIJjSre2C2f4jARVt1J_ZtI64U', subcategory: '내과/가정의학' }, // 국제 여행의학 클리닉
  { google_place_id: 'ChIJ68Qj7t67FgERTpi4awWIz0U', subcategory: '내과/가정의학' }, // 우리 클리닉
  { google_place_id: 'ChIJ_dbmAtef4jARuh-juLJpByE', subcategory: '내과/가정의학' }, // 비합 웰니스 클리닉
  { google_place_id: 'ChIJX430ne6f4jARiPXeChcuCls', subcategory: '내과/가정의학' }, // 무사이 에스테틱
  { google_place_id: 'ChIJvcfbqFWe4jARDGDkf0oh--Q', subcategory: '내과/가정의학' }, // DYM 건강검진
  { google_place_id: 'ChIJL36bdQKf4jARjWb9X5ZqEME', subcategory: '내과/가정의학' }, // DYM 인터내셔널
  { google_place_id: 'ChIJMTxcffif4jARMKtc4RAQ5pY', subcategory: '내과/가정의학' }, // NP 국제 치과 (내과성격)
  { google_place_id: 'ChIJab0OkrOf4jAR0gb9Pfm3790', subcategory: '내과/가정의학' }, // 아이온 클리닉
  { google_place_id: 'ChIJ991lmFWe4jARiEHBcIm1Fho', subcategory: '내과/가정의학' }, // 메드컨설트 클리닉
  { google_place_id: 'ChIJ81UZxcSe4jARajWLWsktH9E', subcategory: '내과/가정의학' }, // KPS 메디컬 센터
  { google_place_id: 'ChIJK4rhclqf4jARvktyJHfJZNs', subcategory: '내과/가정의학' }, // 미라클 리제너레이티브
  { google_place_id: 'ChIJizirMelfHTERirnQFX-Dp3k', subcategory: '내과/가정의학' }, // 람파다 인터내셔널
  { google_place_id: 'ChIJf33VcyWf4jARPMd8zVgtLoI', subcategory: '내과/가정의학' }, // 카셈랏 인터내셔널
  { google_place_id: 'ChIJ04CR9P2h4jARrs49GCSVymU', subcategory: '내과/가정의학' }, // AWC 웰니스 클리닉
  { google_place_id: 'ChIJj6Js5jCf4jARTT3D1eFC-wE', subcategory: '내과/가정의학' }, // 펄스 클리닉 나나
  { google_place_id: 'ChIJZmFYnZWZ4jARAidVebyjaBM', subcategory: '내과/가정의학' }, // 펄스 클리닉 아속
  { google_place_id: 'ChIJAy_0H2Cf4jARv0yWW-XSipg', subcategory: '내과/가정의학' }, // 펄스 클리닉 프롬퐁
  { google_place_id: 'ChIJqzVGr8Ke4jAReajIgn51UZ4', subcategory: '내과/가정의학' }, // 바이탈라이프
  { google_place_id: 'ChIJeeYIbwCf4jAR83VVpGN_-Vg', subcategory: '내과/가정의학' }, // JMS 방콕병원
  { google_place_id: 'ChIJ6eCQKgCf4jARkLKy3KZzYEE', subcategory: '내과/가정의학' }, // 방콕병원 국제의료서비스
  { google_place_id: 'ChIJtbugP6Wf4jARkuRQ55autjw', subcategory: '내과/가정의학' }, // ISC 국제 전문 클리닉
  { google_place_id: 'ChIJaejStCyZ4jARwrHyrXyOBGE', subcategory: '내과/가정의학' }, // 드 미스트 에스테틱
  { google_place_id: 'ChIJX6e_TURwF2kRrgvTMygaFjc', subcategory: '내과/가정의학' }, // 주아 클리닉
  { google_place_id: 'ChIJRTE8aEif4jARdfjg2ihV8Dc', subcategory: '내과/가정의학' }, // 아우라 방콕 센트럴월드

  // 치과
  { google_place_id: 'ChIJtSrHy-ee4jARbvIgvMAOLRA', subcategory: '치과' }, // 방콕 스마일 말로 나나
  { google_place_id: 'ChIJs34PHuSe4jARNDKbPj3dNN0', subcategory: '치과' }, // 마이덴티스트 치과
  { google_place_id: 'ChIJFUQpwOSe4jARHu09RMxxTJQ', subcategory: '치과' }, // 방콕 스마일 치과 아속
  { google_place_id: 'ChIJB1GMwuOe4jAR-KAVTV__VxU', subcategory: '치과' }, // 플러스 치과
  { google_place_id: 'ChIJRZmn9_ae4jARIxRj_ETGsBU', subcategory: '치과' }, // 탄타낏 국제 치과
  { google_place_id: 'ChIJt-oBMLef4jARtvw-DfkrooU', subcategory: '치과' }, // 방콕 덴탈 스파
  { google_place_id: 'ChIJTwqBot6e4jARRmYY2udj7CI', subcategory: '치과' }, // 탄타낏 치과 와이어리스
  { google_place_id: 'ChIJmQ8gdKSf4jARvzz-9LEqDB0', subcategory: '치과' }, // 방콕 국제 치과병원
  { google_place_id: 'ChIJMSQ9ldye4jARbi1LMkXumvc', subcategory: '치과' }, // 아트 덴탈 스튜디오
  { google_place_id: 'ChIJo_oxg5TSskwRj53zEQFaGvs', subcategory: '치과' }, // 방콕 스마일 원방콕
  { google_place_id: 'ChIJtU_5Mtue4jARtQJuv4VlNfU', subcategory: '치과' }, // 트루스 치과
  { google_place_id: 'ChIJwRGKaOOe4jARWNOhQ2Dl-JI', subcategory: '치과' }, // 덴탈 디자인 클리닉
  { google_place_id: 'ChIJl6gz-guf4jARIZfjXAGaMpU', subcategory: '치과' }, // 스마일 센터 수쿰빗39
  { google_place_id: 'ChIJsyqmHSyf4jARI4PA6qbpXBM', subcategory: '치과' }, // 방콕 스마일 실롬
  { google_place_id: 'ChIJI3i29AGf4jAR6wGC4tZu8mk', subcategory: '치과' }, // BIDC 엠쿼티어
  { google_place_id: 'ChIJfzixcIef4jARe3N9fgqXUBY', subcategory: '치과' }, // 스마일 센터 마하툰
  { google_place_id: 'ChIJvRnu_XCf4jARYBE9S62XMoc', subcategory: '치과' }, // 블레즈 치과
  { google_place_id: 'ChIJSdjnb12f4jARzrCCla_Eshk', subcategory: '치과' }, // 그랜드 치과 나나
  { google_place_id: 'ChIJ12wwBh2f4jARP8bt_K7YfOI', subcategory: '치과' }, // 브라이트 스마일
  { google_place_id: 'ChIJYTDTNIee4jARNwdHSA64W3o', subcategory: '치과' }, // BIDC 방콕 국제
  { google_place_id: 'ChIJm6yj7O-e4jAR1b4pdoPFsq0', subcategory: '치과' }, // 스마일 시즌스
  { google_place_id: 'ChIJTw3e_OOe4jAR-Gjr3ZrCvVM', subcategory: '치과' }, // MOS 치과 나나
  { google_place_id: 'ChIJO7XsHj-f4jARklMVxZZY5GA', subcategory: '치과' }, // 에델바이스 치과
  { google_place_id: 'ChIJQ1YAsJ-f4jARJMSZT2kIZx8', subcategory: '치과' }, // 아속 스카이트레인 치과
  { google_place_id: 'ChIJNxVRGeOe4jARzTsM9Z36u6w', subcategory: '치과' }, // MOS 치과 아속
  { google_place_id: 'ChIJQ-Z7puOe4jARauOlz9k7uss', subcategory: '치과' }, // 분딧코솔 치과
  { google_place_id: 'ChIJr45jJKmf4jARa67wRYJfFxQ', subcategory: '치과' }, // 방콕 치과 통로
  { google_place_id: 'ChIJgzo8E7qIo64RDhwhFkIllIw', subcategory: '치과' }, // 헤이스마일 치과
  { google_place_id: 'ChIJ4xexTTCf4jARtF2_xgGYd0o', subcategory: '치과' }, // BFC 치과 엠스피어
  { google_place_id: 'ChIJDeNMUKmf4jARN3W1VCjKmYM', subcategory: '치과' }, // 통로 치과병원
  { google_place_id: 'ChIJyakl16if4jAR-uHLcki85so', subcategory: '치과' }, // 아사바난트 치과
  { google_place_id: 'ChIJAdNruVqe4jARF5MsLm9jjhk', subcategory: '치과' }, // 방콕병원 치과센터
  { google_place_id: 'ChIJfQGp-c2e4jARkW-vs1bJ4Wo', subcategory: '치과' }, // BIDC 시암파라곤
  { google_place_id: 'ChIJiTfqvNKe4jARKtHTflEl4tQ', subcategory: '치과' }, // 스마일 시그니처
  { google_place_id: 'ChIJvWMmcNKe4jARY4VA4XD82MQ', subcategory: '치과' }, // 시암 스테이션 치과
  { google_place_id: 'ChIJca2nqh2c4jAR-_l2Ix4X4DY', subcategory: '치과' }, // 방콕 스마일 파혼요틴
  { google_place_id: 'ChIJBR4Ij-qd4jARSMCD3yq1LyM', subcategory: '치과' }, // 윙크 클리닉
  { google_place_id: 'ChIJK9LEy-uf4jARXWRku3HGSdk', subcategory: '치과' }, // 방콕 덴탈 케어 온눗
  { google_place_id: 'ChIJC0Hi0cGf4jARIEHiHMHo7GM', subcategory: '치과' }, // 덴티스타 치과
  { google_place_id: 'ChIJ0a_M6Luf4jARRQVaHIK0s2Y', subcategory: '치과' }, // 스마일 센터 온눗
  { google_place_id: 'ChIJKW9uvbih4jARoXU6daJzgXE', subcategory: '치과' }, // 스마일 갤러리 우돔숙

  // 피부과
  { google_place_id: 'ChIJkzluuQCf4jARdBP16GIlO9g', subcategory: '피부과' }, // 코리아 코스메틱 성형외과
  { google_place_id: 'ChIJ_exsm92e4jARKYemhrwu5VY', subcategory: '피부과' }, // 자스민 코리안 페이셜 스파
  { google_place_id: 'ChIJiW-yLrqf4jARFqYtafehN7M', subcategory: '피부과' }, // 아우라 K 코리안 스킨
  { google_place_id: 'ChIJMyAzUQCf4jARvaSMvYHQxOE', subcategory: '피부과' }, // 바노바기 클리닉
  { google_place_id: 'ChIJW7abWRyf4jARVBGV0WQJMDs', subcategory: '피부과' }, // 비비 클리닉
  { google_place_id: 'ChIJK4TzkQKf4jARhC9q2mQybnM', subcategory: '피부과' }, // KKC 클리닉 시암파라곤
  { google_place_id: 'ChIJ_emOipef4jAR_BrLaWgnOio', subcategory: '피부과' }, // KKC 클리닉 엠쿼티어
  { google_place_id: 'ChIJNwTaNWWf4jAR7kJrYLWJ2xs', subcategory: '피부과' }, // KKC 클리닉 엠포리엄
  { google_place_id: 'ChIJAaeAWFqc4jARMyV5L-7Dvls', subcategory: '피부과' }, // KKC 클리닉 센트럴 랏프라오
  { google_place_id: 'ChIJ8VhA1LKf4jARTSJmFOtdhwo', subcategory: '피부과' }, // 강남 클리닉 실롬
  { google_place_id: 'ChIJBUW6wd-f4jAROnryhZGglNU', subcategory: '피부과' }, // 아우라 방콕 사톤
  { google_place_id: 'ChIJFRuk106f4jARvFWKxjjOjRs', subcategory: '피부과' }, // 아속 리바이즈 클리닉
  { google_place_id: 'ChIJI-bB59yf4jARXUHtWEfdP5I', subcategory: '피부과' }, // 리뉴미 스킨 클리닉
  { google_place_id: 'ChIJJz7K2-Ke4jARck8MGk_G8ho', subcategory: '피부과' }, // 블레즈 클리닉 아속
  { google_place_id: 'ChIJdytL0_FfHTERdqYyeJz-lvA', subcategory: '피부과' }, // 해원 클리닉 방나
  { google_place_id: 'ChIJNQB0qUdfHTERf-lOa_TDDtU', subcategory: '피부과' }, // 더 코리아 클리닉
  { google_place_id: 'ChIJdYUtyiKf4jAR4UWOeyL_VBM', subcategory: '피부과' }, // 헤어트란 클리닉
];

async function updateSubcategories() {
  console.log(`총 ${UPDATES.length}개 업데이트 시작...`);
  let success = 0;
  let fail = 0;

  for (const item of UPDATES) {
    const { error } = await supabase
      .from('businesses')
      .update({ subcategory: item.subcategory })
      .eq('google_place_id', item.google_place_id);

    if (error) {
      console.error(`❌ 실패: ${item.google_place_id} - ${error.message}`);
      fail++;
    } else {
      console.log(`✅ 완료: ${item.google_place_id} → ${item.subcategory}`);
      success++;
    }
  }

  console.log(`
완료: 성공 ${success}개, 실패 ${fail}개`);
}

updateSubcategories();