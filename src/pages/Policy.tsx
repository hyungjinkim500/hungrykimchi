import { useState } from 'react';

type MainTab = 'privacy' | 'terms';
type LangTab = 'ko' | 'en';

type Section = { heading: string; items: string[] };

const content: Record<MainTab, Record<LangTab, { title: string; intro: string; sections: Section[] }>> = {
  privacy: {
    ko: {
      title: '개인정보처리방침',
      intro: '헝그리김치(HungryKimchi, 이하 "서비스")는 이용자의 개인정보 보호를 최우선으로 생각하며, 「개인정보 보호법」 및 관련 법령을 준수합니다.',
      sections: [
        { heading: '1. 수집하는 개인정보 항목', items: [
          '① 일반 이용자 (비로그인): 서비스의 지도, 업체 정보, 전화번호 조회 등 모든 주요 기능은 로그인 없이 이용 가능합니다. 이 경우 개인정보를 수집하지 않습니다.',
          '② 소셜 로그인 이용자: 이메일 주소, 소셜 계정 식별자 (Google 등 로그인 제공자로부터 제공받는 최소한의 정보에 한함)',
          '③ 업체 등록 이용자 (업주): 업체명, 대표자 연락처, 업체 주소 및 등록 요청 시 직접 입력한 정보. 업주가 직접 등록 또는 수정을 요청하는 경우에만 수집됩니다.',
          '④ 위치 정보: 지도 기능 이용 시 기기의 위치 정보에 접근할 수 있습니다. 위치 정보는 서버에 저장되지 않으며, 지도 표시 목적으로만 일시적으로 사용됩니다.',
        ]},
        { heading: '2. 개인정보 수집 및 이용 목적', items: [
          '수집된 개인정보는 다음 목적으로만 이용되며, 목적 외 용도로 사용하지 않습니다.',
          '• 서비스 제공 및 운영 (지도, 업체 정보 조회 등)',
          '• 업체 등록 신청 접수 및 관리',
          '• 서비스 품질 개선 및 통계 분석 (Google Analytics, 향후 적용 예정)',
          '• 업체 의뢰 기반 광고 게시 (향후 적용 예정, 적용 시 별도 고지)',
        ]},
        { heading: '3. 개인정보 보유 및 이용 기간', items: [
          '• 로그인 이용자: 서비스 탈퇴 시 또는 삭제 요청 시 즉시 파기',
          '• 업체 등록 정보: 등록 철회 요청 시 즉시 파기',
          '• 단, 관련 법령에 따라 보존 의무가 있는 경우 해당 기간 동안 보관 후 파기합니다.',
        ]},
        { heading: '4. 개인정보의 제3자 제공', items: [
          '수집한 개인정보는 원칙적으로 제3자에게 제공하지 않습니다. 다음의 경우에만 예외적으로 제공될 수 있습니다.',
          '• 이용자가 사전에 명시적으로 동의한 경우',
          '• 법령에 의거하거나 수사기관의 적법한 요청이 있는 경우',
        ]},
        { heading: '5. 외부 서비스(제3자) 이용', items: [
          '• Google Maps Platform: 지도 및 장소 정보 표시',
          '• Google Analytics (적용 예정): 서비스 이용 통계 분석 목적으로만 사용',
          '• Supabase: 데이터베이스 및 인증 처리',
          '광고 게재 시 적용되는 제3자 서비스는 별도로 고지합니다.',
        ]},
        { heading: '6. 이용자의 권리', items: [
          '이용자는 언제든지 다음의 권리를 행사할 수 있습니다.',
          '• 본인의 개인정보 열람 요청',
          '• 오류 정보에 대한 수정 요청',
          '• 개인정보 삭제(탈퇴) 요청',
          '• 개인정보 처리 정지 요청',
          '요청은 아래 문의처로 연락 주시면 지체 없이 처리하겠습니다.',
        ]},
        { heading: '7. 개인정보 보호 책임자 및 문의처', items: [
          '• 서비스명: 헝그리김치 (HungryKimchi)',
          '• 이메일: hyungjinkim500@gmail.com',
          '• 문의 접수 후 영업일 기준 3일 이내 답변드립니다.',
        ]},
        { heading: '8. 개정 이력', items: [
          '본 방침은 법령 또는 서비스 변경 시 사전 고지 후 개정될 수 있습니다.',
          '• 최초 시행일: 2026년 4월 21일',
        ]},
      ],
    },
    en: {
      title: 'Privacy Policy',
      intro: 'HungryKimchi (hereinafter "Service") places the highest priority on protecting users\' personal information and complies with applicable privacy laws and regulations.',
      sections: [
        { heading: '1. Information We Collect', items: [
          '① General Users (Non-logged-in): All core features — including the map, business listings, and phone number lookup — are available without logging in. No personal information is collected.',
          '② Social Login Users: Email address and social account identifier (limited to the minimum information provided by login providers such as Google).',
          '③ Business Owners: Business name, contact information, address, and other information directly entered during registration. Collected only when a business owner submits or requests a modification.',
          '④ Location Information: Location data may be accessed when using the map feature. It is not stored on our servers and is used solely for map display purposes.',
        ]},
        { heading: '2. Purpose of Collection and Use', items: [
          'Collected information is used only for the following purposes.',
          '• Providing and operating the Service (map, business info, etc.)',
          '• Receiving and managing business registration requests',
          '• Service improvement and analytics (Google Analytics, to be applied in the future)',
          '• Business-commissioned advertising (to be applied in the future; users will be notified separately)',
        ]},
        { heading: '3. Retention Period', items: [
          '• Login users: Immediately deleted upon account withdrawal or deletion request',
          '• Business registration info: Immediately deleted upon withdrawal request',
          '• Exceptions apply where retention is required by applicable law.',
        ]},
        { heading: '4. Sharing with Third Parties', items: [
          'We do not share personal information with third parties as a matter of principle. Exceptions apply only in the following cases.',
          '• When the user has given explicit prior consent',
          '• When required by law or by a lawful request from an investigative authority',
        ]},
        { heading: '5. Third-Party Services', items: [
          '• Google Maps Platform: Map and place information display',
          '• Google Analytics (planned): Used solely for service usage statistics',
          '• Supabase: Database and authentication processing',
          'Any third-party services involved in advertising will be disclosed separately.',
        ]},
        { heading: '6. User Rights', items: [
          'Users may exercise the following rights at any time.',
          '• Request access to their personal information',
          '• Request correction of inaccurate information',
          '• Request deletion of their personal information',
          '• Request suspension of processing',
          'Please contact us below and we will respond without delay.',
        ]},
        { heading: '7. Contact', items: [
          '• Service: HungryKimchi',
          '• Email: hyungjinkim500@gmail.com',
          '• We will respond within 3 business days of receiving your inquiry.',
        ]},
        { heading: '8. Revision History', items: [
          'This policy may be revised with prior notice in the event of legal or service changes.',
          '• Effective date: April 21, 2026',
        ]},
      ],
    },
  },
  terms: {
    ko: {
      title: '이용약관',
      intro: '헝그리김치(HungryKimchi, 이하 "서비스")가 제공하는 모든 서비스의 이용 조건 및 이용자와 서비스 간의 권리·의무를 규정합니다.',
      sections: [
        { heading: '제1조 (목적)', items: [
          '본 약관은 헝그리김치가 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.',
        ]},
        { heading: '제2조 (정의)', items: [
          '• "서비스"란 헝그리김치가 제공하는 웹 및 앱 기반 해외 한인 업체 정보 서비스를 말합니다.',
          '• "이용자"란 본 약관에 동의하고 서비스를 이용하는 모든 자를 말합니다.',
          '• "업주"란 서비스에 업체 정보를 직접 등록·수정 요청하는 이용자를 말합니다.',
        ]},
        { heading: '제3조 (약관의 효력 및 변경)', items: [
          '• 본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다.',
          '• 서비스는 필요 시 약관을 변경할 수 있으며, 변경 시 시행 7일 전 서비스 내 공지합니다.',
          '• 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.',
        ]},
        { heading: '제4조 (서비스 제공)', items: [
          '• 서비스는 해외 거주 및 여행 중인 한인을 위한 업체 정보, 지도, 전화번호 등의 정보를 제공합니다.',
          '• 서비스 내 업체 정보는 Google Maps 데이터 및 업주 직접 등록 정보를 기반으로 하며, 정확성을 보장하지 않습니다.',
          '• 서비스는 운영상·기술상 필요에 따라 사전 고지 후 서비스를 일시 중단하거나 변경할 수 있습니다.',
        ]},
        { heading: '제5조 (업체 정보 등록)', items: [
          '• 업주는 허위 정보를 등록해서는 안 되며, 등록한 정보의 정확성에 대한 책임은 업주에게 있습니다.',
          '• 서비스는 등록된 정보를 검토 후 승인 여부를 결정할 수 있으며, 부적절한 정보는 사전 통보 없이 삭제할 수 있습니다.',
          '• 광고성 정보, 허위 정보, 타인을 사칭한 정보 등록은 금지됩니다.',
        ]},
        { heading: '제6조 (이용자의 의무)', items: [
          '이용자는 다음 행위를 해서는 안 됩니다.',
          '• 타인의 정보를 도용하거나 허위 정보를 입력하는 행위',
          '• 서비스의 정상적인 운영을 방해하는 행위',
          '• 서비스 내 정보를 무단으로 수집·복제·배포하는 행위',
          '• 기타 관련 법령에 위반되는 행위',
        ]},
        { heading: '제7조 (서비스의 면책)', items: [
          '• 서비스는 업체 정보의 정확성, 최신성, 완전성을 보증하지 않습니다.',
          '• 서비스 내 정보를 이용함으로써 발생하는 손해에 대해 서비스는 책임을 지지 않습니다.',
          '• 천재지변, 서버 장애 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.',
        ]},
        { heading: '제8조 (준거법 및 관할)', items: [
          '• 본 약관은 대한민국 법률에 따라 해석됩니다.',
          '• 서비스 이용과 관련한 분쟁은 관련 법령이 정한 절차에 따릅니다.',
        ]},
        { heading: '제9조 (문의처)', items: [
          '• 이메일: hyungjinkim500@gmail.com',
          '• 문의 접수 후 영업일 기준 3일 이내 답변드립니다.',
        ]},
        { heading: '부칙', items: [
          '• 본 약관은 2026년 4월 21일부터 시행됩니다.',
        ]},
      ],
    },
    en: {
      title: 'Terms of Service',
      intro: 'These Terms govern the conditions for using all services provided by HungryKimchi (hereinafter "Service"), and define the rights and responsibilities between users and the Service.',
      sections: [
        { heading: 'Article 1 (Purpose)', items: [
          'These Terms govern the conditions and procedures for using all services provided by HungryKimchi, and define the rights, obligations, and responsibilities between users and the Service.',
        ]},
        { heading: 'Article 2 (Definitions)', items: [
          '• "Service" refers to the web and app-based Korean community business directory provided by HungryKimchi.',
          '• "User" refers to any person who agrees to these Terms and uses the Service.',
          '• "Business Owner" refers to a user who directly submits or requests modification of business information.',
        ]},
        { heading: 'Article 3 (Effect and Amendment)', items: [
          '• These Terms take effect upon being posted on the Service.',
          '• The Service may amend these Terms with notice provided at least 7 days prior to the effective date.',
          '• Users who do not agree to the amended Terms may discontinue use of the Service.',
        ]},
        { heading: 'Article 4 (Service Provision)', items: [
          '• The Service provides business information, maps, and phone numbers for Koreans living or traveling abroad.',
          '• Business information is based on Google Maps data and direct submissions. Accuracy is not guaranteed.',
          '• The Service may temporarily suspend or modify the Service with prior notice.',
        ]},
        { heading: 'Article 5 (Business Registration)', items: [
          '• Business owners must not register false information and are solely responsible for accuracy.',
          '• The Service may review, approve, or reject submitted information, and may delete inappropriate content without prior notice.',
          '• Registration of spam, false information, or impersonation is strictly prohibited.',
        ]},
        { heading: 'Article 6 (User Obligations)', items: [
          'Users must not engage in any of the following.',
          '• Misusing another person\'s information or entering false information',
          '• Interfering with the normal operation of the Service',
          '• Unauthorized collection, reproduction, or distribution of Service content',
          '• Any other conduct that violates applicable laws',
        ]},
        { heading: 'Article 7 (Disclaimer)', items: [
          '• The Service does not warrant the accuracy, currency, or completeness of business information.',
          '• The Service is not liable for any damages arising from the use of information within the Service.',
          '• The Service is not liable for interruptions caused by force majeure events.',
        ]},
        { heading: 'Article 8 (Governing Law)', items: [
          '• These Terms shall be interpreted in accordance with the laws of the Republic of Korea.',
          '• Disputes shall be resolved in accordance with applicable legal procedures.',
        ]},
        { heading: 'Article 9 (Contact)', items: [
          '• Email: hyungjinkim500@gmail.com',
          '• We will respond within 3 business days.',
        ]},
        { heading: 'Addendum', items: [
          '• These Terms are effective as of April 21, 2026.',
        ]},
      ],
    },
  },
};

