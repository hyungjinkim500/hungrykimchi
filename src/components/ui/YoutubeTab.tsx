import { useState, useEffect } from 'react';

interface Props {
  isDark: boolean;
}

interface Video {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  publishedAt: string;
}

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const FIXED_CHANNELS = [
  { id: 'UCxh-thumbnail', name: '하노이맛집TV', query: '하노이 한식당' },
];

export default function YoutubeTab({ isDark }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const query = encodeURIComponent('하노이 한식 맛집');
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&order=date&key=${YOUTUBE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.items) {
          const mapped: Video[] = data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt,
          }));
          setVideos(mapped);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const cardStyle: React.CSSProperties = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    borderRadius: '12px',
    marginBottom: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
  };

  if (loading) return <div style={{ padding: '24px', textAlign: 'center' }}>불러오는 중...</div>;

  return (
    <div style={{ padding: '12px 16px' }}>
      {videos.map((video) => (
        <div
          key={video.id}
          style={cardStyle}
          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
        >
          <img src={video.thumbnail} alt={video.title} style={{ width: '100%', display: 'block' }} />
          <div style={{ padding: '10px 12px' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 'bold', fontSize: '14px', lineHeight: '1.4' }}>
              {video.title}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#888' : '#666' }}>
              {video.channelTitle} · {new Date(video.publishedAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}