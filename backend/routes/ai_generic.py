from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import ValidationError
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user_optional, user_hobbies
from models import User
from rate_limit import limiter
from schemas.ai_generic import AIGenericRequest, HiddenGemsOut, PackingListOut
from services.gemini_client import GeminiRequestError, GeminiUnavailableError, generate_json
from services.prompts import build_hidden_gems_prompt, build_packing_list_prompt

router = APIRouter(prefix="/ai", tags=["ai-generic"])


@router.post("/{feature}")
@limiter.limit("10/minute")
def generate_ai_content(
    request: Request,
    feature: Literal["hidden-gems", "packing-list"],
    payload: AIGenericRequest,
    current_user: User | None = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    if feature == "packing-list" and (payload.season is None or payload.days is None):
        raise HTTPException(status_code=422, detail="'season' and 'days' are required for packing-list")

    if feature == "hidden-gems":
        prompt = build_hidden_gems_prompt(payload.destination, hobbies=user_hobbies(current_user))
    else:
        prompt = build_packing_list_prompt(payload.destination, payload.season, payload.days)

    try:
        raw = generate_json(prompt, db, feature, f"{feature}:{payload.destination}")
    except GeminiUnavailableError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except GeminiRequestError as exc:
        raise HTTPException(status_code=502, detail=f"AI generation failed: {exc}") from exc

    if not isinstance(raw, dict):
        raise HTTPException(status_code=502, detail="AI response was not a JSON object")

    try:
        if feature == "hidden-gems":
            return HiddenGemsOut(destination=payload.destination, **raw)
        return PackingListOut(destination=payload.destination, **raw)
    except ValidationError as exc:
        raise HTTPException(status_code=502, detail=f"AI response did not match expected shape: {exc}") from exc
