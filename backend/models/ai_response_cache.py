from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class AIResponseCache(Base):
    __tablename__ = "ai_response_cache"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    feature: Mapped[str] = mapped_column(String(50), nullable=False)
    cache_key: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    fallback_key: Mapped[str] = mapped_column(String(200), nullable=False)
    response_json: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None)
    )
