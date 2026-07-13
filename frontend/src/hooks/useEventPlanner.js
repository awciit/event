import { useState, useCallback } from 'react';
import { generateEventPlan } from '../services/api';

const INITIAL_FORM = {
  eventType: '',
  city: '',
  budget: '',
  numberOfGuests: '',
  theme: '',
  additionalNotes: '',
};

export function useEventPlanner(language, currency, t) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [plan, setPlan] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    setPlan(null);
    setMeta(null);
    setError(null);
  }, []);

  const submitPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const response = await generateEventPlan({
        ...formData,
        language,
        currency,
      });

      if (!response.success) {
        throw new Error(response.error || t.errors.failed);
      }

      setPlan(response.data);
      setMeta(response.meta);
    } catch (err) {
      const message =
        err.response?.data?.details?.join(', ') ||
        err.response?.data?.error ||
        err.message ||
        t.errors.generic;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [formData, language, currency, t]);

  const clearError = useCallback(() => setError(null), []);

  return {
    formData,
    updateField,
    resetForm,
    submitPlan,
    clearError,
    plan,
    meta,
    loading,
    error,
  };
}
