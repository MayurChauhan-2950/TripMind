from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Interest = Literal["nature", "photography", "food", "adventure", "shopping", "history"]
BudgetLevel = Literal["Low", "Medium", "High"]
Season = Literal["Winter", "Summer", "Monsoon", "Year-round"]


class DestinationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    state: str
    category: str
    budget_level: str
    best_season: str
    family_friendly: bool
    adventure_score: int
    food_score: int
    shopping_score: int
    nature_score: int
    historical_score: int
    description: str
    image_url: str


class RecommendRequest(BaseModel):
    interests: list[Interest] = Field(min_length=1)
    budget_level: BudgetLevel
    season: Season
    trip_days: int = Field(gt=0)


class MatchBreakdown(BaseModel):
    interest: float
    budget: float
    season: float


class RecommendResult(BaseModel):
    destination: DestinationOut
    match_score: int
    match_breakdown: MatchBreakdown
