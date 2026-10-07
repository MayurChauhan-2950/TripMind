from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from models import RefreshToken, User
from schemas.auth import (
    AccessTokenOut,
    LoginRequest,
    LogoutRequest,
    ProfileUpdateRequest,
    RefreshRequest,
    SignupRequest,
    TokenOut,
    UserOut,
)
from services.auth import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    refresh_token_expiry,
    utcnow_naive,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_tokens(user_id: int, db: Session) -> TokenOut:
    raw_refresh_token = generate_refresh_token()
    db.add(
        RefreshToken(
            user_id=user_id,
            token_hash=hash_refresh_token(raw_refresh_token),
            expires_at=refresh_token_expiry(),
        )
    )
    db.commit()
    return TokenOut(access_token=create_access_token(user_id), refresh_token=raw_refresh_token)


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

    return _issue_tokens(user.id, db)


@router.post("/login", response_model=TokenOut)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return _issue_tokens(user.id, db)


@router.post("/refresh", response_model=AccessTokenOut)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    token_hash = hash_refresh_token(payload.refresh_token)
    stored = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()

    if stored is None or stored.revoked or stored.expires_at < utcnow_naive():
        raise HTTPException(status_code=401, detail="Refresh token is invalid or expired")

    return AccessTokenOut(access_token=create_access_token(stored.user_id))


@router.post("/logout", status_code=204)
def logout(payload: LogoutRequest, db: Session = Depends(get_db)):
    token_hash = hash_refresh_token(payload.refresh_token)
    stored = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
    if stored is not None:
        stored.revoked = True
        db.commit()


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
