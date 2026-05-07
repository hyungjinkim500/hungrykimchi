import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import type { Business, City } from '../types/index';
import { supabase } from '../lib/supabase';
import kimchiLogo from "../assets/images/kimchi_level5_nb.webp";
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

const CONTINENTS = [
  { key: 'asia', label: '🌏 아시아', countries: [
    { key: 'vietnam', label: '🇻🇳 베트남', cities: [{ key: 'hanoi', label: '하노이', active: true },{ key: 'hochiminh', label: '호치민', active: true },{ key: 'danang', label: '다낭', active: true },{ key: 'haiphong', label: '하이퐁', active: true },{ key: 'bacninh', label: '박닌', active: true },{ key: 'vietnam-other', label: '기타지역', active: false }]},
    { key: 'thailand', label: '🇹🇭 태국', cities: [{ key: 'bangkok', label: '방콕', active: true },{ key: 'chiangmai', label: '치앙마이', active: true },{ key: 'pattaya', label: '파타야', active: false },{ key: 'phuket', label: '푸켓', active: false },{ key: 'huahin', label: '후아힌', active: false },{ key: 'thailand-other', label: '기타지역', active: false }]},
    { key: 'philippines', label: '🇵🇭 필리핀', cities: [{ key: 'manila', label: '마닐라', active: true },{ key: 'cebu', label: '세부', active: true },{ key: 'philippines-other', label: '기타지역', active: false }]},
    { key: 'taiwan', label: '🇹🇼 대만', cities: [{ key: 'taipei', label: '타이베이', active: true },{ key: 'kaohsiung', label: '가오슝', active: false },{ key: 'taiwan-other', label: '기타지역', active: false }]},
    { key: 'malaysia', label: '🇲🇾 말레이시아', cities: [{ key: 'kualalumpur', label: '쿠알라룸푸르', active: false },{ key: 'johorbahru', label: '조호르바루', active: false },{ key: 'kotakinabalu', label: '코타키나발루', active: false },{ key: 'penang', label: '페낭', active: false },{ key: 'malaysia-other', label: '기타지역', active: false }]},
    { key: 'singapore', label: '🇸🇬 싱가포르', cities: [{ key: 'singapore', label: '싱가포르', active: false }]},
    { key: 'indonesia', label: '🇮🇩 인도네시아', cities: [{ key: 'jakarta', label: '자카르타', active: false },{ key: 'bali', label: '발리', active: false },{ key: 'indonesia-other', label: '기타지역', active: false }]},
    { key: 'japan', label: '🇯🇵 일본', cities: [{ key: 'tokyo', label: '도쿄', active: false },{ key: 'osaka', label: '오사카', active: false },{ key: 'fukuoka', label: '후쿠오카', active: false },{ key: 'japan-other', label: '기타지역', active: false }]},
    { key: 'cambodia', label: '🇰🇭 캄보디아', cities: [{ key: 'phnompenh', label: '프놈펜', active: false },{ key: 'siemreap', label: '시엠립', active: false }]},
    { key: 'myanmar', label: '🇲🇲 미얀마', cities: [{ key: 'yangon', label: '양곤', active: false }]},
    { key: 'hongkong', label: '🇭🇰 홍콩', cities: [{ key: 'hongkong', label: '홍콩', active: false }]},
  ]},
  { key: 'europe', label: '🌍 유럽', countries: [
    { key: 'uk', label: '🇬🇧 영국', cities: [{ key: 'london', label: '런던', active: false }]},
    { key: 'france', label: '🇫🇷 프랑스', cities: [{ key: 'paris', label: '파리', active: false }]},
    { key: 'germany', label: '🇩🇪 독일', cities: [{ key: 'berlin', label: '베를린', active: false }]},
    { key: 'italy', label: '🇮🇹 이탈리아', cities: [{ key: 'rome', label: '로마', active: false }]},
    { key: 'spain', label: '🇪🇸 스페인', cities: [{ key: 'madrid', label: '마드리드', active: false }]},
  ]},
  { key: 'americas', label: '🌎 아메리카', countries: [
    { key: 'usa', label: '🇺🇸 미국', cities: [{ key: 'newyork', label: '뉴욕', active: false },{ key: 'losangeles', label: '로스앤젤레스', active: false },{ key: 'usa-other', label: '기타지역', active: false }]},
    { key: 'canada', label: '🇨🇦 캐나다', cities: [{ key: 'toronto', label: '토론토', active: false },{ key: 'vancouver', label: '밴쿠버', active: false }]},
  ]},
  { key: 'oceania', label: '🌊 오세아니아', countries: [
    { key: 'australia', label: '🇦🇺 호주', cities: [{ key: 'sydney', label: '시드니', active: false },{ key: 'melbourne', label: '멜버른', active: false }]},
    { key: 'newzealand', label: '🇳🇿 뉴질랜드', cities: [{ key: 'auckland', label: '오클랜드', active: true },{ key: 'queenstown', label: '퀸스타운', active: false }]},
  ]},
];

