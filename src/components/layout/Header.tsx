import { useLocation } from 'react-router-dom'
import kimchiLogoLight from '../../assets/images/kimchi_level5_nb.png'
import kimchiLogoDark from '../../assets/images/kimchi_level2_nb.png'

const pageTitles: Record<string, string> = {
  '/': '한인업체 전화번호부',
  '/map': '김치맵 — 하노이',
  '/news': '소식 — 하노이',
  '/mypage': '내 정보',
}

interface HeaderProps {
  isDark: boolean
  setIsDark: (v: boolean) => void
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
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
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      borderBottom: `1px solid ${isDark ? '#333' : '#E0E0E0'}`,
      padding: '10px 16px',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={isDark ? kimchiLogoDark : kimchiLogoLight} alt="헝그리김치" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: isDark ? '#FFFFFF' : '#1A1A1A', fontWeight: 700, fontSize: '16px', lineHeight: 1.2 }}>
            헝그리김치
          </span>
          <span style={{ color: '#888888', fontSize: '11px' }}>
            {subtitle}
          </span>
        </div>
      </div>
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          background: 'none',
          border: `1px solid ${isDark ? '#555' : '#CCC'}`,
          borderRadius: '20px',
          padding: '4px 10px',
          cursor: 'pointer',
          color: isDark ? '#FFFFFF' : '#1A1A1A',
          fontSize: '13px',
        }}
      >
        {isDark ? '☀️ 라이트' : '🌙 다크'}
      </button>
    </header>
  )
}