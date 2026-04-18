import { useState, useEffect, useRef, useMemo } from 'react';
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import type { Business, City } from '../types/index';
import { supabase } from '../lib/supabase';
import kimchiLogo from '../assets/images/kimchi_level5_nb.png';

interface Props {
  isDark: boolean;
  city: City;
  CITY_CENTERS: Record<string, { lat: number; lng: number; radius: number; label: string }>;
}

const PIN_COLORS: Record<string, { bg: string; border: string }> = {
  '음식점':   { bg: '#C0392B', border: '#8B1A1A' },
  '마트/슈퍼': { bg: '#7DBA31', border: '#4A7A1A' },
  '의료':     { bg: '#2980B9', border: '#1A5276' },
  '관공·긴급': { bg: '#FF6B35', border: '#CC4400' },
};
const DEFAULT_PIN = { bg: '#C0392B', border: '#8B1A1A' };
const FILTER_CATEGORIES = ['전체', '음식점', '마트/슈퍼', '의료', '관공·긴급'];

function KimchiMapInner({ isDark: _isDark, city, CITY_CENTERS }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const map = useMap();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return businesses
      .filter(b =>
        b.city === city &&
        (
          ((b as any).name_ko || b.name || '').toLowerCase().includes(q) ||
          (b.category || '').toLowerCase().includes(q)
        )
      )
      .slice(0, 5);
  }, [searchQuery, businesses, city]);

  const handleSelectResult = (b: Business) => {
    if (map && b.lat && b.lng) {
      map.panTo({ lat: b.lat, lng: b.lng });
      map.setZoom(17);
      setSelectedBusiness(b);
    }
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (map) {
          map.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          map.setZoom(15);
        }
      },
      () => {},
      { timeout: 5000 }
    );
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('id,name,name_ko,category,primary_type_ko,address,phone,lat,lng,google_place_id,is_korean_run,city')
        .not('lat', 'is', null)
        .not('lng', 'is', null)
        .eq('pending_approval', false)
        .limit(100000);
      if (data) setBusinesses(data as Business[]);
    };
    fetchBusinesses();
  }, []);

  const defaultCenter = city && CITY_CENTERS[city]
    ? { lat: CITY_CENTERS[city].lat, lng: CITY_CENTERS[city].lng }
    : { lat: 21.0285, lng: 105.8542 };

  const getDirectionsUrl = (business: Business) => {
    const name = encodeURIComponent((business as any).name_ko || business.name || '');
    const placeId = (business as any).google_place_id;
    if (placeId) {
      return `https://www.google.com/maps/search/?api=1&query=${name}&query_place_id=${placeId}`;
    }
    if (business.lat && business.lng) {
      return `https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`;
    }
    return null;
  };

  const filteredBusinesses = activeCategory === '전체'
    ? businesses.filter(b => b.city === city)
    : businesses.filter(b => b.city === city && b.category === activeCategory);

  return (
    <div style={{ position: 'fixed', top: '65px', bottom: '65px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px' }}>
      <div style={{
        position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', gap: '6px',
        backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '20px',
        padding: '6px 10px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}>
        {FILTER_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '4px 10px', borderRadius: '14px', border: 'none',
              fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
              background: activeCategory === cat
                ? (cat === '전체' ? '#555' : (PIN_COLORS[cat]?.bg ?? '#555'))
                : '#EEEEEE',
              color: activeCategory === cat ? '#FFFFFF' : '#333333',
              fontWeight: activeCategory === cat ? 'bold' : 'normal',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 검색 버튼 */}
      <button
        onClick={() => { setSearchOpen(v => !v); setTimeout(() => searchInputRef.current?.focus(), 50); }}
        style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 10,
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#FFFFFF', border: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          cursor: 'pointer', fontSize: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {searchOpen ? '✕' : '🔍'}
      </button>

      {/* 검색창 + 결과 드롭다운 */}
      {searchOpen && (
        <div style={{
          position: 'absolute', top: '56px', left: '10px', right: '10px', zIndex: 20,
        }}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="업체명 검색..."
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '12px',
              border: 'none', fontSize: '14px', outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF', color: '#1A1A1A',
            }}
          />
          {searchResults.length > 0 && (
            <div style={{
              marginTop: '4px', borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              backgroundColor: '#FFFFFF',
            }}>
              {searchResults.map(b => (
                <div
                  key={b.id}
                  onClick={() => handleSelectResult(b)}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #F0F0F0',
                    display: 'flex', flexDirection: 'column', gap: '2px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F5F5')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A' }}>
                    {(b as any).name_ko || b.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {b.category} · {b.address}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleMyLocation}
        style={{
          position: 'absolute', bottom: '120px', right: '10px', zIndex: 10,
          width: '40px', height: '40px', borderRadius: '50%',
          background: '#FFFFFF', border: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          cursor: 'pointer', fontSize: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ⊕
      </button>
      <Map
        mapId="3c0c11535be505e82aed68f4"
        defaultCenter={defaultCenter}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI={true}
        zoomControl={true}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        rotateControl={false}
        scaleControl={false}
      >
        {filteredBusinesses.map((business) => (
          <AdvancedMarker
            key={`biz-${business.id}`}
            position={{ lat: business.lat!, lng: business.lng! }}
            onClick={() => {
              setSelectedBusiness(business);
            }}
          >
            <Pin
              background={PIN_COLORS[business.category ?? '']?.bg ?? DEFAULT_PIN.bg}
              borderColor={PIN_COLORS[business.category ?? '']?.border ?? DEFAULT_PIN.border}
              glyphColor="#FFFFFF"
            />
          </AdvancedMarker>
        ))}

        {selectedBusiness && (
          <InfoWindow
            position={{ lat: selectedBusiness.lat!, lng: selectedBusiness.lng! }}
            onCloseClick={() => setSelectedBusiness(null)}
          >
            <div style={{ padding: '4px', minWidth: '160px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <p style={{ fontWeight: 'bold', margin: 0, fontSize: '14px' }}>
                  {(selectedBusiness as any).name_ko || selectedBusiness.name}
                </p>
                {(selectedBusiness as any).is_korean_run && (
                  <img
                    src={kimchiLogo}
                    alt="한국인 운영"
                    title="한국인이 운영/근무하는 곳이에요 🇰🇷"
                    style={{ width: '24px', height: '24px', objectFit: 'contain', marginLeft: '8px' }}
                  />
                )}
              </div>
              {(() => {
                const GENERIC_TYPES = ['음식점', '한식당', '한국 음식점', '한국 요리', '식당', '레스토랑', '음식'];
                const typeKo = (selectedBusiness as any).primary_type_ko;
                const display = typeKo && !GENERIC_TYPES.includes(typeKo) ? typeKo : null;
                return display ? (
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#666' }}>· {display}</p>
                ) : null;
              })()}
              {selectedBusiness.address && (
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#666' }}>
                  {selectedBusiness.address}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', gap: '8px' }}>
                {getDirectionsUrl(selectedBusiness) && (
                  <a
                    href={getDirectionsUrl(selectedBusiness)!}
                    onClick={(e) => { e.preventDefault(); window.location.href = getDirectionsUrl(selectedBusiness)!; }}
                    style={{ fontSize: '12px', color: '#1A73E8', textDecoration: 'none', whiteSpace: 'nowrap' }}
                  >
                    📍 구글맵에서 보기
                  </a>
                )}
                {selectedBusiness.phone && (
                  <a
                    href={`tel:${selectedBusiness.phone}`}
                    style={{
                      fontSize: '12px', color: '#C0392B', textDecoration: 'none',
                      border: '1.5px solid #C0392B', borderRadius: '6px',
                      padding: '3px 8px', whiteSpace: 'nowrap',
                    }}
                  >
                    📞 전화
                  </a>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}

export default function KimchiMap(props: Props) {
  return <KimchiMapInner {...props} />;
}
