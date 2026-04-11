import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Props {
  isDark: boolean;
}

interface NewsItem {
  id: string;
  type: string;
  title: string;
  content: string | null;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  notice: '공지',
  event: '이벤트',
  new: '신규등록',
  rss: '한인회',
};

const TYPE_COLORS: Record<string, string> = {
  notice: '#C0392B',
  event: '#FF6B35',
  new: '#2D7A3A',
  rss: '#1A6BB5',
};

export default function NewsTab({ isDark }: Props) {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('전체');

  const FILTERS = ['전체', '공지', '이벤트', '신규등록', '한인회'];

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setNewsList(data as NewsItem[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = filter === '전체'
    ? newsList
    : newsList.filter((n) => TYPE_LABELS[n.type] === filter);

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>불러오는 중...</div>;

  return (
    <div style={{ padding: '12px 16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto' }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              height: '30px',
              padding: '0 12px',
              borderRadius: '15px',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
              flexShrink: 0,
              background: filter === f ? '#C0392B' : isDark ? '#2A2A2A' : '#E0E0E0',
              color: filter === f ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#888' : '#666', fontSize: '14px' }}>
          아직 소식이 없어요 🌱
        </div>
      ) : (
        filtered.map((item) => (
          <div
            key={item.id}
            style={{
              background: isDark ? '#1A1A1A' : '#FFFFFF',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: TYPE_COLORS[item.type] || '#888',
                color: '#FFFFFF',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '11px',
              }}>
                {TYPE_LABELS[item.type] || item.type}
              </span>
              <span style={{ fontSize: '12px', color: isDark ? '#888' : '#666' }}>
                {new Date(item.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <p style={{ margin: '0 0 4px', fontWeight: 'bold', fontSize: '14px' }}>{item.title}</p>
            {item.content && (
              <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#888' : '#666', lineHeight: '1.5' }}>
                {item.content}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
