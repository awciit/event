import { Router } from 'express';
import { generateEventPlan } from '../services/groqService.js';
import { validateEventInput, EVENT_TYPE_KEYS, THEME_KEYS } from '../utils/validation.js';

const router = Router();

router.get('/options', (_req, res) => {
  res.json({ eventTypes: EVENT_TYPE_KEYS, themes: THEME_KEYS });
});

router.post('/generate', async (req, res) => {
  const validation = validateEventInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.errors,
    });
  }

  try {
    const plan = await generateEventPlan(validation.data);

    return res.json({
      success: true,
      data: plan,
      meta: {
        eventTypeKey: validation.data.eventType,
        themeKey: validation.data.theme,
        eventType: validation.data.eventTypeLabel,
        city: validation.data.city,
        budget: validation.data.budget,
        numberOfGuests: validation.data.numberOfGuests,
        theme: validation.data.themeLabel,
        language: validation.data.language,
        currency: validation.data.currency,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Generate error:', error.message);

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate event plan',
    });
  }
});

export default router;
