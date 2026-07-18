from typing import Literal

from pydantic import BaseModel, Field

BudgetTier = Literal["Low", "Medium", "High"]


class BudgetCalculateRequest(BaseModel):
    destination: str
    days: int = Field(gt=0)
    budget_tier: BudgetTier


class BudgetBreakdownOut(BaseModel):
    hotel_total: int
    food_total: int
    transport_total: int
    activities_total: int
    grand_total: int
    cost_saving_tip: str | None = None


class BudgetRateOut(BaseModel):
    model_config = {"from_attributes": True}

    tier: str
    hotel_per_day: int
    food_per_day: int
    transport_per_day: int
    activities_per_day: int


class BudgetRateWrite(BaseModel):
    hotel_per_day: int = Field(ge=0)
    food_per_day: int = Field(ge=0)
    transport_per_day: int = Field(ge=0)
    activities_per_day: int = Field(ge=0)
