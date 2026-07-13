# EventCraft AI — Bilingual Event Planner

Bilingual (English / Arabic) fork of EventCraft AI with USD and SAR currency support.

**Original project:** `~/Projects/ai-event-planner` (unchanged)

## Features

- Language switcher: English (LTR) / Arabic (RTL)
- Currency selector: USD ($) / SAR (ريال)
- Groq AI (`llama-3.1-8b-instant`) generates plans in the selected language and currency
- City suggestions adapt to language (US/EU vs Saudi cities)
- Runs on separate ports so it can run alongside the original app

## Run

```bash
cd ~/Projects/ai-event-planner-bilingual
npm run install:all
cp .env.example .env   # add GROQ_API_KEY
npm run dev
```

- Frontend: http://localhost:5174
- Backend: http://localhost:3002

## Environment

```env
GROQ_API_KEY=your_key
GROQ_MODEL=llama-3.1-8b-instant
PORT=3002
```
