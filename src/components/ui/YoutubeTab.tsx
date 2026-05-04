import { useState, useEffect } from 'react';
import type { City } from '../../types/index';

interface Props {
  isDark: boolean;
  city: City;
}

interface Video {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  publishedAt: string;
}

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const MYDINH_CHANNEL_ID = 'UC3qXp8R4YFMVW8K8cAjsQYw';

const CITY_QUERIES: Record<string, string> = {
  hanoi: '하노이 한식 맛집',
  hochiminh: '호치민 한식 맛집',
  danang: '다낭 한식 맛집',
  haiphong: '하이퐁 한식 맛집',
  bacninh: '박닌 한식 맛집',
  'vietnam-other': '베트남 한식 맛집',
  bangkok: '방콕 한식 맛집',
  chiangmai: '치앙마이 한식 맛집',
  taipei: '타이베이 한식 맛집',
  manila: '마닐라 한식 맛집',
  cebu: '세부 한식 맛집',
  auckland: '오클랜드 한식 맛집',
};

export default function YoutubeTab({ isDark, city }: Props) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mydinhVideos, setMydinhVideos] = useState<Video[]>([]);
  const [usedMydinhIds, setUsedMydinhIds] = useState<Set<string>>(new Set());

  const fetchMydinhShorts = async () => {
    try {
      const url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + MYDINH_CHANNEL_ID + '&type=video&videoDuration=short&maxResults=10&order=date&key=' + YOUTUBE_API_KEY;
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
        setMydinhVideos(mapped);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getRandomMydinhVideo = (currentVideos: Video[], used: Set<string>): Video | null => {
    const available = mydinhVideos.filter(v => !used.has(v.id) && !currentVideos.find(cv => cv.id === v.id));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  };

  const fetchVideos = async (pageToken?: string) => {
    try {
      const queryStr = CITY_QUERIES[city ?? ''] ?? '한식 맛집 해외';
      const query = encodeURIComponent(queryStr);
      let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + query + '&type=video&maxResults=10&order=date&key=' + YOUTUBE_API_KEY;
      if (pageToken) url += '&pageToken=' + pageToken;
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
        return { videos: mapped, nextPageToken: data.nextPageToken ?? null };
      }
    } catch (e) {
      console.error(e);
    }
    return { videos: [], nextPageToken: null };
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setVideos([]);
      setNextPageToken(null);
      await fetchMydinhShorts();
      const result = await fetchVideos();
      setVideos(result.videos);
      setNextPageToken(result.nextPageToken);
      setLoading(false);
    };
    init();
  }, [city]);

  const handleLoadMore = async () => {
    if (!nextPageToken) return;
    setLoadingMore(true);
    const result = await fetchVideos(nextPageToken);
    const newVideos = [...videos, ...result.videos];
    const randomMydinh = getRandomMydinhVideo(newVideos, usedMydinhIds);
    if (randomMydinh) {
      const insertIdx = newVideos.length - result.videos.length + Math.floor(Math.random() * result.videos.length);
      newVideos.splice(insertIdx, 0, randomMydinh);
      setUsedMydinhIds(prev => new Set([...prev, randomMydinh.id]));
    }
    setVideos(newVideos);
    setNextPageToken(result.nextPageToken);
    setLoadingMore(false);
  };

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
          onClick={() => window.open('https://www.youtube.com/watch?v=' + video.id, '_blank')}
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
      {nextPageToken && (
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0',
            color: isDark ? '#FFFFFF' : '#1A1A1A',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '12px',
          }}
        >
          {loadingMore ? '불러오는 중...' : '더 보기'}
        </button>
      )}
    </div>
  );
}