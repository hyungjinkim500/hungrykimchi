
export const CATEGORIES = [
  '전체',
  '음식점',
  '택시',
  '의료',
  '관공·긴급',
  '기관',
  '마트/슈퍼',
  '기타',
] as const;

export type Category = typeof CATEGORIES[number];
