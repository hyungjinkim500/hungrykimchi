import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import kimchiLogoLight from '../../assets/images/kimchi_level5_nb.png';
import kimchiLogoDark from '../../assets/images/kimchi_level2_nb.png';

const pageTitles: Record<string, string> = {
  '/': '한인업체 전화번호부',
  '/map': '김치맵 — 하노이',
  '/news': '소식 — 하노이',
  '/mypage': '내 정보',
  '/register': '신규 업체 등록/제보',
};

interface HeaderProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const subtitle = pageTitles[location.pathname] ?? '';
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    closeMenu();
  };

  const menuItems = [
    { label: isDark ? '☀️ 라이트 모드' : '🌙 다크 모드', action: () => setIsDark(!isDark) },
    { label: '📝 업체 제보', action: () => { navigate('/register?type=suggestion'); } },
    { label: '🏪 업체 등록/수정 (사장님)', action: () => { navigate('/register?type=owner'); } },
    { label: '로그인', action: () => alert('준비 중입니다') },
    { label: '공지사항', action: () => alert('준비 중입니다') },
    { label: '광고·제휴 문의', action: () => alert('준비 중입니다') },
  ];

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
        onClick={handleMenuToggle}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '22px',
          cursor: 'pointer',
          color: isDark ? '#FFFFFF' : '#1A1A1A',
        }}
      >
        ☰
      </button>

      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '0',
          width: '200px',
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          border: `1px solid ${isDark ? '#333' : '#E0E0E0'}`,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 200,
          overflow: 'hidden',
        }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleMenuItemClick(item.action)}
              style={{
                padding: '14px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                borderBottom: index < menuItems.length - 1 ? `1px solid ${isDark ? '#333' : '#E0E0E0'}` : 'none',
                color: isDark ? '#FFFFFF' : '#1A1A1A',
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}