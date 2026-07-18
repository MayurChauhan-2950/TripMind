from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from models import BudgetRate
from rate_limit import limiter
from schemas.budget import BudgetBreakdownOut, BudgetCalculateRequest, BudgetRateOut
from services.budget_calc import calculate_budget
from services.gemini_client import GeminiRequestError, GeminiUnavailableError, generate_json
from services.prompts import build_budget_tip_prompt

router = APIRouter(prefix="/budget", tags=["budget"])


@router.get("/rates", response_model=list[BudgetRateOut])
def list_rates(db: Session = Depends(get_db)):
    return db.query(BudgetRate).all()


@router.post("/calculate", response_model=BudgetBreakdownOut)
@limiter.limit("10/minute")
def calculate(request: Request, payload: BudgetCalculateRequest, db: Session = Depends(get_db)):
    rate = db.query(BudgetRate).filter(BudgetRate.tier == payload.budget_tier).first()
    if rate is None:
        raise HTTPException(status_code=404, detail=f"No rates configured for tier '{payload.budget_tier}'")

    breakdown = calculate_budget(rate, payload.days)

    cost_saving_tip = None
    try:
        prompt = build_budget_tip_prompt(payload.destination, breakdown)
        result = generate_json(prompt, db, "budget-tip", f"budget-tip:{payload.destination}")
        cost_saving_tip = result.get("tip") if isinstance(result, dict) else None
    except (GeminiUnavailableError, GeminiRequestError):
        cost_saving_tip = None

    return BudgetBreakdownOut(**breakdown, cost_saving_tip=cost_saving_tip)
