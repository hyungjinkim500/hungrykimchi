import { useState, useEffect } from 'react';
import type { City } from '../types/index';
import kimchiLogoLight from "../assets/images/kimchi_level5_nb.webp";

const ACTIVE_CITIES: City[] = ['hanoi', 'hochiminh', 'danang', 'bangkok', 'chiangmai', 'taipei'];

const SLIDES = [
  {
    emoji: '🌏',
    title: '해외여행/생활 준비중이세요?',
    desc: '1년에 약 2,900만 명의 한국인이 해외로 떠나지만,\n그중 단 1%만이 방문 국가의 정확한 경찰·구급 신고번호를 알고 있어요.',
  },
  {
    emoji: '🍚',
    title: '해외에서 제대로 된 한식이 먹고 싶을 때',
    desc: '헝그리김치는 해외에 있는 모든 한식당을 모으는\n원대한 꿈을 갖고 있어요!\n해외에서 한식이 생각날 때, 헝그리김치를 잊지 마세요!',
  },
  {
    emoji: '🏥',
    title: '해외에서 병원을 찾아야 할 때',
    desc: '헝그리김치는 해외에서 한국인이 비교적 안심하고\n방문할 수 있는 검증된 병원을 모으고 있어요!\n급히 병원 찾을 때, 헝그리김치를 잊지 마세요!',
  },
  {
    emoji: '🚨',
    title: '그 밖에도 헝그리김치는',
    desc: '해외 한국 마트, 한국 대사관 등 관공서,\n그리고 현지 지역구별 경찰서 번호와 주소를\n제공하는 서비스입니다.',
  },
];

interface Props {
  onSelectCity: (city: City) => void;
  onOpenCityPicker: () => void;
  isDark?: boolean;
}

export default function KoreaOnboarding({ onSelectCity, onOpenCityPicker }: Props) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleRandom = () => {
    const random = ACTIVE_CITIES[Math.floor(Math.random() * ACTIVE_CITIES.length)];
    onSelectCity(random);
  };

  const slide = SLIDES[slideIndex];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      backgroundColor: '#FFFFFF',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px',
    }}>
      {/* 로고 */}
      <img src={kimchiLogoLight} alt="헝그리김치"
        style={{ width: '64px', height: '64px', objectFit: 'contain', marginBottom: '12px' }} />
      <p style={{ color: '#C0392B', fontWeight: 800, fontSize: '22px', margin: '0 0 8px' }}>
        헝그리김치
      </p>
      <p style={{ color: '#888888', fontSize: '13px', margin: '0 0 32px' }}>
        한국에 계신 사용자님 안녕하세요!
      </p>

      {/* 슬라이드 카드 */}
      <div style={{
        width: '100%', maxWidth: '360px',
        backgroundColor: '#F8F8F8',
        borderRadius: '20px', padding: '28px 24px',
        minHeight: '180px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', marginBottom: '16px',
        transition: 'all 0.4s ease',
      }}>
        <span style={{ fontSize: '40px', marginBottom: '12px' }}>{slide.emoji}</span>
        <p style={{ color: '#1A1A1A', fontWeight: 700, fontSize: '16px', margin: '0 0 10px', lineHeight: 1.4 }}>
          {slide.title}
        </p>
        <p style={{ color: '#555555', fontSize: '13px', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
          {slide.desc}
        </p>
      </div>

      {/* 슬라이드 인디케이터 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '36px' }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => setSlideIndex(i)} style={{
            width: i === slideIndex ? '20px' : '8px', height: '8px',
            borderRadius: '4px',
            backgroundColor: i === slideIndex ? '#C0392B' : '#E0E0E0',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* 버튼들 */}
      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={onOpenCityPicker}
          style={{
            width: '100%', padding: '16px',
            borderRadius: '14px', border: 'none',
            backgroundColor: '#FFFFFF',
            border: '2px solid #C0392B',
            color: '#C0392B', fontWeight: 800,
            fontSize: '16px', cursor: 'pointer',
          }}
        >
          🌍 방문할 나라 선택하기
        </button>
        <button
          onClick={handleRandom}
          style={{
            width: '100%', padding: '16px',
            borderRadius: '14px',
            border: '2px solid #E0E0E0',
            backgroundColor: 'transparent',
            color: '#555555', fontWeight: 700,
            fontSize: '15px', cursor: 'pointer',
          }}
        >
          🎲 아무 데나 구경하기
        </button>
      </div>
    </div>
  );
}