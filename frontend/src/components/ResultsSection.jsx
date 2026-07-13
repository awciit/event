import { formatCurrency, priorityColor } from '../utils/formatters';
import { useLocale } from '../context/LocaleContext';
import { translatePriority, interpolate } from '../i18n/translations';

function SectionCard({ icon, title, children, className = '' }) {
  return (
    <div className={`glass-card p-6 animate-slide-up ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300">
          {icon}
        </div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ScheduleTimeline({ items, isRtl }) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className={`relative flex gap-4 ${isRtl ? 'pr-6' : 'pl-6'}`}>
          <div className={`absolute top-1 h-full w-px bg-brand-500/30 ${isRtl ? 'right-0' : 'left-0'}`}>
            <div className={`absolute top-1 h-3 w-3 rounded-full border-2 border-brand-400 bg-slate-950 ${isRtl ? '-right-1.5' : '-left-1.5'}`} />
          </div>
          <div>
            <span className="text-sm font-semibold text-brand-300">{item.time}</span>
            <h4 className="font-medium text-slate-100">{item.activity}</h4>
            <p className="mt-1 text-sm text-slate-400">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function BudgetChart({ items, currency, language }) {
  const colors = ['bg-brand-500', 'bg-accent-500', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500'];

  return (
    <div className="space-y-4">
      <div className="flex h-4 overflow-hidden rounded-full">
        {items.map((item, i) => (
          <div
            key={i}
            className={`${colors[i % colors.length]} transition-all`}
            style={{ width: `${item.percentage}%` }}
            title={`${item.category}: ${item.percentage}%`}
          />
        ))}
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${colors[i % colors.length]}`} />
              <div>
                <p className="font-medium text-slate-200">{item.category}</p>
                <p className="text-xs text-slate-500">{item.notes}</p>
              </div>
            </div>
            <div className="text-end">
              <p className="font-semibold text-brand-300">{formatCurrency(item.amount, currency, language)}</p>
              <p className="text-xs text-slate-500">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IdeaList({ items, nameKey, currency, language, estimatedLabel }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-brand-400/20">
          <h4 className="font-medium text-slate-100">{item[nameKey] || item.idea}</h4>
          <p className="mt-1 text-sm text-slate-400">{item.description}</p>
          {item.estimatedCost != null && (
            <p className="mt-2 text-sm font-medium text-brand-300">
              {estimatedLabel} {formatCurrency(item.estimatedCost, currency, language)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ChecklistItems({ items, language }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 rounded-lg bg-white/5 px-4 py-3">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-brand-500 focus:ring-brand-400" readOnly />
          <div className="flex-1">
            <p className="font-medium text-slate-200">{item.task}</p>
            <p className="text-xs text-slate-500">{item.deadline}</p>
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${priorityColor(item.priority)}`}>
            {translatePriority(item.priority, language)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ResultsSection({ plan, meta, onReset }) {
  const { t, language, currency, isRtl } = useLocale();

  if (!plan) return null;

  const displayCurrency = meta?.currency || currency;
  const displayLanguage = meta?.language || language;

  return (
    <section id="results" className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center animate-fade-in">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{t.results.title}</h2>
          {meta && (
            <p className="mt-3 text-slate-400">
              {interpolate(t.results.meta, {
                eventType: (meta.eventTypeKey && t.eventTypes[meta.eventTypeKey]) || meta.eventType,
                city: meta.city,
                guests: meta.numberOfGuests,
                budget: formatCurrency(meta.budget, displayCurrency, language),
                theme: (meta.themeKey && t.themes[meta.themeKey]) || meta.theme,
              })}
            </p>
          )}
          <button
            onClick={onReset}
            className="mt-4 text-sm text-brand-400 transition-colors hover:text-brand-300"
          >
            {t.results.reset}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title={t.results.schedule}
            className="lg:col-span-2"
          >
            <ScheduleTimeline items={plan.eventSchedule} isRtl={isRtl} />
          </SectionCard>

          <SectionCard
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title={t.results.budget}
            className="lg:col-span-2"
          >
            <BudgetChart items={plan.budgetBreakdown} currency={displayCurrency} language={displayLanguage} />
          </SectionCard>

          <SectionCard
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" /></svg>}
            title={t.results.food}
          >
            <IdeaList items={plan.foodSuggestions} nameKey="item" currency={displayCurrency} language={displayLanguage} estimatedLabel={t.results.estimated} />
          </SectionCard>

          <SectionCard
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
            title={t.results.decor}
          >
            <IdeaList items={plan.decorationIdeas} nameKey="idea" currency={displayCurrency} language={displayLanguage} estimatedLabel={t.results.estimated} />
          </SectionCard>

          <SectionCard
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>}
            title={t.results.entertainment}
          >
            <IdeaList items={plan.entertainmentIdeas} nameKey="idea" currency={displayCurrency} language={displayLanguage} estimatedLabel={t.results.estimated} />
          </SectionCard>

          <SectionCard
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
            title={t.results.checklist}
          >
            <ChecklistItems items={plan.checklist} language={displayLanguage} />
          </SectionCard>

          <SectionCard
            icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
            title={t.results.tips}
            className="lg:col-span-2"
          >
            <ul className="space-y-3">
              {plan.extraTips.map((tip, i) => (
                <li key={i} className="flex gap-3 rounded-lg bg-brand-500/10 px-4 py-3 text-slate-300">
                  <span className="font-bold text-brand-400">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