interface Props {
  isDark: boolean;
  city: City;
  changeCity: (city: City) => void;
  CITY_CENTERS: Record<string, { lat: number; lng: number; radius: number; label: string }>;
}

const EMERGENCY_NUMBERS: Record<string, { ambulance: string; police: string; touristPolice?: string }> = {
  hanoi:               { ambulance: '115',  police: '113' },
  hochiminh:           { ambulance: '115',  police: '113' },
  danang:              { ambulance: '115',  police: '113' },
  'vietnam-other':     { ambulance: '115',  police: '113' },
  bangkok:             { ambulance: '1669', police: '191', touristPolice: '1155' },
  chiangmai:           { ambulance: '1669', police: '191', touristPolice: '1155' },
  pattaya:             { ambulance: '1669', police: '191', touristPolice: '1155' },
  phuket:              { ambulance: '1669', police: '191', touristPolice: '1155' },
  huahin:              { ambulance: '1669', police: '191', touristPolice: '1155' },
  'thailand-other':    { ambulance: '1669', police: '191', touristPolice: '1155' },
  taipei:              { ambulance: '119',  police: '110' },
  kaohsiung:           { ambulance: '119',  police: '110' },
  'taiwan-other':      { ambulance: '119',  police: '110' },
  kualalumpur:         { ambulance: '999',  police: '999' },
  johorbahru:          { ambulance: '999',  police: '999' },
  kotakinabalu:        { ambulance: '999',  police: '999' },
  penang:              { ambulance: '999',  police: '999' },
  'malaysia-other':    { ambulance: '999',  police: '999' },
  yangon:              { ambulance: '192',  police: '199' },
  singapore:           { ambulance: '995',  police: '999' },
  newdelhi:            { ambulance: '108',  police: '100' },
  mumbai:              { ambulance: '108',  police: '100' },
  'india-other':       { ambulance: '108',  police: '100' },
  jakarta:             { ambulance: '118',  police: '110' },
  bali:                { ambulance: '118',  police: '110' },
  'indonesia-other':   { ambulance: '118',  police: '110' },
  tokyo:               { ambulance: '119',  police: '110' },
  osaka:               { ambulance: '119',  police: '110' },
  fukuoka:             { ambulance: '119',  police: '110' },
  kyoto:               { ambulance: '119',  police: '110' },
  nagoya:              { ambulance: '119',  police: '110' },
  sapporo:             { ambulance: '119',  police: '110' },
  hiroshima:           { ambulance: '119',  police: '110' },
  'japan-other':       { ambulance: '119',  police: '110' },
  phnompenh:           { ambulance: '119',  police: '117' },
  siemreap:            { ambulance: '119',  police: '117' },
  manila:              { ambulance: '911',  police: '911' },
  cebu:                { ambulance: '911',  police: '911' },
  'philippines-other': { ambulance: '911',  police: '911' },
  hongkong:            { ambulance: '999',  police: '999' },
};

