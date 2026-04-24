import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase, signOut } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';
import kimchiLogoLight from "../../assets/images/kimchi_level5_nb.webp";
import kimchiLogoDark from "../../assets/images/kimchi_level2_nb.webp";
import type { City } from '../../types/index';

const pageTitles: Record<string, string> = {
  '/': '한인업체 전화번호부',
  '/map': '김치맵',
  '/news': '소식',
  '/mypage': '내 정보',
  '/register': '신규 업체 등록/제보',
};

const COUNTRY_EMERGENCY: Record<string, { ambulance: string; police: string; touristPolice?: string }> = {
  thailand:    { ambulance: '1669', police: '191', touristPolice: '1155' },
  malaysia:    { ambulance: '999', police: '999' },
  myanmar:     { ambulance: '192', police: '199' },
  singapore:   { ambulance: '995', police: '999' },
  india:       { ambulance: '108', police: '100' },
  indonesia:   { ambulance: '118', police: '110' },
  japan:       { ambulance: '119', police: '110' },
  cambodia:    { ambulance: '119', police: '117' },
  philippines: { ambulance: '911', police: '911' },
  hongkong:    { ambulance: '999', police: '999' },
};

const CONTINENTS = [
  {
    key: 'asia',
    label: '🌏 아시아',
    countries: [
      { key: 'vietnam', label: '🇻🇳 베트남', cities: [
        { key: 'hanoi', label: '하노이', active: true },
        { key: 'hochiminh', label: '호치민', active: true },
        { key: 'danang', label: '다낭', active: true },
        { key: 'vietnam-other', label: '기타지역', active: false },
      ]},
      { key: 'thailand', label: '🇹🇭 태국', cities: [
        { key: 'bangkok', label: '방콕', active: true },
        { key: 'chiangmai', label: '치앙마이', active: true },
        { key: 'pattaya', label: '파타야', active: false },
        { key: 'phuket', label: '푸켓', active: false },
        { key: 'huahin', label: '후아힌', active: false },
        { key: 'thailand-other', label: '기타지역', active: false },
      ]},
      { key: 'taiwan', label: '🇹🇼 대만', cities: [
        { key: 'taipei', label: '타이베이', active: true },
        { key: 'kaohsiung', label: '가오슝', active: false },
        { key: 'taiwan-other', label: '기타지역', active: false },
      ]},
      { key: 'japan', label: '🇯🇵 일본', cities: [
        { key: 'tokyo', label: '도쿄', active: false },
        { key: 'osaka', label: '오사카', active: false },
        { key: 'fukuoka', label: '후쿠오카', active: false },
        { key: 'kyoto', label: '교토', active: false },
        { key: 'nagoya', label: '나고야', active: false },
        { key: 'sapporo', label: '삿포로', active: false },
        { key: 'hiroshima', label: '히로시마', active: false },
        { key: 'japan-other', label: '기타지역', active: false },
      ]},
      { key: 'malaysia', label: '🇲🇾 말레이시아', cities: [
        { key: 'kualalumpur', label: '쿠알라룸푸르', active: false },
        { key: 'johorbahru', label: '조호르바루', active: false },
        { key: 'kotakinabalu', label: '코타키나발루', active: false },
        { key: 'penang', label: '페낭', active: false },
        { key: 'malaysia-other', label: '기타지역', active: false },
      ]},
      { key: 'singapore', label: '🇸🇬 싱가포르', cities: [
        { key: 'singapore', label: '싱가포르', active: false },
      ]},
      { key: 'indonesia', label: '🇮🇩 인도네시아', cities: [
        { key: 'jakarta', label: '자카르타', active: false },
        { key: 'bali', label: '발리', active: false },
        { key: 'indonesia-other', label: '기타지역', active: false },
      ]},
      { key: 'philippines', label: '🇵🇭 필리핀', cities: [
        { key: 'manila', label: '마닐라', active: false },
        { key: 'cebu', label: '세부', active: false },
        { key: 'philippines-other', label: '기타지역', active: false },
      ]},
      { key: 'cambodia', label: '🇰🇭 캄보디아', cities: [
        { key: 'phnompenh', label: '프놈펜', active: false },
        { key: 'siemreap', label: '시엠립', active: false },
      ]},
      { key: 'myanmar', label: '🇲🇲 미얀마', cities: [
        { key: 'yangon', label: '양곤', active: false },
      ]},
      { key: 'hongkong', label: '🇭🇰 홍콩', cities: [
        { key: 'hongkong', label: '홍콩', active: false },
      ]},
      { key: 'china', label: '🇨🇳 중국', cities: [
        { key: 'beijing', label: '베이징', active: false },
        { key: 'shanghai', label: '상하이', active: false },
        { key: 'guangzhou', label: '광저우', active: false },
        { key: 'shenzhen', label: '선전', active: false },
        { key: 'china-other', label: '기타지역', active: false },
      ]},
      { key: 'india', label: '🇮🇳 인도', cities: [
        { key: 'newdelhi', label: '뉴델리', active: false },
        { key: 'mumbai', label: '뭄바이', active: false },
        { key: 'india-other', label: '기타지역', active: false },
      ]},
      { key: 'nepal', label: '🇳🇵 네팔', cities: [
        { key: 'kathmandu', label: '카트만두', active: false },
      ]},
      { key: 'srilanka', label: '🇱🇰 스리랑카', cities: [
        { key: 'colombo', label: '콜롬보', active: false },
      ]},
      { key: 'bangladesh', label: '🇧🇩 방글라데시', cities: [
        { key: 'dhaka', label: '다카', active: false },
      ]},
      { key: 'laos', label: '🇱🇦 라오스', cities: [
        { key: 'vientiane', label: '비엔티안', active: false },
        { key: 'luangprabang', label: '루앙프라방', active: false },
      ]},
      { key: 'mongolia', label: '🇲🇳 몽골', cities: [
        { key: 'ulaanbaatar', label: '울란바토르', active: false },
      ]},
      { key: 'uzbekistan', label: '🇺🇿 우즈베키스탄', cities: [
        { key: 'tashkent', label: '타슈켄트', active: false },
        { key: 'samarkand', label: '사마르칸트', active: false },
      ]},
      { key: 'kazakhstan', label: '🇰🇿 카자흐스탄', cities: [
        { key: 'almaty', label: '알마티', active: false },
        { key: 'astana', label: '아스타나', active: false },
      ]},
      { key: 'kyrgyzstan', label: '🇰🇬 키르기스스탄', cities: [
        { key: 'bishkek', label: '비슈케크', active: false },
      ]},
      { key: 'brunei', label: '🇧🇳 브루나이', cities: [
        { key: 'bandar', label: '반다르스리브가완', active: false },
      ]},
      { key: 'timor', label: '🇹🇱 동티모르', cities: [
        { key: 'dili', label: '딜리', active: false },
      ]},
    ],
  },
  {
    key: 'europe',
    label: '🌍 유럽',
    countries: [
      { key: 'uk', label: '🇬🇧 영국', cities: [{ key: 'london', label: '런던', active: false }] },
      { key: 'france', label: '🇫🇷 프랑스', cities: [{ key: 'paris', label: '파리', active: false }] },
      { key: 'germany', label: '🇩🇪 독일', cities: [{ key: 'berlin', label: '베를린', active: false }, { key: 'frankfurt', label: '프랑크푸르트', active: false }] },
      { key: 'italy', label: '🇮🇹 이탈리아', cities: [{ key: 'rome', label: '로마', active: false }, { key: 'milan', label: '밀라노', active: false }] },
      { key: 'spain', label: '🇪🇸 스페인', cities: [{ key: 'madrid', label: '마드리드', active: false }, { key: 'barcelona', label: '바르셀로나', active: false }] },
      { key: 'portugal', label: '🇵🇹 포르투갈', cities: [{ key: 'lisbon', label: '리스본', active: false }] },
      { key: 'netherlands', label: '🇳🇱 네덜란드', cities: [{ key: 'amsterdam', label: '암스테르담', active: false }] },
      { key: 'switzerland', label: '🇨🇭 스위스', cities: [{ key: 'zurich', label: '취리히', active: false }] },
      { key: 'austria', label: '🇦🇹 오스트리아', cities: [{ key: 'vienna', label: '빈', active: false }] },
      { key: 'belgium', label: '🇧🇪 벨기에', cities: [{ key: 'brussels', label: '브뤼셀', active: false }] },
      { key: 'sweden', label: '🇸🇪 스웨덴', cities: [{ key: 'stockholm', label: '스톡홀름', active: false }] },
      { key: 'norway', label: '🇳🇴 노르웨이', cities: [{ key: 'oslo', label: '오슬로', active: false }] },
      { key: 'denmark', label: '🇩🇰 덴마크', cities: [{ key: 'copenhagen', label: '코펜하겐', active: false }] },
      { key: 'finland', label: '🇫🇮 핀란드', cities: [{ key: 'helsinki', label: '헬싱키', active: false }] },
      { key: 'poland', label: '🇵🇱 폴란드', cities: [{ key: 'warsaw', label: '바르샤바', active: false }] },
      { key: 'czechia', label: '🇨🇿 체코', cities: [{ key: 'prague', label: '프라하', active: false }] },
      { key: 'hungary', label: '🇭🇺 헝가리', cities: [{ key: 'budapest', label: '부다페스트', active: false }] },
      { key: 'greece', label: '🇬🇷 그리스', cities: [{ key: 'athens', label: '아테네', active: false }] },
      { key: 'croatia', label: '🇭🇷 크로아티아', cities: [{ key: 'zagreb', label: '자그레브', active: false }] },
      { key: 'romania', label: '🇷🇴 루마니아', cities: [{ key: 'bucharest', label: '부쿠레슈티', active: false }] },
      { key: 'turkey', label: '🇹🇷 튀르키예', cities: [{ key: 'istanbul', label: '이스탄불', active: false }, { key: 'ankara', label: '앙카라', active: false }] },
      { key: 'russia', label: '🇷🇺 러시아', cities: [{ key: 'moscow', label: '모스크바', active: false }] },
      { key: 'ukraine', label: '🇺🇦 우크라이나', cities: [{ key: 'kyiv', label: '키이우', active: false }] },
    ],
  },
  {
    key: 'americas',
    label: '🌎 아메리카',
    countries: [
      { key: 'usa', label: '🇺🇸 미국', cities: [{ key: 'newyork', label: '뉴욕', active: false }, { key: 'losangeles', label: '로스앤젤레스', active: false }, { key: 'lasvegas', label: '라스베이거스', active: false }, { key: 'hawaii', label: '하와이', active: false }, { key: 'usa-other', label: '기타지역', active: false }] },
      { key: 'canada', label: '🇨🇦 캐나다', cities: [{ key: 'toronto', label: '토론토', active: false }, { key: 'vancouver', label: '밴쿠버', active: false }] },
      { key: 'mexico', label: '🇲🇽 멕시코', cities: [{ key: 'mexicocity', label: '멕시코시티', active: false }, { key: 'cancun', label: '칸쿤', active: false }] },
      { key: 'brazil', label: '🇧🇷 브라질', cities: [{ key: 'saopaulo', label: '상파울루', active: false }, { key: 'rio', label: '리우데자네이루', active: false }] },
      { key: 'argentina', label: '🇦🇷 아르헨티나', cities: [{ key: 'buenosaires', label: '부에노스아이레스', active: false }] },
      { key: 'peru', label: '🇵🇪 페루', cities: [{ key: 'lima', label: '리마', active: false }] },
      { key: 'chile', label: '🇨🇱 칠레', cities: [{ key: 'santiago', label: '산티아고', active: false }] },
      { key: 'colombia', label: '🇨🇴 콜롬비아', cities: [{ key: 'bogota', label: '보고타', active: false }] },
      { key: 'cuba', label: '🇨🇺 쿠바', cities: [{ key: 'havana', label: '하바나', active: false }] },
      { key: 'guatemala', label: '🇬🇹 과테말라', cities: [{ key: 'guatemalacity', label: '과테말라시티', active: false }] },
    ],
  },
  {
    key: 'middleeast',
    label: '🕌 중동',
    countries: [
      { key: 'uae', label: '🇦🇪 UAE', cities: [{ key: 'dubai', label: '두바이', active: false }, { key: 'abudhabi', label: '아부다비', active: false }] },
      { key: 'israel', label: '🇮🇱 이스라엘', cities: [{ key: 'telaviv', label: '텔아비브', active: false }] },
      { key: 'jordan', label: '🇯🇴 요르단', cities: [{ key: 'amman', label: '암만', active: false }] },
      { key: 'egypt', label: '🇪🇬 이집트', cities: [{ key: 'cairo', label: '카이로', active: false }] },
      { key: 'qatar', label: '🇶🇦 카타르', cities: [{ key: 'doha', label: '도하', active: false }] },
      { key: 'saudiarabia', label: '🇸🇦 사우디아라비아', cities: [{ key: 'riyadh', label: '리야드', active: false }] },
    ],
  },
  {
    key: 'africa',
    label: '🌍 아프리카',
    countries: [
      { key: 'southafrica', label: '🇿🇦 남아프리카공화국', cities: [{ key: 'capetown', label: '케이프타운', active: false }, { key: 'johannesburg', label: '요하네스버그', active: false }] },
      { key: 'kenya', label: '🇰🇪 케냐', cities: [{ key: 'nairobi', label: '나이로비', active: false }] },
      { key: 'ethiopia', label: '🇪🇹 에티오피아', cities: [{ key: 'addisababa', label: '아디스아바바', active: false }] },
      { key: 'tanzania', label: '🇹🇿 탄자니아', cities: [{ key: 'daressalaam', label: '다르에스살람', active: false }] },
      { key: 'ghana', label: '🇬🇭 가나', cities: [{ key: 'accra', label: '아크라', active: false }] },
      { key: 'nigeria', label: '🇳🇬 나이지리아', cities: [{ key: 'lagos', label: '라고스', active: false }] },
      { key: 'morocco', label: '🇲🇦 모로코', cities: [{ key: 'casablanca', label: '카사블랑카', active: false }, { key: 'marrakech', label: '마라케시', active: false }] },
      { key: 'madagascar', label: '🇲🇬 마다가스카르', cities: [{ key: 'antananarivo', label: '안타나나리보', active: false }] },
    ],
  },
  {
    key: 'oceania',
    label: '🌊 오세아니아',
    countries: [
      { key: 'australia', label: '🇦🇺 호주', cities: [{ key: 'sydney', label: '시드니', active: false }, { key: 'melbourne', label: '멜버른', active: false }, { key: 'brisbane', label: '브리즈번', active: false }, { key: 'perth', label: '퍼스', active: false }] },
      { key: 'newzealand', label: '🇳🇿 뉴질랜드', cities: [{ key: 'auckland', label: '오클랜드', active: false }, { key: 'queenstown', label: '퀸스타운', active: false }] },
      { key: 'fiji', label: '🇫🇯 피지', cities: [{ key: 'suva', label: '수바', active: false }] },
      { key: 'guam', label: '🇬🇺 괌', cities: [{ key: 'hagatna', label: '하갓냐', active: false }] },
      { key: 'saipan', label: '🇲🇵 사이판', cities: [{ key: 'garapan', label: '가라판', active: false }] },
    ],
  },
];

