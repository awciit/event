import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations, interpolate } from '../i18n/translations';

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');

  const t = useMemo(() => translations[language], [language]);
  const dir = t.dir;
  const isRtl = dir === 'rtl';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const value = useMemo(
    () => ({
      language,
      currency,
      setLanguage,
      setCurrency,
      t,
      dir,
      isRtl,
      interpolate,
    }),
    [language, currency, t, dir, isRtl]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
