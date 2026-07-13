import { useLocale } from '../context/LocaleContext';

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-white/5 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-start">
            <h3 className="font-display text-xl font-bold">
              Event<span className="text-brand-400">Craft</span> AI
            </h3>
            <p className="mt-1 text-sm text-slate-500">{t.footer.tagline}</p>
          </div>

          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#planner" className="transition-colors hover:text-brand-400">{t.footer.planEvent}</a>
            <a href="#results" className="transition-colors hover:text-brand-400">{t.nav.results}</a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-8 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} EventCraft AI. {t.footer.built}
        </div>
      </div>
    </footer>
  );
}
