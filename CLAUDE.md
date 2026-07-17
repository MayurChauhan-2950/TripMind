# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TripMind is an AI travel discovery platform — a consumer-facing tourism web app (not an admin/CRUD system) where users discover destinations, plan trips, estimate budgets, and get AI-generated content. It deliberately combines two kinds of logic so the project reads as software engineering rather than an AI wrapper:

- **Custom logic** (no AI): Destination Explorer (recommendation scoring engine), Budget Calculator, Saved Trips (CRUD)
- **Hybrid** (custom logic + AI): Compare Destinations — backend computes the comparison table, Gemini writes the narrative summary
- **AI-powered** (Gemini): Itinerary Generator, Hidden Gems, Packing List

The full functional spec (data models, scoring rules, API routes, page list) lives in [project_prompt.md](project_prompt.md). The visual identity spec ("Modern Cartographer" — ink navy + brass gold, Fraunces/Inter/IBM Plex Mono, stamped-card + dashed-connector motif) lives in [theme_spec.md](theme_spec.md). Both are fully implemented; consult them before changing scope, data shapes, or visual language.

## Current State

All six spec modules are implemented end-to-end (backend routes + frontend pages) and manually verified against a running backend/frontend pair: Destination Explorer, Budget Calculator, AI Itinerary Generator, Saved Trips, Compare Destinations, Hidden Gems + Packing List, plus the Home page. There is no automated test suite.

Beyond the original spec, the user explicitly requested and received two further additions — these are **intentional scope expansions the user chose to take on**, not silent scope creep, and they supersede the "no auth, keep it simple" line in the original spec:

