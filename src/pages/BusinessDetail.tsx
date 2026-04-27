import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Business } from '../types/index';
import { useReviews } from '../hooks/useReviews';
import kimchiLogo from '../assets/images/kimchi_level5_nb.webp';

const RED = '#E8302A';
const RED_BG = '#FFF0EF';
const OK_COLOR = '#2E7D32';
const OK_BG = '#E8F5E9';
const OK_MID = '#43A047';
const GOLD = '#E65100';
const BORDER = '#EBEBEB';
const TASTE_LABELS = ['', '별로였어요 😞', '그저 그랬어요 😐', '괜찮았어요 😊', '맛있었어요 😋', '최고였어요 🤩'];

function okDesc(v: number) {
  if (v < 20) return '현지화가 많이 됐어요';
  if (v < 40) return '한식 느낌이 약해요';
  if (v < 60) return '보통 수준이에요';
  if (v < 75) return '꽤 한국적이에요 👍';
  if (v < 90) return '진짜 한식에 가까워요 🇰🇷';
  return '완벽한 진짜 한식! 🏆';
}

function renderStars(score: number) {
  const full = Math.floor(score);
  const half = score - full >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
}

function formatDate(iso: string) {
  return iso.slice(0, 10).replace(/-/g, '.');
}

const AVATAR_COLORS = [
  { bg: '#FFF0EF', color: '#C0251F' },
  { bg: '#E8F0FE', color: '#185FA5' },
  { bg: '#E8F5E9', color: '#2E7D32' },
  { bg: '#FFF8E1', color: '#F57F17' },
  { bg: '#F3E5F5', color: '#6A1B9A' },
];

