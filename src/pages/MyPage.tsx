import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, signInWithKakao, signInWithGoogle, signInWithEmail, signUpWithEmail, resendVerificationEmail, signOut, deleteUser } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

type AuthTab = 'social' | 'email';

function SignupFlow({ onBack, mutedColor, containerStyle }: {
  onBack: () => void;
  mutedColor: string;
  containerStyle: React.CSSProperties;
}) {
  const { lang } = useLanguage();
  type SignupStep = 'email' | 'password' | 'nickname' | 'gender' | 'nationality' | 'done';
  const [step, setStep] = useState<SignupStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'none' | null>(null);
  const [nationality, setNationality] = useState('대한민국');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const STEPS: SignupStep[] = ['email', 'password', 'nickname', 'gender', 'nationality'];
  const pct = step === 'done' ? 100 : Math.round(((STEPS.indexOf(step) + 1) / STEPS.length) * 100);

  const COUNTRIES = ['가나', '그리스', '나이지리아', '네덜란드', '뉴질랜드', '노르웨이', '대만', '덴마크', '독일', '러시아', '말레이시아', '멕시코', '미국', '베트남', '벨기에', '브라질', '사우디아라비아', '스웨덴', '스위스', '스페인', '싱가포르', '아랍에미리트', '아르헨티나', '영국', '오스트리아', '오스트레일리아', '이탈리아', '인도', '인도네시아', '일본', '중국', '체코', '캐나다', '태국', '터키', '포르투갈', '폴란드', '프랑스', '필리핀', '헝가리', '홍콩'];

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0 0 10px', border: 'none',
    borderBottom: '2px solid #E8302A', fontSize: '16px', color: '#1A1A1A',
    outline: 'none', background: 'transparent', marginBottom: '8px',
  };

  const handleEmailNext = () => {
    setErrorMsg('');
    if (!email.trim() || !email.includes('@')) { setErrorMsg(t(lang, 'signup_email_error')); return; }
    setStep('password');
  };

  const handlePasswordNext = () => {
    setErrorMsg('');
    if (password.length < 6) { setErrorMsg(t(lang, 'signup_password_error_short')); return; }
    if (password !== confirmPassword) { setErrorMsg(t(lang, 'signup_password_error_mismatch')); return; }
    setStep('nickname');
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signUpWithEmail(email.trim(), password);
      setStep('done');
    } catch (e: any) {
      const msg = e?.message || '';
      if (msg.includes('User already registered')) setErrorMsg(t(lang, 'signup_error_already'));
      else setErrorMsg(t(lang, 'signup_error_generic'));
    }
    setLoading(false);
  };

  const nextBtn = (_label: string, _onClick: () => void, disabled = false): React.CSSProperties => ({
    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
    background: disabled ? '#EBEBEB' : '#E8302A', color: disabled ? '#999' : '#fff',
    fontSize: '16px', fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 'auto',
  });

  const optBtn = (selected: boolean): React.CSSProperties => ({
    width: '100%', padding: '14px 16px', borderRadius: '12px',
    border: '1.5px solid ' + (selected ? '#E8302A' : '#EBEBEB'),
    background: selected ? '#FFF0EF' : '#fff',
    color: selected ? '#E8302A' : '#1A1A1A',
    fontSize: '15px', fontWeight: 600, textAlign: 'left', cursor: 'pointer', marginBottom: '10px',
  });

  if (step === 'done') {
    return (
      <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>📬</div>
        <p style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: '#1A1A1A' }}>{t(lang, 'signup_done_title')}</p>
        <p style={{ fontSize: '14px', color: mutedColor, textAlign: 'center', lineHeight: 1.7, marginBottom: '6px' }}>
          <strong style={{ color: '#1A1A1A' }}>{email}</strong>{t(lang, 'signup_done_sub')}
        </p>
        <p style={{ fontSize: '12px', color: mutedColor, marginBottom: '32px', textAlign: 'center' }}>{t(lang, 'signup_done_spam')}</p>
        <button onClick={async () => { try { await resendVerificationEmail(email); alert(t(lang, 'signup_done_resend_ok')); } catch { alert(t(lang, 'signup_done_resend_error')); } }}
          style={{ background: 'transparent', border: 'none', fontSize: '14px', color: '#E8302A', cursor: 'pointer', textDecoration: 'underline', marginBottom: '10px' }}>
          {t(lang, 'signup_done_resend')}
        </button>
        <button onClick={onBack}
          style={{ background: 'transparent', border: 'none', fontSize: '14px', color: mutedColor, cursor: 'pointer', textDecoration: 'underline' }}>
          {t(lang, 'signup_done_back')}
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...containerStyle, padding: '0' }}>
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button onClick={step === 'email' ? onBack : () => {
            const prev: Record<string, SignupStep> = { password: 'email', nickname: 'password', gender: 'nickname', nationality: 'gender' };
            setStep(prev[step] as SignupStep);
            setErrorMsg('');
          }} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#1A1A1A', padding: 0 }}>←</button>
          <div style={{ flex: 1, height: '3px', background: '#F0F0F0', borderRadius: '2px' }}>
            <div style={{ height: '3px', background: '#E8302A', borderRadius: '2px', width: pct + '%', transition: 'width .3s ease' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 24px', flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)' }}>
        {step === 'email' && (
          <>
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>{t(lang, 'signup_email_title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '32px' }}>{t(lang, 'signup_email_sub')}</p>
            <input type="email" placeholder={t(lang, 'signup_email_placeholder')} value={email} onChange={e => setEmail(e.target.value)}
              style={inputStyle} onKeyDown={e => { if (e.key === 'Enter') handleEmailNext(); }} autoFocus />
            {errorMsg && <p style={{ fontSize: '12px', color: '#E8302A', margin: '8px 0 0' }}>{errorMsg}</p>}
            <div style={{ flex: 1 }} />
            <button style={nextBtn('', handleEmailNext, !email.trim())} onClick={handleEmailNext} disabled={!email.trim()}>{t(lang, 'signup_next')}</button>
          </>
        )}
        {step === 'password' && (
          <>
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>{t(lang, 'signup_password_title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '32px' }}>{t(lang, 'signup_password_sub')}</p>
            <input type="password" placeholder={t(lang, 'signup_password_placeholder')} value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} autoFocus />
            <input type="password" placeholder={t(lang, 'signup_password_confirm_placeholder')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              style={inputStyle} onKeyDown={e => { if (e.key === 'Enter') handlePasswordNext(); }} />
            {errorMsg && <p style={{ fontSize: '12px', color: '#E8302A', margin: '8px 0 0' }}>{errorMsg}</p>}
            <div style={{ flex: 1 }} />
            <button style={nextBtn('', handlePasswordNext, password.length < 6)} onClick={handlePasswordNext} disabled={password.length < 6}>{t(lang, 'signup_next')}</button>
          </>
        )}
        {step === 'nickname' && (
          <>
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>{t(lang, 'signup_nickname_title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '32px' }}>{t(lang, 'signup_nickname_sub')} <span style={{ color: '#BBBBBB' }}>{t(lang, 'signup_optional')}</span></p>
            <input type="text" placeholder={t(lang, 'signup_nickname_placeholder')} value={nickname} onChange={e => setNickname(e.target.value)}
              style={inputStyle} onKeyDown={e => { if (e.key === 'Enter') setStep('gender'); }} autoFocus />
            <div style={{ flex: 1 }} />
            <button style={nextBtn('', () => setStep('gender'))} onClick={() => setStep('gender')}>{t(lang, 'signup_next')}</button>
            <button onClick={() => { setNickname(''); setStep('gender'); }}
              style={{ background: 'none', border: 'none', fontSize: '13px', color: mutedColor, cursor: 'pointer', textAlign: 'center', marginTop: '12px', textDecoration: 'underline' }}>{t(lang, 'signup_skip')}</button>
          </>
        )}
        {step === 'gender' && (
          <>
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>{t(lang, 'signup_gender_title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '32px' }}>{t(lang, 'signup_gender_sub')} <span style={{ color: '#BBBBBB' }}>{t(lang, 'signup_optional')}</span></p>
            <button style={optBtn(gender === 'male')} onClick={() => setGender('male')}>{t(lang, 'signup_gender_male')}</button>
            <button style={optBtn(gender === 'female')} onClick={() => setGender('female')}>{t(lang, 'signup_gender_female')}</button>
            <div style={{ flex: 1 }} />
            <button style={nextBtn('', () => setStep('nationality'), gender === null)} onClick={() => setStep('nationality')} disabled={gender === null}>{t(lang, 'signup_next')}</button>
            <button onClick={() => { setGender(null); setStep('nationality'); }}
              style={{ background: 'none', border: 'none', fontSize: '13px', color: mutedColor, cursor: 'pointer', textAlign: 'center', marginTop: '12px', textDecoration: 'underline' }}>{t(lang, 'signup_skip')}</button>
          </>
        )}
        {step === 'nationality' && (
          <>
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>{t(lang, 'signup_nationality_title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '16px' }}>{t(lang, 'signup_nationality_sub')} <span style={{ color: '#BBBBBB' }}>{t(lang, 'signup_optional')}</span></p>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '12px' }}>
              {['대한민국', ...COUNTRIES].map((c, i) => (
                <div key={c}>
                  {i === 1 && <div style={{ height: '0.5px', background: '#EBEBEB', margin: '4px 0 8px' }} />} 
                  <div onClick={() => setNationality(c)} style={{
                    padding: '13px 4px', fontSize: '15px', borderBottom: '0.5px solid #F5F5F5', cursor: 'pointer',
                    color: nationality === c ? '#E8302A' : '#1A1A1A',
                    fontWeight: nationality === c ? 700 : 400,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    {c} {nationality === c && <span style={{ fontSize: '16px' }}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
            {errorMsg && <p style={{ fontSize: '12px', color: '#E8302A', margin: '0 0 8px' }}>{errorMsg}</p>}
            <button style={nextBtn('', handleFinalSubmit, loading)} onClick={handleFinalSubmit} disabled={loading}>
              {loading ? t(lang, 'signup_processing') : t(lang, 'signup_submit')}
            </button>
            <button onClick={() => { setNationality(''); handleFinalSubmit(); }}
              style={{ background: 'none', border: 'none', fontSize: '13px', color: mutedColor, cursor: 'pointer', textAlign: 'center', marginTop: '12px', textDecoration: 'underline' }}>{t(lang, 'signup_skip')}</button>
          </>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ isDark, mutedColor, containerStyle, navigate }: {
  isDark: boolean; mutedColor: string;
  containerStyle: React.CSSProperties;
  navigate: (path: string) => void;
}) {
  const { lang } = useLanguage();
  const [authTab, setAuthTab] = useState<AuthTab>('social');
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const inputStyle: React.CSSProperties = {
    width: '100%', maxWidth: '320px', padding: '13px 14px', borderRadius: '10px',
    border: '1.5px solid #DADCE0', fontSize: '15px', outline: 'none',
    background: cardBg, color: isDark ? '#fff' : '#1A1A1A', boxSizing: 'border-box',
  };

  if (showSignup) {
    return <SignupFlow onBack={() => setShowSignup(false)} mutedColor={mutedColor} containerStyle={containerStyle} />;
  }

  const handleEmailLogin = async () => {
    setErrorMsg('');
    if (!email.trim() || !password.trim()) { setErrorMsg(t(lang, 'login_error_empty')); return; }
    setEmailLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
    } catch (e: any) {
      const msg = e?.message || '';
      if (msg.includes('Invalid login credentials')) setErrorMsg(t(lang, 'login_error_invalid'));
      else if (msg.includes('Email not confirmed')) setErrorMsg(t(lang, 'login_error_unconfirmed'));
      else setErrorMsg(t(lang, 'login_error_generic'));
    }
    setEmailLoading(false);
  };

  return (
    <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <img src="/icon-192.png" alt="logo" style={{ width: '64px', marginBottom: '12px' }} />
      <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{t(lang, 'login_title')}</p>
      <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '24px', textAlign: 'center' }}>
        {t(lang, 'login_subtitle').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
      </p>
      <div style={{ display: 'flex', width: '100%', maxWidth: '320px', borderBottom: '1.5px solid #EBEBEB', marginBottom: '22px' }}>
        {( ['social', 'email'] as AuthTab[]).map(tab => (
          <div key={tab} onClick={() => { setAuthTab(tab); setErrorMsg(''); }}
            style={{ flex: 1, textAlign: 'center', paddingBottom: '10px', fontSize: '14px', fontWeight: 600,
              color: authTab === tab ? '#E8302A' : mutedColor,
              borderBottom: authTab === tab ? '2px solid #E8302A' : '2px solid transparent',
              cursor: 'pointer', marginBottom: '-1.5px' }}>
            {tab === 'social' ? t(lang, 'login_tab_social') : t(lang, 'login_tab_email')}
          </div>
        ))}
      </div>
      {authTab === 'social' && (
        <>
          <button onClick={async () => { try { await signInWithKakao(); } catch { alert(t(lang, 'login_error_generic_short')); } }}
            style={{ width: '100%', maxWidth: '320px', padding: '14px', borderRadius: '12px', border: 'none', background: '#FEE500', color: '#1A1A1A', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" style={{ width: '24px', height: '24px' }} />
            {t(lang, 'login_kakao')}
          </button>
          <button onClick={async () => { try { await signInWithGoogle(); } catch { alert(t(lang, 'login_error_generic_short')); } }}
            style={{ width: '100%', maxWidth: '320px', padding: '14px', borderRadius: '12px', border: '1.5px solid #DADCE0', background: '#FFFFFF', color: '#1A1A1A', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <img src="https://www.google.com/favicon.ico" style={{ width: '20px', height: '20px' }} />
            {t(lang, 'login_google')}
          </button>
          <p style={{ fontSize: '11px', color: mutedColor, marginTop: '16px', textAlign: 'center', lineHeight: 1.6 }}>
            {t(lang, 'login_kakao_hint').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </p>
        </>
      )}
      {authTab === 'email' && (
        <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <input type="email" placeholder={t(lang, 'login_email_placeholder')} value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder={t(lang, 'login_password_placeholder')} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle}
            onKeyDown={e => { if (e.key === 'Enter') handleEmailLogin(); }} />
          {errorMsg && <p style={{ fontSize: '12px', color: '#E8302A', textAlign: 'center', margin: '0' }}>{errorMsg}</p>}
          <button onClick={handleEmailLogin} disabled={emailLoading}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: emailLoading ? '#EBEBEB' : '#E8302A', color: emailLoading ? '#999' : '#fff', fontSize: '16px', fontWeight: 'bold', cursor: emailLoading ? 'not-allowed' : 'pointer' }}>
            {emailLoading ? t(lang, 'login_processing') : t(lang, 'login_btn')}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '0.5px', background: '#EBEBEB' }} />
            <span style={{ fontSize: '11px', color: '#BBBBBB' }}>{t(lang, 'login_or')}</span>
            <div style={{ flex: 1, height: '0.5px', background: '#EBEBEB' }} />
          </div>
          <button onClick={() => setShowSignup(true)}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #E8302A', background: '#fff', color: '#E8302A', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            {t(lang, 'login_signup_btn')}
          </button>
        </div>
      )}
      <button onClick={() => navigate('/policy')} style={{ marginTop: '28px', background: 'transparent', border: 'none', fontSize: '12px', color: mutedColor, cursor: 'pointer', textDecoration: 'underline' }}>
        {t(lang, 'mypage_privacy')}
      </button>
    </div>
  );
}

const RED = '#E8302A';
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

  const { lang } = useLanguage();

  if (loading) return <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center' }}>{t(lang, 'mypage_loading')}</div>;

  if (!user) {
    return <LoginScreen isDark={isDark} mutedColor={mutedColor} containerStyle={containerStyle} navigate={navigate} />;
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
            <div style={{ fontSize: 16, fontWeight: 700 }}>{user.user_metadata?.full_name || user.user_metadata?.name || t(lang, 'mypage_default_username')}</div>
            <div style={{ fontSize: 12, color: mutedColor }}>{user.email || ''}</div>
          </div>
          <button
            onClick={async () => { try { await signOut(); } catch (e) { alert(t(lang, 'mypage_logout_error')); } }}
            style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 8, border: '1.5px solid ' + RED, background: 'transparent', color: RED, fontSize: 13, cursor: 'pointer' }}
          >
            {t(lang, 'mypage_logout')}
          </button>
        </div>

        {/* 탭 */}
        <div style={{ display: 'flex' }}>
          {([
            { key: 'reviews', label: t(lang, 'mypage_tab_reviews') },
            { key: 'comments', label: t(lang, 'mypage_tab_comments') },
            { key: 'favorites', label: t(lang, 'mypage_tab_favorites') },
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
        {dataLoading && <div style={{ textAlign: 'center', padding: 24, color: mutedColor, fontSize: 14 }}>{t(lang, 'mypage_loading')}</div>}

        {/* 나의 리뷰 */}
        {tab === 'reviews' && !dataLoading && (
          reviews.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: mutedColor, fontSize: 14 }}>{t(lang, 'mypage_no_reviews')}</div>
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
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: mutedColor, fontSize: 14 }}>{t(lang, 'mypage_no_comments')}</div>
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
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: mutedColor, fontSize: 14 }}>{t(lang, 'mypage_no_favorites')}</div>
            : favorites.map((fav: any) => {
              const biz = fav.businesses;
              return (
                <div key={fav.id} onClick={() => navigate('/biz/' + fav.business_place_id)} style={{ background: cardBg, borderRadius: 12, padding: '14px', marginBottom: 10, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{biz?.name_ko || biz?.name || '업체'}</div>
                    {biz?.city && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: RED, background: '#FFF0EF', border: '1px solid #FFCDD2', borderRadius: 20, padding: '2px 8px', flexShrink: 0, marginLeft: 8 }}>
                        {biz.city}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: mutedColor }}>{biz?.category}{biz?.subcategory ? ' · ' + biz.subcategory : ''}</div>
                </div>
              );
            })
        )}
      </div>

      {/* 하단 */}
      <div style={{ padding: '16px 20px 24px', display: 'flex', gap: 16, justifyContent: 'center', borderTop: '0.5px solid ' + BORDER }}>
        <button onClick={() => navigate('/policy')} style={{ background: 'transparent', border: 'none', fontSize: 12, color: mutedColor, cursor: 'pointer', textDecoration: 'underline' }}>
          {t(lang, 'mypage_privacy')}
        </button>
        <span style={{ fontSize: 12, color: BORDER }}>|</span>
        <button
          onClick={async () => {
            if (!window.confirm(t(lang, 'mypage_withdraw_confirm'))) return;
            try { await deleteUser(); alert(t(lang, 'mypage_withdraw_done')); } catch (e) { alert(t(lang, 'mypage_withdraw_error')); }
          }}
          style={{ background: 'transparent', border: 'none', fontSize: 12, color: mutedColor, cursor: 'pointer', textDecoration: 'underline' }}
        >
          {t(lang, 'mypage_withdraw')}
        </button>
      </div>
    </div>
  );
}
