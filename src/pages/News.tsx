import { useState } from 'react';
import YoutubeTab from '../components/ui/YoutubeTab';
import NewsTab from '../components/ui/NewsTab';

interface Props {
  isDark: boolean;
}

export default function News({ isDark }: Props) {
  const [activeTab, setActiveTab] = useState<'youtube' | 'news'>('youtube');

  const containerStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#111111' : '#F5F5F5',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: '65px',
    bottom: '65px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
  };

  const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    borderBottom: `2px solid ${isDark ? '#2A2A2A' : '#E0E0E0'}`,
    flexShrink: 0,
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 0',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? (isDark ? '#7DBA31' : '#C0392B') : isDark ? '#888' : '#666',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: isActive ? `2px solid ${isDark ? '#7DBA31' : '#C0392B'}` : '2px solid transparent',
    marginBottom: '-2px',
    background: 'none',
    cursor: 'pointer',
  });

  return (
    <div style={containerStyle}>
      <div style={tabBarStyle}>
        <button style={tabStyle(activeTab === 'youtube')} onClick={() => setActiveTab('youtube')}>
          🎬 추천 동영상
        </button>
        <button style={tabStyle(activeTab === 'news')} onClick={() => setActiveTab('news')}>
          📢 소식
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'youtube' ? (
          <YoutubeTab isDark={isDark} />
        ) : (
          <NewsTab isDark={isDark} />
        )}
      </div>
    </div>
  );
}