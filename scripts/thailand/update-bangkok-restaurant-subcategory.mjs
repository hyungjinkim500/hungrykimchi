import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const UPDATES = [
  // 종합한식
  { google_place_id: 'ChIJ5QN0YOGe4jARE-Y03sxqpmY', subcategory: '종합한식' }, // 가보래
  { google_place_id: 'ChIJz_OT4a6f4jAR348akg-nf9g', subcategory: '종합한식' }, // 코리아홀릭
  { google_place_id: 'ChIJkTWS3eOe4jARauzDiBy263Y', subcategory: '종합한식' }, // 명가
  { google_place_id: 'ChIJox7O4eOe4jARMNBT7vmIDzY', subcategory: '종합한식' }, // 동이
  { google_place_id: 'ChIJx6JXUqmf4jAR6tmg4xV65_A', subcategory: '종합한식' }, // 키아니
  { google_place_id: 'ChIJIQBKyOSe4jARl9KvBH0Cb5c', subcategory: '종합한식' }, // 대장금 아속
  { google_place_id: 'ChIJbY7gF8Of4jARFyzLUFoqsuQ', subcategory: '종합한식' }, // 본가
  { google_place_id: 'ChIJP_k14-Oe4jARaOQtzCnFaIY', subcategory: '종합한식' }, // 자금성
  { google_place_id: 'ChIJnTb84-Oe4jARthYIJSH-lx0', subcategory: '종합한식' }, // 호박 식당
  { google_place_id: 'ChIJH4zN_OOe4jARKWBnaU8F1K0', subcategory: '종합한식' }, // 아리랑
  { google_place_id: 'ChIJZVpyEFGf4jARp3nanG_HeI4', subcategory: '종합한식' }, // 청담 한식당
  { google_place_id: 'ChIJTYaE2OWe4jARRUrQdU-Cikw', subcategory: '종합한식' }, // 경복궁
  { google_place_id: 'ChIJnd5M6OOe4jAR11DWesk88gc', subcategory: '종합한식' }, // 김대감한식
  { google_place_id: 'ChIJBZVi4eOe4jARmDqgbxEDVmc', subcategory: '종합한식' }, // 명동
  { google_place_id: 'ChIJ9dAC3eSe4jARXv-H990rflM', subcategory: '종합한식' }, // 동대문한식당
  { google_place_id: 'ChIJs2v_ZfCf4jAR345T39kaqeI', subcategory: '종합한식' }, // 나인 한식당
  { google_place_id: 'ChIJ69cNSACf4jARS3LtWE9XB9Q', subcategory: '종합한식' }, // 우림 한식
  { google_place_id: 'ChIJRf8ELbOf4jARF2dtNc45Xyg', subcategory: '종합한식' }, // 만점에
  { google_place_id: 'ChIJR8JsZ7Gf4jARsMFdVqqbpSI', subcategory: '종합한식' }, // 솟 시암파라곤
  { google_place_id: 'ChIJI9ZH5vGf4jAR4EfOG4k_M8c', subcategory: '종합한식' }, // 자금성 시암스퀘어
  { google_place_id: 'ChIJ3UUSPACf4jARs_lGDhlRPCM', subcategory: '종합한식' }, // 맛자랑 수쿰빗12
  { google_place_id: 'ChIJhUopz-ee4jAR5SwGNw_Y2bo', subcategory: '종합한식' }, // 유천 레스토랑
  { google_place_id: 'ChIJS79XBOSe4jARWCK8fHZy8FE', subcategory: '종합한식' }, // 진생식당
  { google_place_id: 'ChIJtYKT3m-f4jAR1tc1CViUmZ8', subcategory: '종합한식' }, // 방콕반점
  { google_place_id: 'ChIJe1zsJIef4jARqj6hCLeLz0M', subcategory: '종합한식' }, // 맛자랑 수쿰빗플라자
  { google_place_id: 'ChIJ81kkGdef4jAR_t4YU3vyLgY', subcategory: '종합한식' }, // 둥이네
  { google_place_id: 'ChIJiT2icQCf4jAR_jS4pyWfgUs', subcategory: '종합한식' }, // 수락
  { google_place_id: 'ChIJi_jDayGf4jARXi_qjnUa0bA', subcategory: '종합한식' }, // 동원각
  { google_place_id: 'ChIJe4nCOgCf4jARlChiq7X7_jo', subcategory: '종합한식' }, // 남대문 프리미엄
  { google_place_id: 'ChIJv_V19P2f4jARGpHkXe5mFME', subcategory: '종합한식' }, // 솟 방콕
  { google_place_id: 'ChIJ62U9ahuf4jAR4oI0c8NETZk', subcategory: '종합한식' }, // 김정 그릴 (기타 고려했으나 종합한식 결정)
  { google_place_id: 'ChIJs--PHS6f4jARRtIxT2IJxCw', subcategory: '종합한식' }, // 친구 식당
  { google_place_id: 'ChIJtcjflkef4jARTufSUFYdHO4', subcategory: '종합한식' }, // 대한민국 육해공
  { google_place_id: 'ChIJ서라벌1QdgkAif4jARjRmcPOLKkhg', subcategory: '종합한식' }, // 서라벌
  { google_place_id: 'ChIJ1QdgkAif4jARjRmcPOLKkhg', subcategory: '종합한식' }, // 서라벌
  { google_place_id: 'ChIJZ4PL9_2e4jARNJ0ebUHN4Co', subcategory: '종합한식' }, // 만찬 한식당
  { google_place_id: 'ChIJx1lvVquf4jARSRooZpAh0XA', subcategory: '종합한식' }, // 소담
  { google_place_id: 'ChIJ08Ohhfuf4jARFaGdQ0m6VQk', subcategory: '종합한식' }, // 시나브로
  { google_place_id: 'ChIJyfrRza-f4jARePgTQSNXo3s', subcategory: '종합한식' }, // 산내들
  { google_place_id: 'ChIJW38Q_7ef4jARCD-e_BZ9a1Q', subcategory: '종합한식' }, // 대장금 에까마이
  { google_place_id: 'ChIJ0X0ArNxhHTER9u0CRByI4fs', subcategory: '종합한식' }, // 해남식당
  { google_place_id: 'ChIJv5I3yqqf4jARgHnnwRPaUAE', subcategory: '종합한식' }, // 북막골
  { google_place_id: 'ChIJUTINLeKf4jARHRUOD2vyyX0', subcategory: '종합한식' }, // 육도
  { google_place_id: 'ChIJpaQmPy2f4jARCNi_Mn9ohZs', subcategory: '종합한식' }, // 요기요
  { google_place_id: 'ChIJq8o7P9yZ4jARqTMHfoX5p_Q', subcategory: '종합한식' }, // 방콕 김대감 투어
  { google_place_id: 'ChIJO0nISwCf4jARLkYFJOrxTtQ', subcategory: '종합한식' }, // 신도세기 소반
  { google_place_id: 'ChIJkVadibif4jARzkyLAC8cFbM', subcategory: '종합한식' }, // 우고기 원방콕
  { google_place_id: 'ChIJeZwyYHiZ4jAR5He2Vtsv8Ng', subcategory: '종합한식' }, // 수종
  { google_place_id: 'ChIJw8_MJI2e4jARi0ILjyOKWxs', subcategory: '종합한식' }, // 달달 한식당
  { google_place_id: 'ChIJ6e4AZgCf4jARAzM4CpclaQc', subcategory: '종합한식' }, // 서울풀
  { google_place_id: 'ChIJWdaXjOif4jARCxXCLCaN81A', subcategory: '종합한식' }, // 더 비빔밥 센트럴 라마9
  { google_place_id: 'ChIJhXYrL8qZ4jARAtCIeb-32Xo', subcategory: '종합한식' }, // 더비빔밥 아이콘시암
  { google_place_id: 'ChIJV8bGeQGf4jAR018UQ475-JE', subcategory: '종합한식' }, // 더비빔밥 수쿰빗24
  { google_place_id: 'ChIJvSDtoE-f4jARhDdfLkLJrZ0', subcategory: '종합한식' }, // 더 비빔밥 원방콕
  { google_place_id: 'ChIJd6gOClKf4jARE5yDJ-Z5GWY', subcategory: '종합한식' }, // 삼삼오오
  { google_place_id: 'ChIJ_3gaDA2f4jARLXi2_5HM_Is', subcategory: '종합한식' }, // 하슬 원방콕
  { google_place_id: 'ChIJFaLTtdKe4jAR-NMzKdR3FHQ', subcategory: '종합한식' }, // 공주 한식당
  { google_place_id: 'ChIJNU8O5XKZ4jARJayvQ-wXfu0', subcategory: '종합한식' }, // 홍익인간
  { google_place_id: 'ChIJbw5ox8ef4jARymh3jhLbm-g', subcategory: '종합한식' }, // 우 텐더 방콕
  { google_place_id: 'ChIJO9PfCnWf4jARRvnlNRzWuzE', subcategory: '종합한식' }, // 본촌 센트럴 라마9
  { google_place_id: 'ChIJNQSnpOaf4jARRMWQ7XyzyGw', subcategory: '종합한식' }, // 우곱집
  { google_place_id: 'ChIJ4Wt9hahhHTERXzhYxgwjaQ8', subcategory: '종합한식' }, // 쌈씽 투게더
  { google_place_id: 'ChIJvekMs-VhHTER9nw1zZxhxow', subcategory: '종합한식' }, // 한양 갈비
  { google_place_id: 'ChIJV_9onHhfHTERfmdrbnDoYLU', subcategory: '종합한식' }, // 서울하우스
  { google_place_id: 'ChIJNV5jqRRhHTERh0G_q8mTR50', subcategory: '종합한식' }, // 서울 한식당
  { google_place_id: 'ChIJDXhjKe2h4jARaqR3hjVqHy8', subcategory: '종합한식' }, // 타미식당
  { google_place_id: 'ChIJ-4biYmtfHTERyrNmf3CJ17Q', subcategory: '종합한식' }, // 아이성 방나
  { google_place_id: 'ChIJCwlvoVSf4jARvTQengB8i5A', subcategory: '종합한식' }, // 아이성
  { google_place_id: 'ChIJ6Q9O5Baf4jARGZ-TzWCAkPs', subcategory: '종합한식' }, // 웍 코리아
  { google_place_id: 'ChIJWbYKLgB_HTERKVG-JHoHxA8', subcategory: '종합한식' }, // 소반 랑싯
  { google_place_id: 'ChIJl_pHM2uf4jARcssiBDJqg4s', subcategory: '종합한식' }, // 디디 한식당
  { google_place_id: 'ChIJ-a6YlHqf4jARn5UKguPTEZY', subcategory: '종합한식' }, // 밥상 한식
  { google_place_id: 'ChIJc2-2cwCf4jARvP7wchxNwT8', subcategory: '종합한식' }, // 본가 시암 디스커버리
  { google_place_id: 'ChIJtd-ZmSCZ4jAR9RdhMX6_F6E', subcategory: '종합한식' }, // K-strEAT
  { google_place_id: 'ChIJWV3KScqe4jARAFND0bUGen8', subcategory: '종합한식' }, // 살랑
  { google_place_id: 'ChIJrddfVvVhHTERqkYP-t8VIfY', subcategory: '종합한식' }, // 신톡 방콕
  { google_place_id: 'ChIJ-bu8fwBhHTERJeKMple1S2A', subcategory: '종합한식' }, // 친구집
  { google_place_id: 'ChIJWRVo3ZZfHTERs3-KKnSRM6k', subcategory: '종합한식' }, // 아움 BBQ
  { google_place_id: 'ChIJhaYFk4FfHTERROR_OofNW0I', subcategory: '종합한식' }, // 새마을감자탕 방나
  { google_place_id: 'ChIJ-T64IZ2f4jARPP9XburQ4QQ', subcategory: '종합한식' }, // 김치사랑
  { google_place_id: 'ChIJQ8FRYhBjHTERyCD3RyIHl9g', subcategory: '종합한식' }, // 한국식당
  { google_place_id: 'ChIJl6mZX3KZ4jARbHQJK9yDntY', subcategory: '종합한식' }, // 동대문식당 카오산
  { google_place_id: 'ChIJNybSaNed4jARnp2Ysmn4Ljc', subcategory: '종합한식' }, // 방아방아
  { google_place_id: 'ChIJPWp-eChhHTERc_nBsoCUXU8', subcategory: '종합한식' }, // 삼겹살 한식 BBQ
  { google_place_id: 'ChIJGfCS1Xqf4jARs3yB4cKxFV0', subcategory: '종합한식' }, // KBBQ BTS 온눗
  { google_place_id: 'ChIJ8dG4H9Sf4jARprMOwWDXMtc', subcategory: '종합한식' }, // 수비네 식당
  { google_place_id: 'ChIJ4Wt9hahhHTERXzhYxgwjaQ8', subcategory: '종합한식' }, // 쌈씽 투게더

  // 고기구이
  { google_place_id: 'ChIJmRkPaACf4jARyewh9Wqp940', subcategory: '고기구이' }, // 도야지 아속
  { google_place_id: 'ChIJ95CeAL-f4jARKSPkW-OsnZI', subcategory: '고기구이' }, // 소공돈
  { google_place_id: 'ChIJt-itk-Oe4jAR-7mgbaBJzlg', subcategory: '고기구이' }, // 두레 고기구이
  { google_place_id: 'ChIJ69KL4-Oe4jARBhOsXE0BO_Q', subcategory: '고기구이' }, // 장원
  { google_place_id: 'ChIJr7zhLgOf4jARrInzdiVImKk', subcategory: '고기구이' }, // 반주고깃집
  { google_place_id: 'ChIJbykHRfSf4jARn2JYKm5ZdFM', subcategory: '고기구이' }, // 케이비비큐
  { google_place_id: 'ChIJowXXd-Se4jARR3CgsQshy8g', subcategory: '고기구이' }, // 한국관
  { google_place_id: 'ChIJHwOeyvme4jARGAkXcPgzmYg', subcategory: '고기구이' }, // 서울집
  { google_place_id: 'ChIJvz6eSlKf4jARQ1VrCz9u2lw', subcategory: '고기구이' }, // 한마음 BBQ
  { google_place_id: 'ChIJcQq1s_-e4jARN4ySRHpTidY', subcategory: '고기구이' }, // 수라 BBQ
  { google_place_id: 'ChIJ1R7QvICf4jARQq6IIQcL3_Y', subcategory: '고기구이' }, // 예빈 고기구이
  { google_place_id: 'ChIJ_ZBHPL-f4jARv24Xyj5IGX8', subcategory: '고기구이' }, // 반포
  { google_place_id: 'ChIJCdSqGbmf4jAR0Hemw9xhTlM', subcategory: '고기구이' }, // 바이킹
  { google_place_id: 'ChIJkR1NpGCf4jARF3K2iAikb-c', subcategory: '고기구이' }, // 도야지 센츄리
  { google_place_id: 'ChIJ_RSwdgCZ4jARBTV9pNmR-ko', subcategory: '고기구이' }, // 청계
  { google_place_id: 'ChIJfwbI5muf4jARrDOuaZ0ph00', subcategory: '고기구이' }, // 조은 BBQ
  { google_place_id: 'ChIJz15o39uf4jARP5kItOQPyhk', subcategory: '고기구이' }, // 서울 바베큐 소년
  { google_place_id: 'ChIJtbOYRAqf4jARO5dr2BgGv6w', subcategory: '고기구이' }, // 명륜 진사 갈비
  { google_place_id: 'ChIJ-QXkhQaf4jARjRmcPOLKkhg', subcategory: '고기구이' }, // 고궁
  { google_place_id: 'ChIJAZ1hqT2f4jARsu5r4_zaplM', subcategory: '고기구이' }, // 곱창하우스 통로
  { google_place_id: 'ChIJ0XTLnX-h4jAREk04NTK4ZSU', subcategory: '고기구이' }, // 금고기 BBQ
  { google_place_id: 'ChIJnUJK9qJfHTERNl7H_RNuQ5I', subcategory: '고기구이' }, // 산적 감자탕
  { google_place_id: 'ChIJneKpN_NhHTERtQT6d9aKliA', subcategory: '고기구이' }, // 마포 갈비
  { google_place_id: 'ChIJP5Ze55Sf4jARWm8zAhZC_jI', subcategory: '고기구이' }, // 더안녕바베큐
  { google_place_id: 'ChIJ3c6-M65fHTERs_tiM_kiGQQ', subcategory: '고기구이' }, // 윤스 BBQ
  { google_place_id: 'ChIJ8c4nw45hHTERm1Ubt0Le3qs', subcategory: '고기구이' }, // 도야지 파라다이스
  { google_place_id: 'ChIJC4OHQjBfHTERSacEY9TtiWQ', subcategory: '고기구이' }, // 레드 피그 BBQ
  { google_place_id: 'ChIJfQNxagBhHTER0u5tpK7FBQo', subcategory: '고기구이' }, // 더 안녕 BBQ 뷔페
  { google_place_id: 'ChIJXcGDoKOf4jAR7YTBguTrXcw', subcategory: '고기구이' }, // 압구정 그릴 BBQ
  { google_place_id: 'ChIJlbG-pR5hHTERF6TEdzMmua8', subcategory: '고기구이' }, // 윤키친
  { google_place_id: 'ChIJRZMFCABfHTER8tXmuJju4JM', subcategory: '고기구이' }, // 명륜진사갈비 빅씨방나
  { google_place_id: 'ChIJSfKTE-ZfHTERbYwfRWum7_Y', subcategory: '고기구이' }, // 케이비비큐 방나
  { google_place_id: 'ChIJP7qkwcCd4jARr9-27jTPj3o', subcategory: '고기구이' }, // 육가 아리
  { google_place_id: 'ChIJ-x8i3-qd4jARdOyx5awArGQ', subcategory: '고기구이' }, // 감사 BBQ
  { google_place_id: 'ChIJNWyyyluZ4jAR8xE_xu7adaw', subcategory: '고기구이' }, // 코키냄새 삼얀
  { google_place_id: 'ChIJqcPhmtKe4jARU6vwhrzmIuE', subcategory: '고기구이' }, // 통큰구이
  { google_place_id: 'ChIJx6ZcIgef4jARkwb_TrbAXV8', subcategory: '고기구이' }, // 새마을식당
  { google_place_id: 'ChIJK4ukaY6e4jARlcxTABJW-qw', subcategory: '고기구이' }, // 네네 BBQ 뷔페
  { google_place_id: 'ChIJSfsO5T6f4jARgRPQ1HyycFU', subcategory: '고기구이' }, // 네네 수안플렁
  { google_place_id: 'ChIJ-y1HTrRnHTERJ2y9ZPgPXwg', subcategory: '고기구이' }, // 강남 BBQ 랏끄라방
  { google_place_id: 'ChIJmVWZ2aif4jARgARENVJv07g', subcategory: '고기구이' }, // 고시레
  { google_place_id: 'ChIJ65cMatWf4jARLKuY9_jxIZw', subcategory: '고기구이' }, // KBBQ 랏차다
  { google_place_id: 'ChIJk5m0TPie4jAR9AqikBr7R3g', subcategory: '고기구이' }, // 고기세키
  { google_place_id: 'ChIJB9aS3l2d4jARZXTLifLjZrQ', subcategory: '고기구이' }, // 삼겹살 뷔페 훼이쾅
  { google_place_id: 'ChIJN9sEXIGD4jARZtGdw9Owee0', subcategory: '고기구이' }, // 삼겹살 BBQ 스롱쁘라파
  { google_place_id: 'ChIJf6gr_82Z4jARnP-1VtdLRpg', subcategory: '고기구이' }, // 주방 프리미엄 BBQ
  { google_place_id: 'ChIJh-lJjNWf4jAREyh5uhLy6oA', subcategory: '고기구이' }, // 메이플 트리 하우스
  { google_place_id: 'ChIJX3cg2tSd4jARZ_MWm_rDc90', subcategory: '고기구이' }, // 드럼 BBQ 랏차다
  { google_place_id: 'ChIJtdPITfOf4jARHcb0MIsITjY', subcategory: '고기구이' }, // 남매집 라마3
  { google_place_id: 'ChIJxfRz_02f4jAR8Q8riraXP84', subcategory: '고기구이' }, // 나라 BBQ

  // 치킨
  { google_place_id: 'ChIJY4yN1WKf4jARPyARTCChXqw', subcategory: '치킨' }, // 구구 치킨 아속
  { google_place_id: 'ChIJ8dAwRveZ4jAR7Nr7HIbzMdg', subcategory: '치킨' }, // 충만치킨 실롬
  { google_place_id: 'ChIJ3dx2T7OZ4jARuhoG5mrQUas', subcategory: '치킨' }, // 구구 치킨 파야타이
  { google_place_id: 'ChIJF3g_yoqf4jARK1-GF3bb0iE', subcategory: '치킨' }, // BHC 치킨 원방콕
  { google_place_id: 'ChIJi0aQZfmZ4jARoxpyQzdcthU', subcategory: '치킨' }, // 푸라닥
  { google_place_id: 'ChIJn_ykVgCf4jARlYvnIakqPJ4', subcategory: '치킨' }, // 닭집
  { google_place_id: 'ChIJ13_gCsif4jARZ4p-3TcHcO8', subcategory: '치킨' }, // 충만치킨 에까마이
  { google_place_id: 'ChIJ6cVxTpCf4jARAAzU8XcA-bw', subcategory: '치킨' }, // 체크인 치킨
  { google_place_id: 'ChIJ-xMRegCf4jAR1Vnl8qle5RM', subcategory: '치킨' }, // 충만치킨 트루디지털
  { google_place_id: 'ChIJY1L8nB6h4jAR-SQ5vtLBhIw', subcategory: '치킨' }, // 구구 치킨 수쿰빗101
  { google_place_id: 'ChIJG7lbTLRfHTERjRRAcYytPZ8', subcategory: '치킨' }, // 충만치킨 방나
  { google_place_id: 'ChIJVT0VnMSf4jAR7nl24_x37VY', subcategory: '치킨' }, // 충만치킨 MBK
  { google_place_id: 'ChIJ_blelBWf4jARpu1x5FJA1oc', subcategory: '치킨' }, // 오빠 치킨
  { google_place_id: 'ChIJ2WxBBQqf4jARwue6PyPmyLU', subcategory: '치킨' }, // 구구 치킨 랏차다
  { google_place_id: 'ChIJkT099tKZ4jAR8L29xx_Uq8w', subcategory: '치킨' }, // 창원 치킨
  { google_place_id: 'ChIJV8mRBMWh4jARCi09xU-TX5s', subcategory: '치킨' }, // 코코비 치맥
  { google_place_id: 'ChIJawRZ9suZ4jARdNlgCs2hDdo', subcategory: '치킨' }, // 걸작 떡볶이 치킨

  // 분식
  { google_place_id: 'ChIJh3Z9iPWf4jARd12HrynNJ-U', subcategory: '분식' }, // 언니분식
  { google_place_id: 'ChIJi2uTvsWZ4jAR3SijYCzWDPA', subcategory: '분식' }, // 선비 김밥
  { google_place_id: 'ChIJJbP_21Gf4jARdxUNAT_Vbv4', subcategory: '분식' }, // 오케이 김밥
  { google_place_id: 'ChIJIRjL-cuf4jAROOllmP4YlAA', subcategory: '분식' }, // 찬스떡볶이
  { google_place_id: 'ChIJMSkIsqOf4jARYCYO8BAa0XA', subcategory: '분식' }, // 하나 떡볶이
  { google_place_id: 'ChIJlUvERRWZ4jARcySRjSsEd4A', subcategory: '분식' }, // 라면 키친 두씻
  { google_place_id: 'ChIJYTTISO2f4jARng835Dozvkw', subcategory: '분식' }, // 라면 키친 엠스피어
  { google_place_id: 'ChIJk9-xiG2f4jAR3oQQJ_RHq2Y', subcategory: '분식' }, // 소반 국수 포차

  // 국밥/찌개
  { google_place_id: 'ChIJX1ORJu6f4jARHRqlWEwax-E', subcategory: '국밥/찌개' }, // 새마을 감자탕
  { google_place_id: 'ChIJCCzGedSf4jARP0iltAABpNY', subcategory: '국밥/찌개' }, // 방콕 뚝배기
  { google_place_id: 'ChIJGdMdVwCZ4jARnTmNcGjU7uA', subcategory: '국밥/찌개' }, // 더 솥밥
  { google_place_id: 'ChIJa5CSdCSf4jARS-2AK7aQMkg', subcategory: '국밥/찌개' }, // 더탕면옥
  { google_place_id: 'ChIJ8x4q516f4jAR61pr3LVRsaA', subcategory: '국밥/찌개' }, // 더탕
  { google_place_id: 'ChIJwfdTE7Oh4jARX1T6djNcafg', subcategory: '국밥/찌개' }, // 수북한 우돔숙

  // 중화요리
  { google_place_id: 'ChIJmfJGeuSe4jARr-RvZAWG15c', subcategory: '중화요리' }, // 북경 중식당
  { google_place_id: 'ChIJD3o6riih4jAR8OF5kC9oXsE', subcategory: '중화요리' }, // 짜장면본점 BBQ
  { google_place_id: 'ChIJDUk5rrZhHTERHgIk8T8DbnA', subcategory: '중화요리' }, // 트루짜장 스리나카린
  { google_place_id: 'ChIJ2R8fTKmZ4jARe33Nv2ZgCDU', subcategory: '중화요리' }, // 곱창집 반탓텅 (마라탕)
  { google_place_id: 'ChIJI56e6E2f4jARYR2F7HN3K50', subcategory: '중화요리' }, // 카오카오봄 마라탕

  // 회/초밥
  { google_place_id: 'ChIJTUkJeEmf4jAR7Q_I0j6pucg', subcategory: '회/초밥' }, // 2018 해산물 BBQ

  // 포차/호프
  { google_place_id: 'ChIJP2FNKgqf4jARg5kRZYl0ZfM', subcategory: '포차/호프' }, // 이태원 코리아 바
  { google_place_id: 'ChIJN1yjelqZ4jARNs_6xWslBDA', subcategory: '포차/호프' }, // 오디비

  // 기타 (확신 불가)
  { google_place_id: 'ChIJRzBpBR2f4jARBczraD6u8-s', subcategory: '기타' }, // 연정 (음식점 타입만)
  { google_place_id: 'ChIJi4OF50yf4jARtGknXYIMUJQ', subcategory: '기타' }, // 파크스 비스트로
  { google_place_id: 'ChIJe62nScWf4jAR1UPMqiQOjI8', subcategory: '기타' }, // 차니네
  { google_place_id: 'ChIJDTKBEM6f4jAR2cKTxve7aFQ', subcategory: '기타' }, // 비비고 솥밥
  { google_place_id: 'ChIJjcniOPWZ4jARcH3EvgCD-M8', subcategory: '기타' }, // 숙달방콕
  { google_place_id: 'ChIJfZz4cLCf4jAR87hVbgYUvX4', subcategory: '기타' }, // 돌판집
  { google_place_id: 'ChIJFb4rdQCf4jARtbCLbfxI1Lc', subcategory: '기타' }, // 피자 마루
  { google_place_id: 'ChIJgfPw4OOe4jARp7tulnrpPtM', subcategory: '기타' }, // 화신
  { google_place_id: 'ChIJ-WyMai2f4jARLTbKkp9P-_0', subcategory: '기타' }, // 너랑 나랑
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

  console.log(`\n완료: 성공 ${success}개, 실패 ${fail}개`);
}

updateSubcategories();