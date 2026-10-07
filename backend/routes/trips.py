import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user, get_current_user_optional
from models import Trip, TripCollaborator, User
from schemas.itinerary import ItineraryDay
from schemas.trip import CollaboratorAdd, CollaboratorOut, TripCreate, TripListItem, TripOut

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
        user_id=trip.user_id,
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
        collaborator_trip_ids = (
            db.query(TripCollaborator.trip_id)
            .filter(TripCollaborator.user_id == current_user.id)
            .subquery()
        )
        query = query.filter(
            or_(Trip.user_id == current_user.id, Trip.id.in_(collaborator_trip_ids))
        )
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


def _require_owner(trip_id: int, current_user: User, db: Session) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the trip owner can manage collaborators")
    return trip


@router.get("/{trip_id}/collaborators", response_model=list[CollaboratorOut])
def list_collaborators(trip_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(TripCollaborator, User)
        .join(User, User.id == TripCollaborator.user_id)
        .filter(TripCollaborator.trip_id == trip_id)
        .all()
    )
    return [
        CollaboratorOut(user_id=user.id, email=user.email, username=user.username)
        for _, user in rows
    ]


@router.post("/{trip_id}/collaborators", response_model=CollaboratorOut, status_code=201)
def add_collaborator(
    trip_id: int,
    payload: CollaboratorAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_owner(trip_id, current_user, db)

    invitee = db.query(User).filter(User.email == payload.email).first()
    if invitee is None:
        raise HTTPException(status_code=404, detail="No user found with that email")
    if invitee.id == current_user.id:
        raise HTTPException(status_code=409, detail="You already own this trip")

    existing = (
        db.query(TripCollaborator)
        .filter(TripCollaborator.trip_id == trip_id, TripCollaborator.user_id == invitee.id)
        .first()
    )
    if existing is not None:
        raise HTTPException(status_code=409, detail="This user is already a collaborator")

    db.add(TripCollaborator(trip_id=trip_id, user_id=invitee.id))
    db.commit()
    return CollaboratorOut(user_id=invitee.id, email=invitee.email, username=invitee.username)


@router.delete("/{trip_id}/collaborators/{user_id}", status_code=204)
def remove_collaborator(
    trip_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_owner(trip_id, current_user, db)

    row = (
        db.query(TripCollaborator)
        .filter(TripCollaborator.trip_id == trip_id, TripCollaborator.user_id == user_id)
        .first()
    )
    if row is not None:
        db.delete(row)
        db.commit()
