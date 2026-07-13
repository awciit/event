import { useLocale } from '../context/LocaleContext';

export default function HeaderControls() {
  const { language, currency, setLanguage, setCurrency, t } = useLocale();

  return (
    <div className="flex items-center gap-2 sm:gap-3" dir="ltr">
      <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
        {['USD', 'SAR'].map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
              currency === code
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.currency[code]}
          </button>
        ))}
      </div>

      <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
        {['en', 'ar'].map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
              language === lang
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.language[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}
