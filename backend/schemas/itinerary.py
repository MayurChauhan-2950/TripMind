from pydantic import BaseModel, Field

from schemas.destination import BudgetLevel, Interest


class ItineraryRequest(BaseModel):
    destination: str
    days: int = Field(gt=0, le=21)
    budget_level: BudgetLevel
    interests: list[Interest] = Field(min_length=1)


class ItineraryDay(BaseModel):
    day: int
    activities: list[str]
    meals: list[str]
    notes: str


class ItineraryOut(BaseModel):
    destination: str
    days: list[ItineraryDay]
