import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const groqApiKey = (process.env.GROQ_API_KEY || '').trim();

export const config = {
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  groqApiKey,
  groqApiUrl: process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions',
  groqModel: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
};

export function isGroqConfigured() {
  return Boolean(config.groqApiKey);
}

export function validateGroqApiKey() {
  if (!isGroqConfigured()) {
    throw new Error(
      'GROQ_API_KEY is missing. Add your Groq API key to the .env file or Vercel project settings.\n' +
      'Get a key at https://console.groq.com/'
    );
  }
}
