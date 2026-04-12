import { Link, useLocation, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handlePlusClick = () => {
    switch (location.pathname) {
      case '/':
        navigate('/register');
        break;
      case '/map':
        alert('준비 중입니다');
        break;
      case '/news':
        alert('준비 중입니다');
        break;
      case '/mypage':
        navigate('/');
        break;
      default:
        navigate('/register');
        break;
    }
  };

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2, 4);

  const renderTab = (tab: { path: string; label: string; icon: string; }) => (
    <Link
      to={tab.path}
      key={tab.path}
      style={{
        textDecoration: 'none',
        color: location.pathname === tab.path ? (isDark ? '#FFFFFF' : '#C0392B') : '#888888',
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
  );

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
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', flex: 1 }}>
        {leftTabs.map(renderTab)}
      </div>
      <button
        onClick={handlePlusClick}
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#C0392B',
          color: '#FFFFFF',
          fontSize: '28px',
          border: 'none',
          marginBottom: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        +
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-around', flex: 1 }}>
        {rightTabs.map(renderTab)}
      </div>
    </nav>
  );
}
