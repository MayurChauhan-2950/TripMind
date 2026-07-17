from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import User
from schemas.auth import LoginRequest, ProfileUpdateRequest, SignupRequest, TokenOut, UserOut
from services.auth import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


def _to_user_out(user: User) -> UserOut:
    hobbies = [h.strip() for h in (user.hobbies or "").split(",") if h.strip()]
    return UserOut(
        id=user.id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hobbies=hobbies,
        home_city=user.home_city,
        bio=user.bio,
        created_at=user.created_at,
    )


@router.post("/signup", response_model=TokenOut)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = (
        db.query(User)
        .filter((User.email == payload.email) | (User.username == payload.username))
        .first()
    )
    if existing is not None:
        raise HTTPException(status_code=409, detail="Email or username already registered")

    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenOut(access_token=create_access_token(user.id))


@router.post("/login", response_model=TokenOut)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return TokenOut(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return _to_user_out(current_user)


@router.put("/me", response_model=UserOut)
def update_me(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.full_name = payload.full_name
    current_user.hobbies = ", ".join(payload.hobbies)
    current_user.home_city = payload.home_city
    current_user.bio = payload.bio
    db.commit()
    db.refresh(current_user)
    return _to_user_out(current_user)
