from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class BudgetRate(Base):
    __tablename__ = "budget_rates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tier: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    hotel_per_day: Mapped[int] = mapped_column(Integer, nullable=False)
    food_per_day: Mapped[int] = mapped_column(Integer, nullable=False)
    transport_per_day: Mapped[int] = mapped_column(Integer, nullable=False)
    activities_per_day: Mapped[int] = mapped_column(Integer, nullable=False)
