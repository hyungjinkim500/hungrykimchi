import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#111111' : '#F5F5F5'
    document.body.style.color = isDark ? '#FFFFFF' : '#1A1A1A'
  }, [isDark])

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <BrowserRouter>
        <Header isDark={isDark} setIsDark={setIsDark} city={city} changeCity={changeCity} CITY_CENTERS={CITY_CENTERS} pendingCity={pendingCity} confirmDetectedCity={confirmDetectedCity} rejectDetectedCity={rejectDetectedCity} externalCityPickerOpen={cityPickerOpen} onExternalCityPickerClose={() => setCityPickerOpen(false)} />
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
            <Route path="/" element={<PhoneBook isDark={isDark} city={city} />} />
            <Route path="/biz/:id" element={<BusinessDetail isDark={isDark} />} />
            <Route path="/map" element={<KimchiMap isDark={isDark} city={city} CITY_CENTERS={CITY_CENTERS} />} />
            <Route path="/news" element={<News isDark={isDark} />} />
            <Route path="/mypage" element={<MyPage isDark={isDark} />} />
            <Route path="/register" element={<Register isDark={isDark} />} />
            <Route path="/admin" element={<Admin isDark={isDark} city={city} />} />
            <Route path="/inquiry" element={<Inquiry isDark={isDark} />} />
            <Route path="/policy" element={<Policy />} />
          </Routes>
        </div>
        <BottomNav isDark={isDark} />
      </BrowserRouter>
    </APIProvider>
  )
}
