import json
import re

from google import genai
from sqlalchemy.orm import Session

from config import settings
from services.ai_cache import get_exact, get_fallback, make_cache_key, store


class GeminiUnavailableError(Exception):
    pass


class GeminiRequestError(Exception):
    pass


# Strip markdown code fences (```json ... ``` or ``` ... ```)
_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)


def _clean_json_text(text: str) -> str:
    """Strip fences and common trailing-comma issues from Gemini output."""
    text = _FENCE_RE.sub("", text).strip()
    # Remove trailing commas before ] or } — a common Gemini mistake
    text = re.sub(r",\s*([}\]])", r"\1", text)
    # Remove any control characters that break JSON parsing
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
    return text


def _extract_json_fragment(text: str) -> str:
    """
    If the cleaned text is not valid JSON, try to extract the first
    complete JSON array or object by finding balanced brackets.
    """
    for start_char, end_char in [("[", "]"), ("{", "}")]:
        start = text.find(start_char)
        if start == -1:
            continue
        depth = 0
        in_string = False
        escape_next = False
        for i, ch in enumerate(text[start:], start=start):
            if escape_next:
                escape_next = False
                continue
            if ch == "\\" and in_string:
                escape_next = True
                continue
            if ch == '"':
                in_string = not in_string
                continue
            if in_string:
                continue
            if ch == start_char:
                depth += 1
            elif ch == end_char:
                depth -= 1
                if depth == 0:
                    return text[start : i + 1]
    return text


def _call_gemini(prompt: str, temperature: float) -> dict | list:
    client = genai.Client(api_key=settings.gemini_api_key)

    try:
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "temperature": temperature,
            },
        )
    except Exception as exc:
        raise GeminiRequestError(str(exc)) from exc

    text = (response.text or "").strip()
    text = _clean_json_text(text)

    # First attempt: direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Second attempt: extract first balanced JSON fragment
    fragment = _extract_json_fragment(text)
    try:
        return json.loads(fragment)
    except json.JSONDecodeError as exc:
        raise GeminiRequestError(
            f"Gemini returned malformed JSON that could not be recovered. "
            f"Try simplifying the request (fewer days or different options). "
            f"Details: {exc}"
        ) from exc


def generate_json(
    prompt: str,
    db: Session,
    feature: str,
    fallback_key: str,
    *,
    temperature: float = 0.7,
) -> dict | list:
    """Serves an exact-match response from storage without a live call, and falls
    back to the most recent stored response for (feature, fallback_key) if the
    live call is unavailable or fails, instead of erroring out."""
    cache_key = make_cache_key(settings.gemini_model, temperature, prompt)

    cached = get_exact(db, cache_key)
    if cached is not None:
        return json.loads(cached)

    if not settings.gemini_api_key:
        fallback = get_fallback(db, feature, fallback_key)
        if fallback is not None:
            return json.loads(fallback)
        raise GeminiUnavailableError("GEMINI_API_KEY is not configured")

    try:
        result = _call_gemini(prompt, temperature)
    except GeminiRequestError:
        fallback = get_fallback(db, feature, fallback_key)
        if fallback is not None:
            return json.loads(fallback)
        raise

    store(db, feature, cache_key, fallback_key, json.dumps(result))
    return result
