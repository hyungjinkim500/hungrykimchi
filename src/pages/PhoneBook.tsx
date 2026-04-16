import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import type { Business, City } from '../types/index';
import { CATEGORIES } from '../constants/categories';
import { supabase } from '../lib/supabase';
import kimchiLogo from '../assets/images/kimchi_level5_nb.png';

interface Props {
  isDark: boolean;
  city: City;
}

export default function PhoneBook({ isDark, city }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('음식점');
  const [searchQuery, setSearchQuery] = useState('');
  const [showKoreanOnly, setShowKoreanOnly] = useState(false);
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    if (!searchQuery.trim()) return sortByName(categoryFiltered);
    const fuseCat = new Fuse(categoryFiltered, fuseOptions);
    return sortByName(fuseCat.search(searchQuery).map((r) => r.item));
  })();

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
    categoryChip: (isActive: boolean) => ({
      height: '32px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isActive ? (isDark ? '#7DBA31' : '#C0392B') : isDark ? '#2A2A2A' : '#E0E0E0',
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
      <div style={{ display: 'flex', height: '48px', alignItems: 'center' }}>
        <div style={{ ...styles.categoryContainer, flex: 1 }} className="no-scrollbar">
          {CATEGORIES.filter(c => c !== '전체').map((category) => (
            <button
              key={category}
              style={styles.categoryChip(selectedCategory === category)}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowKoreanOnly(!showKoreanOnly)}
          style={{
            flexShrink: 0,
            marginLeft: '8px',
            marginRight: '16px',
            padding: '3px 6px',
            borderRadius: '10px',
            background: showKoreanOnly ? (isDark ? '#2A2A2A' : '#FFE8E8') : 'transparent',
            border: showKoreanOnly ? `2px solid ${isDark ? '#7DBA31' : '#C0392B'}` : '2px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img src={kimchiLogo} alt="한인 인증" style={{ width: '22px', height: '22px' }} />
        </button>
      </div>
      <input
        type="text"
        placeholder="업체명, 업종 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          boxSizing: ('border-box' as React.CSSProperties['boxSizing']),
          margin: '0 16px 8px',
          width: 'calc(100% - 32px)',
          padding: '10px 14px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: isDark ? '#2A2A2A' : '#E8E8E8',
          color: isDark ? '#FFFFFF' : '#1A1A1A',
          fontSize: '14px',
          outline: 'none',
        }}
      />
      <div style={styles.listContainer}>
        {filteredBusinesses.map((b) => (
          <div key={b.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.businessName}>{(b as any).name_ko || b.name}</span>
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
            
            <p style={{...styles.addressText, margin: '4px 0 0'}}>
                {b.address}
            </p>

            <div style={styles.buttonContainer}>
              {((b as any).google_place_id || (b.lat && b.lng)) && (
                <button
                  style={styles.button(false)}
                  onClick={() => {
                    const name = encodeURIComponent((b as any).name_ko || b.name || '');
                    const placeId = (b as any).google_place_id;
                    const url = placeId
                      ? `https://www.google.com/maps/search/?api=1&query=${name}&query_place_id=${placeId}`
                      : b.lat && b.lng
                      ? `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`
                      : `https://www.google.com/maps/search/?api=1&query=${name}`;
                    window.location.href = url;
                  }}
                >
                  🗺️ 지도
                </button>
              )}
              {b.phone ? (
                <button
                  style={styles.button(true)}
                  onClick={() => window.location.href = `tel:${b.phone}`}
                >
                  📞 전화
                </button>
              ) : (
                <span style={styles.noPhoneText}>전화번호 없음</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
