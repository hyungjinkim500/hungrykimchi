import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Props {
  isDark: boolean;
}

export default function Inquiry({ isDark }: Props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', company: '', email: '', contact: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const bg = isDark ? '#111111' : '#F5F5F5';
  const cardBg = isDark ? '#1A1A1A' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#1A1A1A';
  const muted = isDark ? '#888' : '#666';
  const inputBg = isDark ? '#2A2A2A' : '#F0F0F0';

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: inputBg,
    color: text,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: text,
    marginBottom: '6px',
    display: 'block',
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert('이름, 이메일, 문의 내용은 필수입니다.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('inquiries').insert({
      name: form.name,
      company: form.company || null,
      email: form.email,
      contact: form.contact || null,
      message: form.message,
    });
    setLoading(false);
    if (error) { alert('접수 중 오류가 발생했어요: ' + error.message); return; }
    setSuccess(true);
  };

  return (
    <div style={{
      position: 'fixed', top: '65px', bottom: '65px',
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '430px',
      backgroundColor: bg, color: text,
      overflowY: 'auto', boxSizing: 'border-box',
    }}>
      <div style={{ padding: '20px 16px' }}>
        <div style={{ background: cardBg, borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: muted, lineHeight: '1.7' }}>
            헝그리김치와 함께 성장할 파트너를 찾고 있습니다.<br />
            광고, 제휴, 협업 등 다양한 문의를 남겨주세요.<br />
            빠른 시일 내에 답변 드리겠습니다.
          </p>
        </div>

        {success ? (
          <div style={{ background: cardBg, borderRadius: '14px', padding: '32px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: '32px', margin: '0 0 12px' }}>✅</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>문의가 접수됐어요!</p>
            <p style={{ fontSize: '13px', color: muted, margin: '0 0 24px' }}>빠른 시일 내에 답변 드리겠습니다.</p>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#C0392B', color: '#FFF', fontSize: '14px', cursor: 'pointer' }}
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <div style={{ background: cardBg, borderRadius: '14px', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>이름 *</label>
              <input style={inputStyle} placeholder="이름을 입력하세요" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>사업자명 (선택)</label>
              <input style={inputStyle} placeholder="사업자명을 입력하세요" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>이메일 *</label>
              <input style={inputStyle} placeholder="이메일 주소를 입력하세요" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>연락처 (선택)</label>
              <input style={inputStyle} placeholder="연락처를 입력하세요" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>문의 내용 *</label>
              <textarea
                style={{ ...inputStyle, height: '140px', resize: 'none' }}
                placeholder="문의 내용을 입력하세요"
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: 'none', background: '#C0392B', color: '#FFF',
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '접수 중...' : '문의 접수'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}