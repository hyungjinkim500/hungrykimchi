import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language } from '../lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ko',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('hk_lang');
    return (saved === 'en' ? 'en' : 'ko') as Language;
  });

  const setLang = (newLang: Language) => {
    localStorage.setItem('hk_lang', newLang);
    setLangState(newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'ko';
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
