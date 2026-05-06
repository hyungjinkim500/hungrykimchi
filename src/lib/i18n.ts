export type Language = 'ko' | 'en';

export const translations = {
  ko: {
    // 카테고리
    category_restaurant: '음식점',
    category_grocery: '마트/슈퍼',
    category_medical: '의료',
    category_office: '관공·긴급',

    // 음식점 서브카테고리
    sub_korean: '종합한식',
    sub_bbq: '고기구이',
    sub_chicken: '치킨',
    sub_bar: '포차/호프',
    sub_streetfood: '분식',
    sub_rice: '백반/반찬',
    sub_jokbal: '족발/보쌈',
    sub_chinese: '중화요리',
    sub_sashimi: '회/초밥',
    sub_soup: '국밥/찌개',
    sub_hotpot: '전골/샤브',
    sub_cafe: '브런치/카페',
    sub_etc: '기타',

    // 의료 서브카테고리
    sub_hospital: '종합/국제병원',
    sub_internal: '내과/가정의학',
    sub_dental: '치과',
    sub_derma: '피부과',
    sub_eye: '안과',
    sub_ent: '이비인후과',
    sub_ortho: '정형외과',
    sub_korean_med: '한의원',
    sub_pharmacy: '약국',

    // 관공·긴급 서브카테고리
    sub_embassy: '대사관·영사관',
    sub_police: '경찰서',
    sub_immigration: '출입국관리소',
    sub_airport: '공항',

    // UI 공통
    verified_korean_run: '한국인 운영',
    verified_korean_run_only: '한인업체만',
    save: '찜하기',
    visited: '방문했어요',
    top_rated: '평점순',
    sort_az: '가나다순',
    reviews: '리뷰',
    write_review: '리뷰 작성',
    share_experience: '경험을 공유해주세요',
    be_first_to_rate: '리뷰 {n}개 더 모이면 표시됩니다 🌱',
    ok_score: '진짜한식지수',
    korean_run_label: '한국인 운영',
    search_placeholder: '업체명 검색',
    no_results: '검색 결과가 없어요',
    call: '전화',
    map: '지도',
    report: '신고',
  },
  en: {
    // 카테고리
    category_restaurant: 'Restaurants',
    category_grocery: 'Grocery',
    category_medical: 'Medical',
    category_office: 'Offices & Emergency',

    // 음식점 서브카테고리
    sub_korean: 'Korean Cuisine',
    sub_bbq: 'Korean BBQ',
    sub_chicken: 'Fried Chicken',
    sub_bar: 'Bar & Pocha',
    sub_streetfood: 'Street Food',
    sub_rice: 'Rice & Sides',
    sub_jokbal: 'Jokbal & Bossam',
    sub_chinese: 'Korean-Chinese',
    sub_sashimi: 'Sashimi & Sushi',
    sub_soup: 'Soup & Stew',
    sub_hotpot: 'Hot Pot',
    sub_cafe: 'Café & Brunch',
    sub_etc: 'Other',

    // 의료 서브카테고리
    sub_hospital: 'General Hospital',
    sub_internal: 'Internal Medicine',
    sub_dental: 'Dental',
    sub_derma: 'Dermatology',
    sub_eye: 'Ophthalmology',
    sub_ent: 'ENT',
    sub_ortho: 'Orthopedics',
    sub_korean_med: 'Korean Medicine',
    sub_pharmacy: 'Pharmacy',

    // 관공·긴급 서브카테고리
    sub_embassy: 'Embassy & Consulate',
    sub_police: 'Police',
    sub_immigration: 'Immigration',
    sub_airport: 'Airport',

    // UI 공통
    verified_korean_run: 'Verified Korean-run',
    verified_korean_run_only: 'Verified Korean-run only',
    save: 'Save',
    visited: "I've been here",
    top_rated: 'Top Rated',
    sort_az: 'A-Z',
    reviews: 'Reviews',
    write_review: 'Write a Review',
    share_experience: 'Share your experience',
    be_first_to_rate: 'Shown after {n} more reviews',
    ok_score: 'OK Score',
    korean_run_label: 'Verified Korean-run',
    search_placeholder: 'Search places',
    no_results: 'No results found',
    call: 'Call',
    map: 'Map',
    report: 'Report',
  },
} as const;

export type TranslationKey = keyof typeof translations.ko;

export function t(lang: Language, key: TranslationKey, params?: Record<string, string | number>): string {
  let text = translations[lang][key] as string;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}
