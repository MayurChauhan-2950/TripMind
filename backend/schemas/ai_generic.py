from pydantic import BaseModel, Field

from schemas.destination import Season


class AIGenericRequest(BaseModel):
    destination: str
    season: Season | None = None
    days: int | None = Field(default=None, gt=0)


class HiddenGem(BaseModel):
    name: str
    reason: str


class HiddenGemsOut(BaseModel):
    destination: str
    gems: list[HiddenGem]


class PackingListOut(BaseModel):
    destination: str
    items: list[str]
