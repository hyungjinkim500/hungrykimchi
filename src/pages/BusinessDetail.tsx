import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Business } from '../types/index';
import { useReviews } from '../hooks/useReviews';
import kimchiLogo from '../assets/images/kimchi_level5_nb.webp';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../lib/i18n';

function useFavorite(placeId: string | null) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!placeId) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('favorites').select('id').eq('user_id', user.id).eq('business_place_id', placeId).single();
      setIsFav(!!data);
    })();
  }, [placeId]);
  const toggle = async () => {
    if (!placeId || loading) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('로그인이 필요합니다.'); return; }
    setLoading(true);
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('business_place_id', placeId);
      setIsFav(false);
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, business_place_id: placeId });
      setIsFav(true);
    }
    setLoading(false);
  };
  return { isFav, toggle };
}

function useComments(placeId: string | null) {
  const [comments, setComments] = useState<any[]>([]);
  const [myComment, setMyComment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (!placeId) return; fetchComments(); }, [placeId]);
  const fetchComments = async () => {
    setLoading(true);
    const { data } = await supabase.from('comments').select('*').eq('business_place_id', placeId).order('created_at', { ascending: false }).limit(50);
    if (data) {
      setComments(data);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setMyComment(data.find((c: any) => c.user_id === user.id) ?? null);
    }
    setLoading(false);
  };
  const addComment = async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('로그인이 필요합니다.'); return { error: 'no user' }; }
    const today = new Date().toISOString().slice(0, 10);
    const alreadyToday = comments.find((c: any) => c.user_id === user.id && c.created_at?.slice(0, 10) === today);
    if (alreadyToday) { alert('하루에 한 번만 댓글을 남길 수 있어요.'); return { error: 'limit' }; }
    const { error } = await supabase.from('comments').insert({ user_id: user.id, business_place_id: placeId, content });
    if (!error) await fetchComments();
    return { error };
  };
  const updateComment = async (id: string, content: string) => {
    const { error } = await supabase.from('comments').update({ content, updated_at: new Date().toISOString() }).eq('id', id);
    if (!error) await fetchComments();
    return { error };
  };
  const deleteComment = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) await fetchComments();
    return { error };
  };
  return { comments, myComment, loading, addComment, updateComment, deleteComment };
}

const RED = '#E8302A';
const RED_BG = '#FFF0EF';
const OK_COLOR = '#2E7D32';
const OK_BG = '#E8F5E9';
const OK_MID = '#43A047';
const GOLD = '#E65100';
const BORDER = '#EBEBEB';
const BLUE = '#1565C0';
const BLUE_BG = '#E3F2FD';

const TASTE_LABELS = ['', '별로였어요 😞', '그저 그랬어요 😐', '괜찮았어요 😊', '맛있었어요 😋', '최고였어요 🤩'];
const SCORE_LABELS = ['', '별로였어요 😞', '그저 그랬어요 😐', '괜찮았어요 😊', '좋았어요 😋', '최고였어요 🤩'];

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

function formatDate(iso: string) { return iso.slice(0, 10).replace(/-/g, '.'); }

const AVATAR_COLORS = [
  { bg: '#FFF0EF', color: '#C0251F' },
  { bg: '#E8F0FE', color: '#185FA5' },
  { bg: '#E8F5E9', color: '#2E7D32' },
  { bg: '#FFF8E1', color: '#F57F17' },
  { bg: '#F3E5F5', color: '#6A1B9A' },
];

