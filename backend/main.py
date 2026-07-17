from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import Base, SessionLocal, engine
from routes import ai_generic, ai_itinerary, auth, budget, compare, destinations, trips
from seed import run_seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()
    yield


app = FastAPI(title="TripMind API", lifespan=lifespan)

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


@app.get("/api/health")
def health():
    return {"status": "ok"}
