import { useState, useEffect } from 'react';
import { Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { Business } from '../types/index';
import { supabase } from '../lib/supabase';

interface Props {
  isDark: boolean;
}

export default function KimchiMap({ isDark: _isDark }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .not('lat', 'is', null)
        .not('lng', 'is', null);
      if (data) setBusinesses(data as Business[]);
    };
    fetch();
  }, []);

  const defaultCenter = { lat: 21.0285, lng: 105.8542 }; // 하노이 중심

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
            key={business.id}
            position={{ lat: business.lat!, lng: business.lng! }}
            onClick={() => setSelectedBusiness(business)}
          >
            <Pin
              background="#C0392B"
              borderColor="#8B1A1A"
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
              <p style={{ fontWeight: 'bold', margin: '0 0 4px', fontSize: '14px' }}>{selectedBusiness.name}</p>
              <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#666' }}>{selectedBusiness.subcategory} · {selectedBusiness.category}</p>
              {selectedBusiness.phone && (
                <a href={`tel:${selectedBusiness.phone}`} style={{ fontSize: '12px', color: '#C0392B' }}>📞 {selectedBusiness.phone}</a>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}