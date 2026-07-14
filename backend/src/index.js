import app from './app.js';
import { config, validateGroqApiKey } from './config.js';

export default app;

if (!process.env.VERCEL) {
  try {
    validateGroqApiKey();
  } catch (error) {
    console.error(`\nConfiguration error: ${error.message}\n`);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
    console.log(`AI provider: Groq (${config.groqModel})`);
  });
}
