import hashlib
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from models import AIResponseCache


def make_cache_key(model: str, temperature: float, prompt: str) -> str:
    return hashlib.sha256(f"{model}:{temperature}:{prompt}".encode("utf-8")).hexdigest()


def get_exact(db: Session, cache_key: str) -> str | None:
    row = db.query(AIResponseCache).filter(AIResponseCache.cache_key == cache_key).first()
    return row.response_json if row else None


def get_fallback(db: Session, feature: str, fallback_key: str) -> str | None:
    row = (
        db.query(AIResponseCache)
        .filter(AIResponseCache.feature == feature, AIResponseCache.fallback_key == fallback_key)
        .order_by(AIResponseCache.created_at.desc())
        .first()
    )
    return row.response_json if row else None


def store(db: Session, feature: str, cache_key: str, fallback_key: str, response_json: str) -> None:
    existing = db.query(AIResponseCache).filter(AIResponseCache.cache_key == cache_key).first()
    if existing:
        existing.response_json = response_json
        existing.created_at = datetime.now(timezone.utc).replace(tzinfo=None)
    else:
        db.add(
            AIResponseCache(
                feature=feature,
                cache_key=cache_key,
                fallback_key=fallback_key,
                response_json=response_json,
            )
        )
    db.commit()
