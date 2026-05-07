import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { useState, useEffect } from 'react'
import { APIProvider } from '@vis.gl/react-google-maps';
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import PhoneBook from './pages/PhoneBook'
import KimchiMap from './pages/KimchiMap'
import News from './pages/News'
import MyPage from './pages/MyPage'
import Register from './pages/Register';
import Admin from './pages/Admin';
import Inquiry from './pages/Inquiry';
import Policy from './pages/Policy';
import { useCity } from './hooks/useCity';
import KoreaOnboarding from './components/KoreaOnboarding';
import BusinessDetail from './pages/BusinessDetail';

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const { city, changeCity, CITY_CENTERS, pendingCity, confirmDetectedCity, rejectDetectedCity, isInKorea, setIsInKorea } = useCity();
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#111111' : '#F5F5F5'
    document.body.style.color = isDark ? '#FFFFFF' : '#1A1A1A'
  }, [isDark])

  return (
    <LanguageProvider>
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <BrowserRouter>
      <Header isDark={isDark} setIsDark={setIsDark} city={city} changeCity={changeCity} CITY_CENTERS={CITY_CENTERS} pendingCity={pendingCity} confirmDetectedCity={confirmDetectedCity} rejectDetectedCity={rejectDetectedCity} externalCityPickerOpen={cityPickerOpen} onExternalCityPickerClose={() => setCityPickerOpen(false)} emergencyMode={!!emergencyOpen} onEmergencyModeCity={(cityKey) => setEmergencyOpen(cityKey)} />
        {isInKorea && (
          <KoreaOnboarding
            isDark={isDark}
            onSelectCity={(c) => {
              changeCity(c);
              setIsInKorea(false);
              localStorage.setItem('onboarding_done', 'true');
            }}
            onOpenCityPicker={() => {
              setIsInKorea(false);
              localStorage.setItem('onboarding_done', 'true');
              setCityPickerOpen(true);
            }}
          />
        )}
        <div style={{ paddingTop: '65px', paddingBottom: '65px' }}>
          <Routes>
            <Route path="/" element={<PhoneBook isDark={isDark} city={city} changeCity={changeCity} CITY_CENTERS={CITY_CENTERS} />} />
            <Route path="/biz/:id" element={<BusinessDetail isDark={isDark} />} />
            <Route path="/map" element={<KimchiMap isDark={isDark} city={city} CITY_CENTERS={CITY_CENTERS} />} />
            <Route path="/news" element={<News isDark={isDark} city={city} />} />
            <Route path="/mypage" element={<MyPage isDark={isDark} />} />
            <Route path="/register" element={<Register isDark={isDark} />} />
            <Route path="/admin" element={<Admin isDark={isDark} city={city} />} />
            <Route path="/inquiry" element={<Inquiry isDark={isDark} />} />
            <Route path="/policy" element={<Policy />} />
          </Routes>
        </div>
        <BottomNav isDark={isDark} onEmergency={() => setEmergencyOpen(city ?? 'hanoi')} />
        {emergencyOpen && (() => {
          const COUNTRY_MAP: Record<string, { label: string; ambulance: string; police: string; touristPolice?: string; embassy?: string }> = {
            hanoi: { label: '🇻🇳 베트남', ambulance: '115', police: '113', embassy: '+84-90-402-6126' },
            hochiminh: { label: '🇻🇳 베트남', ambulance: '115', police: '113', embassy: '+84-90-402-6126' },
            danang: { label: '🇻🇳 베트남', ambulance: '115', police: '113', embassy: '+84-90-402-6126' },
            haiphong: { label: '🇻🇳 베트남', ambulance: '115', police: '113', embassy: '+84-90-402-6126' },
            bacninh: { label: '🇻🇳 베트남', ambulance: '115', police: '113', embassy: '+84-90-402-6126' },
            bangkok: { label: '🇹🇭 태국', ambulance: '1669', police: '191', touristPolice: '1155', embassy: '+66-81-914-5803' },
            chiangmai: { label: '🇹🇭 태국', ambulance: '1669', police: '191', touristPolice: '1155', embassy: '+66-81-914-5803' },
            manila: { label: '🇵🇭 필리핀', ambulance: '911', police: '911', embassy: '+63-917-817-5703' },
            cebu: { label: '🇵🇭 필리핀', ambulance: '911', police: '911', embassy: '+63-917-817-5703' },
            taipei: { label: '🇹🇼 대만', ambulance: '119', police: '110', embassy: '+886-912-069-230' },
            kaohsiung: { label: '🇹🇼 대만', ambulance: '119', police: '110', embassy: '+886-912-069-230' },
            auckland: { label: '🇳🇿 뉴질랜드', ambulance: '111', police: '111', embassy: '+64-21-0269-3271' },
          };
          const info = COUNTRY_MAP[emergencyOpen ?? ''] ?? COUNTRY_MAP[city ?? ''];
          if (!info) return null;
          return (
            <div onClick={() => setEmergencyOpen(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div onClick={e => e.stopPropagation()} style={{ width: '85%', maxWidth: '360px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '16px', margin: 0, color: '#1A1A1A' }}>긴급번호</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCityPickerOpen(true); }}
                    style={{
                      background: '#F0F0F0', border: 'none', borderRadius: '20px',
                      padding: '4px 12px', fontSize: '13px', fontWeight: 600,
                      color: '#1A1A1A', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    📍 {info.label} <span style={{ fontSize: '10px', opacity: 0.6 }}>▾</span>
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div><span style={{ fontSize: '12px', color: '#2980B9', fontWeight: 'bold' }}>🚑 구급·응급신고</span><p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: '22px', color: '#1A1A1A' }}>{info.ambulance}</p></div>
                  <button onClick={() => window.location.href = 'tel:' + info.ambulance} style={{ background: 'transparent', color: '#C0392B', border: '1.5px solid #C0392B', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' }}>📞 전화</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: info.touristPolice || info.embassy ? '12px' : '20px' }}>
                  <div><span style={{ fontSize: '12px', color: '#FF6B35', fontWeight: 'bold' }}>🚔 경찰신고</span><p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: '22px', color: '#1A1A1A' }}>{info.police}</p></div>
                  <button onClick={() => window.location.href = 'tel:' + info.police} style={{ background: 'transparent', color: '#C0392B', border: '1.5px solid #C0392B', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' }}>📞 전화</button>
                </div>
                {info.touristPolice && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div><span style={{ fontSize: '12px', color: '#27AE60', fontWeight: 'bold' }}>🚔 관광경찰</span><p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: '22px', color: '#1A1A1A' }}>{info.touristPolice}</p></div>
                    <button onClick={() => window.location.href = 'tel:' + info.touristPolice} style={{ background: 'transparent', color: '#C0392B', border: '1.5px solid #C0392B', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' }}>📞 전화</button>
                  </div>
                )}
                {info.embassy && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div><span style={{ fontSize: '12px', color: '#8E44AD', fontWeight: 'bold' }}>🏛️ 한국 대사관 당직</span><p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: '18px', color: '#1A1A1A' }}>{info.embassy}</p></div>
                    <button onClick={() => window.location.href = 'tel:' + info.embassy} style={{ background: 'transparent', color: '#C0392B', border: '1.5px solid #C0392B', borderRadius: '8px', padding: '7px 14px', fontSize: '13px', cursor: 'pointer' }}>📞 전화</button>
                  </div>
                )}
                <button onClick={() => setEmergencyOpen(null)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#F0F0F0', border: 'none', fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A', cursor: 'pointer' }}>닫기</button>
              </div>
            </div>
          );
        })()}
      </BrowserRouter>
    </APIProvider>
    </LanguageProvider>
  )
}
