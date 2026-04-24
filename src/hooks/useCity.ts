import { useState, useEffect } from 'react';
import type { City } from '../types/index';

const CITY_CENTERS: Record<string, { lat: number; lng: number; radius: number; label: string }> = {
  hanoi:        { lat: 21.0285, lng: 105.8542, radius: 50000, label: '하노이' },
  hochiminh:    { lat: 10.7769, lng: 106.7009, radius: 50000, label: '호치민' },
  danang:       { lat: 16.0544, lng: 108.2022, radius: 50000, label: '다낭' },
  'vietnam-other': { lat: 16.0000, lng: 107.0000, radius: 999999, label: '베트남 기타' },
  bangkok:      { lat: 13.7563, lng: 100.5018, radius: 50000, label: '방콕' },
  chiangmai:    { lat: 18.7883, lng: 98.9853,  radius: 30000, label: '치앙마이' },
  pattaya:      { lat: 12.9236, lng: 100.8825, radius: 20000, label: '파타야' },
  phuket:       { lat: 7.8804,  lng: 98.3923,  radius: 30000, label: '푸켓' },
  huahin:       { lat: 12.5684, lng: 99.9577,  radius: 20000, label: '후아힌' },
  'thailand-other': { lat: 13.0000, lng: 100.0000, radius: 999999, label: '태국 기타' },
  kualalumpur:  { lat: 3.1390,  lng: 101.6869, radius: 50000, label: '쿠알라룸푸르' },
  johorbahru:   { lat: 1.4927,  lng: 103.7414, radius: 20000, label: '조호르바루' },
  kotakinabalu: { lat: 5.9804,  lng: 116.0735, radius: 20000, label: '코타키나발루' },
  penang:       { lat: 5.4141,  lng: 100.3288, radius: 20000, label: '페낭' },
  'malaysia-other': { lat: 4.0000, lng: 109.0000, radius: 999999, label: '말레이시아 기타' },
  singapore:    { lat: 1.3521,  lng: 103.8198, radius: 30000, label: '싱가포르' },
  jakarta:      { lat: -6.2088, lng: 106.8456, radius: 50000, label: '자카르타' },
  bali:         { lat: -8.3405, lng: 115.0920, radius: 30000, label: '발리' },
  'indonesia-other': { lat: -5.0000, lng: 117.0000, radius: 999999, label: '인도네시아 기타' },
  manila:       { lat: 14.5995, lng: 120.9842, radius: 30000, label: '마닐라' },
  cebu:         { lat: 10.3157, lng: 123.8854, radius: 20000, label: '세부' },
  'philippines-other': { lat: 12.0000, lng: 122.0000, radius: 999999, label: '필리핀 기타' },
  phnompenh:    { lat: 11.5564, lng: 104.9282, radius: 30000, label: '프놈펜' },
  siemreap:     { lat: 13.3633, lng: 103.8564, radius: 20000, label: '시엠립' },
  yangon:       { lat: 16.8661, lng: 96.1951,  radius: 30000, label: '양곤' },
  tokyo:        { lat: 35.6762, lng: 139.6503, radius: 50000, label: '도쿄' },
  osaka:        { lat: 34.6937, lng: 135.5023, radius: 30000, label: '오사카' },
  fukuoka:      { lat: 33.5904, lng: 130.4017, radius: 20000, label: '후쿠오카' },
  kyoto:        { lat: 35.0116, lng: 135.7681, radius: 20000, label: '교토' },
  nagoya:       { lat: 35.1815, lng: 136.9066, radius: 20000, label: '나고야' },
  sapporo:      { lat: 43.0618, lng: 141.3545, radius: 20000, label: '삿포로' },
  hiroshima:    { lat: 34.3853, lng: 132.4553, radius: 20000, label: '히로시마' },
  'japan-other': { lat: 36.0000, lng: 138.0000, radius: 999999, label: '일본 기타' },
  hongkong:     { lat: 22.3193, lng: 114.1694, radius: 20000, label: '홍콩' },
  taipei:       { lat: 25.0330, lng: 121.5654, radius: 20000, label: '타이베이' },
  kaohsiung:    { lat: 22.6273, lng: 120.3014, radius: 20000, label: '가오슝' },
  'taiwan-other': { lat: 23.5000, lng: 121.0000, radius: 999999, label: '대만 기타' },
  newdelhi:     { lat: 28.6139, lng: 77.2090,  radius: 30000, label: '뉴델리' },
  mumbai:       { lat: 19.0760, lng: 72.8777,  radius: 30000, label: '뭄바이' },
  'india-other': { lat: 20.0000, lng: 77.0000,  radius: 999999, label: '인도 기타' },
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
  const [pendingCity, setPendingCity] = useState<City>(null);

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
          setPendingCity(detected);
        }
        setDetecting(false);
      },
      () => setDetecting(false),
      { timeout: 5000 }
    );
  }, []);

  const confirmDetectedCity = () => {
    if (pendingCity) {
      setCity(pendingCity);
      localStorage.setItem('selected_city', pendingCity);
      setPendingCity(null);
    }
  };

  const rejectDetectedCity = () => {
    setPendingCity(null);
  };

  const changeCity = (newCity: City) => {
    setCity(newCity);
    if (newCity) localStorage.setItem('selected_city', newCity);
  };

  return { city, changeCity, detecting, CITY_CENTERS, pendingCity, confirmDetectedCity, rejectDetectedCity };
}
