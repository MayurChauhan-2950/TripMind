from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user_optional, user_hobbies
from models import Destination, User
from rate_limit import limiter
from schemas.compare import CompareOut, CompareRequest
from schemas.destination import DestinationOut
from services.compare import build_comparison_table
from services.gemini_client import GeminiRequestError, GeminiUnavailableError, generate_json
from services.prompts import build_compare_prompt

router = APIRouter(prefix="/compare", tags=["compare"])


@router.post("", response_model=CompareOut)
@limiter.limit("10/minute")
def compare_destinations(
    request: Request,
    payload: CompareRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    dest_a = db.query(Destination).filter(Destination.name == payload.destination_a).first()
    dest_b = db.query(Destination).filter(Destination.name == payload.destination_b).first()

    if dest_a is None or dest_b is None:
        raise HTTPException(status_code=404, detail="One or both destinations were not found")

    table = build_comparison_table(dest_a, dest_b)

    ai_summary = None
    try:
        prompt = build_compare_prompt(
            dest_a.name, dest_b.name, table, hobbies=user_hobbies(current_user)
        )
        fallback_key = "compare:" + ":".join(sorted([dest_a.name, dest_b.name]))
        result = generate_json(prompt, db, "compare", fallback_key)
        ai_summary = result.get("summary") if isinstance(result, dict) else None
    except (GeminiUnavailableError, GeminiRequestError):
        ai_summary = None

    return CompareOut(
        destination_a=DestinationOut.model_validate(dest_a),
        destination_b=DestinationOut.model_validate(dest_b),
        comparison_table=table,
        ai_summary=ai_summary,
    )
