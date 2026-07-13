import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { config, validateGroqApiKey } from './config.js';
import generateRouter from './routes/generate.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  validateGroqApiKey();
} catch (error) {
  console.error(`\nConfiguration error: ${error.message}\n`);
  process.exit(1);
}

const app = express();

app.use(helmet());
app.use(cors({ origin: config.nodeEnv === 'production' ? false : true }));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

app.use('/api', limiter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiProvider: 'Groq',
    model: config.groqModel,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', generateRouter);

if (config.nodeEnv === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`AI provider: Groq (${config.groqModel})`);
});
