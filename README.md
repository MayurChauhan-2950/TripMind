# TripMind — An AI Travel Discovery Platform

[![CI](https://github.com/MayurChauhan-2950/TripMind/actions/workflows/ci.yml/badge.svg)](https://github.com/MayurChauhan-2950/TripMind/actions/workflows/ci.yml)

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
alembic upgrade head
uvicorn main:app --reload --port 8000
```

Schema is managed by Alembic migrations (`backend/alembic/versions/`) — run `alembic upgrade
head` once before the first start, and again after pulling any change that adds a migration. Seed
data (14 destinations, 3 budget tiers) still inserts automatically and idempotently on startup, no
manual seed step needed. The app boots and serves all non-AI routes even without a
`GEMINI_API_KEY`; only the AI routes require it.

If you have an existing `tripmind.db` from before migrations were introduced, delete it once and
run `alembic upgrade head` to start clean — `alembic upgrade head` creates tables from scratch and
will conflict with tables that already exist from the old auto-create behavior.

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

## Deployment

- **Backend → [Render](https://render.com)**: the repo root has a `render.yaml` blueprint (Render → New → Blueprint, point it at this repo). It builds `backend/` with `pip install -r requirements.txt` and runs `uvicorn main:app --host 0.0.0.0 --port $PORT`. You'll be prompted for `GEMINI_API_KEY` and `CORS_ORIGINS` (set the latter to your Vercel frontend URL); `JWT_SECRET` is auto-generated.
- **Frontend → [Vercel](https://vercel.com)**: import the repo, set the project's Root Directory to `frontend`, and set `NEXT_PUBLIC_API_BASE_URL` to your deployed Render backend URL.
- SQLite on Render's free tier has no persistent disk — the schema and seed data (14 destinations, 3 budget tiers) recreate automatically on every restart/redeploy since seeding is idempotent, but any signups or saved trips created in the live deployment won't survive a redeploy.
