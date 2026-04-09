import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import BottomNav from './components/layout/BottomNav'
import PhoneBook from './pages/PhoneBook'
import KimchiMap from './pages/KimchiMap'
import News from './pages/News'
import MyPage from './pages/MyPage'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{ paddingTop: '65px', paddingBottom: '65px' }}>
        <Routes>
          <Route path="/" element={<PhoneBook />} />
          <Route path="/map" element={<KimchiMap />} />
          <Route path="/news" element={<News />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  )
}
