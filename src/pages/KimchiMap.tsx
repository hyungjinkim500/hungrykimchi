
import { useState, useEffect } from 'react';
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import type { Business } from '../types/index';
import { supabase } from '../lib/supabase';

interface Props {
  isDark: boolean;
}

interface PlaceMarker {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  vicinity?: string;
}

export default function KimchiMap({ isDark: _isDark }: Props) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [placeMarkers, setPlaceMarkers] = useState<PlaceMarker[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceMarker | null>(null);
  const map = useMap();

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .not('lat', 'is', null)
        .not('lng', 'is', null);
      if (data) setBusinesses(data as Business[]);
    };
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (!map) return;

    const cachedPlaces = sessionStorage.getItem('kimchi_places');
    if (cachedPlaces) {
      setPlaceMarkers(JSON.parse(cachedPlaces));
      return;
    }

    const placesService = new google.maps.places.PlacesService(map);
    const keywords = ['한식당', '한국음식', 'korean food', 'nhà hàng Hàn Quốc', '한식'];
    const hanoiCenter = { lat: 21.0285, lng: 105.8542 };
    const allPlaces: google.maps.places.PlaceResult[] = [];
    let requestsCompleted = 0;

    keywords.forEach(keyword => {
      const request = {
        location: hanoiCenter,
        radius: 5000,
        type: 'restaurant' as const,
        keyword: keyword
      };

      placesService.nearbySearch(request, (results, status) => {
        requestsCompleted++;
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          allPlaces.push(...results);
        }

        if (requestsCompleted === keywords.length) {
          const uniquePlaces = new Map<string, PlaceMarker>();
          allPlaces.forEach(place => {
            if (place.place_id && place.geometry?.location && place.name) {
              uniquePlaces.set(place.place_id, {
                placeId: place.place_id,
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                rating: place.rating,
                vicinity: place.vicinity
              });
            }
          });

          const markers = Array.from(uniquePlaces.values());
          setPlaceMarkers(markers);
          sessionStorage.setItem('kimchi_places', JSON.stringify(markers));
        }
      });
    });
  }, [map]);

  const defaultCenter = { lat: 21.0285, lng: 105.8542 };

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
              setSelectedPlace(null);
            }}
          >
            <Pin background="#C0392B" borderColor="#8B1A1A" glyphColor="#FFFFFF" />
          </AdvancedMarker>
        ))}

        {placeMarkers.map((place) => (
          <AdvancedMarker
            key={`place-${place.placeId}`}
            position={{ lat: place.lat, lng: place.lng }}
            onClick={() => {
              setSelectedPlace(place);
              setSelectedBusiness(null);
            }}
          >
            <Pin background="#1A73E8" borderColor="#1557B0" glyphColor="#FFFFFF" />
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
                <a href={`tel:${selectedBusiness.phone}`} style={{ fontSize: '12px', color: '#C0392B', textDecoration: 'none' }}>📞 {selectedBusiness.phone}</a>
              )}
            </div>
          </InfoWindow>
        )}

        {selectedPlace && (
          <InfoWindow
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div style={{ padding: '4px', minWidth: '160px' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px', fontSize: '14px' }}>{selectedPlace.name}</p>
              {selectedPlace.rating && (
                <p style={{ margin: '0 0 4px', fontSize: '12px' }}>⭐ {selectedPlace.rating}</p>
              )}
              <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#666' }}>{selectedPlace.vicinity}</p>
              <a href={`https://www.google.com/maps/place/?q=place_id:${selectedPlace.placeId}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#1A73E8', textDecoration: 'none' }}>
                구글 정보 보기
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}
