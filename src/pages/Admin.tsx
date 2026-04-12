import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Business } from '../types/index';

const ADMIN_ID = 'hyung64a';
const ADMIN_PW = 'hj0105';

interface Props { isDark: boolean }

export default function Admin({ isDark }: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [loginError, setLoginError] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');

  const handleLogin = () => {
    if (id === ADMIN_ID && pw === ADMIN_PW) {
      setLoggedIn(true);
    } else {
      setLoginError('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  useEffect(() => {
    if (!loggedIn) return;
    fetchBusinesses();
  }, [loggedIn, filter]);

  const fetchBusinesses = async () => {
    setLoading(true);
    let query = supabase.from('businesses').select('*').order('created_at', { ascending: false });
    if (filter === 'pending') query = query.eq('pending_approval', true);
    const { data } = await query;
    if (data) setBusinesses(data as Business[]);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    await supabase.from('businesses').update({ pending_approval: false, is_verified: true }).eq('id', id);
    fetchBusinesses();
  };

  const handleReject = async (id: string) => {
    await supabase.from('businesses').delete().eq('id', id);
    fetchBusinesses();
  };

  const handleHide = async (id: string) => {
    await supabase.from('businesses').update({ pending_approval: true }).eq('id', id);
    fetchBusinesses();
  };

  const bg = isDark ? '#111111' : '#F5F5F5';
  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#1A1A1A';
  const muted = isDark ? '#888888' : '#666666';

  if (!loggedIn) {
    return (
      <div style={{ position: 'fixed', top: '65px', bottom: '65px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' as React.CSSProperties['boxSizing'] }}>
        <div style={{ width: '100%', background: cardBg, borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ color: text, textAlign: 'center', marginTop: 0 }}>관리자 로그인</h2>
          <input placeholder="아이디" value={id} onChange={e => setId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0', color: text, fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' as React.CSSProperties['boxSizing'] }} />
          <input type="password" placeholder="비밀번호" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #333', backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0', color: text, fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' as React.CSSProperties['boxSizing'] }} />
          {loginError && <p style={{ color: '#C0392B', fontSize: '13px', margin: '0 0 12px' }}>{loginError}</p>}
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#C0392B', color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>로그인</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', top: '65px', bottom: '65px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', backgroundColor: bg, color: text, overflowY: 'auto', padding: '16px', boxSizing: 'border-box' as React.CSSProperties['boxSizing'] }}>
      <h2 style={{ marginTop: 0 }}>관리자 페이지</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setFilter('pending')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: filter === 'pending' ? '#C0392B' : isDark ? '#2A2A2A' : '#E0E0E0', color: filter === 'pending' ? '#FFF' : text, cursor: 'pointer', fontSize: '13px' }}>승인 대기</button>
        <button onClick={() => setFilter('all')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: filter === 'all' ? '#C0392B' : isDark ? '#2A2A2A' : '#E0E0E0', color: filter === 'all' ? '#FFF' : text, cursor: 'pointer', fontSize: '13px' }}>전체</button>
      </div>
      {loading ? <p>불러오는 중...</p> : (
        <>
          <p style={{ color: muted, fontSize: '13px', margin: '0 0 12px' }}>총 {businesses.length}개</p>
          {businesses.map(b => (
            <div key={b.id} style={{ background: cardBg, borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '15px', margin: '0 0 4px' }}>{b.name}</p>
              <p style={{ fontSize: '12px', color: muted, margin: '0 0 2px' }}>{b.category} {b.subcategory ? `· ${b.subcategory}` : ''}</p>
              <p style={{ fontSize: '12px', color: muted, margin: '0 0 2px' }}>{b.address}</p>
              <p style={{ fontSize: '12px', color: muted, margin: '0 0 8px' }}>{b.phone ?? '전화번호 없음'}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleApprove(b.id)} style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', backgroundColor: '#2D7A3A', color: '#FFF', fontSize: '13px', cursor: 'pointer' }}>✅ 게시</button>
                <button onClick={() => handleHide(b.id)} style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0', color: text, fontSize: '13px', cursor: 'pointer' }}>⏸ 보류</button>
                <button onClick={() => handleReject(b.id)} style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', backgroundColor: '#C0392B', color: '#FFF', fontSize: '13px', cursor: 'pointer' }}>🗑 삭제</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
