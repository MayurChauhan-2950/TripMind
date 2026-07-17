from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError

from dependencies import get_current_user_optional, user_hobbies
from models import User
from schemas.itinerary import ItineraryDay, ItineraryOut, ItineraryRequest
from services.gemini_client import GeminiRequestError, GeminiUnavailableError, generate_json
from services.prompts import build_itinerary_prompt

router = APIRouter(prefix="/ai", tags=["ai-itinerary"])


@router.post("/itinerary", response_model=ItineraryOut)
def generate_itinerary(
    payload: ItineraryRequest,
    current_user: User | None = Depends(get_current_user_optional),
):
    prompt = build_itinerary_prompt(
        payload.destination,
        payload.days,
        payload.budget_level,
        payload.interests,
        hobbies=user_hobbies(current_user),
    )

    try:
        raw_days = generate_json(prompt)
    except GeminiUnavailableError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except GeminiRequestError as exc:
        raise HTTPException(status_code=502, detail=f"AI itinerary generation failed: {exc}") from exc

    if not isinstance(raw_days, list):
        raise HTTPException(status_code=502, detail="AI response was not a list of days")

    try:
        days = [ItineraryDay.model_validate(day) for day in raw_days]
    except ValidationError as exc:
        raise HTTPException(status_code=502, detail=f"AI response did not match expected shape: {exc}") from exc

    return ItineraryOut(destination=payload.destination, days=days)
