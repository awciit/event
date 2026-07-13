import { useLocale } from '../context/LocaleContext';

export default function ErrorMessage({ message, onDismiss }) {
  const { t } = useLocale();

  if (!message) return null;

  return (
    <div className="animate-slide-up rounded-xl border border-red-500/30 bg-red-500/10 p-4" role="alert">
      <div className="flex items-start gap-3">
        <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <h4 className="font-semibold text-red-300">{t.errors.title}</h4>
          <p className="mt-1 text-sm text-red-200/80">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 transition-colors hover:text-red-300"
            aria-label={t.errors.dismiss}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
