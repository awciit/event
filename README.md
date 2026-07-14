# EventCraft AI — Bilingual Event Planner

Bilingual (English / Arabic) fork of EventCraft AI with USD and SAR currency support.

**Original project:** `~/Projects/ai-event-planner` (unchanged)

## Features

- Language switcher: English (LTR) / Arabic (RTL)
- Currency selector: USD ($) / SAR (ريال)
- Groq AI (`llama-3.1-8b-instant`) generates plans in the selected language and currency
- City suggestions adapt to language (US/EU vs Saudi cities)
- Production-ready Express API with React frontend, deployable to Vercel

## Local development

```bash
cd ~/Projects/ai-event-planner-bilingual
npm run install:all
cp .env.example .env   # add GROQ_API_KEY
npm run dev
```

- Frontend: http://localhost:5174
- Backend: http://localhost:3002

## Production (local)

Build the frontend and serve the app from Express:

```bash
npm run install:all
cp .env.example .env   # add GROQ_API_KEY
npm run build
NODE_ENV=production npm start
```

- App: http://localhost:3002

## Deploy to Vercel

1. Push this repository to GitHub and import it in the [Vercel dashboard](https://vercel.com/new).
2. Add environment variables in **Project Settings → Environment Variables**:
   - `GROQ_API_KEY` — required
   - `GROQ_MODEL` — optional (default: `llama-3.1-8b-instant`)
   - `GROQ_API_URL` — optional
   - `NODE_ENV` — set to `production` for Production deployments
3. Deploy. Vercel uses `vercel.json` to build the frontend and run the Express API from `server.js`.

Or deploy from the CLI:

```bash
npx vercel login
npx vercel link
npx vercel env pull .env.local
npx vercel --prod
```

## Environment variables

```env
GROQ_API_KEY=your_key
GROQ_MODEL=llama-3.1-8b-instant
PORT=3002
NODE_ENV=development
```

## Project structure

```
├── server.js          # Vercel entry point (exports Express app)
├── vercel.json        # Vercel build & function configuration
├── frontend/          # React + Vite SPA
└── backend/           # Express API + Groq integration
```
