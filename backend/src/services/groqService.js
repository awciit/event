import axios from 'axios';
import { config } from '../config.js';
import {
  buildEventPrompt,
  parseAiResponse,
  extractChatCompletionText,
} from '../utils/prompt.js';

function formatApiError(error) {
  const status = error.response.status;
  const data = error.response.data;
  const message =
    data?.error?.message ||
    data?.message ||
    (typeof data === 'string' ? data : JSON.stringify(data)) ||
    error.response.statusText;

  if (status === 401) {
    return new Error('Invalid Groq API key. Check your GROQ_API_KEY in .env');
  }
  if (status === 403) {
    return new Error(`Access denied for model "${config.groqModel}": ${message}`);
  }
  if (status === 429) {
    return new Error('Groq rate limit exceeded. Please try again in a few minutes.');
  }
  if (status === 503) {
    return new Error('Groq is temporarily unavailable. Please try again shortly.');
  }
  return new Error(`Groq API error (${status}): ${message}`);
}

function parseRetryDelayMs(message) {
  const match = message?.match(/try again in ([\d.]+)s/i);
  return match ? Math.ceil(parseFloat(match[1]) * 1000) + 500 : 5000;
}

async function callGroq(prompt, attempt = 1) {
  const requestConfig = {
    headers: {
      Authorization: `Bearer ${config.groqApiKey}`,
      'Content-Type': 'application/json',
    },
    timeout: 120000,
  };

  try {
    return await axios.post(
      config.groqApiUrl,
      {
        model: config.groqModel,
        messages: [
          {
            role: 'system',
            content:
              'You are a professional event planner. Always respond with valid JSON only, no markdown formatting.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      },
      requestConfig
    );
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.error?.message;

    if (status === 429 && attempt < 3) {
      const delay = parseRetryDelayMs(message);
      console.warn(`Groq rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/3)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return callGroq(prompt, attempt + 1);
    }

    throw error;
  }
}

export async function generateEventPlan(eventData) {
  const prompt = buildEventPrompt(eventData);

  try {
    const response = await callGroq(prompt);
    const content = extractChatCompletionText(response.data);
    return parseAiResponse(content);
  } catch (error) {
    if (error.response) {
      console.error('Groq API error:', error.response.status, error.response.data);
      throw formatApiError(error);
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Groq took too long to respond.');
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Unable to reach the Groq API. Check your network connection.');
    }

    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response. Please try again.');
    }

    throw error;
  }
}
