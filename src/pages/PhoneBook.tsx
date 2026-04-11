
import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import type { Business } from '../types/index';
import { CATEGORIES } from '../constants/categories';
import { supabase } from '../lib/supabase';

interface Props {
  isDark: boolean;
}

export default function PhoneBook({ isDark }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('businesses').select('*');
      if (error) {
        setError(error.message);
      } else {
        setBusinesses(data as Business[]);
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  const fuseOptions = {
    keys: ['name', 'subcategory', 'address'],
    threshold: 0.4,
  };

  const filteredBusinesses = (() => {
    const categoryFiltered = selectedCategory === '전체'
      ? businesses
      : businesses.filter((b) => b.category === selectedCategory);

    if (!searchQuery.trim()) return categoryFiltered;

    const fuseCat = new Fuse(categoryFiltered, fuseOptions);
    return fuseCat.search(searchQuery).map((r) => r.item);
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
      height: '48px',
      padding: '0 16px',
      gap: '8px',
      scrollbarWidth: 'none',
    } as React.CSSProperties,
    categoryChip: (isActive: boolean) => ({
      height: '32px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isActive ? '#C0392B' : isDark ? '#2A2A2A' : '#E0E0E0',
      color: isActive ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A',
      padding: '0 12px',
      borderRadius: '16px',
      fontSize: '13px',
      cursor: 'pointer',
      flexShrink: 0,
      border: 'none',
      whiteSpace: 'nowrap',
      lineHeight: '1',
      boxSizing: 'border-box',
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
      background: primary ? '#C0392B' : isDark ? '#2A2A2A' : '#E8E8E8',
      color: primary ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A',
      borderRadius: '8px',
      padding: '7px 14px',
      fontSize: '13px',
      border: 'none',
      cursor: 'pointer',
      marginLeft: '8px',
    }),
    noPhoneText: {
      color: '#888',
      fontSize: '13px',
      marginRight: 'auto',
    },
  };
  
  // Hide scrollbar for Webkit browsers
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

  return (
    <div style={styles.container}>
      <style>{customStyles}</style>
      <div style={styles.categoryContainer} className="no-scrollbar">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            style={styles.categoryChip(selectedCategory === category)}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
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
        {filteredBusinesses.map((business) => (
          <div key={business.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.businessName}>{business.name}</span>
              {business.category === '음식점' && (
                <span style={styles.okBadge}>Lv.{business.ok_level}</span>
              )}
            </div>

            <p style={{...styles.mutedText, marginTop: '4px', marginBottom: 0}}>
              {business.subcategory && `${business.subcategory} · `}{business.category}
            </p>
            
            <p style={{...styles.addressText, margin: '4px 0 0'}}>
                {business.address}
            </p>

            {business.google_rating && (
              <p style={{...styles.ratingText, margin: '4px 0 0'}}>
                ⭐ {business.google_rating}
              </p>
            )}

            <div style={styles.buttonContainer}>
              {business.phone ? (
                <button
                  style={styles.button(true)}
                  onClick={() => window.location.href = `tel:${business.phone}`}
                >
                  📞 전화
                </button>
              ) : (
                <span style={styles.noPhoneText}>전화번호 없음</span>
              )}
              <button
                style={styles.button(false)}
                onClick={() => {
                  const url = business.lat && business.lng
                    ? `https://maps.google.com/?q=${business.lat},${business.lng}`
                    : `https://maps.google.com/?q=${encodeURIComponent(business.address || '')}`;
                  window.open(url, '_blank');
                }}
              >
                🗺️ 지도
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
