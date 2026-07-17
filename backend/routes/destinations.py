from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Destination
from schemas.destination import DestinationOut, MatchBreakdown, RecommendRequest, RecommendResult
from services.scoring import rank_destinations

router = APIRouter(prefix="/destinations", tags=["destinations"])


@router.get("", response_model=list[DestinationOut])
def list_destinations(
    category: str | None = Query(default=None),
    budget_level: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Destination)
    if category:
        query = query.filter(Destination.category == category)
    if budget_level:
        query = query.filter(Destination.budget_level == budget_level)
    return query.all()


@router.post("/recommend", response_model=list[RecommendResult])
def recommend_destinations(payload: RecommendRequest, db: Session = Depends(get_db)):
    destinations = db.query(Destination).all()
    ranked = rank_destinations(
        destinations, payload.interests, payload.budget_level, payload.season
    )
    return [
        RecommendResult(
            destination=DestinationOut.model_validate(dest),
            match_score=score,
            match_breakdown=MatchBreakdown(**breakdown),
        )
        for dest, score, breakdown in ranked
    ]