function ShareSheet({ bizName, placeId, onClose }: { bizName: string; placeId: string; onClose: () => void }) {
  const url = 'https://hungrykimchi.com/biz/' + placeId;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '18px 20px 44px', width: '100%', maxWidth: 430 }}>
        <div style={{ width: 36, height: 4, background: BORDER, borderRadius: 10, margin: '0 auto 14px' }} />
        <div style={{ fontSize: 15, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>{bizName} 공유하기</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { icon: '💬', label: '카카오톡', bg: '#FEE500', fn: () => { alert('카카오 SDK 연동 필요'); onClose(); } },
            { icon: '🔗', label: '링크 복사', bg: '#F0F0F0', fn: () => { navigator.clipboard?.writeText(url); onClose(); } },
            { icon: '↗', label: '더 보기', bg: '#E8F0FE', fn: () => { navigator.share?.({ title: bizName + ' - 헝그리김치', url }); onClose(); } },
          ].map(({ icon, label, bg, fn }) => (
            <div key={label} onClick={fn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#555' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type Step = 'korean' | 'taste' | 'ok' | 'comment' | 'done';

function ReviewFlow({ bizName, onClose, onSubmit, submitting }: {
  bizName: string;
  onClose: () => void;
  onSubmit: (p: { is_korean_run: 'yes' | 'no' | 'unknown'; taste_score: number; ok_score: number; comment: string }) => Promise<{ error: unknown }>;
  submitting: boolean;
}) {
  const [step, setStep] = useState<Step>('korean');
  const [korean, setKorean] = useState<'yes' | 'no' | 'unknown' | null>(null);
  const [taste, setTaste] = useState(0);
  const [ok, setOk] = useState(50);
  const [comment, setComment] = useState('');

  const STEPS: Step[] = ['korean', 'taste', 'ok', 'comment'];
  const pct = step === 'done' ? 100 : Math.round(((STEPS.indexOf(step) + 1) / (STEPS.length + 1)) * 100);

  const handleSubmit = async () => {
    const { error } = await onSubmit({ is_korean_run: korean!, taste_score: taste, ok_score: ok, comment });
    if (!error) setStep('done');
  };

  const nbtn = (active: boolean, variant: 'red' | 'ok' = 'red'): React.CSSProperties => ({
    width: '100%', padding: 15, border: 'none', borderRadius: 12,
    fontSize: 16, fontWeight: 800, cursor: active ? 'pointer' : 'not-allowed',
    background: active ? (variant === 'ok' ? OK_COLOR : RED) : BORDER,
    color: active ? '#fff' : '#999', letterSpacing: '-0.3px',
  });

  const ch = (sel: boolean, variant: 'red' | 'ok' = 'red'): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px',
    border: '1.5px solid ' + (sel ? (variant === 'ok' ? OK_COLOR : RED) : BORDER),
    borderRadius: 12,
    background: sel ? (variant === 'ok' ? OK_BG : RED_BG) : '#fff',
    cursor: 'pointer', fontSize: 15, fontWeight: 600,
    color: sel ? (variant === 'ok' ? OK_COLOR : RED) : '#1A1A1A',
    width: '100%', textAlign: 'left',
  });

  return (
    <div style={{ background: '#fff', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '0.5px solid ' + BORDER }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#1A1A1A', padding: 0 }}>←</button>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{bizName} 리뷰</div>
      </div>
      <div style={{ height: 3, background: BORDER }}>
        <div style={{ height: 3, background: RED, width: pct + '%', transition: 'width .35s ease' }} />
      </div>

      <div style={{ padding: '28px 20px 24px' }}>

        {step === 'korean' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>한국인이 운영하거나 근무하나요?</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 26, lineHeight: 1.5 }}>다른 교민분들에게 도움이 됩니다.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { val: 'yes' as const, icon: '🇰🇷', label: '네, 한국인이에요', v: 'ok' as const },
                { val: 'no' as const, icon: '🌏', label: '아니요, 현지인이에요', v: 'red' as const },
                { val: 'unknown' as const, icon: '🤔', label: '잘 모르겠어요', v: 'red' as const },
              ].map(({ val, icon, label, v }) => (
                <button key={val} style={ch(korean === val, v)} onClick={() => setKorean(val)}>
                  <span style={{ fontSize: 22, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>{label}
                </button>
              ))}
            </div>
            <button style={{ ...nbtn(korean !== null), marginTop: 22 }} disabled={korean === null} onClick={() => setStep('taste')}>다음 →</button>
          </>
        )}

        {step === 'taste' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>맛은 어떠셨나요?</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 26, lineHeight: 1.5 }}>한국 음식으로서의 맛을 평가해 주세요.</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} onClick={() => setTaste(n)} style={{
                  fontSize: 44, cursor: 'pointer', lineHeight: 1, userSelect: 'none',
                  color: n <= taste ? GOLD : '#E0E0E0',
                  display: 'inline-block',
                  transform: n <= taste ? 'scale(1.06)' : 'scale(1)',
                  transition: 'color .1s, transform .1s',
                }}>★</span>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: GOLD, minHeight: 22, marginBottom: 24 }}>
              {taste ? TASTE_LABELS[taste] : '별을 눌러 평가해 주세요'}
            </div>
            <button style={nbtn(taste > 0)} disabled={taste === 0} onClick={() => setStep('ok')}>다음 →</button>
          </>
        )}

        {step === 'ok' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>OK Score를 매겨주세요</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20, lineHeight: 1.5 }}>
              맛과 별개로, 이 집이 얼마나 <strong style={{ color: OK_COLOR }}>진짜 한식</strong>에 가까운지 평가하는 헝그리김치만의 독자 지표입니다.
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: OK_COLOR, lineHeight: 1 }}>{ok}</span>
              <span style={{ fontSize: 18, color: '#999' }}>/ 100</span>
            </div>
            <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: OK_MID, minHeight: 20, marginBottom: 16 }}>{okDesc(ok)}</div>
            <div style={{ position: 'relative', height: 8, borderRadius: 10, background: 'linear-gradient(to right,#FF8A65,#FFD54F,#66BB6A)', marginBottom: 6 }}>
              <div style={{
                position: 'absolute', top: '50%', left: 'calc(' + ok + '% - 9px)', transform: 'translateY(-50%)',
                width: 18, height: 18, borderRadius: '50%', background: OK_COLOR,
                border: '3px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,.25)', transition: 'left .05s',
              }} />
            </div>
            <input type="range" min={0} max={100} step={1} value={ok}
              onChange={e => setOk(parseInt(e.target.value))}
              style={{ width: '100%', opacity: 0, height: 20, marginTop: -14, cursor: 'pointer', display: 'block' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#999', marginBottom: 28, marginTop: 2 }}>
              <span>🌏 현지화</span><span>🇰🇷 진짜 한식</span>
            </div>
            <button style={nbtn(true, 'ok')} onClick={() => setStep('comment')}>다음 →</button>
          </>
        )}

        {step === 'comment' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>한 줄 후기를 남겨주세요</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20, lineHeight: 1.5 }}>선택사항이에요. 다른 교민분들께 큰 도움이 됩니다.</div>
            <textarea
              value={comment} onChange={e => setComment(e.target.value)}
              placeholder="예) 된장찌개는 거의 한국 맛! 밑반찬도 충실하고 사장님 친절해요."
              style={{
                width: '100%', border: '1.5px solid ' + BORDER, borderRadius: 12,
                padding: 14, fontSize: 14, lineHeight: 1.6, resize: 'none', height: 110,
                color: '#1A1A1A', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16,
              }}
              onFocus={e => { e.target.style.borderColor = RED; }}
              onBlur={e => { e.target.style.borderColor = BORDER; }}
            />
            <button style={nbtn(!submitting)} disabled={submitting} onClick={handleSubmit}>
              {submitting ? '제출 중...' : '리뷰 제출 ✓'}
            </button>
            <span onClick={handleSubmit} style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#999', cursor: 'pointer', textDecoration: 'underline' }}>건너뛰기</span>
          </>
        )}

        {step === 'done' && (
          <div style={{ paddingTop: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>리뷰 감사합니다!</div>
            <div style={{ fontSize: 14, color: '#999', lineHeight: 1.6, marginBottom: 32 }}>소중한 의견이 다른 교민분들께<br />큰 도움이 됩니다 🙏</div>
            <button style={nbtn(true)} onClick={onClose}>식당 페이지로 돌아가기</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BusinessDetail({ isDark: _isDark }: { isDark: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'review' | 'info'>('review');
  const [showReviewFlow, setShowReviewFlow] = useState(false);
  const [visitAnswer, setVisitAnswer] = useState<'none' | 'yes' | 'no'>('none');
  const [showShare, setShowShare] = useState(false);

  const { reviews, summary, submitting, userReview, submitReview } = useReviews(id ?? null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('google_place_id', id)
        .single();
      if (data) setBusiness(data as Business);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', fontSize: 14, color: '#999' }}>
      불러오는 중...
    </div>
  );

  if (!business) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
      <div style={{ fontSize: 40 }}>🍃</div>
      <div style={{ fontSize: 15, color: '#999' }}>업체를 찾을 수 없어요.</div>
      <button onClick={() => navigate(-1)} style={{ fontSize: 14, color: RED, background: 'none', border: 'none', cursor: 'pointer' }}>← 돌아가기</button>
    </div>
  );

  const bizName = business.name_ko || business.name;
  const dirUrl = business.google_place_id
    ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(bizName) + '&query_place_id=' + business.google_place_id
    : (business.lat && business.lng)
    ? 'https://www.google.com/maps/search/?api=1&query=' + business.lat + ',' + business.lng
    : null;

  const MIN_REVIEWS = 3;
  const hasEnoughReviews = summary.count >= MIN_REVIEWS;
  const displayScore = hasEnoughReviews ? summary.avgTaste : (business.google_rating ?? null);
  const hasGoogleRating = !hasEnoughReviews && business.google_rating;
  const remainingForScore = MIN_REVIEWS - summary.count;

  if (showReviewFlow) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 150, overflowY: 'auto', background: '#fff' }}>
      <ReviewFlow
        bizName={bizName}
        onClose={() => { setShowReviewFlow(false); setVisitAnswer('none'); }}
        onSubmit={submitReview}
        submitting={submitting}
      />
    </div>
  );

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100%', fontFamily: "-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif" }}>

      <div style={{ background: '#fff', padding: '0 16px', borderBottom: '0.5px solid ' + BORDER }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0 8px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#1A1A1A', padding: 0 }}>←</button>
          <span style={{ fontSize: 13, color: '#999' }}>{business.city}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, flex: 1 }}>{bizName}</div>
          {business.is_korean_run && (
            <img src={kimchiLogo} alt="한국인 운영" style={{ width: 32, height: 32, objectFit: 'contain', marginLeft: 10, flexShrink: 0 }} />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#C0251F', background: RED_BG, padding: '3px 9px', borderRadius: 20 }}>{business.category}</span>
          {business.subcategory && <span style={{ fontSize: 12, color: '#999' }}>· {business.subcategory}</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 12, paddingBottom: 14, borderTop: '0.5px solid ' + BORDER }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 34, fontWeight: 800, color: GOLD, lineHeight: 1 }}>
                {displayScore ? displayScore.toFixed(1) : '—'}
              </span>
              {hasGoogleRating && (
                <span style={{ fontSize: 10, color: '#999', background: '#F5F5F5', padding: '2px 6px', borderRadius: 6 }}>구글</span>
              )}
            </div>
            <div style={{ color: GOLD, fontSize: 13, letterSpacing: 1, marginTop: 2 }}>
              {displayScore ? renderStars(displayScore) : '☆☆☆☆☆'}
            </div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
              {summary.count > 0 ? '교민 리뷰 ' + summary.count + '개' : hasGoogleRating ? '구글 평점 기준' : '리뷰 없음'}
            </div>
          </div>

          {summary.count > 0 && !hasEnoughReviews ? (
            <div style={{ position: 'relative' }}>
              <div
                style={{ background: OK_BG, borderRadius: 14, padding: '8px 14px', maxWidth: 160, cursor: 'pointer' }}
                onClick={e => { e.currentTarget.querySelector('div[data-tip]') && ((e.currentTarget.querySelector('div[data-tip]') as HTMLElement).style.display = 'block'); }}
                onMouseEnter={e => { const t = e.currentTarget.querySelector('div[data-tip]') as HTMLElement; if(t) t.style.display='block'; }}
                onMouseLeave={e => { const t = e.currentTarget.querySelector('div[data-tip]') as HTMLElement; if(t) t.style.display='none'; }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: OK_MID, marginBottom: 2 }}>진짜한식지수(OK Score)✱</div>
                <div style={{ fontSize: 11, color: OK_COLOR, lineHeight: 1.4 }}>
                  리뷰 {remainingForScore}개 더 모이면<br />표시됩니다 🌱
                </div>
                <div data-tip style={{ display: 'none', position: 'absolute', bottom: '110%', left: 0, background: '#333', color: '#fff', fontSize: 11, lineHeight: 1.5, padding: '8px 12px', borderRadius: 10, width: 200, zIndex: 50, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  맛과는 별개로, 이 업체의 음식이 얼마나 진짜 한식에 가까운지를 교민들이 직접 평가한 헝그리김치만의 독자 지표입니다.
                  <div style={{ position: 'absolute', top: '100%', left: 16, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #333' }} />
                </div>
              </div>
            </div>
          ) : hasEnoughReviews && summary.avgOk != null ? (
            <div style={{ position: 'relative' }}>
              <div
                style={{ background: OK_BG, borderRadius: 14, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                onMouseEnter={e => { const t = e.currentTarget.querySelector('div[data-tip]') as HTMLElement; if(t) t.style.display='block'; }}
                onMouseLeave={e => { const t = e.currentTarget.querySelector('div[data-tip]') as HTMLElement; if(t) t.style.display='none'; }}
                onClick={e => { const t = e.currentTarget.querySelector('div[data-tip]') as HTMLElement; if(t) t.style.display = t.style.display==='block'?'none':'block'; }}
              >
                <div style={{ fontSize: 26, fontWeight: 900, color: OK_COLOR, lineHeight: 1 }}>{summary.avgOk}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: OK_MID }}>진짜한식지수(OK Score)✱</div>
                  <div style={{ fontSize: 10, color: '#81C784' }}>Original Korean</div>
                </div>
                <div data-tip style={{ display: 'none', position: 'absolute', bottom: '110%', left: 0, background: '#333', color: '#fff', fontSize: 11, lineHeight: 1.5, padding: '8px 12px', borderRadius: 10, width: 200, zIndex: 50, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  맛과는 별개로, 이 업체의 음식이 얼마나 진짜 한식에 가까운지를 교민들이 직접 평가한 헝그리김치만의 독자 지표입니다.
                  <div style={{ position: 'absolute', top: '100%', left: 16, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #333' }} />
                </div>
              </div>
            </div>
          ) : null}

          {summary.koreanRunYesPct != null && (
            <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: OK_COLOR }}>{summary.koreanRunYesPct}%</div>
              <div style={{ fontSize: 10, color: '#999' }}>한국인 운영</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', borderTop: '0.5px solid ' + BORDER }}>
          {(['review', 'info'] as const).map(t => (
            <div key={t} onClick={() => setTab(t)} style={{
              flex: 1, textAlign: 'center', padding: '11px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              color: tab === t ? RED : '#999',
              borderBottom: tab === t ? '2px solid ' + RED : '2px solid transparent',
            }}>
              {t === 'review' ? '리뷰' : '정보'}
            </div>
          ))}
        </div>
      </div>

      {tab === 'review' && (
        <>
          <div style={{ background: '#fff', marginTop: 8, padding: '14px 16px' }}>
            {visitAnswer === 'none' && !userReview && (
              <>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>이 식당 가보셨나요?</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setVisitAnswer('yes'); setShowReviewFlow(true); }}
                    style={{ flex: 1, padding: '13px 0', borderRadius: 10, border: '1.5px solid ' + RED, background: '#fff', color: RED, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                    ✓ 방문했어요
                  </button>
                  <button onClick={() => setVisitAnswer('no')}
                    style={{ flex: 1, padding: '13px 0', borderRadius: 10, border: '1.5px solid ' + BORDER, background: '#fff', color: '#999', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                    ✗ 안 가봤어요
                  </button>
                </div>
              </>
            )}
            {visitAnswer === 'no' && (
              <div style={{ textAlign: 'center', fontSize: 14, color: '#999', padding: '4px 0' }}>방문하신 적이 있어야 리뷰를 남길 수 있어요 😊</div>
            )}
            {userReview && (
              <div style={{ textAlign: 'center', fontSize: 13, color: OK_COLOR, fontWeight: 700 }}>✓ 이미 리뷰를 남기셨어요</div>
            )}
          </div>

          {null}

          <div style={{ background: '#fff', marginTop: 8, padding: '16px 16px 8px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: reviews.length ? 14 : 0 }}>
              {reviews.length > 0 ? '최신 리뷰' : '아직 리뷰가 없어요'}
            </div>
            {reviews.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#bbb', fontSize: 14 }}>첫 번째 리뷰를 남겨보세요 🍜</div>
            )}
            {reviews.map((rv, i) => {
              const ac = AVATAR_COLORS[i % AVATAR_COLORS.length];
              return (
                <div key={rv.id} style={{ padding: '14px 0', borderBottom: '0.5px solid ' + BORDER }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: ac.bg, color: ac.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>익</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>익명</div>
                      <div style={{ fontSize: 11, color: '#999' }}>{formatDate(rv.created_at)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: rv.comment ? 8 : 0, flexWrap: 'wrap' }}>
                    {rv.taste_score != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#FFF3E0', color: '#7B3F00' }}>맛 ★ {rv.taste_score.toFixed(1)}</span>
                    )}
                    {rv.rating != null && rv.taste_score == null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#FFF3E0', color: '#7B3F00' }}>평점 ★ {rv.rating}</span>
                    )}
                    {rv.ok_score != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: OK_BG, color: '#1B5E20' }}>OK Score {rv.ok_score}</span>
                    )}
                    {rv.is_korean_run === 'yes' && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: OK_BG, color: '#1B5E20' }}>🇰🇷 한국인 운영 확인</span>
                    )}
                    {rv.is_korean === true && rv.is_korean_run == null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: OK_BG, color: '#1B5E20' }}>🇰🇷 한국인 운영 확인</span>
                    )}
                  </div>
                  {rv.comment && <div style={{ fontSize: 13, lineHeight: 1.6, color: '#555' }}>{rv.comment}</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'info' && (
        <div style={{ background: '#fff', marginTop: 8, padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>업체 정보</div>
          {[
            { icon: '📍', label: '주소', value: business.address, href: undefined },
            { icon: '📞', label: '전화번호', value: business.phone, href: business.phone ? 'tel:' + business.phone : undefined },
            { icon: '🗂️', label: '카테고리', value: [business.category, business.subcategory].filter(Boolean).join(' · '), href: undefined },
            { icon: '⭐', label: '구글 평점', value: business.google_rating ? business.google_rating.toFixed(1) : null, href: undefined },
          ].filter(row => row.value).map(({ icon, label, value, href }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '0.5px solid ' + BORDER }}>
              <span style={{ fontSize: 16, width: 22, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 11, color: '#999' }}>{label}</div>
                {href
                  ? <a href={href} style={{ fontSize: 13, color: RED, textDecoration: 'none' }}>{value}</a>
                  : <div style={{ fontSize: 13, color: '#1A1A1A' }}>{value}</div>
                }
              </div>
            </div>
          ))}
          {dirUrl && (
            <a href={dirUrl} onClick={e => { e.preventDefault(); window.location.href = dirUrl; }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, padding: 12, background: '#fff', color: '#1A73E8', border: '1.5px solid ' + BORDER, borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              📍 구글맵에서 보기
            </a>
          )}
          <button onClick={() => setShowShare(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', marginTop: 8, padding: 12, background: '#fff', color: '#555', border: '1.5px solid ' + BORDER, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            🔗 이 업체 공유하기
          </button>
        </div>
      )}

      {showShare && <ShareSheet bizName={bizName} placeId={id!} onClose={() => setShowShare(false)} />}
    </div>
  );
}
