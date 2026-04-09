import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/': '한인업체 전화번호부',
  '/map': '김치맵 — 하노이',
  '/news': '소식 — 하노이',
  '/mypage': '내 정보',
}

export default function Header() {
  const location = useLocation()
  const subtitle = pageTitles[location.pathname] ?? ''

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      backgroundColor: '#1A1A1A',
      borderBottom: '1px solid #333',
      padding: '10px 16px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '18px' }}>
        🌶️ 헝그리김치
      </span>
      <span style={{ color: '#888888', fontSize: '12px', marginTop: '2px' }}>
        {subtitle}
      </span>
    </header>
  )
}
