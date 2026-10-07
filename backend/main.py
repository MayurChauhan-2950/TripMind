from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from config import settings
from database import SessionLocal
from rate_limit import limiter
from routes import admin, ai_generic, ai_itinerary, auth, budget, compare, destinations, trips
from seed import run_seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Schema is managed by Alembic migrations — run `alembic upgrade head` before starting.
    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()
    yield


app = FastAPI(title="TripMind API", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(destinations.router, prefix="/api")
app.include_router(budget.router, prefix="/api")
app.include_router(ai_itinerary.router, prefix="/api")
app.include_router(compare.router, prefix="/api")
app.include_router(ai_generic.router, prefix="/api")
app.include_router(trips.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/api/health")
def health():
    return {"status": "ok"}
