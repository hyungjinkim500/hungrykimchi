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
  question: '질문·추천',
  review: '맛집후기',
};

const TYPE_COLORS: Record<string, string> = {
  notice: '#C0392B',
  event: '#FF6B35',
  question: '#2D7A3A',
  review: '#1A6BB5',
};

const EMPTY_MESSAGES: Record<string, string> = {
  '전체': '아직 소식이 없어요 🌱',
  '공지': '등록된 공지가 없어요',
  '이벤트': '진행 중인 이벤트가 없어요',
  '질문·추천': '첫 번째 질문을 남겨보세요! (로그인 후 작성 가능, 준비중)',
  '맛집후기': '첫 번째 맛집후기를 남겨보세요! (로그인 후 작성 가능, 준비중)',
};

export default function NewsTab({ isDark }: Props) {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('전체');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const FILTERS = ['전체', '공지', '이벤트', '질문·추천', '맛집후기'];

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setNewsList(data as NewsItem[]);
      setLoading(false);
    };
    fetchNews();
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
              background: filter === f ? (isDark ? '#7DBA31' : '#C0392B') : isDark ? '#2A2A2A' : '#E0E0E0',
              color: filter === f ? '#FFFFFF' : isDark ? '#FFFFFF' : '#1A1A1A',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#888' : '#666', fontSize: '14px' }}>
          {EMPTY_MESSAGES[filter]}
        </div>
      ) : (
        filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedNews(item)}
            style={{
              background: isDark ? '#1A1A1A' : '#FFFFFF',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '10px',
              cursor: 'pointer',
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
          </div>
        ))
      )}

      {selectedNews && (
        <div
          onClick={() => setSelectedNews(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDark ? '#2A2A2A' : '#FFFFFF',
              padding: '24px',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '430px',
              position: 'relative',
              maxHeight: '80vh',
              overflowY: 'auto',
              color: isDark ? '#FFFFFF' : '#1A1A1A',
            }}
          >
            <button
              onClick={() => setSelectedNews(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: isDark ? '#FFF' : '#000',
                fontSize: '24px',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              &times;
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{
                    background: TYPE_COLORS[selectedNews.type] || '#888',
                    color: '#FFFFFF',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '11px',
                }}>
                    {TYPE_LABELS[selectedNews.type] || selectedNews.type}
                </span>
                <span style={{ fontSize: '12px', color: isDark ? '#888' : '#666' }}>
                    {new Date(selectedNews.created_at).toLocaleDateString('ko-KR')}
                </span>
            </div>
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 'bold' }}>{selectedNews.title}</h2>
            <p style={{ margin: 0, fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '1.7', color: isDark ? '#DDD' : '#333' }}>
              {selectedNews.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
