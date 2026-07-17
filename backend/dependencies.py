from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from models import User
from services.auth import decode_access_token


def _extract_token(request: Request) -> str | None:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    return auth_header.removeprefix("Bearer ").strip()


def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    token = _extract_token(request)
    user_id = decode_access_token(token) if token else None
    if user_id is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


def get_current_user_optional(request: Request, db: Session = Depends(get_db)) -> User | None:
    token = _extract_token(request)
    if not token:
        return None
    user_id = decode_access_token(token)
    if user_id is None:
        return None
    return db.query(User).filter(User.id == user_id).first()


def user_hobbies(user: User | None) -> list[str] | None:
    if not user or not user.hobbies:
        return None
    return [h.strip() for h in user.hobbies.split(",") if h.strip()]
