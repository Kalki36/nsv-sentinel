from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class StockSummary(BaseModel):
    symbol: str
    name: str
    exchange: str
    sector: str
    price: float
    change: float
    volume: str
    volatility: float
    rsi: float
    riskScore: float

class CandlePoint(BaseModel):
    label: str
    price: float
    ma: float
    volume: int
    volatility: float
    returns: float

class MarketDataSeriesResponse(BaseModel):
    stock: StockSummary
    series: List[CandlePoint]
    range: str

class DashboardOverviewResponse(BaseModel):
    market_status: str
    total_alerts: int
    security_status: str
    avg_risk_score: str
    ai_confidence: str
    featured_stock: StockSummary
    recent_alerts: List[dict]
