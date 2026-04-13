import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import { supabase } from '../lib/supabase';

interface Props {
  isDark: boolean;
}

const COUNTRIES = [
  { label: '베트남', value: 'vietnam', code: '+84', city: 'hanoi' },
];

export default function Register({ isDark }: Props) {
  const [registrationType, setRegistrationType] = useState<'owner' | 'suggestion'>('owner');
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'suggestion') setRegistrationType('suggestion');
    else if (type === 'owner') setRegistrationType('owner');
  }, [searchParams]);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [ownerKakao, setOwnerKakao] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerContact2, setOwnerContact2] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedCountry = COUNTRIES.find(c => c.value === country);
  const phonePrefix = selectedCountry?.code ?? '';
  const fullPhone = phoneNumber ? `${phonePrefix} ${phoneNumber}` : '';
  const city = selectedCountry?.city ?? '';

  const resetForm = () => {
    setName('');
    setCategory('');
    setSubcategory('');
    setCountry('');
    setAddress('');
    setPhoneNumber('');
    setMapLink('');
    setOwnerContact('');
    setOwnerKakao('');
    setOwnerEmail('');
    setOwnerContact2('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { setError('업체명은 필수 항목입니다.'); return; }
    if (!category) { setError('카테고리를 선택해주세요.'); return; }
    if (!country) { setError('국가를 선택해주세요.'); return; }
    setLoading(true);
    setError(null);
    setSuccess(null);

    let finalOwnerContact = ownerContact;
    if (registrationType === 'owner' && ownerContact2) {
      finalOwnerContact = `전화: ${ownerContact} / 제휴: ${ownerContact2}`;
    }

    const { error } = await supabase.from('businesses').insert([{
      name,
      category,
      subcategory,
      city,
      address: address || (city ? city : ''),
      phone: fullPhone || null,
      google_place_id: mapLink || null,
      registration_type: registrationType,
      owner_contact: registrationType === 'owner' ? finalOwnerContact : null,
      owner_kakao: registrationType === 'owner' ? ownerKakao : null,
      owner_email: registrationType === 'owner' ? ownerEmail : null,
      pending_approval: true,
      is_verified: false,
    }]);

    setLoading(false);
    if (error) {
      setError(`등록 중 오류가 발생했습니다: ${error.message}`);
    } else {
      setSuccess('등록 신청이 완료됐습니다. 검토 후 노출됩니다.');
      resetForm();
      window.scrollTo(0, 0);
    }
  };

  const styles = {
    container: {
      position: 'fixed',
      top: '65px',
      bottom: '65px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      overflowY: 'auto',
      backgroundColor: isDark ? '#111111' : '#F5F5F5',
      color: isDark ? '#FFFFFF' : '#1A1A1A',
      padding: '20px 16px',
      boxSizing: 'border-box',
    } as React.CSSProperties,
    form: { display: 'flex', flexDirection: 'column', gap: '16px' } as React.CSSProperties,
    card: { background: isDark ? '#1A1A1A' : '#FFFFFF', borderRadius: '12px', padding: '16px' },
    label: { fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', display: 'block' },
    input: {
      width: '100%', padding: '10px 12px', borderRadius: '8px',
      border: `1px solid ${isDark ? '#333' : '#E0E0E0'}`,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
      color: isDark ? '#FFFFFF' : '#1A1A1A',
      fontSize: '14px', boxSizing: 'border-box',
    } as React.CSSProperties,
    select: {
      width: '100%', padding: '10px 12px', borderRadius: '8px',
      border: `1px solid ${isDark ? '#333' : '#E0E0E0'}`,
      backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF',
      color: isDark ? '#FFFFFF' : '#1A1A1A',
      fontSize: '14px', boxSizing: 'border-box',
    } as React.CSSProperties,
    phoneRow: { display: 'flex', gap: '8px', alignItems: 'center' },
    phonePrefix: {
      padding: '10px 12px', borderRadius: '8px',
      border: `1px solid ${isDark ? '#333' : '#E0E0E0'}`,
      backgroundColor: isDark ? '#1A1A1A' : '#F0F0F0',
      color: isDark ? '#888' : '#666',
      fontSize: '14px', whiteSpace: 'nowrap' as const, flexShrink: 0,
    },
    submitButton: {
      width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
      backgroundColor: '#C0392B', color: '#FFFFFF', fontSize: '16px',
      fontWeight: 'bold', cursor: 'pointer', marginTop: '16px',
    },
    message: { padding: '12px', borderRadius: '8px', textAlign: 'center', fontSize: '14px' } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', margin: '0 0 24px' }}>
        {registrationType === 'owner' ? '🏪 업체 등록/수정 (사장님)' : '📝 업체 제보'}
      </h2>
      {success && <div style={{...styles.message, backgroundColor: isDark ? '#2E7D32' : '#D4EDDA', color: isDark ? '#FFF' : '#155724'}}>{success}</div>}
      {error && <div style={{...styles.message, backgroundColor: isDark ? '#D32F2F' : '#F8D7DA', color: isDark ? '#FFF' : '#721C24'}}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.card}>
          <h3 style={{marginTop: 0}}>업체 정보 (공통)</h3>

          <div style={{marginBottom: '12px'}}>
            <label style={styles.label}>업체명 <span style={{color: '#C0392B'}}>*</span></label>
            <input style={styles.input} type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div style={{marginBottom: '12px'}}>
            <label style={styles.label}>국가 <span style={{color: '#C0392B'}}>*</span></label>
            <select style={styles.select} value={country} onChange={e => setCountry(e.target.value)}>
              <option value="">— 선택 —</option>
              {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div style={{marginBottom: '12px'}}>
            <label style={styles.label}>카테고리 <span style={{color: '#C0392B'}}>*</span></label>
            <select style={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">— 선택 —</option>
              {CATEGORIES.filter(c => c !== '전체').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{marginBottom: '12px'}}>
            <label style={styles.label}>세부 업종</label>
            <input style={styles.input} type="text" value={subcategory} onChange={e => setSubcategory(e.target.value)} placeholder="예: 한식, 노래방, 미용실" />
          </div>

          <div style={{marginBottom: '12px'}}>
            <label style={styles.label}>주소</label>
            <input style={styles.input} type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="모를 경우 도시명·지역명 입력 (예: 하노이-호안끼엠)" />
          </div>

          <div style={{marginBottom: '12px'}}>
            <label style={styles.label}>지도 링크 <span style={{fontSize: '11px', color: '#888', fontWeight: 'normal'}}>(구글맵 또는 다른 지도 서비스)</span></label>
            <input style={styles.input} type="url" value={mapLink} onChange={e => setMapLink(e.target.value)} placeholder="https://maps.google.com/..." />
          </div>

          <div style={{marginBottom: '12px'}}>
            <label style={styles.label}>전화번호</label>
            <div style={styles.phoneRow}>
              <span style={styles.phonePrefix}>{phonePrefix || '국가 선택'}</span>
              <input style={{...styles.input, flex: 1}} type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="앞자리 0 제외 후 입력" />
            </div>
          </div>
        </div>

        {registrationType === 'owner' && (
          <div style={styles.card}>
            <h3 style={{marginTop: 0}}>업주 정보 (선택)</h3>
            <p style={{fontSize: 12, color: '#888', marginTop: -10, marginBottom: 15}}>
              업주 인증 및 업체 정보 수정 권한 부여를 위해 필요한 정보입니다.
            </p>
            <div style={{marginBottom: '12px'}}>
              <label style={styles.label}>업주 연락처</label>
              <input style={styles.input} type="tel" value={ownerContact} onChange={e => setOwnerContact(e.target.value)} placeholder="개인 연락처" />
            </div>
            <div style={{marginBottom: '12px'}}>
              <label style={styles.label}>영업/제휴 문의 연락처</label>
              <input style={styles.input} type="tel" value={ownerContact2} onChange={e => setOwnerContact2(e.target.value)} placeholder="별도 문의 연락처가 있을 경우" />
            </div>
            <div style={{marginBottom: '12px'}}>
              <label style={styles.label}>카카오톡 ID</label>
              <input style={styles.input} type="text" value={ownerKakao} onChange={e => setOwnerKakao(e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>이메일</label>
              <input style={styles.input} type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} />
            </div>
          </div>
        )}

        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? '신청하는 중...' : '등록 신청하기'}
        </button>
      </form>
    </div>
  );
}
