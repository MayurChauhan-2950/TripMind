import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user_optional
from models import Trip, User
from schemas.itinerary import ItineraryDay
from schemas.trip import TripCreate, TripListItem, TripOut

router = APIRouter(prefix="/trips", tags=["trips"])


def _to_trip_out(trip: Trip) -> TripOut:
    itinerary = [ItineraryDay.model_validate(day) for day in json.loads(trip.itinerary_json)]
    return TripOut(
        id=trip.id,
        trip_name=trip.trip_name,
        destination=trip.destination,
        budget_tier=trip.budget_tier,
        days=trip.days,
        traveler_name=trip.traveler_name,
        created_at=trip.created_at,
        itinerary=itinerary,
    )


@router.post("", response_model=TripOut)
def create_trip(
    payload: TripCreate,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    trip = Trip(
        trip_name=payload.trip_name,
        destination=payload.destination,
        budget_tier=payload.budget_tier,
        days=payload.days,
        traveler_name=payload.traveler_name or "Anonymous Traveler",
        itinerary_json=json.dumps([day.model_dump() for day in payload.itinerary]),
        user_id=current_user.id if current_user else None,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return _to_trip_out(trip)


@router.get("", response_model=list[TripListItem])
def list_trips(
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    query = db.query(Trip)
    if current_user:
        query = query.filter(Trip.user_id == current_user.id)
    return query.order_by(Trip.created_at.desc()).all()


@router.get("/{trip_id}", response_model=TripOut)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return _to_trip_out(trip)


@router.delete("/{trip_id}", status_code=204)
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