- **Visual overhaul**: real destination photos (Wikimedia Commons, not placeholders — see below), a shared full-bleed `PageHeader` band on every inner page, scroll-reveal and tab cross-fade motion, a photo background on the Home hero.
- **Accounts + profile-driven AI personalization**: JWT-based signup/login/logout, a `/profile` page (full name, home city, bio, free-form **hobbies**), and hobbies are woven into the itinerary/compare/hidden-gems prompts when a user is logged in. Verified live: the same request produces visibly different Gemini output logged-in vs anonymous (logged-in output explicitly references the profile's hobbies).

## Image sourcing

Destination photos come from Wikimedia Commons' stable `Special:FilePath` endpoint: `https://commons.wikimedia.org/wiki/Special:FilePath/<url-encoded filename>?width=1000`. This 302-redirects to the current CDN thumbnail and is Wikimedia's documented stable hotlinking API — don't switch to guessing `upload.wikimedia.org/.../thumb/...` paths directly (those require exact hash-path segments and frequently 400). When adding a new destination, find a real filename via web search (`site:commons.wikimedia.org <subject> jpg`) and curl-verify it before adding — Wikimedia rate-limits rapid-fire requests (429) if you check many at once, so add a short delay between verification calls. `next.config.ts` allowlists `commons.wikimedia.org`/`upload.wikimedia.org` in `images.remotePatterns`; any new image host needs adding there too.

## Environment quirks specific to this machine (read before running anything)

This repo lives on Windows, but the frontend's Node toolchain was installed via **WSL Ubuntu**, not natively on Windows (`node`/`npm` are not on the Windows PATH at all — `frontend/node_modules/.bin` has no `.cmd` wrappers, confirming a POSIX install). The backend's Python `venv/` was *also* originally created via WSL and was unusable from native Windows (broken symlinks, `/usr/bin/python3.12` target); it has since been recreated as a native Windows venv under `backend/venv/` using the Windows Python 3.13 install, and that one works fine with plain `venv\Scripts\python.exe`.

Practical consequences:

- **Backend**: run natively on Windows — `backend\venv\Scripts\python.exe -m uvicorn main:app --port 8000`. No WSL needed for the backend.
- **Frontend**: run through WSL, since that's where a working `node`/`npm` actually exists on this machine:
  ```bash
  wsl.exe -d Ubuntu -- bash -lc 'export PATH="$HOME/.nvm/versions/node/v24.14.1/bin:$PATH"; cd "/mnt/c/Users/Mayur Chauhan/Downloads/tripmind-ai/frontend" && npm run dev'
  ```
  (nvm is installed in that WSL user's home but isn't sourced in non-interactive shells — exporting the versioned `bin/` directly onto `PATH` is the reliable way to reach `node`/`npm`.)
- **Cross-boundary networking is asymmetric**: Windows *can* reach the WSL-hosted Next.js dev server at `localhost:3000` (WSL2 forwards inbound), but code running *inside* WSL (e.g. a Next.js Server Component doing a server-side `fetch`) **cannot** reach the Windows-hosted backend at `localhost:8000` (no outbound passthrough). This is why every page that needs backend data is a **client component fetching in `useEffect`** (browser-side fetch, which works fine) rather than an async Server Component with a server-side fetch. Keep new data-fetching pages consistent with that pattern unless the networking setup changes.
- **File-watching across the Windows/WSL boundary is unreliable**: edits made from the Windows side to files under `/mnt/c/...` are not always picked up by Turbopack's dev-server watcher running inside WSL. If a change doesn't seem to take effect, don't trust hot-reload — kill the dev server and restart it fresh (clearing `.next/` if needed) before concluding something is broken. Verify pages by checking actual rendered content (`curl` + grep for expected text), not just HTTP status — a stale cached page still returns 200.
- Prefer starting long-running dev servers via the Bash tool's own `run_in_background` rather than manually detaching with `setsid`/`nohup`/`disown` inside a `wsl.exe` invocation — the latter has intermittently failed to survive the parent call returning.
- **After adding new routes/pages**, hitting many freshly-added, never-before-compiled routes concurrently (e.g. a tight loop of curl calls) can produce transient Turbopack "module factory is not available" 500s. This is a compile race, not a code defect — retry the same routes sequentially with a short delay between each before concluding something broke.
- **SQLite has no auto-migration**: `Base.metadata.create_all()` only creates tables that don't exist yet — it will NOT add a new column to an existing table (e.g. adding `Trip.user_id` silently did nothing until `tripmind.db` was deleted and recreated). After any model field change, delete `backend/tripmind.db` and restart so the schema and seed data regenerate from scratch. Fine for this dev-scale project since the DB only holds seed data plus whatever test data you created.

## Architecture

**Frontend** (`frontend/`, Next.js App Router + TypeScript + Tailwind CSS v4 + framer-motion) talks to **Backend** (`backend/`, FastAPI + Pydantic + SQLAlchemy) over HTTP via direct browser-side `fetch` (CORS-enabled, no proxy/rewrite). Backend owns a SQLite database — no auth, no external DB server. SQLite tables and seed data are created automatically on FastAPI startup (`backend/seed.py`, idempotent) — no manual migration step.

### Backend layout (`backend/`)

```
main.py                 # FastAPI app, CORS, router mounts, startup create_all + seed
config.py               # pydantic-settings; GEMINI_API_KEY is optional so the app boots without it
database.py             # engine, SessionLocal, Base, get_db
dependencies.py         # get_current_user (401 if missing/invalid), get_current_user_optional, user_hobbies()
seed.py                 # idempotent seeding (inserts only if tables are empty)
models/                 # SQLAlchemy: destination.py, budget_rate.py, trip.py (nullable user_id FK), user.py
schemas/                # Pydantic request/response schemas, one file per module, incl. auth.py
routes/                 # destinations.py, budget.py, ai_itinerary.py, compare.py, ai_generic.py, trips.py, auth.py
services/
  scoring.py            # recommendation engine — pure Python, see weights below
  budget_calc.py        # deterministic tier-rate math
  compare.py            # deterministic comparison-table builder
  gemini_client.py       # generate_json(): google-genai wrapper, JSON mode + fence-stripping fallback
  prompts.py             # one prompt-builder function per AI feature; itinerary/compare/hidden-gems accept optional hobbies
  auth.py                # bcrypt hash/verify, PyJWT create/decode (HS256, 7-day expiry, JWT_SECRET from env)
data/                   # destinations_seed.py (14 destinations, real Wikimedia photos), budget_rates_seed.py (3 tiers)
```

API routes actually implemented:

```
GET    /api/destinations                  # list all, optional category/budget_level filters
POST   /api/destinations/recommend        # scoring engine, returns ranked list + match_breakdown
POST   /api/budget/calculate              # breakdown + optional AI cost-saving tip (degrades to null)
POST   /api/ai/itinerary                  # Gemini itinerary generation (503 if key missing); personalizes if logged in
POST   /api/compare                       # deterministic table + optional AI summary (degrades to null); personalizes if logged in
POST   /api/ai/{feature}                  # feature: "hidden-gems" | "packing-list"; hidden-gems personalizes if logged in
POST   /api/trips                         # save a trip; tagged with user_id if logged in, else anonymous
GET    /api/trips                         # logged in: only that user's trips; logged out: all anonymous trips (unchanged behavior)
GET    /api/trips/{id}                    # view one trip (full itinerary)
DELETE /api/trips/{id}                    # delete a trip
POST   /api/auth/signup                   # email/username/password -> {access_token}
POST   /api/auth/login                    # email/password -> {access_token}
GET    /api/auth/me                       # requires Bearer token -> profile incl. hobbies
PUT    /api/auth/me                       # update full_name/home_city/bio/hobbies
```

**Auth model**: stateless JWT Bearer tokens (no server-side session store), `Authorization: Bearer <token>` header, no cookies — chosen because frontend (WSL) and backend (native Windows) are different origins/processes and cookie/CORS credential plumbing would add complexity for no benefit at this scale. `hobbies` is stored on `User` as a comma-separated string (same pattern as `Destination.best_season`), converted to/from `list[str]` at the schema boundary — never assume it's a list at the DB layer.

**Graceful AI degradation contract** (don't break this when touching AI routes): the app must always boot and serve non-AI routes with no `GEMINI_API_KEY` set. For *pure-AI* features (itinerary, hidden-gems, packing-list) a missing/failing key means a `503`/`502` with a clear `detail` message — there's no meaningful partial result. For *hybrid* features where AI only adds a narrative on top of an already-useful deterministic result (budget's cost-saving tip, compare's AI summary), a Gemini failure must degrade to `null` in that one field and still return `200` — the deterministic part must never be blocked by AI availability.

**Recommendation scoring** (`services/scoring.py`, 0–100, three weighted components): interest match (60%, averages the destination's matching category score(s) — `photography` is a derived average of `nature_score`+`historical_score` since there's no dedicated column), budget match (25%: exact tier=25, adjacent tier=12, opposite ends=0), season match (15%: destination's `best_season` is a comma-separated tag string like `"Summer, Winter"`, checked via substring/contains against one of the fixed seasons `Winter | Summer | Monsoon | Year-round`).

### Frontend layout (`frontend/`)

```
app/                    # one folder per route: explore, planner, budget, compare, discover, trips, trips/[id],
                         # plus login, signup, profile
components/
  layout/               # Nav (auth-aware, mobile hamburger menu), Footer, PageHeader (full-bleed navy band, all inner pages)
  ui/                    # Button, Card, Tag, Input, Select, ScoreBadge, InterestPicker
  motifs/                # StampedCard (optional image prop), DashedConnector, RevealOnScroll — the repeated
                         # decorative/motion language; reuse these, don't invent new ones
  destinations/ planner/ budget/ compare/ discover/ trips/ home/   # feature-specific components
lib/
  api/                  # client.ts (fetchJson<T> + ApiError, attaches Bearer token from localStorage automatically),
                         # one file per backend module incl. auth.ts
  auth/context.tsx       # AuthProvider/useAuth — user, login, signup, logout, refreshUser; wraps the whole app in layout.tsx
  types.ts              # TS types mirrored 1:1 from backend Pydantic schemas — keep in sync manually
```

Every page that needs destination/trip/etc. data is a `"use client"` component fetching via `useEffect` (see the networking note above for why) — this includes the Home page, which was originally an async Server Component but had to be converted to client-side fetching for the same cross-boundary networking reason. `ScoreBadge`, `Hero`, and `PageHeader` respect `prefers-reduced-motion` explicitly (via `matchMedia` / framer-motion's `useReducedMotion`); `globals.css` also has a blanket reduced-motion override — don't reintroduce animations that bypass both.

Theme tokens live in `frontend/app/globals.css` under a Tailwind v4 `@theme` block (CSS-first — there is deliberately no `tailwind.config.ts`). Colors/fonts/radii/type-scale all come from there; match `theme_spec.md` exactly rather than inventing new ad-hoc values.

**Auth token storage**: `localStorage` under the key `tripmind_token` (exported as `AUTH_TOKEN_KEY` from `lib/api/client.ts`) — `fetchJson` reads it directly and attaches `Authorization: Bearer <token>` to every request when present, so individual API call sites never need to think about auth. `AuthProvider` is the only thing that writes/clears that key.

## Commands

**Backend** (from `backend/`, native Windows):
```powershell
venv\Scripts\python.exe -m pip install -r requirements.txt
venv\Scripts\python.exe -m uvicorn main:app --port 8000
```
Add `GEMINI_API_KEY` to `backend/.env` to enable AI features (see `backend/.env.example`). `--reload` has been unreliable on this Windows setup (socket permission errors) — prefer manually restarting after backend changes.

**Frontend** (from `frontend/`, via WSL — see environment quirks above):
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

There is no automated test suite in either package yet — verify changes by running both servers and exercising the actual page/endpoint.

## Scope Constraints

These are explicit, intentional limits — don't add scope beyond them without the user asking, the same way auth and the visual overhaul were explicit additions on top of the original spec:

- No Mapbox/Leaflet, no image upload, no charting library. Destination images are real Wikimedia Commons photos (see "Image sourcing" above), hotlinked — not user-uploaded.
- SQLite only — no external DB server.
- Auth is intentionally minimal: no email verification, no password reset flow, no OAuth/social login, no role/permission system — just signup/login/logout and a self-editable profile.
- Keep `venv/`, `.env`, `node_modules/`, `.next/`, and any `*.db` files out of version control (see root `.gitignore`). `.env` now also holds `JWT_SECRET` — never commit it.
