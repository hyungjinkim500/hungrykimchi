import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { t } from '../../lib/i18n';

interface BottomNavProps {
  isDark: boolean;
  onEmergency: () => void;
}

export default function BottomNav({ isDark, onEmergency }: BottomNavProps) {
  const location = useLocation();
  const { lang } = useLanguage();

  const tabStyle = (path: string) => ({
    textDecoration: 'none' as const,
    color: location.pathname === path ? (isDark ? '#7DBA31' : '#C0392B') : '#888888',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    fontSize: '11px',
    fontWeight: location.pathname === path ? 700 : 400,
  });

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
      <Link to="/" style={tabStyle('/')}>
        <span style={{ fontSize: '24px' }}>📋</span>
        {t(lang, 'nav_phonebook')}
      </Link>
      <Link to="/map" style={tabStyle('/map')}>
        <span style={{ fontSize: '24px' }}>🗺️</span>
        {t(lang, 'nav_map')}
      </Link>
      <button
        onClick={onEmergency}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          fontSize: '11px', color: '#888888', padding: 0,
        }}
      >
        <span style={{ fontSize: '24px' }}>🚨</span>
        {t(lang, 'nav_emergency')}
      </button>
      <Link to="/news" style={tabStyle('/news')}>
        <span style={{ fontSize: '24px' }}>📰</span>
        {t(lang, 'nav_news')}
      </Link>
      <Link to="/mypage" style={tabStyle('/mypage')}>
        <span style={{ fontSize: '24px' }}>👤</span>
        {t(lang, 'nav_mypage')}
      </Link>
    </nav>
  );
}
