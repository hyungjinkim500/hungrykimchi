import { useState, useEffect } from 'react';
import { supabase, signInWithKakao, signOut } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Props {
  isDark: boolean;
}

export default function MyPage({ isDark }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const containerStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#111111' : '#F5F5F5',
    color: isDark ? '#FFFFFF' : '#1A1A1A',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: '65px',
    bottom: '65px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    padding: '24px',
    boxSizing: 'border-box',
  };

  if (loading) return <div style={containerStyle}>불러오는 중...</div>;

  if (!user) {
    return (
      <div style={containerStyle}>
        <img src="/kimchi_level5_nb.png" alt="logo" style={{ width: '64px', marginBottom: '16px' }} />
        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>헝그리김치</p>
        <p style={{ fontSize: '14px', color: isDark ? '#888' : '#666', marginBottom: '32px', textAlign: 'center' }}>
          로그인하면 업체 제보, 리뷰 작성 등<br />더 많은 기능을 이용할 수 있어요
        </p>
        <button
          onClick={async () => { try { await signInWithKakao(); } catch (e) { alert('로그인 중 오류가 발생했어요'); } }}
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            background: '#FEE500',
            color: '#1A1A1A',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" style={{ width: '24px', height: '24px' }} />
          카카오로 시작하기
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <img
        src={user.user_metadata?.avatar_url || '/kimchi_level5_nb.png'}
        alt="프로필"
        style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}
      />
      <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
        {user.user_metadata?.full_name || user.user_metadata?.name || '헝김 유저'}
      </p>
      <p style={{ fontSize: '13px', color: isDark ? '#888' : '#666', marginBottom: '32px' }}>
        {user.email || ''}
      </p>
      <button
        onClick={async () => { try { await signOut(); } catch (e) { alert('로그아웃 중 오류가 발생했어요'); } }}
        style={{
          padding: '10px 24px',
          borderRadius: '10px',
          border: '1.5px solid #C0392B',
          background: 'transparent',
          color: '#C0392B',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
