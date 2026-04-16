import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/', label: '전화번호부', icon: '📋' },
  { path: '/map', label: '김치맵', icon: '🗺️' },
  { path: '/news', label: '소식', icon: '📰' },
  { path: '/mypage', label: '내정보', icon: '👤' },
];

interface BottomNavProps {
  isDark: boolean;
}

export default function BottomNav({ isDark }: BottomNavProps) {
  const location = useLocation();

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
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0',
      zIndex: 100,
    }}>
      {tabs.map(tab => (
        <Link
          to={tab.path}
          key={tab.path}
          style={{
            textDecoration: 'none',
            color: location.pathname === tab.path ? (isDark ? '#7DBA31' : '#C0392B') : '#888888',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '11px',
            fontWeight: location.pathname === tab.path ? 700 : 400,
          }}
        >
          <span style={{ fontSize: '24px' }}>{tab.icon}</span>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
