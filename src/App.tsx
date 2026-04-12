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

export default function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#111111' : '#F5F5F5'
    document.body.style.color = isDark ? '#FFFFFF' : '#1A1A1A'
  }, [isDark])

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <BrowserRouter>
        <Header isDark={isDark} setIsDark={setIsDark} />
        <div style={{ paddingTop: '65px', paddingBottom: '65px' }}>
          <Routes>
            <Route path="/" element={<PhoneBook isDark={isDark} />} />
            <Route path="/map" element={<KimchiMap isDark={isDark} />} />
            <Route path="/news" element={<News isDark={isDark} />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/register" element={<Register isDark={isDark} />} />
          </Routes>
        </div>
        <BottomNav isDark={isDark} />
      </BrowserRouter>
    </APIProvider>
  )
}