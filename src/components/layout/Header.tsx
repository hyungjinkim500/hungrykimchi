
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

const CONTINENTS = [
  {
    key: 'asia',
    label: '🌏 아시아',
    countries: [
      {
        key: 'vietnam', label: '🇻🇳 베트남',
        cities: [
          { key: 'hanoi', label: '하노이', active: true },
          { key: 'hochiminh', label: '호치민', active: true },
          { key: 'danang', label: '다낭', active: true },
          { key: 'vietnam-other', label: '기타지역', active: false },
        ],
      },
      {
        key: 'thailand', label: '🇹🇭 태국',
        cities: [
          { key: 'bangkok', label: '방콕', active: true },
          { key: 'chiangmai', label: '치앙마이', active: true },
          { key: 'pattaya', label: '파타야', active: true },
          { key: 'phuket', label: '푸켓', active: true },
          { key: 'huahin', label: '후아힌', active: false },
          { key: 'thailand-other', label: '기타지역', active: false },
        ],
      },
      {
        key: 'malaysia', label: '🇲🇾 말레이시아',
        cities: [
          { key: 'kualalumpur', label: '쿠알라룸푸르', active: false },
          { key: 'johorbahru', label: '조호르바루', active: false },
          { key: 'kotakinabalu', label: '코타키나발루', active: false },
          { key: 'penang', label: '페낭', active: false },
          { key: 'malaysia-other', label: '기타지역', active: false },
        ],
      },
      {
        key: 'singapore', label: '🇸🇬 싱가포르',
        cities: [
          { key: 'singapore', label: '싱가포르', active: false },
        ],
      },
      {
        key: 'indonesia', label: '🇮🇩 인도네시아',
        cities: [
          { key: 'jakarta', label: '자카르타', active: false },
          { key: 'bali', label: '발리', active: false },
          { key: 'indonesia-other', label: '기타지역', active: false },
        ],
      },
      {
        key: 'philippines', label: '🇵🇭 필리핀',
        cities: [
          { key: 'manila', label: '마닐라', active: false },
          { key: 'cebu', label: '세부', active: false },
          { key: 'philippines-other', label: '기타지역', active: false },
        ],
      },
      {
        key: 'cambodia', label: '🇰🇭 캄보디아',
        cities: [
          { key: 'phnompenh', label: '프놈펜', active: false },
          { key: 'siemreap', label: '시엠립', active: false },
        ],
      },
      {
        key: 'myanmar', label: '🇲🇲 미얀마',
        cities: [
          { key: 'yangon', label: '양곤', active: false },
        ],
      },
      {
        key: 'japan', label: '🇯🇵 일본',
        cities: [
          { key: 'tokyo', label: '도쿄', active: false },
          { key: 'osaka', label: '오사카', active: false },
          { key: 'fukuoka', label: '후쿠오카', active: false },
          { key: 'kyoto', label: '교토', active: false },
          { key: 'nagoya', label: '나고야', active: false },
          { key: 'sapporo', label: '삿포로', active: false },
          { key: 'hiroshima', label: '히로시마', active: false },
          { key: 'japan-other', label: '기타지역', active: false },
        ],
      },
      {
        key: 'hongkong', label: '🇭🇰 홍콩',
        cities: [
          { key: 'hongkong', label: '홍콩', active: false },
        ],
      },
      {
        key: 'taiwan', label: '🇹🇼 대만',
        cities: [
          { key: 'taipei', label: '타이베이', active: false },
          { key: 'kaohsiung', label: '가오슝', active: false },
        ],
      },
      {
        key: 'india', label: '🇮🇳 인도',
        cities: [
          { key: 'newdelhi', label: '뉴델리', active: false },
          { key: 'mumbai', label: '뭄바이', active: false },
          { key: 'india-other', label: '기타지역', active: false },
        ],
      },
    ],
  },
];

interface HeaderProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  city: City;
  changeCity: (city: City) => void;
  CITY_CENTERS: Record<string, { lat: number; lng: number; radius: number; label: string }>;
}

export default function Header({ isDark, setIsDark, city, changeCity, CITY_CENTERS }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const subtitle = pageTitles[location.pathname] ?? '';
  const [menuOpen, setMenuOpen] = useState(false);
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [step, setStep] = useState<'country' | 'city'>('country');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [comingSoon, setComingSoon] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
    setStep('country');
    setSelectedCountry(null);
    setSearch('');
    setCityPickerOpen(true);
    setMenuOpen(false);
  };

  const closePicker = () => {
    setCityPickerOpen(false);
    setSearch('');
    setStep('country');
    setSelectedCountry(null);
  };

  const handleBack = () => {
    if (step === 'city') {
      setStep('country');
      setSelectedCountry(null);
      setSearch('');
    } else {
      closePicker();
    }
  };

  const handleCitySelect = (cityKey: string, active: boolean) => {
    if (!active) {
      setComingSoon(true);
      setTimeout(() => setComingSoon(false), 2000);
      return;
    }
    changeCity(cityKey as City);
    closePicker();
  };

  const asiaContinent = CONTINENTS[0];
  const currentCountry = asiaContinent.countries.find(c => c.key === selectedCountry);

  const filteredCountries = asiaContinent.countries.filter(c =>
    search === '' || c.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCities = currentCountry?.cities.filter(c =>
    search === '' || c.label.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const stepTitle = step === 'country' ? '국가 선택' : (currentCountry?.label ?? '도시 선택');
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

            {step === 'country' && (
              <div style={{ overflowY: 'auto', flex: 1 }}>
                {filteredCountries.map(country => (
                  <div
                    key={country.key}
                    onClick={() => { setSelectedCountry(country.key); setStep('city'); setSearch(''); }}
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
                      onClick={() => handleCitySelect(c.key, c.active)}
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
