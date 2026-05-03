import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) { console.error('SUPABASE_KEY 누락'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const data = [
  { google_place_id: 'ChIJxyLnmE44DW0RBDAPwTmfb-s', name: '로얄 세이브 마트', name_ko: '로얄 세이브 마트', city: 'auckland', lat: -36.8011331, lng: 174.74566819999998, address: '47 Pearn Crescent, Northcote, Auckland 0627 뉴질랜드', phone: '+64 9 480 0504', google_rating: 3.7 },
  { google_place_id: 'ChIJISwWXps5DW0RaU9N-Xfd3sw', name: 'Wang Korea Food Market Link Drive', name_ko: '왕코리아 푸드마켓 링크드라이브 Wang Korea Food Market Link Drive', city: 'auckland', lat: -36.763997599999996, lng: 174.73702649999998, address: '18/20 Link Drive, Wairau Valley, Auckland 0627 뉴질랜드', phone: '+64 9 443 6214', google_rating: 4.2 },
  { google_place_id: 'ChIJi5S0QJo5DW0R8oZv2U75bq0', name: 'nh mall', name_ko: 'NH 몰 nh mall', city: 'auckland', lat: -36.7792492, lng: 174.7421793, address: '85 Wairau Road, Wairau Valley, Auckland 0627 뉴질랜드', phone: '+64 9 869 7691', google_rating: 4.3 },
  { google_place_id: 'ChIJh2-0ssQ7DW0RsjT0ukZJ5hM', name: 'H MART ALBANY (한아름) 韓國食品超市', name_ko: '한아름 알바니 H MART ALBANY', city: 'auckland', lat: -36.7403763, lng: 174.7165441, address: '2A/2 Tawa Drive, Albany, Auckland 0632 뉴질랜드', phone: '+64 9 415 1225', google_rating: 4.2 },
  { google_place_id: 'ChIJ4a7rnDE7DW0RPhYgsRGDKDw', name: 'Wang Korea Food Market Rosedale', name_ko: '왕코리아 푸드마켓 로즈데일 Wang Korea Food Market Rosedale', city: 'auckland', lat: -36.7372042, lng: 174.7244517, address: '98 Rosedale Road, Albany, Auckland 0632 뉴질랜드', phone: '+64 9 447 3333', google_rating: 4.4 },
  { google_place_id: 'ChIJg5qY2pg5DW0RJoRHkGM9ROg', name: "Kim's Club Glenfield", name_ko: "킴스 클럽 글렌필드 Kim's Club Glenfield", city: 'auckland', lat: -36.7715852, lng: 174.7373719, address: '75 View Road, Wairau Valley, Auckland 0627 뉴질랜드', phone: '+64 9 444 5466', google_rating: 4.2 },
  { google_place_id: 'ChIJUVwA5G9HDW0RzIzmtJSifk0', name: 'H MART CITY (iMart)', name_ko: '한아름 시티 H MART CITY iMart', city: 'auckland', lat: -36.8530356, lng: 174.764231, address: 'Lv1, 9, 15 Wakefield Street, Auckland CBD 1010 뉴질랜드', phone: '+64 9 307 2777', google_rating: 3.9 },
  { google_place_id: 'ChIJhTWa68RHDW0RA0oRHRz3Uz8', name: 'Bok Mart (Wang Mart) central', name_ko: '복마트 센트럴 Bok Mart Wang Mart Central', city: 'auckland', lat: -36.8673377, lng: 174.76138709999998, address: '75 Mount Eden Road, Mount Eden, Auckland 1023 뉴질랜드', phone: '+64 9 357 0988', google_rating: 4.2 },
  { google_place_id: 'ChIJAd_ITu5HDW0RQvdx51NqxbU', name: '로얄세이브 마트(시티점)', name_ko: '로얄세이브 마트 시티점', city: 'auckland', lat: -36.8473427, lng: 174.76145929999998, address: '161 Hobson Street, Auckland CBD 1010 뉴질랜드', phone: '+64 9 336 1400', google_rating: 3.9 },
  { google_place_id: 'ChIJl5d86YFLDW0RGecMIikkLKU', name: 'Wang Korea Food Market Howick', name_ko: '왕코리아 푸드마켓 호윅 Wang Korea Food Market Howick', city: 'auckland', lat: -36.926553299999995, lng: 174.89749899999998, address: '312 Ti Rakau Drive, Burswood, Auckland 2013 뉴질랜드', phone: '+64 9 272 2266', google_rating: 4.3 },
  { google_place_id: 'ChIJi-bXt4FLDW0RZzOI3IjQJQk', name: 'H Mart Howick', name_ko: '한아름 호윅 H Mart Howick', city: 'auckland', lat: -36.927351300000005, lng: 174.8972714, address: '166c Harris Road, East Tāmaki, Auckland 2013 뉴질랜드', phone: '+64 9 274 8877', google_rating: 4.3 },
  { google_place_id: 'ChIJ14j270FADW0RoAw_jk2I9Lc', name: 'H MART HENDERSON 韓國食品超市', name_ko: '한아름 헨더슨 H MART HENDERSON', city: 'auckland', lat: -36.855323999999996, lng: 174.6315033, address: '42 Paramount Drive, Henderson, Auckland 0610 뉴질랜드', phone: '+64 9 880 2345', google_rating: 4.2 },
  { google_place_id: 'ChIJDe1Vl_dMDW0RU2cahfJDshs', name: 'Wang Korea Food Market Botany', name_ko: '왕코리아 푸드마켓 보타니 Wang Korea Food Market Botany', city: 'auckland', lat: -36.9618434, lng: 174.89979029999998, address: '7/14 Bishop Lenihan Place, East Tāmaki, Auckland 2013 뉴질랜드', phone: '+64 9 265 1122', google_rating: 4.3 },
  { google_place_id: 'ChIJBQ0gWXZIDW0R0Uwka-WAQ5Q', name: 'NJK Asian Supermarket 生活達人購物網', name_ko: 'NJK 아시안 슈퍼마켓 NJK Asian Supermarket', city: 'auckland', lat: -36.8683323, lng: 174.7766513, address: '3 Kent Street, Newmarket, Auckland 1023 뉴질랜드', phone: null, google_rating: 3.8 },
  { google_place_id: 'ChIJrZlPvJw5DW0RfJq5u2p1yWI', name: 'Queen Mart', name_ko: '퀸 마트 Queen Mart', city: 'auckland', lat: -36.763650999999996, lng: 174.7358199, address: '10/20 Link Drive, Glenfield, Auckland 0627 뉴질랜드', phone: '+64 9 444 8106', google_rating: 4.5 },
  { google_place_id: 'ChIJe8EbYIlHDW0RZYi3OTbX_1A', name: 'Furein Asian Supermarket', name_ko: '푸레인 아시안 슈퍼마켓 Furein Asian Supermarket', city: 'auckland', lat: -36.8501076, lng: 174.7646871, address: 'Basement, Unit 1A/239 Queen Street, CBD, Auckland 1011 뉴질랜드', phone: '+64 21 849 888', google_rating: 3.7 },
  { google_place_id: 'ChIJi6UB1LBBDW0Rri1E7ark85U', name: '거복식품', name_ko: '거복식품', city: 'auckland', lat: -36.884383799999995, lng: 174.6326752, address: '10 Cranwell Street, Henderson, Auckland 0612 뉴질랜드', phone: '+64 9 835 9884', google_rating: 4.3 },
  { google_place_id: 'ChIJP0EpbEQHNEcRpo1sqI6a3XQ', name: 'Asian Grocer', name_ko: '아시안 그로서 Asian Grocer', city: 'auckland', lat: -36.8535726, lng: 174.7582394, address: '235 Hobson Street, Auckland CBD 1010 뉴질랜드', phone: '+64 9 320 4023', google_rating: 4.9 },
  { google_place_id: 'ChIJJQ5A83VHDW0RWhIDlF1Q6kw', name: 'SKYMART SUPERMARKET - 24x7', name_ko: '스카이마트 슈퍼마켓 SKYMART SUPERMARKET', city: 'auckland', lat: -36.8484674, lng: 174.7639525, address: 'Cnr Victoria St West & Albert Street, Auckland CBD 1010 뉴질랜드', phone: '+64 9 217 9025', google_rating: 4.8 },
  { google_place_id: 'ChIJh1O3PABHDW0RdvHn9Od4JQQ', name: 'Auckland Supermarket', name_ko: '오클랜드 슈퍼마켓 Auckland Supermarket', city: 'auckland', lat: -36.8498841, lng: 174.7640458, address: '53 High Street, Auckland CBD 1010 뉴질랜드', phone: '+64 210 817 8112', google_rating: 4.2 },
  { google_place_id: 'ChIJxSrjeABHDW0Rnnqk71JUcOE', name: 'Ramyun Lab', name_ko: '라면 랩 Ramyun Lab', city: 'auckland', lat: -36.850017, lng: 174.76414459999998, address: '239 Queen Street, Auckland CBD 1010 뉴질랜드', phone: null, google_rating: 4.7 },
  { google_place_id: 'ChIJS7CNtuI7DW0R57Hce_MgfX8', name: 'Daily Chan', name_ko: '데일리 찬 Daily Chan', city: 'auckland', lat: -36.7403763, lng: 174.7165441, address: '2A/2 Tawa Drive, Albany, Auckland 0632 뉴질랜드', phone: '+64 20 4188 3302', google_rating: 5.0 },
  { google_place_id: 'ChIJk2gHp2o5DW0RcaLq-RdRJic', name: 'Kandy Grocer', name_ko: '캔디 그로서 Kandy Grocer', city: 'auckland', lat: -36.8011844, lng: 174.7463039, address: '26 Pearn Place, Northcote, Auckland 0627 뉴질랜드', phone: '+64 9 222 3775', google_rating: 4.7 },
  { google_place_id: 'ChIJO6JVve5HDW0R2yR79uiMcAc', name: 'Soung Yueen & Co Ltd', name_ko: '송윤 Soung Yueen & Co Ltd', city: 'auckland', lat: -36.8535726, lng: 174.7582394, address: '235 Hobson Street, Auckland CBD 1010 뉴질랜드', phone: '+64 9 373 4936', google_rating: 4.4 },
  { google_place_id: 'ChIJ3wSh6505DW0RheaUkx_Z3SM', name: 'Hi mart', name_ko: '하이마트 Hi mart', city: 'auckland', lat: -36.763650999999996, lng: 174.7358199, address: '2/48 Ellice Road, Wairau Valley, Auckland 0629 뉴질랜드', phone: '+64 9 444 9114', google_rating: 4.2 },
  { google_place_id: 'ChIJK9tN7O5HDW0RKMiH2oQAtJk', name: 'Wah Lee Co Ltd', name_ko: '와 리 Wah Lee Co Ltd', city: 'auckland', lat: -36.8473427, lng: 174.76145929999998, address: '214/220 Hobson Street, Auckland 1010 뉴질랜드', phone: '+64 9 373 4583', google_rating: 4.6 },
  { google_place_id: 'ChIJs3IvZgYVDW0R24mdfZ6IoHQ', name: 'Foodie Asian Supermarket 福地亚洲超市', name_ko: '푸디 아시안 슈퍼마켓 Foodie Asian Supermarket', city: 'auckland', lat: -36.811205199999996, lng: 174.6045304, address: '33/47 Northside Drive, Westgate, Auckland 0814 뉴질랜드', phone: null, google_rating: 4.3 },
  { google_place_id: 'ChIJ79cqML05DW0RfHEdd4dtuTA', name: 'Hesari Supermarket - Wairau Rd', name_ko: '헤사리 슈퍼마켓 Hesari Supermarket Wairau Rd', city: 'auckland', lat: -36.763650999999996, lng: 174.7358199, address: '15/170 Wairau Road, Wairau Valley, Auckland 0627 뉴질랜드', phone: '+64 9 440 9301', google_rating: 4.5 },
  { google_place_id: 'ChIJ3ZwLHro7DW0RpxLegrP3zvk', name: 'Zenesco', name_ko: '제네스코 Zenesco', city: 'auckland', lat: -36.763819, lng: 174.7364283, address: '7B/89 Ellice Road, Wairau Valley, Auckland 0629 뉴질랜드', phone: '+64 21 613 320', google_rating: 5.0 },
  { google_place_id: 'ChIJiTX0ZW9JDW0RDi5C2A_bBBM', name: "Martha's Backyard", name_ko: "마사스 백야드 Martha's Backyard", city: 'auckland', lat: -36.899261599999996, lng: 174.85387509999998, address: '44 Mount Wellington Highway, Mount Wellington, Auckland 1060 뉴질랜드', phone: '+64 9 570 7976', google_rating: 4.4 },
  { google_place_id: 'ChIJXQZtcNSscm0R0oyW9WM9B1I', name: 'Saveway Asian Supermarket', name_ko: '세이브웨이 아시안 슈퍼마켓 Saveway Asian Supermarket', city: 'auckland', lat: -37.062208999999996, lng: 174.94281229999999, address: '303 Great South Road, Papakura, Auckland 2110 뉴질랜드', phone: '+64 9 299 9511', google_rating: 4.3 },
  { google_place_id: 'ChIJKzmU6sRHDW0Rrbl0_nWD1_s', name: 'Oriental Grocery (BOK MART)', name_ko: '오리엔탈 그로서리 복마트 Oriental Grocery BOK MART', city: 'auckland', lat: -36.8673377, lng: 174.76138709999998, address: '75 Mount Eden Road, Grafton, Auckland 1023 뉴질랜드', phone: '+64 9 357 0988', google_rating: 5.0 },
  { google_place_id: 'ChIJzT0y_LdHDW0RNT-Dux36W14', name: 'Silver Bell Market', name_ko: '실버 벨 마켓 Silver Bell Market', city: 'auckland', lat: -36.8673377, lng: 174.76138709999998, address: '83 Dominion Road, Mount Eden, Auckland 1024 뉴질랜드', phone: '+64 9 630 2900', google_rating: 4.0 },
  { google_place_id: 'ChIJv33OXlk7DW0ReT7AboSrS48', name: 'Living Korea', name_ko: '리빙 코리아 Living Korea', city: 'auckland', lat: -36.7403763, lng: 174.7165441, address: '2a Munroe Lane, Albany, Auckland 0632 뉴질랜드', phone: null, google_rating: 4.2 },
  { google_place_id: 'ChIJxdq8gelHDW0RTtlDovkQsgs', name: 'K Road Mart', name_ko: 'K 로드 마트 K Road Mart', city: 'auckland', lat: -36.8578067, lng: 174.7586106, address: '292 Karangahape Road, Auckland CBD 1010 뉴질랜드', phone: '+64 9 377 6588', google_rating: 4.1 },
  { google_place_id: 'ChIJ502cp3JGDW0RK12_plWnGH8', name: 'Mount Roskill Fresh Supermarket', name_ko: '마운트 로스킬 프레시 슈퍼마켓 Mount Roskill Fresh Supermarket', city: 'auckland', lat: -36.904680899999995, lng: 174.74227499999998, address: '3/32 Carr Road, Three Kings, Auckland 1042 뉴질랜드', phone: '+64 9 215 7826', google_rating: 3.8 },
  { google_place_id: 'ChIJEzF9IjdHDW0RTZfyqwIq8FU', name: 'FIFO Supermarket', name_ko: '피포 슈퍼마켓 FIFO Supermarket', city: 'auckland', lat: -36.8820433, lng: 174.76191419999998, address: '4 Rocklands Avenue, Mount Eden, Auckland 1024 뉴질랜드', phone: '+64 22 510 7824', google_rating: 4.8 },
  { google_place_id: 'ChIJ7Tesfwk5DW0RBXJG19j6Jz0', name: 'Japan Mart Milford', name_ko: '재팬 마트 밀퍼드 Japan Mart Milford', city: 'auckland', lat: -36.7729754, lng: 174.7628235, address: '218 Kitchener Road, Milford, Auckland 0620 뉴질랜드', phone: '+64 9 486 1102', google_rating: 4.7 },
  { google_place_id: 'ChIJobmxGydHDW0RPoQ4pfKcTYY', name: 'Rice Spice Dice NZ', name_ko: '라이스 스파이스 다이스 Rice Spice Dice NZ', city: 'auckland', lat: -36.8473427, lng: 174.76145929999998, address: '205 Hobson Street, Auckland CBD 1010 뉴질랜드', phone: '+64 27 678 9010', google_rating: 4.7 },
  { google_place_id: 'ChIJbRy_HW87DW0Rr6a092OQyRM', name: '이마트 프리미엄 아울렛', name_ko: '이마트 프리미엄 아울렛', city: 'auckland', lat: -36.7312728, lng: 174.72097789999998, address: 'Shop 16/100 Don McKinnon Drive, Albany, Auckland 0632 뉴질랜드', phone: '+64 21 826 621', google_rating: 4.4 },
  { google_place_id: 'ChIJSTSt2uRHDW0Rx81dy5x_toQ', name: "Kim's Mart", name_ko: "킴스 마트 Kim's Mart", city: 'auckland', lat: -36.8455949, lng: 174.7675415, address: '2 Kitchener Street, Auckland CBD 1010 뉴질랜드', phone: '+64 9 377 0077', google_rating: 5.0 },
  { google_place_id: 'ChIJK9NVPqdIDW0RApiv8_eIgk4', name: 'Lampire Asian Mart', name_ko: '램파이어 아시안 마트 Lampire Asian Mart', city: 'auckland', lat: -36.8993342, lng: 174.7729425, address: '691 Manukau Road, Royal Oak, Auckland 1023 뉴질랜드', phone: '+64 9 625 2863', google_rating: 4.3 },
  { google_place_id: 'ChIJ3_BlzUVJDW0RWM0kATfzevc', name: '재펜 마트 실비아 파크', name_ko: '재팬 마트 실비아파크', city: 'auckland', lat: -36.9171882, lng: 174.8422382, address: 'Shop 79 Sylvia Park Shopping Centre, Auckland 1060 뉴질랜드', phone: '+64 9 573 0067', google_rating: 4.4 },
  { google_place_id: 'ChIJu2xep2NJDW0RE6_K4o2V6QE', name: 'Spiceland', name_ko: '스파이스랜드 Spiceland', city: 'auckland', lat: -36.8987986, lng: 174.8517714, address: '50/52 Queens Road, Panmure, Auckland 1072 뉴질랜드', phone: '+64 22 698 8018', google_rating: 4.4 },
  { google_place_id: 'ChIJl379r_dJDW0Rr88IEpmmXPY', name: 'TxgMall Asian supermarket 中纽易购超市', name_ko: 'TXG몰 아시안 슈퍼마켓 TxgMall Asian supermarket', city: 'auckland', lat: -36.9217677, lng: 174.79958249999999, address: '104 Princes Street, Onehunga, Auckland 1061 뉴질랜드', phone: '+64 9 948 3510', google_rating: 4.9 },
  { google_place_id: 'ChIJVxruiK1IDW0R1IEutBvUcpo', name: 'Ings Asian Food Mart', name_ko: '잉스 아시안 푸드마트 Ings Asian Food Mart', city: 'auckland', lat: -36.9217677, lng: 174.79958249999999, address: '3/14 Waiapu Lane, Onehunga, Auckland 1061 뉴질랜드', phone: '+64 9 636 0980', google_rating: 4.4 },
  { google_place_id: 'ChIJ9WAQ0kNADW0RqA-Pyf43vwY', name: 'Golden Apple Supermarket', name_ko: '골든 애플 슈퍼마켓 Golden Apple Supermarket', city: 'auckland', lat: -36.8572203, lng: 174.6327026, address: '193 Universal Drive, Henderson, Auckland 0610 뉴질랜드', phone: '+64 9 835 0432', google_rating: 4.4 },
  { google_place_id: 'ChIJ1cwH5bNBDW0RcVh3-GWkTDI', name: 'Japan Mart Henderson', name_ko: '재팬 마트 헨더슨 Japan Mart Henderson', city: 'auckland', lat: -36.8633228, lng: 174.62941709999998, address: 'Shop 133 WestCity, 7 Catherine Street, Henderson, Auckland 0612 뉴질랜드', phone: '+64 9 835 1442', google_rating: 4.3 },
  { google_place_id: 'ChIJC1j7R7FBDW0RMq7QIgd3an0', name: 'Tofu Shop', name_ko: '두부 가게 Tofu Shop', city: 'auckland', lat: -36.8843792, lng: 174.63253, address: 'D/Pioneer Street, Henderson, Auckland 0612 뉴질랜드', phone: '+64 9 836 0616', google_rating: 4.5 },
  { google_place_id: 'ChIJwTeA4zI5DW0R7AULhqE8qBU', name: 'SIJANG K-Bakery', name_ko: '시장 K-베이커리 SIJANG K-Bakery', city: 'auckland', lat: -36.7597526, lng: 174.7399699, address: '98 Sycamore Drive, Sunnynook, Auckland 0620 뉴질랜드', phone: '+64 20 484 7637', google_rating: 5.0 },
  { google_place_id: 'ChIJ9WFpvRQ7DW0Rmnfb3Y4vrow', name: 'Sunshine Mart 阳光超市', name_ko: '선샤인 마트 Sunshine Mart', city: 'auckland', lat: -36.7460978, lng: 174.6936092, address: '343 Albany Highway, Rosedale, Auckland 0632 뉴질랜드', phone: null, google_rating: 4.4 },
  { google_place_id: 'ChIJffd9HAA7DW0RCQsgGAPaJ8g', name: 'Barrio', name_ko: '바리오 Barrio', city: 'auckland', lat: -36.743394599999995, lng: 174.69672430000003, address: '4/44 William Pickering Drive, Rosedale, Auckland 0632 뉴질랜드', phone: '+64 9 930 4231', google_rating: 5.0 },
  { google_place_id: 'ChIJkwzs1rBBDW0RMH1Pfj8kdKQ', name: 'Wang Mart', name_ko: '왕마트 Wang Mart', city: 'auckland', lat: -36.8843792, lng: 174.63253, address: '33 Catherine Street, Henderson, Auckland 0612 뉴질랜드', phone: null, google_rating: 4.4 },
];

async function main() {
  console.log('총 ' + data.length + '개 INSERT 시작...');
  let success = 0;
  let skip = 0;
  for (const item of data) {
    const { error } = await supabase.from('businesses').insert({
      ...item,
      category: '마트/슈퍼',
      pending_approval: true,
      is_verified: false,
      is_korean_run: false,
      registration_type: 'script',
    });
    if (error) {
      if (error.code === '23505') {
        console.log('중복 스킵: ' + item.name);
        skip++;
      } else {
        console.log('에러 (' + item.name + '): ' + error.message);
      }
    } else {
      console.log('완료: ' + item.name_ko);
      success++;
    }
  }
  console.log('\n완료! 성공: ' + success + '개 / 중복스킵: ' + skip + '개');
}

main().catch(console.error);