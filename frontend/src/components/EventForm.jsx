import { EVENT_TYPE_KEYS, THEME_KEYS, CITY_SUGGESTIONS } from '../i18n/translations';
import { useLocale } from '../context/LocaleContext';

export default function EventForm({ formData, updateField, onSubmit, loading, eventTypes, themes }) {
  const { t, language, currency } = useLocale();
  const types = eventTypes?.length ? eventTypes : EVENT_TYPE_KEYS;
  const themeOptions = themes?.length ? themes : THEME_KEYS;
  const cities = CITY_SUGGESTIONS[language] || CITY_SUGGESTIONS.en;
  const budgetLabel = currency === 'SAR' ? t.form.budgetSar : t.form.budgetUsd;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section id="planner" className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="glass-card p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{t.form.title}</h2>
            <p className="mt-2 text-slate-400">{t.form.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="eventType" className="mb-2 block text-sm font-medium text-slate-300">
                  {t.form.eventType}
                </label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => updateField('eventType', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">{t.form.selectEventType}</option>
                  {types.map((key) => (
                    <option key={key} value={key}>{t.eventTypes[key]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-medium text-slate-300">
                  {t.form.city}
                </label>
                <input
                  id="city"
                  type="text"
                  list="city-suggestions"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder={t.form.cityPlaceholder}
                  className="input-field"
                  required
                />
                <datalist id="city-suggestions">
                  {cities.map((city) => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>

              <div>
                <label htmlFor="budget" className="mb-2 block text-sm font-medium text-slate-300">
                  {budgetLabel}
                </label>
                <input
                  id="budget"
                  type="number"
                  min="100"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                  placeholder={t.form.budgetPlaceholder}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label htmlFor="numberOfGuests" className="mb-2 block text-sm font-medium text-slate-300">
                  {t.form.guests}
                </label>
                <input
                  id="numberOfGuests"
                  type="number"
                  min="1"
                  value={formData.numberOfGuests}
                  onChange={(e) => updateField('numberOfGuests', e.target.value)}
                  placeholder={t.form.guestsPlaceholder}
                  className="input-field"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="theme" className="mb-2 block text-sm font-medium text-slate-300">
                  {t.form.theme}
                </label>
                <select
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => updateField('theme', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">{t.form.selectTheme}</option>
                  {themeOptions.map((key) => (
                    <option key={key} value={key}>{t.themes[key]}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="additionalNotes" className="mb-2 block text-sm font-medium text-slate-300">
                  {t.form.notes}
                </label>
                <textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => updateField('additionalNotes', e.target.value)}
                  placeholder={t.form.notesPlaceholder}
                  rows={4}
                  maxLength={1000}
                  className="input-field resize-none"
                />
                <p className="mt-1 text-xs text-slate-500 ltr:text-right rtl:text-left">
                  {formData.additionalNotes.length}/1000
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t.form.generating}
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t.form.generate}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
