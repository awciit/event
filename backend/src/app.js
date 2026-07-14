import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { config, isGroqConfigured } from './config.js';
import generateRouter from './routes/generate.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: config.nodeEnv === 'production' ? false : undefined,
  })
);
app.use(cors({ origin: config.nodeEnv === 'production' ? false : true }));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiProvider: 'Groq',
    model: config.groqModel,
    groqConfigured: isGroqConfigured(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', generateRouter);

const isProduction = config.nodeEnv === 'production';
const frontendDist = path.resolve(__dirname, '../../frontend/dist');

if (isProduction) {
  app.use(express.static(frontendDist, { maxAge: '1d', index: false }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
      if (err) {
        next(err);
      }
    });
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
