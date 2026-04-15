
import { useState, useEffect } from 'react';
import { Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { Business, City } from '../types/index';
import { supabase } from '../lib/supabase';
import kimchiLogo from '../assets/images/kimchi_level5_nb.png';

interface Props {
  isDark: boolean;
  city: City;
  CITY_CENTERS: Record<string, { lat: number; lng: number; radius: number; label: string }>;
}

export default function KimchiMap({ isDark: _isDark, city, CITY_CENTERS }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .not('lat', 'is', null)
        .not('lng', 'is', null)
        .eq('pending_approval', false);
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

  return (
    <div style={{ position: 'fixed', top: '65px', bottom: '65px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px' }}>
      <Map
        mapId="kimchi-map"
        defaultCenter={defaultCenter}
        defaultZoom={13}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {businesses.map((business) => (
          <AdvancedMarker
            key={`biz-${business.id}`}
            position={{ lat: business.lat!, lng: business.lng! }}
            onClick={() => {
              setSelectedBusiness(business);
            }}
          >
            <Pin background="#C0392B" borderColor="#8B1A1A" glyphColor="#FFFFFF" />
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
