import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, signInWithKakao, signInWithGoogle, signOut, deleteUser } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

const RED = '#E8302A';
const RED_BG = '#FFF0EF';
const OK_COLOR = '#2E7D32';
const BORDER = '#EBEBEB';

interface Props {
  isDark: boolean;
}

type MyTab = 'reviews' | 'comments' | 'favorites';

export default function MyPage({ isDark }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<MyTab>('reviews');
  const [reviews, setReviews] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, tab]);

  const fetchData = async () => {
    if (!user) return;
    setDataLoading(true);

    if (tab === 'reviews') {
      const { data } = await supabase
        .from('reviews')
        .select('*, businesses!reviews_business_place_id_fkey(name_ko, name, category)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setReviews(data || []);
    }

    if (tab === 'comments') {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setComments(data || []);
    }

    if (tab === 'favorites') {
      const { data } = await supabase
        .from('favorites')
        .select('*, businesses!favorites_business_place_id_fkey(name_ko, name, category, subcategory, city)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setFavorites(data || []);
    }

    setDataLoading(false);
  };

  const bg = isDark ? '#111111' : '#F5F5F5';
  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const mutedColor = isDark ? '#888' : '#666';

  const containerStyle: React.CSSProperties = {
    backgroundColor: bg,
    color: textColor,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: '65px',
    bottom: '65px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    overflowY: 'auto',
    boxSizing: 'border-box',
  };

  if (loading) return <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center' }}>불러오는 중...</div>;

  if (!user) {
    return (
      <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <img src="/icon-192.png" alt="logo" style={{ width: '64px', marginBottom: '16px' }} />
        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>헝그리김치</p>
        <p style={{ fontSize: '14px', color: mutedColor, marginBottom: '32px', textAlign: 'center' }}>
          로그인하면 업체 제보, 리뷰 작성 등<br />더 많은 기능을 이용할 수 있어요
        </p>
        <button
          onClick={async () => { try { await signInWithKakao(); } catch (e) { alert('로그인 중 오류가 발생했어요'); } }}
          style={{ width: '100%', maxWidth: '320px', padding: '14px', borderRadius: '12px', border: 'none', background: '#FEE500', color: '#1A1A1A', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" style={{ width: '24px', height: '24px' }} />
          카카오로 시작하기
        </button>
        <button
          onClick={async () => { try { await signInWithGoogle(); } catch (e) { alert('로그인 중 오류가 발생했어요'); } }}
          style={{ width: '100%', maxWidth: '320px', padding: '14px', borderRadius: '12px', border: '1.5px solid #DADCE0', background: '#FFFFFF', color: '#1A1A1A', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}
        >
          <img src="https://www.google.com/favicon.ico" style={{ width: '20px', height: '20px' }} />
          구글로 시작하기
        </button>
        <button onClick={() => navigate('/policy')} style={{ marginTop: '32px', background: 'transparent', border: 'none', fontSize: '12px', color: mutedColor, cursor: 'pointer', textDecoration: 'underline' }}>
          개인정보처리방침 · 이용약관
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>

      {/* 프로필 */}
      <div style={{ background: cardBg, padding: '20px 20px 0', borderBottom: '0.5px solid ' + BORDER }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <img
            src={user.user_metadata?.avatar_url || '/icon-192.png'}
            alt="프로필"
            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{user.user_metadata?.full_name || user.user_metadata?.name || '헝김 유저'}</div>
            <div style={{ fontSize: 12, color: mutedColor }}>{user.email || ''}</div>
          </div>
          <button
            onClick={async () => { try { await signOut(); } catch (e) { alert('로그아웃 중 오류가 발생했어요'); } }}
            style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 8, border: '1.5px solid ' + RED, background: 'transparent', color: RED, fontSize: 13, cursor: 'pointer' }}
          >
            로그아웃
          </button>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex' }}>
          {([
            { key: 'reviews', label: '나의 리뷰' },
            { key: 'comments', label: '나의 댓글' },
            { key: 'favorites', label: '찜한 업체' },
          ] as { key: MyTab; label: string }[]).map(({ key, label }) => (
            <div key={key} onClick={() => setTab(key)} style={{
              flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              color: tab === key ? RED : mutedColor,
              borderBottom: tab === key ? '2px solid ' + RED : '2px solid transparent',
            }}>{label}</div>
          ))}
        </div>
      </div>

      {/* 콘텐츠 */}
      <div style={{ padding: '12px 16px', flex: 1 }}>
        {dataLoading && <div style={{ textAlign: 'center', padding: 24, color: mutedColor, fontSize: 14 }}>불러오는 중...</div>}

        {/* 나의 리뷰 */}
        {tab === 'reviews' && !dataLoading && (
          reviews.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: mutedColor, fontSize: 14 }}>아직 작성한 리뷰가 없어요 🍜</div>
            : reviews.map((rv: any) => (
              <div key={rv.id} onClick={() => navigate('/biz/' + rv.business_place_id)} style={{ background: cardBg, borderRadius: 12, padding: '14px', marginBottom: 10, cursor: 'pointer' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                  {rv.businesses?.name_ko || rv.businesses?.name || '업체'}
                </div>
                <div style={{ fontSize: 11, color: mutedColor, marginBottom: 8 }}>{rv.created_at?.slice(0, 10).replace(/-/g, '.')}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {rv.taste_score != null && (
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#FFF3E0', color: '#7B3F00' }}>맛 ★ {rv.taste_score}</span>
                  )}
                  {rv.ok_score != null && (
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#E8F5E9', color: '#1B5E20' }}>OK Score {rv.ok_score}</span>
                  )}
                </div>
                {rv.comment && <div style={{ fontSize: 13, color: mutedColor, marginTop: 8, lineHeight: 1.5 }}>{rv.comment}</div>}
              </div>
            ))
        )}

        {/* 나의 댓글 */}
        {tab === 'comments' && !dataLoading && (
          comments.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: mutedColor, fontSize: 14 }}>아직 작성한 댓글이 없어요 💬</div>
            : comments.map((c: any) => (
              <div key={c.id} onClick={() => navigate('/biz/' + c.business_place_id)} style={{ background: cardBg, borderRadius: 12, padding: '14px', marginBottom: 10, cursor: 'pointer' }}>
                <div style={{ fontSize: 11, color: mutedColor, marginBottom: 6 }}>{c.created_at?.slice(0, 10).replace(/-/g, '.')}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: textColor }}>{c.content}</div>
              </div>
            ))
        )}

        {/* 찜한 업체 */}
        {tab === 'favorites' && !dataLoading && (
          favorites.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: mutedColor, fontSize: 14 }}>찜한 업체가 없어요 🤍</div>
            : favorites.map((fav: any) => {
              const biz = fav.businesses;
              return (
                <div key={fav.id} onClick={() => navigate('/biz/' + fav.business_place_id)} style={{ background: cardBg, borderRadius: 12, padding: '14px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>❤️</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{biz?.name_ko || biz?.name || '업체'}</div>
                    <div style={{ fontSize: 12, color: mutedColor, marginTop: 2 }}>{biz?.category}{biz?.subcategory ? ' · ' + biz.subcategory : ''}</div>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* 하단 */}
      <div style={{ padding: '16px 20px 24px', display: 'flex', gap: 16, justifyContent: 'center', borderTop: '0.5px solid ' + BORDER }}>
        <button onClick={() => navigate('/policy')} style={{ background: 'transparent', border: 'none', fontSize: 12, color: mutedColor, cursor: 'pointer', textDecoration: 'underline' }}>
          개인정보처리방침 · 이용약관
        </button>
        <span style={{ fontSize: 12, color: BORDER }}>|</span>
        <button
          onClick={async () => {
            if (!window.confirm('정말 탈퇴하시겠어요?\n계정 및 모든 데이터가 삭제되며 복구할 수 없습니다.')) return;
            try { await deleteUser(); alert('탈퇴가 완료되었습니다.'); } catch (e) { alert('탈퇴 중 오류가 발생했어요.'); }
          }}
          style={{ background: 'transparent', border: 'none', fontSize: 12, color: mutedColor, cursor: 'pointer', textDecoration: 'underline' }}
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
}