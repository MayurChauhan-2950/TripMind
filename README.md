# TripMind — An AI Travel Discovery Platform

A tourism web app for discovering destinations, planning trips, estimating budgets, and getting
AI-powered recommendations. Combines custom backend logic (recommendation scoring, budget
calculation, comparisons) with Gemini-generated content (itineraries, hidden gems, packing lists,
travel narratives).

- **Custom logic:** Destination Explorer (recommendation scoring engine), Budget Calculator, Saved Trips (CRUD)
- **Hybrid:** Compare Destinations
- **AI-powered:** Itinerary Generator, Hidden Gems, Packing List

## Tech stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS + framer-motion
- **Backend:** FastAPI (Python) + Pydantic + SQLAlchemy
- **Database:** SQLite (seeded automatically on first run, no manual setup)
- **AI:** Gemini API via the `google-genai` SDK

## Running the backend

```bash
cd backend
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
# add your GEMINI_API_KEY to backend/.env (see .env.example)
uvicorn main:app --reload --port 8000
```

The database and seed data (14 destinations, 3 budget tiers) are created automatically on
startup — no manual migration or seed step needed. The app boots and serves all non-AI routes
even without a `GEMINI_API_KEY`; only the AI routes require it.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`. The frontend expects the backend at `http://localhost:8000` by
default — override with `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local` if needed.

## Environment variables

| File | Variable | Purpose |
|---|---|---|
| `backend/.env` | `GEMINI_API_KEY` | Required for AI features (itinerary, compare summary, hidden gems, packing list, budget tip) |
| `backend/.env` | `GEMINI_MODEL` | Defaults to `gemini-2.5-flash` |
| `backend/.env` | `CORS_ORIGINS` | Defaults to `http://localhost:3000` |
| `frontend/.env.local` | `NEXT_PUBLIC_API_BASE_URL` | Defaults to `http://localhost:8000` |