export default function Policy() {
  const [mainTab, setMainTab] = useState<MainTab>('privacy');
  const [langTab, setLangTab] = useState<LangTab>('ko');

  const data = content[mainTab][langTab];

  const activeMain = 'px-4 py-2 rounded-full text-sm font-semibold border bg-black text-white border-black';
  const inactiveMain = 'px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-500';
  const activeLang = 'px-3 py-1 rounded-full text-xs font-semibold border bg-gray-700 text-white border-gray-700';
  const inactiveLang = 'px-3 py-1 rounded-full text-xs border border-gray-300 text-gray-400';

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '72px 20px 80px', boxSizing: 'border-box' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>정책 및 약관</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button onClick={() => setMainTab('privacy')} className={mainTab === 'privacy' ? activeMain : inactiveMain}>
          개인정보처리방침
        </button>
        <button onClick={() => setMainTab('terms')} className={mainTab === 'terms' ? activeMain : inactiveMain}>
          이용약관
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
        <button onClick={() => setLangTab('ko')} className={langTab === 'ko' ? activeLang : inactiveLang}>
          한국어
        </button>
        <button onClick={() => setLangTab('en')} className={langTab === 'en' ? activeLang : inactiveLang}>
          English
        </button>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{data.title}</h2>
      <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#555', marginBottom: '28px' }}>{data.intro}</p>

      {data.sections.map((section, i) => (
        <div key={i} style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#111' }}>{section.heading}</h3>
          {section.items.map((item, j) => (
            <p key={j} style={{ fontSize: '13px', lineHeight: '1.8', color: '#444', marginBottom: '4px' }}>{item}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