export default function PhoneBook({ isDark, city, changeCity, CITY_CENTERS }: Props) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => sessionStorage.getItem('pb_category') || '음식점');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(() => {
    const isBack = sessionStorage.getItem('pb_is_back') === 'true';
    sessionStorage.removeItem('pb_is_back');
    return isBack ? (sessionStorage.getItem('pb_subcategory') || '전체') : '전체';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showKoreanOnly, setShowKoreanOnly] = useState(false);
  const koreanRunCount = businesses.filter((b) => (b as any).is_korean_run === true).length;
  const [sortOrder, setSortOrder] = useState<'name' | 'rating' | 'distance'>(() => (sessionStorage.getItem('pb_sort') as 'name' | 'rating' | 'distance') || 'rating');
  const listRef = useRef<HTMLDivElement>(null);
  const cityBtnRef = useRef<HTMLButtonElement>(null);
  const categoryBtnRef = useRef<HTMLButtonElement>(null);
  const subcategoryBtnRef = useRef<HTMLButtonElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<'city' | 'category' | 'subcategory' | 'sort' | null>(null);

  const openDropdown = (type: 'city' | 'category' | 'subcategory' | 'sort', ref: React.RefObject<HTMLButtonElement | null>) => {
    if (activeDropdown === type) { setActiveDropdown(null); return; }
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownTop(rect.bottom - 60);
    }
    setActiveDropdown(type);
  };

  // 도시선택 피커 단계
  const [, setPickerStep] = useState<'continent' | 'country' | 'city'>('continent');
  const [pickerContinent, setPickerContinent] = useState<string | null>(null);
  const [pickerCountry, setPickerCountry] = useState<string | null>(null);
  const [, setPickerSearch] = useState('');

  // 거리순 정렬용 사용자 위치
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const getDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); },
      () => { setLocationDenied(true); if (sortOrder === 'distance') setSortOrder('rating'); },
      { timeout: 5000 }
    );
  }, []);

  const ALL_LABEL = lang === 'en' ? 'All' : '전체';
  const FOOD_SUBCATEGORIES = lang === 'en'
    ? ['All', 'Korean Cuisine', 'Korean BBQ', 'Fried Chicken', 'Bar & Pocha', 'Street Food', 'Rice & Sides', 'Jokbal & Bossam', 'Korean-Chinese', 'Sashimi & Sushi', 'Soup & Stew', 'Hot Pot', 'Café & Brunch', 'Other']
    : ['전체', '종합한식', '고기구이', '치킨', '포차/호프', '분식', '백반/반찬', '족발/보쌈', '중화요리', '회/초밥', '국밥/찌개', '전골/샤브', '브런치/카페', '기타'];
  const MEDICAL_SUBCATEGORIES = lang === 'en'
    ? ['All', 'General Hospital', 'Internal Medicine', 'Dental', 'Dermatology', 'Ophthalmology', 'ENT', 'Orthopedics', 'Korean Medicine', 'Pharmacy', 'Other']
    : ['전체', '종합/국제병원', '내과/가정의학', '치과', '피부과', '안과', '이비인후과', '정형외과', '한의원', '약국', '기타'];
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('pb_scroll');
    if (saved && listRef.current) {
      listRef.current.scrollTop = parseInt(saved);
    }
  }, [businesses]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      let query = supabase.from('businesses').select('*').eq('pending_approval', false).not('phone', 'is', null);
      if (city) query = query.eq('city', city);
      const { data, error } = await query;
      if (error) {
        setError(error.message);
      } else {
        setBusinesses(data as Business[]);
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, [city]);

  const fuseOptions = {
    keys: ['name', 'name_ko', 'subcategory', 'address', 'primary_type_ko'],
    threshold: 0.4,
  };

  const filteredBusinesses = (() => {
    let categoryFiltered = selectedCategory === '전체'
        ? businesses
        : businesses.filter((b) => b.category === selectedCategory);

    if (selectedSubcategory !== ALL_LABEL && (selectedCategory === '음식점' || selectedCategory === '의료')) {
        categoryFiltered = categoryFiltered.filter(b => {
          const subMap: Record<string, string> = {
            'Korean Cuisine': '종합한식', 'Korean BBQ': '고기구이', 'Fried Chicken': '치킨',
            'Bar & Pocha': '포차/호프', 'Street Food': '분식', 'Rice & Sides': '백반/반찬',
            'Jokbal & Bossam': '족발/보쌈', 'Korean-Chinese': '중화요리', 'Sashimi & Sushi': '회/초밥',
            'Soup & Stew': '국밥/찌개', 'Hot Pot': '전골/샤브', 'Café & Brunch': '브런치/카페', 'Other': '기타',
            'General Hospital': '종합/국제병원', 'Internal Medicine': '내과/가정의학', 'Dental': '치과',
            'Dermatology': '피부과', 'Ophthalmology': '안과', 'ENT': '이비인후과',
            'Orthopedics': '정형외과', 'Korean Medicine': '한의원', 'Pharmacy': '약국',
          };
          const dbValue = subMap[selectedSubcategory] ?? selectedSubcategory;
          return (b as any).subcategory === dbValue;
        });
    }

    if (showKoreanOnly) {
        categoryFiltered = categoryFiltered.filter(b => (b as any).is_korean_run === true);
    }

    const sortByName = (arr: Business[]) => [...arr].sort((a, b) => {
        const nameA = (a as any).name_ko || a.name || '';
        const nameB = (b as any).name_ko || b.name || '';
        const aIsKorean = /^[가-힣]/.test(nameA);
        const bIsKorean = /^[가-힣]/.test(nameB);
        if (aIsKorean && !bIsKorean) return -1;
        if (!aIsKorean && bIsKorean) return 1;
        return nameA.localeCompare(nameB, 'ko');
    });

    const sortByRating = (arr: Business[]) => [...arr].sort((a, b) => {
        const rA = (a as any).google_rating ?? 0;
        const rB = (b as any).google_rating ?? 0;
        return rB - rA;
    });

    const sortByDistance = (arr: Business[]) => [...arr].sort((a, b) => {
        if (!userLat || !userLng) return 0;
        const dA = (a.lat && a.lng) ? getDistance(userLat, userLng, a.lat, a.lng) : Infinity;
        const dB = (b.lat && b.lng) ? getDistance(userLat, userLng, b.lat, b.lng) : Infinity;
        return dA - dB;
    });

    const sorted = sortOrder === 'rating' ? sortByRating : sortOrder === 'distance' ? sortByDistance : sortByName;

    if (!searchQuery.trim()) return sorted(categoryFiltered);
    const fuseCat = new Fuse(categoryFiltered, fuseOptions);
    return sorted(fuseCat.search(searchQuery).map((r) => r.item));
  })();

  const getActiveColor = (category: string) => {
    if (category === '음식점') return '#C0392B';
    if (category === '마트/슈퍼') return '#7DBA31';
    if (category === '의료') return '#2980B9';
    if (category === '관공·긴급') return '#FF6B35';
    return isDark ? '#7DBA31' : '#C0392B';
  };

  const styles = {
    container: {
      backgroundColor: isDark ? '#111111' : '#F5F5F5',
      color: isDark ? '#FFFFFF' : '#1A1A1A',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: '65px',
      bottom: '65px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
    } as React.CSSProperties,
    categoryContainer: {
      display: 'flex',
      alignItems: 'center',
      overflowX: 'auto',
      flexShrink: 0,
      padding: '0 16px',
      gap: '8px',
      scrollbarWidth: 'none',
    } as React.CSSProperties,
    categoryChip: (isActive: boolean, category: string) => ({
      height: '32px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isActive ? getActiveColor(category) : isDark ? '#2A2A2A' : '#E0E0E0',
      color: isActive ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A',
      padding: '0 12px',
      borderRadius: '16px',
      fontSize: '13px',
      cursor: 'pointer',
      flexShrink: 0,
      border: 'none',
      whiteSpace: 'nowrap',
      lineHeight: '1',
      boxSizing: ('border-box' as React.CSSProperties['boxSizing']),
    }),
    listContainer: {
      overflowY: 'auto',
      flex: 1,
      padding: '8px 16px',
    } as React.CSSProperties,
    card: {
      background: isDark ? '#1A1A1A' : '#FFFFFF',
      borderRadius: '12px',
      padding: '14px',
      marginBottom: '10px',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    businessName: {
      fontWeight: 'bold',
      fontSize: '16px',
    },
    okBadge: {
      background: '#C0392B',
      color: '#FFFFFF',
      borderRadius: '6px',
      padding: '2px 8px',
      fontSize: '12px',
    },
    mutedText: {
      color: isDark ? '#888' : '#666',
      fontSize: '14px',
    },
    addressText: {
      color: isDark ? '#888' : '#666',
      fontSize: '13px',
      marginTop: '4px',
    },
    ratingText: {
      fontSize: '14px',
      marginTop: '4px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: '12px',
    },
    button: (primary: boolean) => ({
      background: primary ? 'transparent' : isDark ? '#2A2A2A' : '#E8E8E8',
      color: primary ? (isDark ? '#7DBA31' : '#C0392B') : isDark ? '#FFFFFF' : '#1A1A1A',
      borderRadius: '8px',
      padding: '7px 14px',
      fontSize: '13px',
      border: primary ? `1.5px solid ${isDark ? '#7DBA31' : '#C0392B'}` : 'none',
      cursor: 'pointer',
      marginLeft: '8px',
    }),
    noPhoneText: {
      color: '#888',
      fontSize: '13px',
      marginRight: 'auto',
    },
  };

  const customStyles = `
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
  `;

  const categoryLabel: Record<string, string> = {
    '음식점': t(lang, 'category_restaurant'),
    '마트/슈퍼': t(lang, 'category_grocery'),
    '의료': t(lang, 'category_medical'),
    '관공·긴급': t(lang, 'category_office'),
  };
  const sortLabels: Record<string, string> = {
    rating: '⭐ 평점순',
    name: '🔤 가나다순',
    distance: '📍 거리순',
  };
  const currentCityLabel = city ? (CITY_CENTERS[city]?.label ?? '도시') : '도시';
  const currentCategoryLabel = categoryLabel[selectedCategory] ?? selectedCategory;
  const currentSubLabel = (selectedCategory === '음식점' || selectedCategory === '의료') && selectedSubcategory !== ALL_LABEL ? selectedSubcategory : null;
  const currentSortLabel = sortLabels[sortOrder];

  const pickerContinentData = CONTINENTS.find(c => c.key === pickerContinent);

  const handleCitySelect = (cityKey: string, active: boolean) => {
    if (!active) return;
    changeCity(cityKey as City);
    setActiveDropdown(null);
    setPickerStep('continent');
    setPickerContinent(null);
    setPickerCountry(null);
    setPickerSearch('');
    sessionStorage.setItem('pb_scroll', '0');
    if (listRef.current) listRef.current.scrollTop = 0;
  };

  const chipBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '3px',
    padding: '5px 10px', borderRadius: '20px', fontSize: '12px',
    fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
    border: 'none', transition: 'all 0.15s',
  };
  const chipActive = (active: boolean): React.CSSProperties => ({
    background: active ? (isDark ? '#3A3A3A' : '#1A1A1A') : (isDark ? '#2A2A2A' : '#F0F0F0'),
    color: active ? '#FFFFFF' : (isDark ? '#CCCCCC' : '#555555'),
  });

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>불러오는 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  const muted = isDark ? '#888' : '#666';

  return (
    <div style={styles.container}>
      <style>{customStyles}</style>

      {/* 상단바: 도시선택 + 검색창 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 12px', flexShrink: 0,
      }}>
        <button ref={cityBtnRef} style={{ ...chipBase, ...chipActive(activeDropdown === 'city'), flexShrink: 0 }}
          onClick={() => openDropdown('city', cityBtnRef)}>
          📍 {currentCityLabel} <span style={{ fontSize: '10px', opacity: 0.6 }}>▾</span>
        </button>
        <input
          type="text"
          placeholder={t(lang, 'search_placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '6px 12px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: isDark ? '#2A2A2A' : '#EFEFEF',
            color: isDark ? '#FFFFFF' : '#1A1A1A',
            fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>

      {/* 필터바: 카테고리/세부분류/정렬/한인업체 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '0 12px 8px', overflowX: 'auto', flexShrink: 0,
        scrollbarWidth: 'none',
      }} className="no-scrollbar">
        <button ref={categoryBtnRef} style={{ ...chipBase, ...chipActive(activeDropdown === 'category') }}
          onClick={() => openDropdown('category', categoryBtnRef)}>
          {currentCategoryLabel} <span style={{ fontSize: '10px', opacity: 0.6 }}>▾</span>
        </button>
        {(selectedCategory === '음식점' || selectedCategory === '의료') && (
          <button ref={subcategoryBtnRef} style={{ ...chipBase, ...chipActive(activeDropdown === 'subcategory' || !!currentSubLabel) }}
            onClick={() => openDropdown('subcategory', subcategoryBtnRef)}>
            {currentSubLabel ?? (lang === 'en' ? 'Type' : '세부분류')} <span style={{ fontSize: '10px', opacity: 0.6 }}>▾</span>
          </button>
        )}
        <button ref={sortBtnRef} style={{ ...chipBase, ...chipActive(activeDropdown === 'sort') }}
          onClick={() => openDropdown('sort', sortBtnRef)}>
          {currentSortLabel} <span style={{ fontSize: '10px', opacity: 0.6 }}>▾</span>
        </button>
        {koreanRunCount >= 2 && (
          <button style={{
            ...chipBase,
            background: showKoreanOnly ? (isDark ? '#3A3A3A' : '#1A1A1A') : (isDark ? '#2A2A2A' : '#F0F0F0'),
            color: showKoreanOnly ? '#FFFFFF' : (isDark ? '#CCCCCC' : '#555555'),
            border: showKoreanOnly ? '1.5px solid #C0392B' : 'none',
          }} onClick={() => setShowKoreanOnly(!showKoreanOnly)}>
            🇰🇷 {t(lang, 'verified_korean_run_only')}
          </button>
        )}
      </div>

      {/* 드롭다운 패널 */}
      {activeDropdown && (
        <div
          style={{
            position: 'fixed',
            top: dropdownTop + 'px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '430px',
            background: isDark ? '#1E1E1E' : '#FFFFFF',
            borderBottom: `1px solid ${isDark ? '#333' : '#E8E8E8'}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            maxHeight: '280px', overflowY: 'auto',
            padding: '12px 16px',
            zIndex: 200,
          }}
          onClick={e => e.stopPropagation()}
        >
          {activeDropdown === 'category' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['음식점', '마트/슈퍼', '의료', '관공·긴급'].map(cat => (
                <button key={cat} style={{
                  ...chipBase,
                  background: selectedCategory === cat ? getActiveColor(cat) : (isDark ? '#2A2A2A' : '#F0F0F0'),
                  color: selectedCategory === cat ? '#FFF' : (isDark ? '#CCC' : '#555'),
                }} onClick={() => {
                  setSelectedCategory(cat);
                  sessionStorage.setItem('pb_category', cat);
                  setSelectedSubcategory(ALL_LABEL);
                  sessionStorage.setItem('pb_subcategory', ALL_LABEL);
                  sessionStorage.setItem('pb_scroll', '0');
                  if (listRef.current) listRef.current.scrollTop = 0;
                  setActiveDropdown(null);
                }}>{categoryLabel[cat] ?? cat}</button>
              ))}
            </div>
          )}
          {activeDropdown === 'subcategory' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(selectedCategory === '음식점' ? FOOD_SUBCATEGORIES : MEDICAL_SUBCATEGORIES).map(sub => (
                <button key={sub} style={{
                  ...chipBase,
                  background: selectedSubcategory === sub ? getActiveColor(selectedCategory) : (isDark ? '#2A2A2A' : '#F0F0F0'),
                  color: selectedSubcategory === sub ? '#FFF' : (isDark ? '#CCC' : '#555'),
                }} onClick={() => {
                  setSelectedSubcategory(sub);
                  sessionStorage.setItem('pb_subcategory', sub);
                  sessionStorage.setItem('pb_scroll', '0');
                  if (listRef.current) listRef.current.scrollTop = 0;
                  setActiveDropdown(null);
                }}>{sub}</button>
              ))}
            </div>
          )}
          {activeDropdown === 'sort' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(['rating', 'name', 'distance'] as const).map(s => (
                <button key={s} style={{
                  ...chipBase,
                  background: sortOrder === s ? (isDark ? '#3A3A3A' : '#1A1A1A') : (isDark ? '#2A2A2A' : '#F0F0F0'),
                  color: sortOrder === s ? '#FFF' : (isDark ? '#CCC' : '#555'),
                  opacity: s === 'distance' && locationDenied ? 0.4 : 1,
                  cursor: s === 'distance' && locationDenied ? 'not-allowed' : 'pointer',
                }} onClick={() => {
                  if (s === 'distance' && locationDenied) return;
                  setSortOrder(s);
                  sessionStorage.setItem('pb_sort', s);
                  setActiveDropdown(null);
                }}>{sortLabels[s]}{s === 'distance' && locationDenied ? ' (권한없음)' : ''}</button>
              ))}
            </div>
          )}
          {activeDropdown === 'city' && (
            <div>
              {CONTINENTS.map(continent =>
                continent.countries
                  .filter(country => country.cities.some(c => c.active))
                  .map(country => (
                    <div key={country.key} style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#888' : '#999', margin: '0 0 6px', letterSpacing: '0.5px' }}>
                        {country.label}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {country.cities.filter(c => c.active).map(c => (
                          <button key={c.key} style={{
                            ...chipBase,
                            background: city === c.key ? (isDark ? '#3A3A3A' : '#1A1A1A') : (isDark ? '#2A2A2A' : '#F0F0F0'),
                            color: city === c.key ? '#FFF' : (isDark ? '#CCC' : '#555'),
                          }} onClick={() => handleCitySelect(c.key, true)}>
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      )}

      {activeDropdown && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setActiveDropdown(null)} />
      )}

      <div
        ref={listRef}
        style={styles.listContainer}
        onScroll={() => sessionStorage.setItem('pb_scroll', String(listRef.current?.scrollTop ?? 0))}
      >
        {selectedCategory === '의료' && (
          <div style={{
            background: isDark ? '#1A1A1A' : '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <span style={{ fontSize: '12px', color: '#2980B9', fontWeight: 'bold' }}>🚑 {lang === 'en' ? 'Ambulance' : '구급·응급신고'}</span>
              <p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: '16px', color: isDark ? '#FFFFFF' : '#1A1A1A' }}>{EMERGENCY_NUMBERS[city ?? '']?.ambulance ?? '115'}</p>
            </div>
            <button
              style={{
                background: 'transparent',
                color: isDark ? '#7DBA31' : '#C0392B',
                border: `1.5px solid ${isDark ? '#7DBA31' : '#C0392B'}`,
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
              onClick={() => window.location.href = `tel:${EMERGENCY_NUMBERS[city ?? '']?.ambulance ?? '115'}`}
            >
              📞 {t(lang, 'call')}
            </button>
          </div>
        )}

        {selectedCategory === '관공·긴급' && (
          <>
            <div style={{
              background: isDark ? '#1A1A1A' : '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <span style={{ fontSize: '12px', color: '#FF6B35', fontWeight: 'bold' }}>🚔 경찰신고</span>
                <p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: '16px', color: isDark ? '#FFFFFF' : '#1A1A1A' }}>{EMERGENCY_NUMBERS[city ?? '']?.police ?? '113'}</p>
              </div>
              <button
                style={{
                  background: 'transparent',
                  color: isDark ? '#7DBA31' : '#C0392B',
                  border: `1.5px solid ${isDark ? '#7DBA31' : '#C0392B'}`,
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
                onClick={() => window.location.href = `tel:${EMERGENCY_NUMBERS[city ?? '']?.police ?? '113'}`}
              >
                📞 전화
              </button>
            </div>

            {EMERGENCY_NUMBERS[city ?? '']?.touristPolice && (
              <div style={{
                background: isDark ? '#1A1A1A' : '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 14px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#FF6B35', fontWeight: 'bold' }}>👮 관광경찰</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: '16px', color: isDark ? '#FFFFFF' : '#1A1A1A' }}>
                    {EMERGENCY_NUMBERS[city ?? '']?.touristPolice}
                  </p>
                </div>
                <button
                  style={{
                    background: 'transparent',
                    color: isDark ? '#7DBA31' : '#C0392B',
                    border: `1.5px solid ${isDark ? '#7DBA31' : '#C0392B'}`,
                    borderRadius: '8px',
                    padding: '7px 14px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                  onClick={() => window.location.href = `tel:${EMERGENCY_NUMBERS[city ?? '']?.touristPolice}`}
                >
                  📞 전화
                </button>
              </div>
            )}
          </>
        )}
        {filteredBusinesses.map((b) => (
          <div
            key={b.id}
            style={{ ...styles.card, cursor: (b as any).google_place_id ? 'pointer' : 'default' }}
            onClick={() => { if ((b as any).google_place_id) { sessionStorage.setItem('pb_is_back', 'true'); navigate('/biz/' + (b as any).google_place_id); } }}
          >
            <div style={styles.cardHeader}>
              <span style={styles.businessName}>{lang === 'en' ? ((b as any).name_en || (b as any).name_ko || b.name) : ((b as any).name_ko || b.name)}</span>
              {(b as any).is_korean_run && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={kimchiLogo}
                    alt="한국인 운영"
                    style={{ width: '28px', height: '28px', objectFit: 'contain', cursor: 'pointer' }}
                    onClick={() => {
                      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
                      if (tooltipId === b.id) {
                        setTooltipId(null);
                      } else {
                        setTooltipId(b.id);
                        tooltipTimerRef.current = setTimeout(() => setTooltipId(null), 5000);
                      }
                    }}
                  />
                  {tooltipId === b.id && (
                    <div style={{
                      position: 'absolute', bottom: '34px', right: 0,
                      backgroundColor: '#C0392B', color: '#FFF',
                      padding: '6px 10px', borderRadius: '8px',
                      fontSize: '12px', whiteSpace: 'nowrap',
                      zIndex: 50, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}>
                      한국인이 운영/근무하는 곳이에요 🇰🇷
                      <div style={{
                        position: 'absolute', bottom: '-6px', right: '8px',
                        width: 0, height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid #C0392B',
                      }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {(() => {
              const GENERIC_TYPES = ['음식점', '한식당', '한국 음식점', '한국 요리', '식당', '레스토랑', '음식'];
              const typeKo = (b as any).primary_type_ko;
              return typeKo && !GENERIC_TYPES.includes(typeKo) ? (
                <p style={{ fontSize: '12px', color: muted, margin: '4px 0 0' }}>{typeKo}</p>
              ) : null;
            })()}
            
            <p style={{...styles.addressText, margin: '4px 0 0'}}>{b.address}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {(b as any).google_rating && (
                  <span style={{ fontSize: '12px', color: '#E65100', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    ⭐ 구글 {((b as any).google_rating as number).toFixed(1)}
                  </span>
                )}
                {(b as any).ok_score_avg && (
                  <span style={{ fontSize: '12px', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <img src={kimchiLogo} alt="OK" style={{ width: '14px', height: '14px', objectFit: 'contain' }} />
                    OK {(b as any).ok_score_avg}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {((b as any).google_place_id || (b.lat && b.lng)) && (
                  <button
                    style={styles.button(false)}
                    onClick={(e) => {
                      e.stopPropagation();
                      const name = encodeURIComponent((b as any).name_ko || b.name || '');
                      const placeId = (b as any).google_place_id;
                      const url = placeId
                        ? 'https://www.google.com/maps/search/?api=1&query=' + name + '&query_place_id=' + placeId
                        : b.lat && b.lng
                        ? 'https://www.google.com/maps/search/?api=1&query=' + b.lat + ',' + b.lng
                        : 'https://www.google.com/maps/search/?api=1&query=' + name;
                      window.location.href = url;
                    }}
                  >
                    🗺️ {t(lang, 'map')}
                  </button>
                )}
                {b.phone ? (
                  <button
                    style={{ ...styles.button(true), marginLeft: 0 }}
                    onClick={(e) => { e.stopPropagation(); window.location.href = 'tel:' + b.phone; }}
                  >
                    📞 {t(lang, 'call')}
                  </button>
                ) : (
                  <span style={styles.noPhoneText}>{lang === 'en' ? 'No phone number' : '전화번호 없음'}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
