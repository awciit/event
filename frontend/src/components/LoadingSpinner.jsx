import { useLocale } from '../context/LocaleContext';

export default function LoadingSpinner() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-brand-500/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-400 border-r-accent-400" />
      </div>
      <p className="mt-6 text-lg font-medium text-slate-300 animate-pulse-soft">{t.loading.message}</p>
      <p className="mt-2 text-sm text-slate-500">{t.loading.sub}</p>
    </div>
  );
}
