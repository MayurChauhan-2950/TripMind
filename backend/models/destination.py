from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Destination(Base):
    __tablename__ = "destinations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    budget_level: Mapped[str] = mapped_column(String(20), nullable=False)
    best_season: Mapped[str] = mapped_column(String(100), nullable=False)
    family_friendly: Mapped[bool] = mapped_column(Boolean, default=True)
    adventure_score: Mapped[int] = mapped_column(Integer, default=0)
    food_score: Mapped[int] = mapped_column(Integer, default=0)
    shopping_score: Mapped[int] = mapped_column(Integer, default=0)
    nature_score: Mapped[int] = mapped_column(Integer, default=0)
    historical_score: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    image_url: Mapped[str] = mapped_column(String(300), nullable=False)
