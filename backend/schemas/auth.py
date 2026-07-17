from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=100)
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    username: str
    full_name: str | None
    hobbies: list[str]
    home_city: str | None
    bio: str | None
    created_at: datetime


class ProfileUpdateRequest(BaseModel):
    full_name: str | None = None
    hobbies: list[str] = Field(default_factory=list)
    home_city: str | None = None
    bio: str | None = None
