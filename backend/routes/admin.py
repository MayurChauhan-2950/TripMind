from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_admin
from models import BudgetRate, Destination
from schemas.budget import BudgetRateOut, BudgetRateWrite
from schemas.destination import DestinationOut, DestinationWrite

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


@router.post("/destinations", response_model=DestinationOut, status_code=201)
def create_destination(payload: DestinationWrite, db: Session = Depends(get_db)):
    destination = Destination(**payload.model_dump())
    db.add(destination)
    db.commit()
    db.refresh(destination)
    return destination


@router.put("/destinations/{destination_id}", response_model=DestinationOut)
def update_destination(destination_id: int, payload: DestinationWrite, db: Session = Depends(get_db)):
    destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if destination is None:
        raise HTTPException(status_code=404, detail="Destination not found")

    for field, value in payload.model_dump().items():
        setattr(destination, field, value)
    db.commit()
    db.refresh(destination)
    return destination


@router.delete("/destinations/{destination_id}", status_code=204)
def delete_destination(destination_id: int, db: Session = Depends(get_db)):
    destination = db.query(Destination).filter(Destination.id == destination_id).first()
    if destination is None:
        raise HTTPException(status_code=404, detail="Destination not found")
    db.delete(destination)
    db.commit()


@router.put("/budget-rates/{tier}", response_model=BudgetRateOut)
def update_budget_rate(tier: str, payload: BudgetRateWrite, db: Session = Depends(get_db)):
    rate = db.query(BudgetRate).filter(BudgetRate.tier == tier).first()
    if rate is None:
        raise HTTPException(status_code=404, detail=f"No rates configured for tier '{tier}'")

    for field, value in payload.model_dump().items():
        setattr(rate, field, value)
    db.commit()
    db.refresh(rate)
    return rate
