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
