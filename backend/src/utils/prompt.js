import { EVENT_TYPE_LABELS, THEME_LABELS } from './constants.js';

export function buildEventPrompt(eventData) {
  const {
    eventType,
    eventTypeLabel,
    city,
    budget,
    numberOfGuests,
    theme,
    themeLabel,
    additionalNotes,
    language,
    currency,
  } = eventData;

  const isArabic = language === 'ar';
  const typeLabel = eventTypeLabel || EVENT_TYPE_LABELS[language]?.[eventType] || eventType;
  const themeText = themeLabel || THEME_LABELS[language]?.[theme] || theme;
  const notesText = additionalNotes || (isArabic ? 'لا يوجد' : 'None');

  const currencyName = currency === 'SAR'
    ? (isArabic ? 'ريال سعودي (SAR)' : 'Saudi Riyals (SAR)')
    : (isArabic ? 'دولار أمريكي (USD)' : 'US Dollars (USD)');

  const budgetFormatted = new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US').format(budget);
  const budgetLine = currency === 'SAR'
    ? `${budgetFormatted} ${isArabic ? 'ريال سعودي' : 'SAR'}`
    : `$${budgetFormatted} USD`;

  const languageInstruction = isArabic
    ? 'IMPORTANT: Generate the ENTIRE JSON response in Arabic. Every text field (activities, descriptions, categories, tasks, tips, etc.) must be written in Arabic.'
    : 'IMPORTANT: Generate the ENTIRE JSON response in English. Every text field must be written in English.';

  const currencyInstruction = currency === 'SAR'
    ? (isArabic
      ? 'جميع المبالغ في الميزانية والتكاليف المقدرة يجب أن تكون بالريال السعودي (SAR) فقط.'
      : 'All budget amounts and estimated costs must be expressed in Saudi Riyals (SAR) only.')
    : (isArabic
      ? 'جميع المبالغ في الميزانية والتكاليف المقدرة يجب أن تكون بالدولار الأمريكي (USD) فقط.'
      : 'All budget amounts and estimated costs must be expressed in US Dollars (USD) only.');

  return `${languageInstruction}

${currencyInstruction}

Create a detailed, practical event plan with the following details:

${isArabic ? 'نوع الفعالية' : 'Event Type'}: ${typeLabel}
${isArabic ? 'المدينة' : 'City'}: ${city}
${isArabic ? 'الميزانية' : 'Budget'}: ${budgetLine} (${currencyName})
${isArabic ? 'عدد الضيوف' : 'Number of Guests'}: ${numberOfGuests}
${isArabic ? 'السمة' : 'Theme'}: ${themeText}
${isArabic ? 'ملاحظات إضافية' : 'Additional Notes'}: ${notesText}

Respond ONLY with valid JSON (no markdown, no code fences) matching this exact structure:
{
  "eventSchedule": [
    { "time": "string", "activity": "string", "description": "string" }
  ],
  "budgetBreakdown": [
    { "category": "string", "amount": number, "percentage": number, "notes": "string" }
  ],
  "foodSuggestions": [
    { "item": "string", "description": "string", "estimatedCost": number }
  ],
  "decorationIdeas": [
    { "idea": "string", "description": "string", "estimatedCost": number }
  ],
  "entertainmentIdeas": [
    { "idea": "string", "description": "string", "estimatedCost": number }
  ],
  "checklist": [
    { "task": "string", "deadline": "string", "priority": "high|medium|low" }
  ],
  "extraTips": ["string"]
}

Requirements:
- Budget breakdown amounts must sum to approximately ${budgetFormatted} ${currency}
- Include at least 5 schedule items, 5 checklist items, and 3 extra tips
- Tailor all suggestions to ${city}, the ${themeText} theme, and the ${typeLabel} event type
- Be specific, actionable, and realistic for the budget and guest count
- Keep priority values as exactly: high, medium, or low (English only in JSON)`;
}

export function parseAiResponse(content) {
  let cleaned = content.trim();

  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  const requiredKeys = [
    'eventSchedule',
    'budgetBreakdown',
    'foodSuggestions',
    'decorationIdeas',
    'entertainmentIdeas',
    'checklist',
    'extraTips',
  ];

  for (const key of requiredKeys) {
    if (!parsed[key]) {
      throw new Error(`AI response missing required field: ${key}`);
    }
  }

  return parsed;
}

export function extractChatCompletionText(responseData) {
  const content = responseData?.choices?.[0]?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new Error('Unexpected response format from Groq API');
  }

  return content;
}