// ─── 공유 시트 ───────────────────────────────────────────
function ShareSheet({ bizName, placeId, onClose }: { bizName: string; placeId: string; onClose: () => void }) {
  const { lang } = useLanguage();
  const url = 'https://hungrykimchi.com/biz/' + placeId;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '18px 20px 44px', width: '100%', maxWidth: 430 }}>
        <div style={{ width: 36, height: 4, background: BORDER, borderRadius: 10, margin: '0 auto 14px' }} />
        <div style={{ fontSize: 15, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>{t(lang, 'biz_share_title', { name: bizName })}</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { icon: '💬', label: t(lang, 'biz_share_sns'), bg: '#FEE500', fn: () => { navigator.share?.({ title: bizName + ' - 헝그리김치', url }); onClose(); } },
            { icon: '🔗', label: t(lang, 'biz_share_copy'), bg: '#F0F0F0', fn: () => { navigator.clipboard?.writeText(url); alert(t(lang, 'biz_share_copied')); onClose(); } },
            { icon: '↗', label: t(lang, 'biz_share_more'), bg: '#E8F0FE', fn: () => { navigator.share?.({ title: bizName + ' - 헝그리김치', url }); onClose(); } },
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

// ─── 제보 모달 ───────────────────────────────────────────
function ReportModal({ business, onClose }: { business: Business; onClose: () => void }) {
  const { lang } = useLanguage();
  const [reportType, setReportType] = useState<'closed' | 'info_error' | 'other' | null>(null);
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reportType) return;
    setSubmitting(true);
    await supabase.from('inquiries').insert({
      place_id: business.google_place_id,
      report_type: reportType,
      content: '[제보] ' + business.name_ko + ' / ' + reportType + (detail ? ' / ' + detail : ''),
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px 20px 44px', width: '100%', maxWidth: 430 }}>
        <div style={{ width: 36, height: 4, background: BORDER, borderRadius: 10, margin: '0 auto 14px' }} />
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{t(lang, 'biz_report_done_title')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>{t(lang, 'biz_report_done_msg')}</div>
            <button onClick={onClose} style={{ padding: '10px 28px', background: RED, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{t(lang, 'biz_close')}</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{t(lang, 'biz_report_title')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {[
                { val: 'closed' as const, label: t(lang, 'biz_report_closed') },
                { val: 'info_error' as const, label: t(lang, 'biz_report_info_error') },
                { val: 'other' as const, label: t(lang, 'biz_report_other') },
              ].map(({ val, label }) => (
                <button key={val} onClick={() => setReportType(val)} style={{
                  padding: '12px 14px', border: '1.5px solid ' + (reportType === val ? RED : BORDER),
                  borderRadius: 10, background: reportType === val ? RED_BG : '#fff',
                  color: reportType === val ? RED : '#1A1A1A', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', textAlign: 'left',
                }}>{label}</button>
              ))}
            </div>
            <textarea
              value={detail}
              onChange={e => setDetail(e.target.value)}
              placeholder={t(lang, 'biz_report_placeholder')}
              style={{ width: '100%', border: '1.5px solid ' + BORDER, borderRadius: 10, padding: 12, fontSize: 13, lineHeight: 1.6, resize: 'none', height: 70, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
            />
            <button
              onClick={handleSubmit}
              disabled={!reportType || submitting}
              style={{ width: '100%', padding: 13, background: reportType ? RED : BORDER, color: reportType ? '#fff' : '#999', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: reportType ? 'pointer' : 'not-allowed' }}
            >{submitting ? t(lang, 'biz_report_submitting') : t(lang, 'biz_report_submit')}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── 음식점 리뷰 플로우 ──────────────────────────────────
type FoodStep = 'korean' | 'taste' | 'ok' | 'comment' | 'done';

function ReviewFlowFood({ bizName, onClose, onSubmit, submitting, showOkScore }: {
  bizName: string; onClose: () => void;
  onSubmit: (p: { is_korean_run: 'yes' | 'no' | 'unknown'; taste_score: number; ok_score: number; comment: string }) => Promise<{ error: unknown }>;
  submitting: boolean;
  showOkScore: boolean;
}) {
  const { lang } = useLanguage();
  const [step, setStep] = useState<FoodStep>('korean');
  const [korean, setKorean] = useState<'yes' | 'no' | 'unknown' | null>(null);
  const [taste, setTaste] = useState(0);
  const [ok, setOk] = useState(50);
  const [comment, setComment] = useState('');

  const STEPS: FoodStep[] = showOkScore ? ['korean', 'taste', 'ok', 'comment'] : ['korean', 'taste', 'comment'];
  const pct = step === 'done' ? 100 : Math.round(((STEPS.indexOf(step) + 1) / (STEPS.length + 1)) * 100);

  const handleSubmit = async () => {
    const { error } = await onSubmit({ is_korean_run: korean!, taste_score: taste, ok_score: showOkScore ? ok : 0, comment });
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
    borderRadius: 12, background: sel ? (variant === 'ok' ? OK_BG : RED_BG) : '#fff',
    cursor: 'pointer', fontSize: 15, fontWeight: 600,
    color: sel ? (variant === 'ok' ? OK_COLOR : RED) : '#1A1A1A',
    width: '100%', textAlign: 'left',
  });

  return (
    <div style={{ background: '#fff', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '0.5px solid ' + BORDER }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#1A1A1A', padding: 0 }}>←</button>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{bizName} {t(lang, 'biz_review_tab')}</div>
      </div>
      <div style={{ height: 3, background: BORDER }}>
        <div style={{ height: 3, background: RED, width: pct + '%', transition: 'width .35s ease' }} />
      </div>
      <div style={{ padding: '28px 20px 24px' }}>
        {step === 'korean' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_korean_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 26 }}>{t(lang, 'review_korean_sub')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([{ val: 'yes' as const, icon: '🇰🇷', label: t(lang, 'review_korean_yes'), v: 'ok' as const }, { val: 'no' as const, icon: '🌏', label: t(lang, 'review_korean_no'), v: 'red' as const }, { val: 'unknown' as const, icon: '🤔', label: t(lang, 'review_korean_unknown'), v: 'red' as const }]).map(({ val, icon, label, v }) => (
                <button key={val} style={ch(korean === val, v)} onClick={() => setKorean(val)}>
                  <span style={{ fontSize: 22, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>{label}
                </button>
              ))}
            </div>
            <button style={{ ...nbtn(korean !== null), marginTop: 22 }} disabled={korean === null} onClick={() => setStep('taste')}>{t(lang, 'review_next')}</button>
          </>
        )}
        {step === 'taste' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_taste_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 26 }}>{t(lang, 'review_taste_sub')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} onClick={() => setTaste(n)} style={{ fontSize: 44, cursor: 'pointer', lineHeight: 1, userSelect: 'none', color: n <= taste ? GOLD : '#E0E0E0', display: 'inline-block', transform: n <= taste ? 'scale(1.06)' : 'scale(1)', transition: 'color .1s, transform .1s' }}>★</span>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: GOLD, minHeight: 22, marginBottom: 24 }}>{taste ? TASTE_LABELS[taste] : t(lang, 'review_taste_prompt')}</div>
            <button style={nbtn(taste > 0)} disabled={taste === 0} onClick={() => setStep(showOkScore ? 'ok' : 'comment')}>{t(lang, 'review_next')}</button>
          </>
        )}
        {step === 'ok' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_ok_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>{t(lang, 'review_ok_sub')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: OK_COLOR, lineHeight: 1 }}>{ok}</span>
              <span style={{ fontSize: 18, color: '#999' }}>/ 100</span>
            </div>
            <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: OK_MID, minHeight: 20, marginBottom: 16 }}>{okDesc(ok)}</div>
            <div style={{ position: 'relative', height: 8, borderRadius: 10, background: 'linear-gradient(to right,#FF8A65,#FFD54F,#66BB6A)', marginBottom: 6 }}>
              <div style={{ position: 'absolute', top: '50%', left: 'calc(' + ok + '% - 9px)', transform: 'translateY(-50%)', width: 18, height: 18, borderRadius: '50%', background: OK_COLOR, border: '3px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,.25)', transition: 'left .05s' }} />
            </div>
            <input type="range" min={0} max={100} step={1} value={ok} onChange={e => setOk(parseInt(e.target.value))} style={{ width: '100%', opacity: 0, height: 20, marginTop: -14, cursor: 'pointer', display: 'block' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#999', marginBottom: 28, marginTop: 2 }}><span>🌏 {lang === 'en' ? 'Local' : '현지화'}</span><span>🇰🇷 {lang === 'en' ? 'Authentic Korean' : '진짜 한식'}</span></div>
            <button style={nbtn(true, 'ok')} onClick={() => setStep('comment')}>{t(lang, 'review_next')}</button>
          </>
        )}
        {step === 'comment' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_comment_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>{t(lang, 'review_comment_sub')}</div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={t(lang, 'review_comment_placeholder_food')} style={{ width: '100%', border: '1.5px solid ' + BORDER, borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 1.6, resize: 'none', height: 110, color: '#1A1A1A', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} onFocus={e => { e.target.style.borderColor = RED; }} onBlur={e => { e.target.style.borderColor = BORDER; }} />
            <button style={nbtn(!submitting)} disabled={submitting} onClick={handleSubmit}>{submitting ? t(lang, 'review_submitting') : t(lang, 'review_submit')}</button>
            <span onClick={handleSubmit} style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#999', cursor: 'pointer', textDecoration: 'underline' }}>{t(lang, 'review_skip')}</span>
          </>
        )}
        {step === 'done' && (
          <div style={{ paddingTop: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{t(lang, 'review_done_title')}</div>
            <div style={{ fontSize: 14, color: '#999', lineHeight: 1.6, marginBottom: 32 }}>{t(lang, 'review_done_msg')}</div>
            <button style={nbtn(true)} onClick={onClose}>{t(lang, 'review_back_to_page')}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 마트 리뷰 플로우 ────────────────────────────────────
type MartStep = 'korean' | 'size' | 'ratio' | 'comment' | 'done';

function ReviewFlowMart({ bizName, onClose, onSubmit, submitting }: {
  bizName: string; onClose: () => void;
  onSubmit: (p: { is_korean_run: 'yes' | 'no' | 'unknown'; store_size: string; korean_product_ratio: number; comment: string }) => Promise<{ error: unknown }>;
  submitting: boolean;
}) {
  const { lang } = useLanguage();
  const [step, setStep] = useState<MartStep>('korean');
  const [korean, setKorean] = useState<'yes' | 'no' | 'unknown' | null>(null);
  const [size, setSize] = useState<'small' | 'medium' | 'large' | null>(null);
  const [ratio, setRatio] = useState(50);
  const [comment, setComment] = useState('');

  const STEPS: MartStep[] = ['korean', 'size', 'ratio', 'comment'];
  const pct = step === 'done' ? 100 : Math.round(((STEPS.indexOf(step) + 1) / (STEPS.length + 1)) * 100);

  const handleSubmit = async () => {
    const { error } = await onSubmit({ is_korean_run: korean!, store_size: size!, korean_product_ratio: ratio, comment });
    if (!error) setStep('done');
  };

  const nbtn = (active: boolean): React.CSSProperties => ({
    width: '100%', padding: 15, border: 'none', borderRadius: 12,
    fontSize: 16, fontWeight: 800, cursor: active ? 'pointer' : 'not-allowed',
    background: active ? RED : BORDER, color: active ? '#fff' : '#999', letterSpacing: '-0.3px',
  });

  const ch = (sel: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 14, padding: '15px 16px',
    border: '1.5px solid ' + (sel ? RED : BORDER), borderRadius: 12,
    background: sel ? RED_BG : '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600,
    color: sel ? RED : '#1A1A1A', width: '100%', textAlign: 'left',
  });

  return (
    <div style={{ background: '#fff', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '0.5px solid ' + BORDER }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#1A1A1A', padding: 0 }}>←</button>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{bizName} {t(lang, 'biz_review_tab')}</div>
      </div>
      <div style={{ height: 3, background: BORDER }}><div style={{ height: 3, background: RED, width: pct + '%', transition: 'width .35s ease' }} /></div>
      <div style={{ padding: '28px 20px 24px' }}>
        {step === 'korean' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_korean_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 26 }}>{t(lang, 'review_korean_sub')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([{ val: 'yes' as const, icon: '🇰🇷', label: t(lang, 'review_korean_yes') }, { val: 'no' as const, icon: '🌏', label: t(lang, 'review_korean_no') }, { val: 'unknown' as const, icon: '🤔', label: t(lang, 'review_korean_unknown') }]).map(({ val, icon, label }) => (
                <button key={val} style={ch(korean === val)} onClick={() => setKorean(val)}>
                  <span style={{ fontSize: 22, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>{label}
                </button>
              ))}
            </div>
            <button style={{ ...nbtn(korean !== null), marginTop: 22 }} disabled={korean === null} onClick={() => setStep('size')}>{t(lang, 'review_next')}</button>
          </>
        )}
        {step === 'size' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_mart_size_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 26 }}>{t(lang, 'review_mart_size_sub')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([{ val: 'small' as const, icon: '🏪', label: t(lang, 'review_mart_small') }, { val: 'medium' as const, icon: '🛒', label: t(lang, 'review_mart_medium') }, { val: 'large' as const, icon: '🏬', label: t(lang, 'review_mart_large') }]).map(({ val, icon, label }) => (
                <button key={val} style={ch(size === val)} onClick={() => setSize(val)}>
                  <span style={{ fontSize: 22, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>{label}
                </button>
              ))}
            </div>
            <button style={{ ...nbtn(size !== null), marginTop: 22 }} disabled={size === null} onClick={() => setStep('ratio')}>{t(lang, 'review_next')}</button>
          </>
        )}
        {step === 'ratio' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_mart_ratio_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>{t(lang, 'review_mart_ratio_sub')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: RED, lineHeight: 1 }}>{ratio}%</span>
            </div>
            <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: ratio >= 70 ? OK_COLOR : ratio >= 40 ? GOLD : '#999', minHeight: 20, marginBottom: 16 }}>
              {ratio >= 70 ? (lang === 'en' ? 'Mostly Korean products 🇰🇷' : '한국 상품 위주예요 🇰🇷') : ratio >= 40 ? (lang === 'en' ? 'Mixed selection 🛒' : '적당히 섞여 있어요 🛒') : (lang === 'en' ? 'Few Korean products 😅' : '한국 상품이 적어요 😅')}
            </div>
            <div style={{ position: 'relative', height: 8, borderRadius: 10, background: 'linear-gradient(to right,#EF9A9A,#FFD54F,#66BB6A)', marginBottom: 6 }}>
              <div style={{ position: 'absolute', top: '50%', left: 'calc(' + ratio + '% - 9px)', transform: 'translateY(-50%)', width: 18, height: 18, borderRadius: '50%', background: RED, border: '3px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,.25)', transition: 'left .05s' }} />
            </div>
            <input type="range" min={0} max={100} step={5} value={ratio} onChange={e => setRatio(parseInt(e.target.value))} style={{ width: '100%', opacity: 0, height: 20, marginTop: -14, cursor: 'pointer', display: 'block' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#999', marginBottom: 28, marginTop: 2 }}><span>{lang === 'en' ? '0% Almost none' : '0% 거의 없음'}</span><span>{lang === 'en' ? '100% Korean mart' : '100% 한국마트'}</span></div>
            <button style={nbtn(true)} onClick={() => setStep('comment')}>{t(lang, 'review_next')}</button>
          </>
        )}
        {step === 'comment' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_comment_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>{t(lang, 'review_comment_sub')}</div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={t(lang, 'review_mart_comment_placeholder')} style={{ width: '100%', border: '1.5px solid ' + BORDER, borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 1.6, resize: 'none', height: 110, color: '#1A1A1A', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} onFocus={e => { e.target.style.borderColor = RED; }} onBlur={e => { e.target.style.borderColor = BORDER; }} />
            <button style={nbtn(!submitting)} disabled={submitting} onClick={handleSubmit}>{submitting ? t(lang, 'review_submitting') : t(lang, 'review_submit')}</button>
            <span onClick={handleSubmit} style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#999', cursor: 'pointer', textDecoration: 'underline' }}>{t(lang, 'review_skip')}</span>
          </>
        )}
        {step === 'done' && (
          <div style={{ paddingTop: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{t(lang, 'review_done_title')}</div>
            <div style={{ fontSize: 14, color: '#999', lineHeight: 1.6, marginBottom: 32 }}>{t(lang, 'review_done_msg')}</div>
            <button style={nbtn(true)} onClick={onClose}>{t(lang, 'review_back_to_page')}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 의료 리뷰 플로우 ────────────────────────────────────
type MedStep = 'lang' | 'fee' | 'satisfaction' | 'comment' | 'done';

function ReviewFlowMedical({ bizName, onClose, onSubmit, submitting, showLang }: {
  bizName: string; onClose: () => void;
  onSubmit: (p: { is_korean_run: 'yes' | 'no' | 'unknown'; lang_korean: boolean; lang_english: boolean; fee_transparency: number; treatment_score: number; comment: string }) => Promise<{ error: unknown }>;
  submitting: boolean;
  showLang: boolean;
}) {
  const { lang } = useLanguage();
  const [step, setStep] = useState<MedStep>(showLang ? 'lang' : 'fee');
  const [langKo, setLangKo] = useState(false);
  const [langEn, setLangEn] = useState(false);
  const [fee, setFee] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [comment, setComment] = useState('');

  const STEPS: MedStep[] = showLang ? ['lang', 'fee', 'satisfaction', 'comment'] : ['fee', 'satisfaction', 'comment'];
  const pct = step === 'done' ? 100 : Math.round(((STEPS.indexOf(step) + 1) / (STEPS.length + 1)) * 100);

  const handleSubmit = async () => {
    const { error } = await onSubmit({ is_korean_run: langKo ? 'yes' : 'unknown', lang_korean: langKo, lang_english: langEn, fee_transparency: fee, treatment_score: satisfaction, comment });
    if (!error) setStep('done');
  };

  const nbtn = (active: boolean): React.CSSProperties => ({
    width: '100%', padding: 15, border: 'none', borderRadius: 12,
    fontSize: 16, fontWeight: 800, cursor: active ? 'pointer' : 'not-allowed',
    background: active ? BLUE : BORDER, color: active ? '#fff' : '#999', letterSpacing: '-0.3px',
  });

  const toggle = (sel: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
    border: '1.5px solid ' + (sel ? BLUE : BORDER), borderRadius: 12,
    background: sel ? BLUE_BG : '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600,
    color: sel ? BLUE : '#1A1A1A', width: '100%', textAlign: 'left',
  });

  return (
    <div style={{ background: '#fff', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '0.5px solid ' + BORDER }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#1A1A1A', padding: 0 }}>←</button>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{bizName} {t(lang, 'biz_review_tab')}</div>
      </div>
      <div style={{ height: 3, background: BORDER }}><div style={{ height: 3, background: BLUE, width: pct + '%', transition: 'width .35s ease' }} /></div>
      <div style={{ padding: '28px 20px 24px' }}>
        {step === 'lang' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_med_lang_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 26 }}>{t(lang, 'review_med_lang_sub')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
              <button style={toggle(langKo)} onClick={() => setLangKo(!langKo)}>
                <span style={{ fontSize: 22, width: 28, textAlign: 'center', flexShrink: 0 }}>🇰🇷</span>{t(lang, 'review_med_lang_ko')} {langKo ? '✓' : ''}
              </button>
              <button style={toggle(langEn)} onClick={() => setLangEn(!langEn)}>
                <span style={{ fontSize: 22, width: 28, textAlign: 'center', flexShrink: 0 }}>🇺🇸</span>{t(lang, 'review_med_lang_en')} {langEn ? '✓' : ''}
              </button>
              <div style={{ padding: '13px 16px', border: '1.5px solid ' + BORDER, borderRadius: 12, fontSize: 15, color: '#999' }}>
                {t(lang, 'review_med_lang_local')}
              </div>
            </div>
            <button style={nbtn(true)} onClick={() => setStep('fee')}>{t(lang, 'review_next')}</button>
          </>
        )}
        {step === 'fee' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_med_fee_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 26 }}>{t(lang, 'review_med_fee_sub')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} onClick={() => setFee(n)} style={{ fontSize: 40, cursor: 'pointer', lineHeight: 1, userSelect: 'none', color: n <= fee ? BLUE : '#E0E0E0', display: 'inline-block', transform: n <= fee ? 'scale(1.06)' : 'scale(1)', transition: 'color .1s, transform .1s' }}>★</span>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: BLUE, minHeight: 22, marginBottom: 8 }}>
              {fee === 0 ? t(lang, 'review_med_fee_prompt') : fee <= 2 ? t(lang, 'review_med_fee_low') : fee === 3 ? t(lang, 'review_med_fee_mid') : t(lang, 'review_med_fee_high')}
            </div>
            <div style={{ fontSize: 11, color: '#999', textAlign: 'center', marginBottom: 24 }}>{t(lang, 'review_med_fee_hint')}</div>
            <button style={nbtn(fee > 0)} disabled={fee === 0} onClick={() => setStep('satisfaction')}>{t(lang, 'review_next')}</button>
          </>
        )}
        {step === 'satisfaction' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_med_sat_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 26 }}>{t(lang, 'review_med_sat_sub')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} onClick={() => setSatisfaction(n)} style={{ fontSize: 40, cursor: 'pointer', lineHeight: 1, userSelect: 'none', color: n <= satisfaction ? GOLD : '#E0E0E0', display: 'inline-block', transform: n <= satisfaction ? 'scale(1.06)' : 'scale(1)', transition: 'color .1s, transform .1s' }}>★</span>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 700, color: GOLD, minHeight: 22, marginBottom: 24 }}>{satisfaction ? SCORE_LABELS[satisfaction] : t(lang, 'review_taste_prompt')}</div>
            <button style={nbtn(satisfaction > 0)} disabled={satisfaction === 0} onClick={() => setStep('comment')}>{t(lang, 'review_next')}</button>
          </>
        )}
        {step === 'comment' && (
          <>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 }}>{t(lang, 'review_comment_q')}</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>{t(lang, 'review_comment_sub')}</div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder={t(lang, 'review_med_comment_placeholder')} style={{ width: '100%', border: '1.5px solid ' + BORDER, borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 1.6, resize: 'none', height: 110, color: '#1A1A1A', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} onFocus={e => { e.target.style.borderColor = BLUE; }} onBlur={e => { e.target.style.borderColor = BORDER; }} />
            <button style={nbtn(!submitting)} disabled={submitting} onClick={handleSubmit}>{submitting ? t(lang, 'review_submitting') : t(lang, 'review_submit')}</button>
            <span onClick={handleSubmit} style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: 13, color: '#999', cursor: 'pointer', textDecoration: 'underline' }}>{t(lang, 'review_skip')}</span>
          </>
        )}
        {step === 'done' && (
          <div style={{ paddingTop: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{t(lang, 'review_done_title')}</div>
            <div style={{ fontSize: 14, color: '#999', lineHeight: 1.6, marginBottom: 32 }}>{t(lang, 'review_done_msg')}</div>
            <button style={nbtn(true)} onClick={onClose}>{t(lang, 'review_back_to_page')}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── useReviews submit 래퍼 ──────────────────────────────
function getCategoryType(category: string): 'food' | 'mart' | 'medical' | 'official' {
  if (category === '음식점') return 'food';
  if (category === '마트/슈퍼') return 'mart';
  if (category === '의료') return 'medical';
  if (category === '관공·긴급') return 'official';
  return 'food';
}

// ─── 메인 컴포넌트 ───────────────────────────────────────
export default function BusinessDetail({ isDark: _isDark }: { isDark: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'review' | 'info'>('review');
  const [showReviewFlow, setShowReviewFlow] = useState(false);
  const [visitAnswer, setVisitAnswer] = useState<'none' | 'yes' | 'no'>('none');
  const [showShare, setShowShare] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isKakaoUser, setIsKakaoUser] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsKakaoUser(user?.app_metadata?.provider === 'kakao');
    });
  }, []);

  const { lang } = useLanguage();
  const { reviews, summary, submitting, userReview, submitReview } = useReviews(id ?? null);
  const { isFav, toggle: toggleFav } = useFavorite(id ?? null);
  const { comments, myComment, addComment, updateComment, deleteComment } = useComments(id ?? null);
  void myComment;

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('businesses').select('*').eq('google_place_id', id).single();
      if (data) setBusiness(data as Business);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', fontSize: 14, color: '#999' }}>{t(lang, 'biz_loading')}</div>
  );

  if (!business) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
      <div style={{ fontSize: 40 }}>🍃</div>
      <div style={{ fontSize: 15, color: '#999' }}>{t(lang, 'biz_not_found')}</div>
      <button onClick={() => navigate(-1)} style={{ fontSize: 14, color: RED, background: 'none', border: 'none', cursor: 'pointer' }}>{t(lang, 'biz_back')}</button>
    </div>
  );

  const bizName = business.name_ko || business.name || '';
  const categoryType = getCategoryType(business.category ?? '');
  const isOfficial = categoryType === 'official';

  const dirUrl = business.google_place_id
    ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(bizName) + '&query_place_id=' + business.google_place_id
    : (business.lat && business.lng)
    ? 'https://www.google.com/maps/search/?api=1&query=' + business.lat + ',' + business.lng
    : null;

    const displayScore = summary.avgTaste ?? (business.google_rating ?? null);
    const hasGoogleRating = summary.count === 0 && business.google_rating;

  // 마트/의료용 submit 래퍼
  const submitMart = async (p: { is_korean_run: 'yes' | 'no' | 'unknown'; store_size: string; korean_product_ratio: number; comment: string }) => {
    return submitReview({ is_korean_run: p.is_korean_run, taste_score: 0, ok_score: 0, comment: p.comment, store_size: p.store_size, korean_product_ratio: p.korean_product_ratio });
  };

  const submitMedical = async (p: { is_korean_run: 'yes' | 'no' | 'unknown'; lang_korean: boolean; lang_english: boolean; fee_transparency: number; treatment_score: number; comment: string }) => {
    return submitReview({ is_korean_run: p.is_korean_run, taste_score: p.treatment_score, ok_score: 0, comment: p.comment, lang_korean: p.lang_korean, lang_english: p.lang_english, fee_transparency: p.fee_transparency, treatment_score: p.treatment_score });
  };

  if (showReviewFlow && !isOfficial) return (
    <div style={{ position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', zIndex: 150, overflowY: 'auto', background: '#fff' }}>
      {categoryType === 'food' && (
        <ReviewFlowFood bizName={bizName} onClose={() => { setShowReviewFlow(false); setVisitAnswer('none'); }} onSubmit={submitReview} submitting={submitting} showOkScore={isKakaoUser} />
      )}
      {categoryType === 'mart' && (
        <ReviewFlowMart bizName={bizName} onClose={() => { setShowReviewFlow(false); setVisitAnswer('none'); }} onSubmit={submitMart} submitting={submitting} />
      )}
      {categoryType === 'medical' && (
        <ReviewFlowMedical bizName={bizName} onClose={() => { setShowReviewFlow(false); setVisitAnswer('none'); }} onSubmit={submitMedical} submitting={submitting} showLang={isKakaoUser} />
      )}
    </div>
  );

  return (
    <div style={{ background: '#F5F5F5', minHeight: '100%', fontFamily: "-apple-system,'Apple SD Gothic Neo','Noto Sans KR',sans-serif" }}>

      {/* ── 헤더 ── */}
      <div style={{ background: '#fff', padding: '0 16px', borderBottom: '0.5px solid ' + BORDER }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0 8px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#1A1A1A', padding: 0 }}>←</button>
          <span style={{ fontSize: 13, color: '#999' }}>{business.city}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, flex: 1 }}>{bizName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 10 }}>
            {business.is_korean_run && (
              <img src={kimchiLogo} alt="한국인 운영" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            )}
            <button onClick={() => setShowShare(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: '#AAAAAA' }}>
              <Share2 size={20} />
            </button>
            {!isOfficial && (
              <button onClick={toggleFav} style={{ background: 'none', border: 'none', fontSize: 26, cursor: 'pointer', lineHeight: 1, padding: 0 }}>
                <Heart size={22} fill={isFav ? '#E8302A' : 'none'} color={isFav ? '#E8302A' : '#CCCCCC'} />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#C0251F', background: RED_BG, padding: '3px 9px', borderRadius: 20 }}>{business.category}</span>
          {business.subcategory && <span style={{ fontSize: 12, color: '#999' }}>· {business.subcategory}</span>}
        </div>

        {/* 점수 영역 - 관공서는 생략 */}
        {!isOfficial && (
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
              {!hasGoogleRating && (
                <div style={{ color: GOLD, fontSize: 13, letterSpacing: 1, marginTop: 2 }}>
                  {displayScore ? renderStars(displayScore) : '☆☆☆☆☆'}
                </div>
              )}
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                {summary.count > 0 ? t(lang, 'biz_community_reviews', { n: summary.count }) : hasGoogleRating ? t(lang, 'biz_google_rating') : t(lang, 'biz_no_review_label')}
              </div>
            </div>

            {categoryType === 'food' && summary.avgOk != null && (
              <div style={{ background: OK_BG, borderRadius: 14, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: OK_COLOR, lineHeight: 1 }}>{summary.avgOk}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: OK_MID }}>{lang === 'en' ? 'OK Score✱' : '진짜한식지수(OK Score)✱'}</div>
                  <div style={{ fontSize: 10, color: '#81C784' }}>Original Korean</div>
                </div>
              </div>
            )}

            {categoryType === 'mart' && summary.count >= 1 && (
              <div style={{ background: RED_BG, borderRadius: 14, padding: '8px 14px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: RED, marginBottom: 2 }}>{t(lang, 'biz_korean_product_ratio')}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: RED }}>{summary.avgKoreanProductRatio != null ? summary.avgKoreanProductRatio + '%' : '—'}</div>
              </div>
            )}

            {categoryType === 'medical' && summary.count >= 1 && (
              <div style={{ background: BLUE_BG, borderRadius: 14, padding: '8px 14px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, marginBottom: 4 }}>{t(lang, 'biz_lang_label')}</div>
                <div style={{ fontSize: 12, color: BLUE, lineHeight: 1.5 }}>
                  {summary.langKoreanPct != null && summary.langKoreanPct > 50 && <div>{t(lang, 'biz_lang_korean')}</div>}
                  {summary.langEnglishPct != null && summary.langEnglishPct > 50 && <div>{t(lang, 'biz_lang_english')}</div>}
                  {(summary.langKoreanPct == null || summary.langKoreanPct <= 50) && (summary.langEnglishPct == null || summary.langEnglishPct <= 50) && <div>{t(lang, 'biz_lang_local')}</div>}
                </div>
              </div>
            )}

            {summary.koreanRunYesPct != null && (
              <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: OK_COLOR }}>{summary.koreanRunYesPct}%</div>
                <div style={{ fontSize: 10, color: '#999' }}>{t(lang, 'biz_korean_run_pct')}</div>
              </div>
            )}
          </div>
        )}

        {/* 탭 - 관공서도 정보 탭은 유지 */}
        <div style={{ display: 'flex', borderTop: '0.5px solid ' + BORDER }}>
          {(isOfficial ? ['info'] as const : ['review', 'info'] as const).map(tabKey => (
            <div key={tabKey} onClick={() => setTab(tabKey as 'review' | 'info')} style={{
              flex: 1, textAlign: 'center', padding: '11px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              color: tab === tabKey ? RED : '#999',
              borderBottom: tab === tabKey ? '2px solid ' + RED : '2px solid transparent',
            }}>
              {tabKey === 'review' ? t(lang, 'biz_review_tab') : t(lang, 'biz_info_tab')}
            </div>
          ))}
        </div>
      </div>

      {/* ── 리뷰 탭 (관공서 제외) ── */}
      {tab === 'review' && !isOfficial && (
        <>
          <div style={{ background: '#fff', marginTop: 8, padding: '14px 16px' }}>
            {visitAnswer === 'none' && !userReview && (
              <>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                  {categoryType === 'mart' ? t(lang, 'biz_visited_q_mart') : categoryType === 'medical' ? t(lang, 'biz_visited_q_medical') : t(lang, 'biz_visited_q_food')}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setVisitAnswer('yes'); setShowReviewFlow(true); }}
                    style={{ flex: 1, padding: '13px 0', borderRadius: 10, border: '1.5px solid ' + RED, background: '#fff', color: RED, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                    {t(lang, 'biz_visited_yes')}
                  </button>
                  <button onClick={() => setVisitAnswer('no')}
                    style={{ flex: 1, padding: '13px 0', borderRadius: 10, border: '1.5px solid ' + BORDER, background: '#fff', color: '#999', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                    {t(lang, 'biz_visited_no')}
                  </button>
                </div>
              </>
            )}
            {visitAnswer === 'no' && (
              <div style={{ textAlign: 'center', fontSize: 14, color: '#999', padding: '4px 0' }}>{t(lang, 'biz_visited_no_msg')}</div>
            )}
            {userReview && (
              <div style={{ textAlign: 'center', fontSize: 13, color: OK_COLOR, fontWeight: 700 }}>{t(lang, 'biz_already_reviewed')}</div>
            )}
          </div>

          <div style={{ background: '#fff', marginTop: 8, padding: '16px 16px 8px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: reviews.length ? 14 : 0 }}>
              {reviews.length > 0 ? t(lang, 'biz_reviews_label') : t(lang, 'biz_no_reviews_label')}
            </div>
            {reviews.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#bbb', fontSize: 14 }}>
                {categoryType === 'mart' ? t(lang, 'biz_no_reviews_mart') : categoryType === 'medical' ? t(lang, 'biz_no_reviews_medical') : t(lang, 'biz_no_reviews_food')}
              </div>
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
                    {/* 음식점 뱃지 */}
                    {categoryType === 'food' && rv.taste_score != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#FFF3E0', color: '#7B3F00' }}>맛 ★ {rv.taste_score.toFixed(1)}</span>
                    )}
                    {categoryType === 'food' && rv.rating != null && rv.taste_score == null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#FFF3E0', color: '#7B3F00' }}>평점 ★ {rv.rating}</span>
                    )}
                    {categoryType === 'food' && rv.ok_score != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: OK_BG, color: '#1B5E20' }}>OK Score {rv.ok_score}</span>
                    )}
                    {(rv.is_korean_run === 'yes' || rv.is_korean === true) && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: OK_BG, color: '#1B5E20' }}>🇰🇷 한국인 운영 확인</span>
                    )}
                    {/* 마트 뱃지 */}
                    {categoryType === 'mart' && rv.store_size && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: RED_BG, color: RED }}>
                        {rv.store_size === 'small' ? '🏪 소형' : rv.store_size === 'medium' ? '🛒 중형' : '🏬 대형'}
                      </span>
                    )}
                    {categoryType === 'mart' && rv.korean_product_ratio != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: RED_BG, color: RED }}>한국상품 {rv.korean_product_ratio}%</span>
                    )}
                    {/* 의료 뱃지 */}
                    {categoryType === 'medical' && rv.lang_korean && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: BLUE_BG, color: BLUE }}>🇰🇷 한국어 가능</span>
                    )}
                    {categoryType === 'medical' && rv.lang_english && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: BLUE_BG, color: BLUE }}>🇺🇸 영어 가능</span>
                    )}
                    {categoryType === 'medical' && rv.fee_transparency != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: BLUE_BG, color: BLUE }}>진료비 투명도 ★ {rv.fee_transparency}</span>
                    )}
                    {categoryType === 'medical' && rv.treatment_score != null && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#FFF3E0', color: '#7B3F00' }}>만족도 ★ {rv.treatment_score}</span>
                    )}
                  </div>
                  {rv.comment && <div style={{ fontSize: 13, lineHeight: 1.6, color: '#555' }}>{rv.comment}</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── 정보 탭 ── */}
      {tab === 'info' && (
        <div style={{ background: '#fff', marginTop: 8, padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{t(lang, 'biz_info_title')}</div>
          {[
            { icon: '📍', label: t(lang, 'biz_info_address'), value: business.address, href: undefined },
            { icon: '📞', label: t(lang, 'biz_info_phone'), value: business.phone, href: business.phone ? 'tel:' + business.phone : undefined },
            { icon: '🗂️', label: t(lang, 'biz_info_category'), value: [business.category, business.subcategory].filter(Boolean).join(' · '), href: undefined },
            { icon: '⭐', label: t(lang, 'biz_info_google_rating'), value: business.google_rating ? business.google_rating.toFixed(1) : null, href: undefined },
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
              {t(lang, 'biz_open_gmaps')}
            </a>
          )}
          {/* 제보 버튼 */}
          <button onClick={() => setShowReport(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%', marginTop: 24, padding: '8px 0', background: 'none', color: '#BBBBBB', border: 'none', borderRadius: 0, fontSize: 12, cursor: 'pointer', borderTop: '0.5px solid ' + BORDER }}>
            {t(lang, 'biz_report_btn')}
          </button>
        </div>
      )}

      {/* ── 댓글 비활성화 ── */}
      {false && tab === 'review' && (
        <div style={{ background: '#fff', marginTop: 8, padding: '16px 16px 24px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>댓글</div>
          {!myComment && (
            <div style={{ marginBottom: 16 }}>
              <textarea value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="이 업체에 대한 댓글을 남겨주세요. (하루 1회)"
                style={{ width: '100%', border: '1.5px solid ' + BORDER, borderRadius: 10, padding: 12, fontSize: 13, lineHeight: 1.6, resize: 'none', height: 80, color: '#1A1A1A', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
                onFocus={e => { e.target.style.borderColor = RED; }} onBlur={e => { e.target.style.borderColor = BORDER; }} />
              <button onClick={async () => { if (!commentInput.trim()) return; const { error } = await addComment(commentInput.trim()); if (!error) setCommentInput(''); }}
                style={{ padding: '8px 18px', background: RED, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                댓글 등록
              </button>
            </div>
          )}
          {comments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '16px 0', color: '#bbb', fontSize: 13 }}>첫 번째 댓글을 남겨보세요 💬</div>
          )}
          {comments.map((c, i) => {
            const ac = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const isEditing = editingId === c.id;
            const isMine = myComment?.id === c.id;
            return (
              <div key={c.id} style={{ padding: '12px 0', borderBottom: '0.5px solid ' + BORDER }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: ac.bg, color: ac.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>익</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>익명{isMine ? ' (나)' : ''}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>{formatDate(c.created_at)}</div>
                  </div>
                  {isMine && !isEditing && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setEditingId(c.id); setEditContent(c.content); }} style={{ fontSize: 11, color: '#999', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>수정</button>
                      <button onClick={async () => { if (window.confirm('댓글을 삭제할까요?')) await deleteComment(c.id); }} style={{ fontSize: 11, color: RED, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>삭제</button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <div>
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)} style={{ width: '100%', border: '1.5px solid ' + RED, borderRadius: 8, padding: 10, fontSize: 13, lineHeight: 1.6, resize: 'none', height: 70, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 6 }} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={async () => { await updateComment(c.id, editContent); setEditingId(null); }} style={{ padding: '6px 14px', background: RED, color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>저장</button>
                      <button onClick={() => setEditingId(null)} style={{ padding: '6px 14px', background: '#F5F5F5', color: '#555', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>취소</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: '#555' }}>{c.content}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 관공서 댓글 비활성화 */}
      {false && isOfficial && tab === 'info' && (
        <div style={{ background: '#fff', marginTop: 8, padding: '16px 16px 24px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>댓글</div>
          {!myComment && (
            <div style={{ marginBottom: 16 }}>
              <textarea value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="이 기관에 대해 알고 있는 정보나 경험을 남겨주세요. (하루 1회)"
                style={{ width: '100%', border: '1.5px solid ' + BORDER, borderRadius: 10, padding: 12, fontSize: 13, lineHeight: 1.6, resize: 'none', height: 80, color: '#1A1A1A', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
                onFocus={e => { e.target.style.borderColor = RED; }} onBlur={e => { e.target.style.borderColor = BORDER; }} />
              <button onClick={async () => { if (!commentInput.trim()) return; const { error } = await addComment(commentInput.trim()); if (!error) setCommentInput(''); }}
                style={{ padding: '8px 18px', background: RED, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                댓글 등록
              </button>
            </div>
          )}
          {comments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '16px 0', color: '#bbb', fontSize: 13 }}>첫 번째 댓글을 남겨보세요 💬</div>
          )}
          {comments.map((c, i) => {
            const ac = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const isEditing = editingId === c.id;
            const isMine = myComment?.id === c.id;
            return (
              <div key={c.id} style={{ padding: '12px 0', borderBottom: '0.5px solid ' + BORDER }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: ac.bg, color: ac.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>익</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>익명{isMine ? ' (나)' : ''}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>{formatDate(c.created_at)}</div>
                  </div>
                  {isMine && !isEditing && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setEditingId(c.id); setEditContent(c.content); }} style={{ fontSize: 11, color: '#999', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>수정</button>
                      <button onClick={async () => { if (window.confirm('댓글을 삭제할까요?')) await deleteComment(c.id); }} style={{ fontSize: 11, color: RED, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}>삭제</button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <div>
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)} style={{ width: '100%', border: '1.5px solid ' + RED, borderRadius: 8, padding: 10, fontSize: 13, lineHeight: 1.6, resize: 'none', height: 70, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 6 }} />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={async () => { await updateComment(c.id, editContent); setEditingId(null); }} style={{ padding: '6px 14px', background: RED, color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>저장</button>
                      <button onClick={() => setEditingId(null)} style={{ padding: '6px 14px', background: '#F5F5F5', color: '#555', border: 'none', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>취소</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: '#555' }}>{c.content}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showShare && <ShareSheet bizName={bizName} placeId={id!} onClose={() => setShowShare(false)} />}
      {showReport && business && <ReportModal business={business} onClose={() => setShowReport(false)} />}
    </div>
  );
}
