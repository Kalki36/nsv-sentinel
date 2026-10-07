from pydantic import BaseModel
from typing import List, Optional

class DecisionFactorSchema(BaseModel):
    label: str
    value: float
    tone: str  # buy, sell, neutral

class DecisionResponse(BaseModel):
    recommendation: str  # BUY, SELL, HOLD
    confidence: int  # 0 to 100
    factors: List[DecisionFactorSchema]
    summary: str

class ExplainabilityResponse(BaseModel):
    recommendation: str
    confidence: int
    positiveFactors: List[DecisionFactorSchema]
    negativeFactors: List[DecisionFactorSchema]
    explanation: str
