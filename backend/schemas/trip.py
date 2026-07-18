from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from schemas.budget import BudgetTier
from schemas.itinerary import ItineraryDay


class TripCreate(BaseModel):
    trip_name: str = Field(min_length=1, max_length=150)
    destination: str
    budget_tier: BudgetTier
    days: int = Field(gt=0)
    traveler_name: str | None = None
    itinerary: list[ItineraryDay]


class TripListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    trip_name: str
    destination: str
    budget_tier: str
    days: int
    traveler_name: str | None
    created_at: datetime
    user_id: int | None = None


class TripOut(TripListItem):
    itinerary: list[ItineraryDay]


class CollaboratorAdd(BaseModel):
    email: str


class CollaboratorOut(BaseModel):
    user_id: int
    email: str
    username: str
