import { useState, useEffect } from 'react';
import type { City } from '../types/index';

const CITY_CENTERS: Record<string, { lat: number; lng: number; radius: number; label: string }> = {
  hanoi: { lat: 21.0285, lng: 105.8542, radius: 50000, label: '하노이' },
  hochiminh: { lat: 10.7769, lng: 106.7009, radius: 50000, label: '호치민' },
};

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function useCity() {
  const [city, setCity] = useState<City>(() => {
    const saved = localStorage.getItem('selected_city');
    return (saved as City) ?? 'hanoi';
  });
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selected_city');
    if (saved) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let detected: City = null;
        for (const [key, center] of Object.entries(CITY_CENTERS)) {
          const dist = getDistance(latitude, longitude, center.lat, center.lng);
          if (dist <= center.radius) {
            detected = key as City;
            break;
          }
        }
        if (detected) {
          setCity(detected);
          localStorage.setItem('selected_city', detected);
        }
        setDetecting(false);
      },
      () => setDetecting(false),
      { timeout: 5000 }
    );
  }, []);

  const changeCity = (newCity: City) => {
    setCity(newCity);
    if (newCity) localStorage.setItem('selected_city', newCity);
  };

  return { city, changeCity, detecting, CITY_CENTERS };
}