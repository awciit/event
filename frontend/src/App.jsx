import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import EventForm from './components/EventForm';
import ResultsSection from './components/ResultsSection';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';
import HeaderControls from './components/HeaderControls';
import { useEventPlanner } from './hooks/useEventPlanner';
import { fetchFormOptions } from './services/api';
import { useLocale } from './context/LocaleContext';

export default function App() {
  const { t, language, currency } = useLocale();
  const {
    formData,
    updateField,
    resetForm,
    submitPlan,
    plan,
    meta,
    loading,
    error,
    clearError,
  } = useEventPlanner(language, currency, t);

  const [options, setOptions] = useState({ eventTypes: [], themes: [] });

  useEffect(() => {
    fetchFormOptions()
      .then(setOptions)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (plan) {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [plan]);

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="shrink-0 font-display text-xl font-bold">
            Event<span className="text-brand-400">Craft</span> AI
          </a>
          <div className="flex items-center gap-3 sm:gap-4">
            <nav className="hidden gap-6 text-sm text-slate-400 sm:flex">
              <a href="#planner" className="transition-colors hover:text-brand-400">{t.nav.plan}</a>
              {plan && (
                <a href="#results" className="transition-colors hover:text-brand-400">{t.nav.results}</a>
              )}
            </nav>
            <HeaderControls />
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <EventForm
          formData={formData}
          updateField={updateField}
          onSubmit={submitPlan}
          loading={loading}
          eventTypes={options.eventTypes}
          themes={options.themes}
        />

        {(loading || error) && (
          <div className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
            {loading && <LoadingSpinner />}
            <ErrorMessage message={error} onDismiss={clearError} />
          </div>
        )}

        <ResultsSection plan={plan} meta={meta} onReset={resetForm} />
      </main>

      <Footer />
    </div>
  );
}
