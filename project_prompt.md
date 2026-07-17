# Project: TripMind — An AI Travel Discovery Platform

## If possible can we use framer-motion and use uiux pro max skill this skill for good website ?
cmds :
npm i framermotion
uipro init -ai antigravity
https://github.com/nextlevelbuilder/ui-ux-pro-max-skill


## Project Setup Status (Already Done — Do Not Re-Scaffold)

The folder structure and environments below are already set up on the local machine. Build the modules described in this document **inside this existing structure** — do not run `create-next-app` again or recreate the virtual environment.

```
tripmind-ai/
├── frontend/          # Next.js app already scaffolded (TypeScript + Tailwind + App Router)
├── backend/
│   ├── venv/           # Python virtual environment (already created, activate before running)
│   ├── main.py         # empty, ready for FastAPI app
│   ├── models/         # empty, for SQLAlchemy models
│   ├── routes/         # empty, for API route files
│   ├── requirements.txt   # fastapi, uvicorn, sqlalchemy, pydantic, python-dotenv, google-genai
│   └── .env            # add GEMINI_API_KEY here
├── README.md
└── .gitignore          # ignores venv/, node_modules/, .env, .next/, __pycache__/, *.db
```

To run the backend: `cd backend && source venv/bin/activate && uvicorn main:app --reload`
To run the frontend: `cd frontend && npm run dev`

---

## Overview

Build a full-stack web application called **"TripMind — An AI Travel Discovery Platform"** — a tourism web app for travelers to discover destinations, plan trips, estimate budgets, and get AI-powered recommendations.

This is **not** a tourism management/admin CRUD system. It is a consumer-facing product that combines **custom backend logic** (recommendation scoring, budget calculation, comparisons) with **AI-generated content** (Gemini API) for itineraries, hidden gems, packing lists, and travel narratives.

Positioning: *Discover destinations using a recommendation engine. Plan with AI-generated itineraries. Estimate costs with a custom calculator. Explore destination details. Save and manage trips.*

---

## Tech Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend:** FastAPI (Python) + Pydantic
- **Database:** SQLite + SQLAlchemy (no auth, no external DB server — keep it simple)
- **AI:** Gemini API (google-generativeai / google-genai SDK)
- **No Mapbox/Leaflet, no image upload, no charts library** — keep scope tight for a ~4-week build.

---

## Modules to Build

### 1. Destination Explorer (Custom Logic — no AI)
- SQLite table `destinations` with fields: `id, name, state, category, budget_level, best_season, family_friendly, adventure_score, food_score, shopping_score, nature_score, historical_score, description, image_url`.
- Seed with 12-15 real Indian destinations (e.g., Manali, Goa, Jaipur, Udaipur, Kerala, Leh, Ahmedabad, Rishikesh, Munnar, etc.) with realistic scores (0-100 scale per category).
- User submits: budget level, interests (multi-select: nature, photography, food, adventure, shopping, history), season, trip days.
- Backend computes a **weighted match score** per destination (e.g., matched interest categories weighted higher, budget match adds points, season match adds points) and returns a ranked list.
- This scoring logic must be custom Python code — no AI call involved.

### 2. Budget Calculator (Custom Logic — no AI)
- SQLite table `budget_rates` with per-budget-tier daily rates: `hotel_per_day, food_per_day, transport_per_day, activities_per_day` for Low/Medium/High tiers.
- User inputs destination + trip days + budget tier → backend computes total cost breakdown (hotel × days, food × days, etc.) and a grand total.
- After the calculation, optionally send the breakdown to Gemini to generate ONE short cost-saving tip (AI enhances, does not calculate).

### 3. AI Itinerary Generator (Gemini)
- User inputs: destination, days, budget, interests.
- Backend builds a structured prompt from these inputs and calls Gemini to generate a day-by-day itinerary (activities, meals, tips).
- Return structured JSON if possible (ask Gemini to respond in JSON format: `{"day": 1, "activities": [...], "notes": "..."}`) so the frontend can render it as cards/timeline.

### 4. Compare Destinations (Hybrid — Custom Logic + AI)
- User selects two destinations.
- Backend pulls their stored scores/attributes from SQLite and builds a comparison table (no AI).
- Backend sends this comparison data to Gemini and asks for a short natural-language summary of which destination suits which kind of traveler.

### 5. Hidden Gems + Packing List (Gemini, bundled)
- **Hidden Gems:** user picks a destination → Gemini prompt: "Suggest 5 lesser-known local spots near {destination} that tourists usually miss, with a one-line reason for each."
- **Packing List:** user inputs destination + season + trip days → Gemini prompt: "Generate a packing checklist for a {days}-day trip to {destination} during {season}."
- Both can share one FastAPI route pattern (`/api/ai/{feature}`) with different prompt templates.

### 6. Saved Trips (Custom Logic — SQLite CRUD, no AI, no auth)
- SQLite table `trips`: `id, trip_name, destination, budget_tier, days, itinerary_json, created_at`.
- No login system — use a simple text field for "traveler name" or just allow anonymous saves for this project's scope.
- Endpoints: create trip (save generated itinerary), list trips, view trip detail, delete trip.

---

## Suggested API Routes (FastAPI)

```
GET    /api/destinations                  # list all, with optional filters
POST   /api/destinations/recommend        # scoring engine, returns ranked list
POST   /api/budget/calculate              # budget calculator
POST   /api/ai/itinerary                  # Gemini itinerary generation
POST   /api/compare                       # hybrid comparison
POST   /api/ai/hidden-gems                # Gemini hidden gems
POST   /api/ai/packing-list               # Gemini packing list
POST   /api/trips                         # save a trip
GET    /api/trips                         # list saved trips
GET    /api/trips/{id}                    # view one trip
DELETE /api/trips/{id}                    # delete a trip
```

---

## Suggested Frontend Pages (Next.js)

```
/                     Home — search bar, trending destinations, quick links to modules
/explore              Destination Explorer — filter form + ranked results
/planner              AI Itinerary Generator — form + generated itinerary display
/budget               Budget Calculator — sliders/inputs + cost breakdown
/compare              Compare Destinations — pick two, see table + AI summary
/discover             Hidden Gems + Packing List — tabs or two sections
/trips                Saved Trips — list + detail view
```

---

## Report / Presentation Notes

When documenting this for the internship report, frame the modules like this so it reads as software engineering, not just an AI wrapper:

- Custom logic: Destination Explorer (recommendation scoring engine), Budget Calculator, Saved Trips (CRUD)
- Hybrid: Compare Destinations
- AI-powered: Itinerary Generator, Hidden Gems, Packing List

---

## Running the Project (macOS) — DO THIS LAST, AFTER CODE IS WRITTEN

The virtual environment and Next.js app are already scaffolded (see Project Setup Status above). Once the module code has been written into the existing structure, just install any new dependencies and run:

```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
# Add GEMINI_API_KEY inside backend/.env before running
uvicorn main:app --reload
deactivate   # when done
```

```bash
# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Confirm `venv/`, `.env`, `node_modules/`, and `.next/` stay in `.gitignore` before pushing to GitHub, so the virtual environment and API key are never committed.
