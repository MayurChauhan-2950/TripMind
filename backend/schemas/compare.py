from pydantic import BaseModel

from schemas.destination import DestinationOut


class CompareRequest(BaseModel):
    destination_a: str
    destination_b: str


class ComparisonRow(BaseModel):
    metric: str
    value_a: str
    value_b: str


class CompareOut(BaseModel):
    destination_a: DestinationOut
    destination_b: DestinationOut
    comparison_table: list[ComparisonRow]
    ai_summary: str | None = None
