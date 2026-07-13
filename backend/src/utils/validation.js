import {
  EVENT_TYPE_KEYS,
  THEME_KEYS,
  EVENT_TYPE_LABELS,
  THEME_LABELS,
} from './constants.js';

const LANGUAGES = ['en', 'ar'];
const CURRENCIES = ['USD', 'SAR'];

export function validateEventInput(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body is required'] };
  }

  const {
    eventType,
    city,
    budget,
    numberOfGuests,
    theme,
    additionalNotes = '',
    language = 'en',
    currency = 'USD',
  } = body;

  if (!eventType || typeof eventType !== 'string' || !eventType.trim()) {
    errors.push('Event type is required');
  } else if (!EVENT_TYPE_KEYS.includes(eventType)) {
    errors.push('Invalid event type');
  }

  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    errors.push('City is required and must be at least 2 characters');
  } else if (city.trim().length > 100) {
    errors.push('City must be 100 characters or less');
  }

  const budgetNum = Number(budget);
  if (budget === undefined || budget === null || budget === '') {
    errors.push('Budget is required');
  } else if (Number.isNaN(budgetNum) || budgetNum < 100) {
    errors.push('Budget must be a number of at least 100');
  } else if (budgetNum > 10000000) {
    errors.push('Budget must be 10,000,000 or less');
  }

  const guestsNum = parseInt(numberOfGuests, 10);
  if (numberOfGuests === undefined || numberOfGuests === null || numberOfGuests === '') {
    errors.push('Number of guests is required');
  } else if (Number.isNaN(guestsNum) || guestsNum < 1) {
    errors.push('Number of guests must be at least 1');
  } else if (guestsNum > 10000) {
    errors.push('Number of guests must be 10,000 or less');
  }

  if (!theme || typeof theme !== 'string' || !theme.trim()) {
    errors.push('Theme is required');
  } else if (!THEME_KEYS.includes(theme)) {
    errors.push('Invalid theme');
  }

  if (!LANGUAGES.includes(language)) {
    errors.push('Language must be en or ar');
  }

  if (!CURRENCIES.includes(currency)) {
    errors.push('Currency must be USD or SAR');
  }

  if (additionalNotes && typeof additionalNotes !== 'string') {
    errors.push('Additional notes must be a string');
  } else if (additionalNotes && additionalNotes.length > 1000) {
    errors.push('Additional notes must be 1000 characters or less');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const lang = language === 'ar' ? 'ar' : 'en';

  return {
    valid: true,
    data: {
      eventType: eventType.trim(),
      eventTypeLabel: EVENT_TYPE_LABELS[lang][eventType] || eventType,
      city: city.trim(),
      budget: budgetNum,
      numberOfGuests: guestsNum,
      theme: theme.trim(),
      themeLabel: THEME_LABELS[lang][theme] || theme,
      additionalNotes: (additionalNotes || '').trim(),
      language: lang,
      currency,
    },
  };
}

export { EVENT_TYPE_KEYS, THEME_KEYS };
