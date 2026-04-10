import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/', label: '전화번호부', icon: '📋' },
  { path: '/map', label: '김치맵', icon: '🗺️' },
  { path: '/news', label: '소식', icon: '📰' },
  { path: '/mypage', label: '내정보', icon: '👤' },
]

interface BottomNavProps {
  isDark: boolean
}

export default function BottomNav({ isDark }: BottomNavProps) {
  const location = useLocation()
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
      borderTop: `1px solid ${isDark ? '#333' : '#E0E0E0'}`,
      display: 'flex',
    }}>
      {tabs.map(tab => (
        <Link key={tab.path} to={tab.path} style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 0',
          textDecoration: 'none',
          color: location.pathname === tab.path ? '#C0392B' : (isDark ? '#888888' : '#555555'),
          fontSize: '10px',
          gap: '2px',
        }}>
          <span style={{ fontSize: '20px' }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}