interface HeaderProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  city: City;
  changeCity: (city: City) => void;
  CITY_CENTERS: Record<string, { lat: number; lng: number; radius: number; label: string }>;
  pendingCity: City;
  confirmDetectedCity: () => void;
  rejectDetectedCity: () => void;
}

export default function Header({ isDark, setIsDark, city, changeCity, CITY_CENTERS, pendingCity, confirmDetectedCity, rejectDetectedCity }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const subtitle = pageTitles[location.pathname] ?? '';
  const [menuOpen, setMenuOpen] = useState(false);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [step, setStep] = useState<'continent' | 'country' | 'city'>('continent');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [comingSoon, setComingSoon] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [emergencyPopup, setEmergencyPopup] = useState<{ ambulance: string; police: string; label: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const openCityPicker = () => {
    setStep('continent');
    setSelectedCountry(null);
    setSearch('');
    setCityPickerOpen(true);
    setMenuOpen(false);
  };

  const closePicker = () => {
    setCityPickerOpen(false);
    setSearch('');
    setStep('continent');
    setSelectedCountry(null);
    setSelectedContinent(null);
  };

  const handleBack = () => {
    if (step === 'city') {
      setStep('country');
      setSelectedCountry(null);
      setSearch('');
    } else if (step === 'country') {
      setStep('continent');
      setSelectedContinent(null);
      setSearch('');
    } else {
      closePicker();
    }
  };

  const selectedContinentData = CONTINENTS.find(c => c.key === selectedContinent);
  const asiaContinent = CONTINENTS[0];
  const handleCitySelect = (cityKey: string, active: boolean, countryKey?: string) => {
    if (!active) {
      if (countryKey && COUNTRY_EMERGENCY[countryKey]) {
        const country = asiaContinent.countries.find(c => c.key === countryKey);
        setEmergencyPopup({
          ambulance: COUNTRY_EMERGENCY[countryKey].ambulance,
          police: COUNTRY_EMERGENCY[countryKey].police,
          label: country?.label ?? countryKey,
        });
      } else {
        setComingSoon(true);
        setTimeout(() => setComingSoon(false), 2000);
      }
      return;
    }
    changeCity(cityKey as City);
    closePicker();
  };

  const currentCountry = selectedContinentData?.countries.find(c => c.key === selectedCountry);

  const filteredCountries = (selectedContinentData?.countries ?? []).filter(c =>
    search === '' || c.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCities = currentCountry?.cities.filter(c =>
    search === '' || c.label.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const filteredContinents = CONTINENTS.filter(c =>
    search === '' || c.label.toLowerCase().includes(search.toLowerCase())
  );

  const stepTitle = step === 'continent' ? '지역 선택' : step === 'country' ? (selectedContinentData?.label ?? '국가 선택') : (currentCountry?.label ?? '도시 선택');
  const currentLabel = city ? (CITY_CENTERS[city]?.label ?? '도시선택') : '도시선택';

  const menuItems = [
    { label: isDark ? '☀️ 라이트 모드' : '🌙 다크 모드', action: () => setIsDark(!isDark) },
    { label: '📝 업체 제보', action: () => navigate('/register?type=suggestion') },
    { label: '🏪 업체 등록/수정 (사장님)', action: () => navigate('/register?type=owner') },
    user
      ? { label: '로그아웃', action: async () => { try { await signOut(); } catch (e) {} } }
      : { label: '🔑 로그인', action: () => navigate('/mypage') },
    { label: '공지사항', action: () => alert('준비 중입니다') },
    { label: '📣 광고·제휴 문의', action: () => navigate('/inquiry') },
  ];

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px',
        backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
        borderBottom: `1px solid ${isDark ? '#333' : '#E0E0E0'}`,
        padding: '10px 16px', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={isDark ? kimchiLogoDark : kimchiLogoLight} alt="헝그리김치"
            style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: isDark ? '#FFFFFF' : '#1A1A1A', fontWeight: 700, fontSize: '16px', lineHeight: 1.2 }}>
              헝그리김치
            </span>
            <span style={{ color: '#888888', fontSize: '11px' }}>{subtitle}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={openCityPicker}
            style={{
              background: isDark ? '#2A2A2A' : '#E8E8E8', border: 'none',
              borderRadius: '8px', padding: '5px 10px',
              fontSize: '12px', fontWeight: 'bold',
              color: isDark ? '#FFFFFF' : '#1A1A1A',
              cursor: 'pointer', marginRight: '8px',
            }}
          >
            📍 {currentLabel}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: isDark ? '#FFFFFF' : '#1A1A1A' }}
          >
            ☰
          </button>
        </div>
        {menuOpen && (
          <div style={{
            position: 'absolute', top: '60px', right: '0', width: '200px',
            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
            border: `1px solid ${isDark ? '#333' : '#E0E0E0'}`,
            borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 200, overflow: 'hidden',
          }}>
            {menuItems.map((item, index) => (
              <div key={index}
                onClick={() => { item.action(); setMenuOpen(false); }}
                style={{
                  padding: '14px 16px', fontSize: '14px', cursor: 'pointer',
                  borderBottom: index < menuItems.length - 1 ? `1px solid ${isDark ? '#333' : '#E0E0E0'}` : 'none',
                  color: isDark ? '#FFFFFF' : '#1A1A1A',
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </header>

      {cityPickerOpen && (
        <div
          onClick={closePicker}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 300,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '90%', maxWidth: '400px',
              backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
              borderRadius: '16px', padding: '20px 16px',
              maxHeight: '70vh', display: 'flex', flexDirection: 'column',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
              <button
                onClick={handleBack}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888', padding: '0 4px' }}
              >
                ←
              </button>
              <span style={{ fontWeight: 'bold', fontSize: '15px', color: isDark ? '#FFFFFF' : '#1A1A1A', flex: 1 }}>
                {stepTitle}
              </span>
              <button
                onClick={closePicker}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' }}
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="🔍 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '9px 14px', borderRadius: '10px', border: 'none',
                backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0',
                color: isDark ? '#FFFFFF' : '#1A1A1A',
                fontSize: '14px', outline: 'none', marginBottom: '12px',
              }}
            />

            {step === 'continent' && (
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {filteredContinents.map(continent => (
                  <div
                    key={continent.key}
                    onClick={() => { setSelectedContinent(continent.key); setStep('country'); setSearch(''); }}
                    style={{
                      padding: '14px 12px',
                      borderBottom: `1px solid ${isDark ? '#2A2A2A' : '#F0F0F0'}`,
                      cursor: 'pointer', fontSize: '15px',
                      color: isDark ? '#FFFFFF' : '#1A1A1A',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <span>{continent.label}</span>
                    <span style={{ color: '#888', fontSize: '13px' }}>›</span>
                  </div>
                ))}
              </div>
            )}

            {step === 'country' && (
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {filteredCountries.map(country => (
                  <div
                    key={country.key}
                    onClick={() => {
                      const hasCities = country.cities.some(c => c.active);
                      if (hasCities) {
                        setSelectedCountry(country.key); setStep('city'); setSearch('');
                      } else if (COUNTRY_EMERGENCY[country.key]) {
                        setEmergencyPopup({
                          ambulance: COUNTRY_EMERGENCY[country.key].ambulance,
                          police: COUNTRY_EMERGENCY[country.key].police,
                          label: country.label,
                        });
                      } else {
                        setComingSoon(true);
                        setTimeout(() => setComingSoon(false), 2000);
                      }
                    }}
                    style={{
                      padding: '14px 12px',
                      borderBottom: `1px solid ${isDark ? '#2A2A2A' : '#F0F0F0'}`,
                      cursor: 'pointer', fontSize: '15px',
                      color: isDark ? '#FFFFFF' : '#1A1A1A',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <span>{country.label}</span>
                    <span style={{ color: '#888', fontSize: '13px' }}>›</span>
                  </div>
                ))}
              </div>
            )}

            {step === 'city' && (
              <div style={{ overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '4px 0' }}>
                  {filteredCities.map(c => (
                    <button
                      key={c.key}
                      onClick={() => handleCitySelect(c.key, c.active, selectedCountry ?? undefined)}
                      style={{
                        padding: '8px 16px', borderRadius: '20px', border: 'none',
                        fontSize: '14px', cursor: 'pointer',
                        background: city === c.key
                          ? (isDark ? '#7DBA31' : '#C0392B')
                          : isDark ? '#2A2A2A' : '#F0F0F0',
                        color: city === c.key ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A',
                        opacity: c.active ? 1 : 0.5,
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {emergencyPopup && (
        <div
          onClick={() => setEmergencyPopup(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 400,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '85%', maxWidth: '360px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px', padding: '24px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 16px', color: '#1A1A1A' }}>
              {emergencyPopup.label} 비상연락
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#2980B9', fontWeight: 'bold' }}>🚑 구급·응급신고</span>
                <p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: '22px', color: '#1A1A1A' }}>{emergencyPopup.ambulance}</p>
              </div>
              <button
                onClick={() => window.location.href = `tel:${emergencyPopup.ambulance}`}
                style={{
                  background: 'transparent', color: '#C0392B',
                  border: '1.5px solid #C0392B', borderRadius: '8px',
                  padding: '7px 14px', fontSize: '13px', cursor: 'pointer',
                }}
              >
                📞 전화
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#FF6B35', fontWeight: 'bold' }}>🚔 경찰신고</span>
                <p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: '22px', color: '#1A1A1A' }}>{emergencyPopup.police}</p>
              </div>
              <button
                onClick={() => window.location.href = `tel:${emergencyPopup.police}`}
                style={{
                  background: 'transparent', color: '#C0392B',
                  border: '1.5px solid #C0392B', borderRadius: '8px',
                  padding: '7px 14px', fontSize: '13px', cursor: 'pointer',
                }}
              >
                📞 전화
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', margin: '0 0 16px' }}>
              🌱 해당 지역 데이터를 수집하는 중입니다.
            </p>

            <button
              onClick={() => setEmergencyPopup(null)}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: '#F0F0F0', border: 'none',
                fontSize: '14px', fontWeight: 'bold',
                color: '#1A1A1A', cursor: 'pointer',
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {pendingCity && (
        <div
          onClick={() => rejectDetectedCity()}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 400,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '85%', maxWidth: '360px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px', padding: '24px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <p style={{ fontWeight: 'bold', fontSize: '16px', margin: '0 0 8px', color: '#1A1A1A' }}>
              📍 현재 위치 확인
            </p>
            <p style={{ fontSize: '14px', color: '#555', margin: '0 0 20px' }}>
              현재 <strong>{CITY_CENTERS[pendingCity]?.label}</strong>에 계신가요?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => rejectDetectedCity()}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  background: '#F0F0F0', border: 'none',
                  fontSize: '14px', fontWeight: 'bold',
                  color: '#1A1A1A', cursor: 'pointer',
                }}
              >
                아니요
              </button>
              <button
                onClick={() => { confirmDetectedCity(); }}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  background: '#C0392B', border: 'none',
                  fontSize: '14px', fontWeight: 'bold',
                  color: '#FFFFFF', cursor: 'pointer',
                }}
              >
                네, 맞아요
              </button>
            </div>
          </div>
        </div>
      )}

      {comingSoon && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#333', color: '#FFF',
          padding: '10px 20px', borderRadius: '20px',
          fontSize: '13px', zIndex: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          🌱 준비중입니다
        </div>
      )}
    </>
  );
}
