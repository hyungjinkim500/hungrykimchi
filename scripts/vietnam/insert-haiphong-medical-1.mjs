import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://altdvxekugatmewftlus.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA = [
  // ===== 종합/국제병원 =====
  { google_place_id: 'ChIJky9DEiV7SjERlPopRJc-9A8', name: 'HTM Clinic (High-Tech Medical Clinic)', name_ko: 'HTM 클리닉 하이테크', category: '의료', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: '20 QL5, Nam Sơn, An Dương, Hải Phòng', phone: '+84 225 3985 555', lat: 20.8574, lng: 106.6990, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJZXowo756SjERpzv99EFVJp0', name: 'Phòng khám nhi khoa quốc tế The Medcare Hải Phòng', name_ko: '메드케어 국제 소아과 하이퐁', category: '의료', subcategory: '종합/국제병원', primary_type_ko: '종합병원', address: 'Tầng 3+4, Lô 22A Đ. Lê Hồng Phong, Hải Phòng', phone: '+84 225 3246 357', lat: 20.8490, lng: 106.7070, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJETNKyCKbNTERdn57X0JPNfc', name: 'Phòng Khám Chuyên Khoa Trĩ - MAR CHN KOREA', name_ko: 'MAR CHN 코리아 항문외과 클리닉', category: '의료', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: '81 Phạm Xuân Huân, Hải Phòng', phone: '+84 865 129 232', lat: 20.9270, lng: 106.3340, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: true, registration_type: 'script' },
  { google_place_id: 'ChIJNy1gpm53SjER9C6tUWuTmDo', name: 'Phòng khám đa khoa Quốc tế Quang Thanh', name_ko: '꽝타잉 국제 종합 클리닉', category: '의료', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: 'QL10, Quốc Tuấn, An Quang, Hải Phòng', phone: '+84 225 3922 666', lat: 20.8700, lng: 106.6200, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ372bTwB3SjERjoRs6Iy5pns', name: 'Phòng Khám Đa Khoa Medical Hải Phòng', name_ko: '메디컬 종합 클리닉 하이퐁', category: '의료', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: 'ĐT351, Hoà Bình, An Hải, Hải Phòng', phone: '+84 225 3668 881', lat: 20.8450, lng: 106.7500, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJuXJ80dd7SjERDomJWd5fu_g', name: 'Phòng khám Đa Khoa Công Nghệ Quốc Tế Thượng Lý', name_ko: '트엉리 국제기술 종합 클리닉', category: '의료', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: '52 Hà Nội - Hải Phòng, Hồng Bàng, Hải Phòng', phone: '+84 225 6258 999', lat: 20.8633, lng: 106.6541, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJV3E9heFxSjER9Av7FyYZzfQ', name: 'Phòng khám đa khoa MedHomes', name_ko: '메드홈즈 종합 클리닉', category: '의료', subcategory: '종합/국제병원', primary_type_ko: '건강', address: '555 Ngô Gia Tự, Hải Phòng', phone: '+84 1900 599845', lat: 20.8291, lng: 106.7122, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJod-7b6x7SjERBIlj1zrwh7U', name: 'Phòng Khám Đa Khoa Kỳ Đồng', name_ko: '끼동 종합 클리닉', category: '의료', subcategory: '종합/국제병원', primary_type_ko: '종합병원', address: 'RMV9+HQX, An Bien, Hai Phong', phone: '+84 1900 599998', lat: 20.8320, lng: 106.6830, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ82WVxt7p7SjER2IH0knN5xu4', name: 'Phòng khám Da liễu Dr An', name_ko: '닥터 안 피부과 클리닉', category: '의료', subcategory: '피부과', primary_type_ko: '종합병원', address: '900A Tôn Đức Thắng, Hồng Bàng, Hải Phòng', phone: '+84 366 090 115', lat: 20.8631, lng: 106.6501, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  // ===== 치과 =====
  { google_place_id: 'ChIJ9WM4sp56SjEROk0khMlaZ2I', name: '치과', name_ko: '치과 응우옌빈', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '143 Nguyễn Bình, Hải Phòng', phone: '+84 982 888 685', lat: 20.8400, lng: 106.6983, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJvazwa3VxSjERgC9lQyyp-mU', name: 'NHA KHOA TƯƠNG LAI - MIRAI DENTAL', name_ko: '미래 치과 MIRAI DENTAL', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '432 Lạch Tray, Hải Phòng', phone: '+84 834 442 288', lat: 20.8332, lng: 106.6979, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJA5yh15h6SjER2ACV4m6TGy4', name: 'Nha Khoa DDC Dental Hải Phòng', name_ko: 'DDC 치과 하이퐁', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '7 Ngõ 213 Lạch Tray, Hải Phòng', phone: '+84 948 004 004', lat: 20.8420, lng: 106.6930, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJr_7WH_V6SjERfLQzzzwxTh0', name: 'PHOCO LUXURY DENTAL', name_ko: '포코 럭셔리 치과', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '55 P Chu Văn An, Hải Phòng', phone: '+84 937 495 111', lat: 20.8591, lng: 106.6934, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJtULcM2F7SjERiiFYsWu44ZI', name: 'Nha Khoa Nụ Cười Hải Phòng Cơ Sở 3', name_ko: '누꼬이 치과 3호점', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: 'Vinhomes Imperia, Hồng Bàng, Hải Phòng', phone: '+84 868 675 899', lat: 20.8641, lng: 106.6624, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJN6GiAIx6SjERqhYI0B5zby0', name: 'Nha Khoa Hoàn Mỹ - Hải Phòng', name_ko: '호안미 치과 하이퐁', category: '의료', subcategory: '치과', primary_type_ko: '치과의사', address: '118 P. Tô Hiệu, Hải Phòng', phone: '+84 919 067 055', lat: 20.8512, lng: 106.6799, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJL-p4Kud7SjERsYNTrmVjde4', name: 'Nha khoa Hoàn Mỹ - Yenle Dental 213 Hàng Kênh', name_ko: '호안미 옌레 치과 항껜점', category: '의료', subcategory: '치과', primary_type_ko: '치과의사', address: '213 Hàng Kênh, Hải Phòng', phone: '+84 867 010 982', lat: 20.8470, lng: 106.6857, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJPxJiOSV7SjERkTGRTNQZofw', name: 'Nha khoa Quốc tế SEOUL', name_ko: '서울 국제 치과', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '165 P. Hoàng Minh Thảo, Hải Phòng', phone: '+84 973 949 108', lat: 20.8450, lng: 106.6720, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ3VELamN6SjER3YmziSNM4rQ', name: 'Trung Tâm Nha Khoa Quốc Tế', name_ko: '국제 치과 센터', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '170 P. Trần Nguyên Hãn, Hải Phòng', phone: '+84 225 3789 555', lat: 20.8450, lng: 106.6740, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJRzokzSRxSjERjEbb7nqX6eg', name: 'Nha Khoa Dr Green Premium', name_ko: '닥터 그린 프리미엄 치과', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '40b Lạch Tray, Hải Phòng', phone: '+84 936 609 996', lat: 20.8473, lng: 106.6904, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJFx3GYY56SjERdXhD5xIXl14', name: 'Nha Khoa Quân Đội', name_ko: '군 치과', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '109 P. Hàng Kênh, Hải Phòng', phone: '+84 989 059 771', lat: 20.8470, lng: 106.6858, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJGTF89p56SjERnsrUNHaeCg0', name: 'Phòng Khám Răng Hàm Mặt - Bs Quốc Thọ', name_ko: '꾸옥토 치과', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '16 P. Hào Khê, Hải Phòng', phone: '+84 225 3738 917', lat: 20.8380, lng: 106.6954, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJjxRIdH1xSjERENKUv2ANnsI', name: 'Nha khoa Dumi Hải Phòng', name_ko: '두미 치과 하이퐁', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '135 Đa Phúc, Hưng Đạo, Hải Phòng', phone: '+84 878 814 555', lat: 20.8791, lng: 106.6830, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJRYERVI57SjERsF7b86JIxjM', name: 'Bác sĩ Hiệp Nha Khoa Hina', name_ko: '히나 치과 투이응우옌', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '151 Bạch Đằng, Thủy Nguyên, Hải Phòng', phone: '+84 901 802 888', lat: 20.9163, lng: 106.6710, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJDR4HpGF3SjERz8uihNhU_Nk', name: 'NHA KHOA SEOUL', name_ko: '서울 치과 끼엔안', category: '의료', subcategory: '치과', primary_type_ko: '진료소', address: '88 Trần Tất Văn, Hải Phòng', phone: '+84 332 779 919', lat: 20.8121, lng: 106.6273, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJm7GDkoB3SjERloT1Qnt8DqA', name: 'Nha khoa YenLe Dental Kiến An', name_ko: '옌레 치과 끼엔안', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '70 Nguyễn Lương Bằng, Hải Phòng', phone: '+84 919 067 055', lat: 20.8008, lng: 106.6273, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJUZadSQp5SjERKuA_B2aHZWE', name: 'Nha Khoa Lê Hướng Lan Anh', name_ko: '레흐엉란아잉 치과', category: '의료', subcategory: '치과', primary_type_ko: '치과의사', address: '178 Đ. Hùng Vương, Hải Phòng', phone: '+84 912 050 231', lat: 20.8931, lng: 106.6051, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJLe9d4IarNTERs6RM_cvWLrA', name: 'International Dental Clinic', name_ko: '국제 치과 클리닉', category: '의료', subcategory: '치과', primary_type_ko: '치과 진료소', address: '476 Trần Phú, Nam Sách, Hải Phòng', phone: '+84 707 115 999', lat: 20.9114, lng: 106.3233, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  // ===== 피부과 =====
  { google_place_id: 'ChIJjQAgtHx6SjER_Rf60BFpJyE', name: 'Phòng khám Da liễu Hải Phòng - Bác sĩ Lê Thị Thu Hằng', name_ko: '레티투항 피부과 클리닉', category: '의료', subcategory: '피부과', primary_type_ko: '의사', address: '127 P. Trần Nguyên Hãn, Hải Phòng', phone: '+84 912 349 244', lat: 20.8450, lng: 106.6740, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJd7O8-2F6SjER_7Og-bYEyPw', name: 'Phòng khám Da Liễu - BS Doãn Thị Mùi', name_ko: '도안티무이 피부과', category: '의료', subcategory: '피부과', primary_type_ko: '의사', address: '230 P. Hai Bà Trưng, Hải Phòng', phone: '+84 903 414 355', lat: 20.8527, lng: 106.6794, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  // ===== 안과 =====
  { google_place_id: 'ChIJ0TILo3x6SjERUvfLykbSQqE', name: 'Phòng Khám Chuyên Khoa Mắt', name_ko: '안과 전문 클리닉', category: '의료', subcategory: '안과', primary_type_ko: '진료소', address: '233N P. Trần Nguyên Hãn, Hải Phòng', phone: null, lat: 20.8450, lng: 106.6740, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJlQCp_QV7SjER-sjDRDt9yLQ', name: 'Phòng khám Mắt Bác sĩ Nghĩa', name_ko: '박시응이아 안과', category: '의료', subcategory: '안과', primary_type_ko: '의사', address: '345 P. Lán Bè, Hải Phòng', phone: null, lat: 20.8495, lng: 106.6646, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },

  // ===== 기타 =====
  { google_place_id: 'ChIJ9Spoy_Z6SjER55fDbGKdDkA', name: 'Trung Tâm Kiểm Dịch Y Tế Quốc Tế', name_ko: '국제 검역 의료 센터', category: '의료', subcategory: '기타', primary_type_ko: '진료소', address: '2 P.Thất Khê, Hồng Bàng, Hải Phòng', phone: '+84 225 3821 067', lat: 20.8609, lng: 106.6824, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJiWYOL-x6SjERy0v_eICL8wE', name: 'Phòng khám Sản Phụ Khoa bs Thăng', name_ko: '탕 산부인과 클리닉', category: '의료', subcategory: '기타', primary_type_ko: '진료소', address: '14D P.Điện Biên Phủ, Hải Phòng', phone: '+84 903 277 206', lat: 20.8616, lng: 106.6897, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ42D9hB6SjERApNIZsGo3s0', name: 'BV YHCT Hải Phòng', name_ko: '하이퐁 한의원 병원', category: '의료', subcategory: '한의원', primary_type_ko: '종합병원', address: 'An Đồng, An Hai, Hai Phong', phone: null, lat: 20.8600, lng: 106.5750, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
  { google_place_id: 'ChIJ-wRvIAZ5SjERC3S43S2eHiU', name: 'Phòng Khám Đa Khoa Nguyễn Bỉnh Khiêm', name_ko: '응우옌빈끼엠 종합 클리닉', category: '의료', subcategory: '종합/국제병원', primary_type_ko: '진료소', address: 'VHVV+2VW, QL5, Tân Tiến, Hải Phòng', phone: '+84 225 2222 667', lat: 20.8930, lng: 106.6060, city: 'haiphong', google_rating: null, pending_approval: false, is_verified: false, is_korean_run: false, registration_type: 'script' },
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

  console.log(`전체 ${DATA.length}개 중 ${toInsert.length}개 삽입 예정`);

  let success = 0;
  let skip = 0;

  for (const item of toInsert) {
    const { error } = await supabase.from('businesses').insert([item]);
    if (error) {
      console.error(`❌ ${item.name}: ${error.message}`);
      skip++;
    } else {
      console.log(`✅ ${item.name}`);
      success++;
    }
  }

  console.log(`\n완료: 성공 ${success}개, 실패/스킵 ${skip}개`);
}

main().catch(console.error);