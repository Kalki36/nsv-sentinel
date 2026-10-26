from pydantic import BaseModel
from typing import List, Optional, Dict

class DecisionFactorSchema(BaseModel):
    label: str
    value: float
    tone: str  # buy, sell, neutral

class PredictionWeightsSchema(BaseModel):
    pairs_trading_weight: float = 0.35
    sentiment_analysis_weight: float = 0.35
    market_sentiment_weight: float = 0.30

class PredictionTrajectoryPoint(BaseModel):
    day: str
    predicted_price: float
    confidence_upper: float
    confidence_lower: float

class StockPredictionSchema(BaseModel):
    symbol: str
    current_price: float
    predicted_target_price: float
    predicted_return_pct: float
    recommendation: str  # STRONG BUY, BUY, HOLD, SELL, STRONG SELL
    confidence_score: int
    composite_score: float  # -100 to +100
    weights: PredictionWeightsSchema
    component_scores: Dict[str, float]
    formula: str
    timeframe: str
    trajectory: List[PredictionTrajectoryPoint]

class DecisionResponse(BaseModel):
    recommendation: str  # BUY, SELL, HOLD
    confidence: int  # 0 to 100
    factors: List[DecisionFactorSchema]
    summary: str
    prediction: Optional[StockPredictionSchema] = None

class ExplainabilityResponse(BaseModel):
    recommendation: str
    confidence: int
    positiveFactors: List[DecisionFactorSchema]
    negativeFactors: List[DecisionFactorSchema]
    explanation: str
    prediction: Optional[StockPredictionSchema] = None
