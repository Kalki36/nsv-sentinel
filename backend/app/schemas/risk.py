from pydantic import BaseModel
from typing import List

class RiskBreakdownSchema(BaseModel):
    overall: float
    market: float
    volatility: float
    manipulation: float
    sentiment: float
    security: float

class RiskHistoryPoint(BaseModel):
    label: str
    risk: float

class RiskAnalysisResponse(BaseModel):
    breakdown: RiskBreakdownSchema
    history: List[RiskHistoryPoint]
