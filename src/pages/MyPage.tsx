import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, signInWithKakao, signInWithGoogle, signInWithEmail, signUpWithEmail, resendVerificationEmail, signOut, deleteUser } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type AuthTab = 'social' | 'email';

function SignupFlow({ onBack, mutedColor, containerStyle }: {
  onBack: () => void;
  mutedColor: string;
  containerStyle: React.CSSProperties;
}) {
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
    if (!email.trim() || !email.includes('@')) { setErrorMsg('올바른 이메일을 입력해주세요.'); return; }
    setStep('password');
  };

  const handlePasswordNext = () => {
    setErrorMsg('');
    if (password.length < 6) { setErrorMsg('비밀번호는 6자 이상이어야 해요.'); return; }
    if (password !== confirmPassword) { setErrorMsg('비밀번호가 일치하지 않아요.'); return; }
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
      if (msg.includes('User already registered')) setErrorMsg('이미 가입된 이메일이에요.');
      else setErrorMsg('오류가 발생했어요. 잠시 후 다시 시도해주세요.');
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
        <p style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: '#1A1A1A' }}>인증 메일을 보냈어요!</p>
        <p style={{ fontSize: '14px', color: mutedColor, textAlign: 'center', lineHeight: 1.7, marginBottom: '6px' }}>
          <strong style={{ color: '#1A1A1A' }}>{email}</strong>으로<br />전송된 링크를 클릭하면 가입이 완료됩니다.
        </p>
        <p style={{ fontSize: '12px', color: mutedColor, marginBottom: '32px', textAlign: 'center' }}>메일이 안 오면 스팸함을 확인해주세요.</p>
        <button onClick={async () => { try { await resendVerificationEmail(email); alert('재전송했어요!'); } catch { alert('잠시 후 다시 시도해주세요.'); } }}
          style={{ background: 'transparent', border: 'none', fontSize: '14px', color: '#E8302A', cursor: 'pointer', textDecoration: 'underline', marginBottom: '10px' }}>
          메일 다시 보내기
        </button>
        <button onClick={onBack}
          style={{ background: 'transparent', border: 'none', fontSize: '14px', color: mutedColor, cursor: 'pointer', textDecoration: 'underline' }}>
          로그인 화면으로
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
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>이메일을<br />알려주세요</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '32px' }}>로그인 및 인증에 사용돼요</p>
            <input type="email" placeholder="example@email.com" value={email} onChange={e => setEmail(e.target.value)}
              style={inputStyle} onKeyDown={e => { if (e.key === 'Enter') handleEmailNext(); }} autoFocus />
            {errorMsg && <p style={{ fontSize: '12px', color: '#E8302A', margin: '8px 0 0' }}>{errorMsg}</p>}
            <div style={{ flex: 1 }} />
            <button style={nextBtn('다음', handleEmailNext, !email.trim())} onClick={handleEmailNext} disabled={!email.trim()}>다음</button>
          </>
        )}
        {step === 'password' && (
          <>
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>비밀번호를<br />설정해주세요</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '32px' }}>6자 이상 입력해주세요</p>
            <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, marginBottom: '20px' }} autoFocus />
            <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              style={inputStyle} onKeyDown={e => { if (e.key === 'Enter') handlePasswordNext(); }} />
            {errorMsg && <p style={{ fontSize: '12px', color: '#E8302A', margin: '8px 0 0' }}>{errorMsg}</p>}
            <div style={{ flex: 1 }} />
            <button style={nextBtn('다음', handlePasswordNext, password.length < 6)} onClick={handlePasswordNext} disabled={password.length < 6}>다음</button>
          </>
        )}
        {step === 'nickname' && (
          <>
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>닉네임을<br />알려주세요</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '32px' }}>다른 교민들에게 보여지는 이름이에요 <span style={{ color: '#BBBBBB' }}>(선택)</span></p>
            <input type="text" placeholder="예) 하노이김치맨" value={nickname} onChange={e => setNickname(e.target.value)}
              style={inputStyle} onKeyDown={e => { if (e.key === 'Enter') setStep('gender'); }} autoFocus />
            <div style={{ flex: 1 }} />
            <button style={nextBtn('다음', () => setStep('gender'))} onClick={() => setStep('gender')}>다음</button>
            <button onClick={() => { setNickname(''); setStep('gender'); }}
              style={{ background: 'none', border: 'none', fontSize: '13px', color: mutedColor, cursor: 'pointer', textAlign: 'center', marginTop: '12px', textDecoration: 'underline' }}>건너뛰기</button>
          </>
        )}
        {step === 'gender' && (
          <>
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>성별을<br />알려주세요</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '32px' }}>서비스 개선을 위한 통계에만 활용돼요 <span style={{ color: '#BBBBBB' }}>(선택)</span></p>
            <button style={optBtn(gender === 'male')} onClick={() => setGender('male')}>남성</button>
            <button style={optBtn(gender === 'female')} onClick={() => setGender('female')}>여성</button>
            <div style={{ flex: 1 }} />
            <button style={nextBtn('다음', () => setStep('nationality'), gender === null)} onClick={() => setStep('nationality')} disabled={gender === null}>다음</button>
            <button onClick={() => { setGender(null); setStep('nationality'); }}
              style={{ background: 'none', border: 'none', fontSize: '13px', color: mutedColor, cursor: 'pointer', textAlign: 'center', marginTop: '12px', textDecoration: 'underline' }}>건너뛰기</button>
          </>
        )}
        {step === 'nationality' && (
          <>
            <p style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.3, marginBottom: '6px', color: '#1A1A1A' }}>국적을<br />알려주세요</p>
            <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '16px' }}>서비스 개선에 도움이 돼요 <span style={{ color: '#BBBBBB' }}>(선택)</span></p>
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
            <button style={nextBtn('가입 완료', handleFinalSubmit, loading)} onClick={handleFinalSubmit} disabled={loading}>
              {loading ? '처리 중...' : '가입 완료'}
            </button>
            <button onClick={() => { setNationality(''); handleFinalSubmit(); }}
              style={{ background: 'none', border: 'none', fontSize: '13px', color: mutedColor, cursor: 'pointer', textAlign: 'center', marginTop: '12px', textDecoration: 'underline' }}>건너뛰기</button>
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
    if (!email.trim() || !password.trim()) { setErrorMsg('이메일과 비밀번호를 입력해주세요.'); return; }
    setEmailLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
    } catch (e: any) {
      const msg = e?.message || '';
      if (msg.includes('Invalid login credentials')) setErrorMsg('이메일 또는 비밀번호가 맞지 않아요.');
      else if (msg.includes('Email not confirmed')) setErrorMsg('이메일 인증이 필요해요. 메일함을 확인해주세요.');
      else setErrorMsg('오류가 발생했어요. 잠시 후 다시 시도해주세요.');
    }
    setEmailLoading(false);
  };

  return (
    <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <img src="/icon-192.png" alt="logo" style={{ width: '64px', marginBottom: '12px' }} />
      <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>헝그리김치</p>
      <p style={{ fontSize: '13px', color: mutedColor, marginBottom: '24px', textAlign: 'center' }}>
        로그인하면 리뷰 작성, 찜하기 등<br />더 많은 기능을 이용할 수 있어요
      </p>
      <div style={{ display: 'flex', width: '100%', maxWidth: '320px', borderBottom: '1.5px solid #EBEBEB', marginBottom: '22px' }}>
        {( ['social', 'email'] as AuthTab[]).map(t => (
          <div key={t} onClick={() => { setAuthTab(t); setErrorMsg(''); }}
            style={{ flex: 1, textAlign: 'center', paddingBottom: '10px', fontSize: '14px', fontWeight: 600,
              color: authTab === t ? '#E8302A' : mutedColor,
              borderBottom: authTab === t ? '2px solid #E8302A' : '2px solid transparent',
              cursor: 'pointer', marginBottom: '-1.5px' }}>
            {t === 'social' ? '소셜 로그인' : '이메일 로그인'}
          </div>
        ))}
      </div>
      {authTab === 'social' && (
        <>
          <button onClick={async () => { try { await signInWithKakao(); } catch { alert('로그인 중 오류가 발생했어요'); } }}
            style={{ width: '100%', maxWidth: '320px', padding: '14px', borderRadius: '12px', border: 'none', background: '#FEE500', color: '#1A1A1A', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <img src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" style={{ width: '24px', height: '24px' }} />
            카카오로 시작하기
          </button>
          <button onClick={async () => { try { await signInWithGoogle(); } catch { alert('로그인 중 오류가 발생했어요'); } }}
            style={{ width: '100%', maxWidth: '320px', padding: '14px', borderRadius: '12px', border: '1.5px solid #DADCE0', background: '#FFFFFF', color: '#1A1A1A', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <img src="https://www.google.com/favicon.ico" style={{ width: '20px', height: '20px' }} />
            구글로 시작하기
          </button>
          <p style={{ fontSize: '11px', color: mutedColor, marginTop: '16px', textAlign: 'center', lineHeight: 1.6 }}>
            ※ 카카오 로그인 시 OK Score 등<br />한국인 전용 기능을 이용할 수 있어요 🇰🇷
          </p>
        </>
      )}
      {authTab === 'email' && (
        <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle}
            onKeyDown={e => { if (e.key === 'Enter') handleEmailLogin(); }} />
          {errorMsg && <p style={{ fontSize: '12px', color: '#E8302A', textAlign: 'center', margin: '0' }}>{errorMsg}</p>}
          <button onClick={handleEmailLogin} disabled={emailLoading}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: emailLoading ? '#EBEBEB' : '#E8302A', color: emailLoading ? '#999' : '#fff', fontSize: '16px', fontWeight: 'bold', cursor: emailLoading ? 'not-allowed' : 'pointer' }}>
            {emailLoading ? '처리 중...' : '로그인'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '0.5px', background: '#EBEBEB' }} />
            <span style={{ fontSize: '11px', color: '#BBBBBB' }}>또는</span>
            <div style={{ flex: 1, height: '0.5px', background: '#EBEBEB' }} />
          </div>
          <button onClick={() => setShowSignup(true)}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #E8302A', background: '#fff', color: '#E8302A', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            이메일로 회원가입
          </button>
        </div>
      )}
      <button onClick={() => navigate('/policy')} style={{ marginTop: '28px', background: 'transparent', border: 'none', fontSize: '12px', color: mutedColor, cursor: 'pointer', textDecoration: 'underline' }}>
        개인정보처리방침 · 이용약관
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

  if (loading) return <div style={{ ...containerStyle, alignItems: 'center', justifyContent: 'center' }}>불러오는 중...</div>;

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
