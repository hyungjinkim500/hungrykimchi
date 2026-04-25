import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  // ===== 경찰 =====
  { google_place_id: 'ChIJRZ7kJ88NNTERCePMYEj8Kas', name: 'Công An Thành Phố Bắc Ninh', name_ko: '박닌 시 경찰청', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '90 Đ. Ngô Gia Tự, Kinh Bắc, Bắc Ninh', phone: '+84 222 3821 268', lat: 21.189374, lng: 106.074311, city: 'bacninh', google_rating: 4.1, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJRZmv5gQMNTERvdjNSVV_WmA', name: 'Bắc Ninh Provincial Police', name_ko: '박닌 성 경찰청', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '14 Đ. Lý Thái Tổ, Kinh Bắc, Bắc Ninh', phone: '+84 222 3811 102', lat: 21.181233, lng: 106.0725877, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJYVPc8_8JNTERLeqROHHW9as', name: 'Trung tâm Cảnh sát - Công an tỉnh Bắc Ninh', name_ko: '박닌 성 경찰 센터', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '3, 50 Võ Cường, Bắc Ninh', phone: '+84 948 115 627', lat: 21.1652135, lng: 106.0564766, city: 'bacninh', google_rating: 4.5, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJIUQ0ZKwONTERafUchCdeyuI', name: 'Công An Tỉnh Bắc Ninh', name_ko: '박닌 성 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '53G4+FW6, Kinh Bắc, Bắc Ninh', phone: null, lat: 21.1761645, lng: 106.0572654, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJVVVVVVAJNTERs6WiaTTinek', name: 'Bac Ninh Province Traffic Police Department', name_ko: '박닌 성 교통경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '134 Đ. Võ Cường 123, Võ Cường, Bắc Ninh', phone: '+84 222 3822 405', lat: 21.166431, lng: 106.0457371, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ7WhY4Q8MNTERWCCbfgvKfTY', name: 'Kinh Bac Ward Police Department', name_ko: '킨박 구역 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '89 Đ. Cao Lỗ Vương, Kinh Bắc, Bắc Ninh', phone: '+84 222 3811 102', lat: 21.1820219, lng: 106.0708621, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJi4TOb6kONTER3lJTWAXJFsQ', name: 'Công An Phường Tiền Ninh Vệ', name_ko: '띠엔닌베 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '429 Ng. Gia Tự, Kinh Bắc, Bắc Ninh', phone: null, lat: 21.1817073, lng: 106.0680219, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJAQAAQKoONTERqljWUe1Y8Gk', name: 'Công An Phường Ninh Xá', name_ko: '닌사 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '673 Ng. Gia Tự, Kinh Bắc, Bắc Ninh', phone: '+84 222 3821 269', lat: 21.1788954, lng: 106.0599914, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ6x1PX00JNTERo-opmjTmt3E', name: 'Công An Phường Võ Cường', name_ko: '보쿠엉 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '212 Nguyễn Văn Cừ, Võ Cường, Bắc Ninh', phone: '+84 222 3896 999', lat: 21.1721145, lng: 106.0522769, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJg5o0QRcMNTERzymAtY2xDMg', name: 'Công An Phường Vũ Ninh', name_ko: '부닌 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '53QG+QRF, Vũ Ninh, Bắc Ninh', phone: '+84 222 3870 469', lat: 21.1894358, lng: 106.0770579, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJzULmb6cONTERD17TTlWOgX4', name: 'Công An Phường Kinh Bắc', name_ko: '킨박 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '53Q7+477, Kinh Bắc, Bắc Ninh', phone: '+84 866 119 002', lat: 21.1877775, lng: 106.0631734, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJTaKLAb0ONTERFjdQeqKxdKs', name: 'Công An Phường Vạn An', name_ko: '반안 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '52VX+MV9, Kinh Bắc, Bắc Ninh', phone: null, lat: 21.1941545, lng: 106.0497430, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ_wne_D0MNTERNwYqYoRtmHM', name: 'Công An Phường Thị Cầu', name_ko: '티꺼우 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '53VJ+QF9, Vũ Ninh, Bắc Ninh', phone: '+84 222 3821 255', lat: 21.1944193, lng: 106.0812301, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJzULmb6cONTERD17TTlWOgX4', name: 'Công An Phường Kinh Bắc', name_ko: '킨박 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '53Q7+477, Kinh Bắc, Bắc Ninh', phone: '+84 866 119 002', lat: 21.1877775, lng: 106.0631734, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJMXY__dELNTER_0Svs-CKd0g', name: 'Công an phường Hạp Lĩnh', name_ko: '합린 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '43JG+G7G, Hap Linh, Bắc Ninh', phone: '+84 865 424 479', lat: 21.1313151, lng: 106.0757097, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJAQAAQEYMNTERZczFVyV1hNo', name: 'Công An Phường Đáp Cầu', name_ko: '답꺼우 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '532 Hoàng Quốc Việt, Vũ Ninh, Bắc Ninh', phone: null, lat: 21.2015505, lng: 106.0956813, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJTZvj_OcHNTERito0-kIhj6g', name: 'Tu Son city police', name_ko: '뚜선 시 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '15 Đường Lý Thái Tổ, Từ Sơn, Bắc Ninh', phone: '+84 222 3831 205', lat: 21.1125739, lng: 105.9586984, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJvzRHWukFNTER_f9vrcgxgzQ', name: 'Police of Yên Phong District', name_ko: '옌퐁 군 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '6 Nguyễn Bỉnh Khiêm, TT. Chờ, Yên Phong, Bắc Ninh', phone: '+84 222 3860 204', lat: 21.1997695, lng: 105.9489167, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJq6qqqh4JNTER4DVDgkrDkYw', name: 'Công an huyện Tiên Du', name_ko: '띠엔주 현 경찰서', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '42QC+MPX, Lim, Tien Du, Bắc Ninh', phone: '+84 222 3837 524', lat: 21.1392389, lng: 106.0218556, city: 'bacninh', google_rating: 2.8, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJG2lIKzsPNTERfZAb4ZK_g7s', name: 'Đồn Công An Khu Công Nghiệp Yên Phong', name_ko: '옌퐁 공단 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '52V4+872, Long Châu, Tam Đa, Bắc Ninh', phone: null, lat: 21.1932591, lng: 106.0056496, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJMxcJTHgINTERklj_czQAuFI', name: 'Công An Phường Đồng Nguyên', name_ko: '동응우옌 파출소', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '4XFF+H73, Dong Nguyen, Bắc Ninh', phone: null, lat: 21.123889, lng: 105.9731605, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJUQtmjOQLNTER1wrJBYkpLJg', name: 'Công An Tỉnh Bắc Ninh cơ sở 2', name_ko: '박닌 성 경찰서 2호', category: '관공·긴급', subcategory: null, primary_type_ko: '경찰서', address: '535C+2FJ, Hạp Lĩnh, Bắc Ninh', phone: null, lat: 21.1575941, lng: 106.0711419, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  // ===== 소방 =====
  { google_place_id: 'ChIJ-Y9BaQkMNTERAoEO_6WsO_c', name: 'Phòng Cảnh Sát Phòng Cháy Và Chữa Cháy Công An Tỉnh Bắc Ninh', name_ko: '박닌 성 소방서', category: '관공·긴급', subcategory: null, primary_type_ko: '소방서', address: 'Km2 Trần Hưng Đạo, Võ Cường, Bắc Ninh', phone: '+84 222 3822 555', lat: 21.174783, lng: 106.0806230, city: 'bacninh', google_rating: 4.2, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJo5BCaQkMNTER8gzNTiTeOBc', name: 'CA Phòng cháy chữa cháy', name_ko: '박닌 소방대', category: '관공·긴급', subcategory: null, primary_type_ko: '소방서', address: '53FJ+W5Q, Trần Hưng Đạo, Võ Cường, Bắc Ninh', phone: null, lat: 21.1748377, lng: 106.0804873, city: 'bacninh', google_rating: 4.4, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJhXLZXVsINTERHp4c6QS_3p8', name: 'Đội Cảnh Sát Pccc Kcn Tiên Sơn', name_ko: '띠엔선 공단 소방대', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '4XCX+QWJ, Đại Đồng, Bắc Ninh', phone: '+84 222 3734 755', lat: 21.1219548, lng: 105.9997523, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ9_V8fQALNTERI6h3snnMGz4', name: 'Phòng Cảnh sát PCCC và CNCH', name_ko: '박닌 소방구조대 합린', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '43JM+JQQ, Hap Linh, Bắc Ninh', phone: '+84 222 3821 832', lat: 21.1315962, lng: 106.0844865, city: 'bacninh', google_rating: 4.8, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJWSVDKiUPNTERPf3svHkeQZQ', name: 'Phòng Cảnh Sát PC&CC số 3 Bắc Ninh', name_ko: '박닌 소방서 3호', category: '관공·긴급', subcategory: null, primary_type_ko: '소방서', address: '52R4+W5X, Tam Đa, Bắc Ninh', phone: '+84 222 3699 508', lat: 21.1923746, lng: 106.0054761, city: 'bacninh', google_rating: 3.0, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJKVXX22UNNTERJH5Rx3jcUok', name: 'Phòng Cảnh Sát Pccc', name_ko: '딘짬 공단 소방대', category: '관공·긴급', subcategory: null, primary_type_ko: '서비스', address: 'Khu Công Nghiệp Đình Trám, Nếnh, Bắc Ninh', phone: null, lat: 21.2490872, lng: 106.1282998, city: 'bacninh', google_rating: 5.0, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJNecOJHYPNTERalR1IkIV-VI', name: 'Trạm cứu hỏa công ty SamSung Electronics Việt Nam', name_ko: '삼성전자 베트남 소방대', category: '관공·긴급', subcategory: null, primary_type_ko: '소방서', address: '5XXQ+PFR, Yên Phong, Bắc Ninh', phone: '+84 222 3696 114', lat: 21.1993517, lng: 105.9886359, city: 'bacninh', google_rating: 5.0, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJQy6Lg44NNTERH-HSbdf2ESg', name: 'Đội Cảnh Sát PCCC&CNCH KCN Đình Trám', name_ko: '딘짬 공단 소방구조대', category: '관공·긴급', subcategory: null, primary_type_ko: '서비스', address: '64XH+M6, Nếnh, Bắc Ninh', phone: null, lat: 21.248148, lng: 106.128065, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  // ===== 출입국 =====
  { google_place_id: 'ChIJZ4jI3v0NNTERTnamtGG6s9Y', name: '박닌출입국관리국', name_ko: '박닌 출입국관리국', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '84 108 Đ. Cao Lỗ Vương, Kinh Bắc, Bắc Ninh', phone: null, lat: 21.181032, lng: 106.0721318, city: 'bacninh', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJvc4UXgANNTERkxJw0nEqZLE', name: 'Phòng Quản lý Xuất nhập cảnh tỉnh Bắc Ninh', name_ko: '박닌 성 출입국관리소', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '108 Đ. Cao Lỗ Vương, Kinh Bắc, Bắc Ninh', phone: '+84 69 260 93 39', lat: 21.1809373, lng: 106.0721753, city: 'bacninh', google_rating: 1.9, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  // ===== 세관 =====
  { google_place_id: 'ChIJ1ebQRAQMNTERrc1rNaLgvdU', name: 'Hải quan Bắc Ninh', name_ko: '박닌 세관', category: '관공·긴급', subcategory: null, primary_type_ko: '세관', address: '18 Đ. Lý Thái Tổ, Kinh Bắc, Bắc Ninh', phone: '+84 222 3875 500', lat: 21.179493, lng: 106.0718901, city: 'bacninh', google_rating: 4.5, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJlc_z12MINTERx4WM2AV5VLo', name: 'Tiên Sơn Customs', name_ko: '띠엔선 세관', category: '관공·긴급', subcategory: null, primary_type_ko: '관공서', address: '4XHP+VV4, Đồng Nguyên, Bắc Ninh', phone: '+84 222 3734 959', lat: 21.1296346, lng: 105.9872044, city: 'bacninh', google_rating: 4.5, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  { google_place_id: 'ChIJ_3YWb02rNTERvTCLcxn9cBQ', name: '하노이 한국 영사관', name_ko: '주베트남 대한민국 대사관 (하노이)', category: '관공·긴급', subcategory: null, primary_type_ko: '대사관', address: 'Lô SQ4 Khu Ngoại Giao Đoàn, Xuân Đỉnh, Hà Nội', phone: '+84 24 3771 0404', lat: 21.0671186, lng: 105.7964066, city: 'bacninh', google_rating: 3.6, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
];

async function main() {
  const { data: existingData } = await supabase
    .from('businesses')
    .select('google_place_id')
    .limit(10000);

  const { data: deletedData } = await supabase
    .from('deleted_places')
    .select('google_place_id')
    .limit(10000);

  const existingIds = new Set((existingData || []).map((r) => r.google_place_id));
  const deletedIds = new Set((deletedData || []).map((r) => r.google_place_id));

  const toInsert = DATA.filter(
    (d) => !existingIds.has(d.google_place_id) && !deletedIds.has(d.google_place_id)
  );

  console.log('전체 ' + DATA.length + '개 중 ' + toInsert.length + '개 삽입 예정');

  let success = 0;
  let skip = 0;

  for (const item of toInsert) {
    const { error } = await supabase.from('businesses').insert([item]);
    if (error) {
      console.error('❌ ' + item.name + ': ' + error.message);
      skip++;
    } else {
      console.log('✅ ' + item.name);
      success++;
    }
  }

  console.log('완료: 성공 ' + success + '개, 실패/스킵 ' + skip + '개');
}

main().catch(console.error);