import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Business } from '../types/index';

const ADMIN_ID = 'hyung64a';
const ADMIN_PW = 'hj0105';

const CATEGORIES = ['전체', '음식점', '택시', '의료', '관공·긴급', '기관', '기타'];
const COUNTRIES = ['전체', '베트남'];
const SORT_OPTIONS = [{ id: 'newest', label: '최신순' }, { id: 'abc', label: '가나다·ABC순' }];

interface Props { isDark: boolean }

export default function Admin({ isDark }: Props) {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('admin_logged_in') === 'true');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [loginError, setLoginError] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'published' | 'pending' | 'request'>('pending');
  const [nameKoEdits, setNameKoEdits] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [countryFilter, setCountryFilter] = useState('전체');
  const [sortOrder, setSortOrder] = useState('newest');

  const handleLogin = () => {
    if (id === ADMIN_ID && pw === ADMIN_PW) {
      sessionStorage.setItem('admin_logged_in', 'true');
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
    if (filter === 'pending') {
      query = query.eq('pending_approval', true).eq('registration_type', 'script');
    } else if (filter === 'request') {
      query = query.eq('pending_approval', true).in('registration_type', ['owner', 'suggestion']);
    } else if (filter === 'published') {
      query = query.eq('pending_approval', false);
    }
    const { data } = await query;
    if (data) setBusinesses(data as Business[]);
    setLoading(false);
  };

  const handleApprove = async (businessId: string) => {
    const { error } = await supabase.from('businesses').update({ pending_approval: false, is_verified: true }).eq('id', businessId);
    if (error) { alert('게시 실패: ' + error.message); return; }
    setBusinesses(prev => prev.filter(b => b.id !== businessId));
  };

  const handleReject = async (businessId: string) => {
    const { error } = await supabase.from('businesses').delete().eq('id', businessId);
    if (error) { alert('삭제 실패: ' + error.message); return; }
    setBusinesses(prev => prev.filter(b => b.id !== businessId));
  };

  const handleHide = async (businessId: string) => {
    const { error } = await supabase.from('businesses').update({ pending_approval: true }).eq('id', businessId);
    if (error) { alert('보류 실패: ' + error.message); return; }
    if (filter === 'published') setBusinesses(prev => prev.filter(b => b.id !== businessId));
  };

  const handleSaveNameKo = async (businessId: string) => {
    const { error } = await supabase.from('businesses').update({ name_ko: nameKoEdits[businessId] }).eq('id', businessId);
    if (error) { alert('저장 실패: ' + error.message); } else { alert('저장됐습니다'); }
  };

  const getGoogleMapUrl = (b: Business) => {
    if (b.google_place_id) return `https://www.google.com/maps/place/?q=place_id:${b.google_place_id}`;
    if (b.lat && b.lng) return `https://www.google.com/maps?q=${b.lat},${b.lng}`;
    return null;
  };

  const filteredAndSortedBusinesses = useMemo(() => {
    let result = [...businesses];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        (b as any).name_ko?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== '전체') result = result.filter(b => b.category === categoryFilter);
    if (countryFilter === '베트남') result = result.filter(b => b.city === 'hanoi');
    if (sortOrder === 'abc') {
      result.sort((a, b) => {
        const nameA = (a as any).name_ko || a.name || '';
        const nameB = (b as any).name_ko || b.name || '';
        return nameA.localeCompare(nameB, 'ko');
      });
    } // 'newest' is the default order from the API
    return result;
  }, [businesses, categoryFilter, countryFilter, sortOrder, searchQuery]);

  const bg = isDark ? '#111111' : '#F5F5F5';
  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#1A1A1A';
  const muted = isDark ? '#888888' : '#666666';

  const chipStyle = (active: boolean) => ({
    padding: '6px 12px', borderRadius: '16px', border: 'none', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
    backgroundColor: active ? '#C0392B' : isDark ? '#2A2A2A' : '#E0E0E0',
    color: active ? '#FFF' : text,
  });

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
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button onClick={() => setFilter('pending')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: filter === 'pending' ? '#C0392B' : isDark ? '#2A2A2A' : '#E0E0E0', color: filter === 'pending' ? '#FFF' : text, cursor: 'pointer', fontSize: '13px' }}>승인 대기</button>
        <button onClick={() => setFilter('request')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: filter === 'request' ? '#FF6B35' : isDark ? '#2A2A2A' : '#E0E0E0', color: filter === 'request' ? '#FFF' : text, cursor: 'pointer', fontSize: '13px' }}>게시 요청</button>
        <button onClick={() => setFilter('published')} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', backgroundColor: filter === 'published' ? '#2D7A3A' : isDark ? '#2A2A2A' : '#E0E0E0', color: filter === 'published' ? '#FFF' : text, cursor: 'pointer', fontSize: '13px' }}>게시됨</button>
      </div>

      <input
        type="text"
        placeholder="업체명 검색..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0', color: text, fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
      />

      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '8px', paddingBottom: '4px' }}>
        {CATEGORIES.map(c => <button key={c} onClick={() => setCategoryFilter(c)} style={chipStyle(categoryFilter === c)}>{c}</button>)}
      </div>
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '8px', paddingBottom: '4px' }}>
        {COUNTRIES.map(c => <button key={c} onClick={() => setCountryFilter(c)} style={chipStyle(countryFilter === c)}>{c}</button>)}
      </div>
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
        {SORT_OPTIONS.map(o => <button key={o.id} onClick={() => setSortOrder(o.id)} style={chipStyle(sortOrder === o.id)}>{o.label}</button>)}
      </div>

      {loading ? <p>불러오는 중...</p> : (
        <>
          <p style={{ color: muted, fontSize: '13px', margin: '0 0 12px' }}>총 {filteredAndSortedBusinesses.length}개</p>
          {filteredAndSortedBusinesses.map(b => {
            const mapUrl = getGoogleMapUrl(b);
            return (
              <div key={b.id} style={{ background: cardBg, borderRadius: '12px', padding: '14px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '15px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</p>
                  {mapUrl && <button onClick={() => window.open(mapUrl, '_blank')} style={{ padding: '3px 8px', borderRadius: '6px', border: 'none', backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0', color: text, fontSize: '12px', cursor: 'pointer', marginLeft: '8px' }}>📍</button>}
                </div>
                <p style={{ fontSize: '12px', color: muted, margin: '0 0 2px' }}>{b.category} {b.subcategory ? `· ${b.subcategory}` : ''}</p>
                <p style={{ fontSize: '12px', color: muted, margin: '0 0 2px' }}>{b.address}</p>
                <p style={{ fontSize: '12px', color: muted, margin: '0 0 8px' }}>{b.phone ?? '전화번호 없음'}</p>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', color: muted }}>한국어 이름</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input value={nameKoEdits[b.id] ?? (b as any).name_ko ?? ''} onChange={e => setNameKoEdits(prev => ({ ...prev, [b.id]: e.target.value }))} style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0', color: text, fontSize: '13px', boxSizing: 'border-box' }} />
                    <button onClick={() => handleSaveNameKo(b.id)} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#FF6B35', color: '#FFF', fontSize: '12px', cursor: 'pointer' }}>저장</button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleApprove(b.id)} style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', backgroundColor: '#2D7A3A', color: '#FFF', fontSize: '13px', cursor: 'pointer' }}>✅ 게시</button>
                  <button onClick={() => handleHide(b.id)} style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', backgroundColor: isDark ? '#2A2A2A' : '#E0E0E0', color: text, fontSize: '13px', cursor: 'pointer' }}>⏸ 보류</button>
                  <button onClick={() => handleReject(b.id)} style={{ flex: 1, padding: '7px', borderRadius: '8px', border: 'none', backgroundColor: '#C0392B', color: '#FFF', fontSize: '13px', cursor: 'pointer' }}>🗑 삭제</button>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  );
}
