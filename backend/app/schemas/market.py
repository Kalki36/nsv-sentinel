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
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: Optional[float] = None
    feed_source: Optional[str] = "DHAN_HQ_API"
    integrity_hash: Optional[str] = None

class CandlePoint(BaseModel):
    label: str
    price: float
    ma: float
    volume: int
    volatility: float
    returns: float
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: Optional[float] = None
    ma50: Optional[float] = None
    upper_band: Optional[float] = None
    lower_band: Optional[float] = None
    is_up: Optional[bool] = None

class MarketSessionStatusSchema(BaseModel):
    status: str  # OPEN or CLOSED
    is_open: bool
    session: str
    ist_time: str
    trading_hours: str
    exchange: str
    message: str

class MarketDataSeriesResponse(BaseModel):
    stock: StockSummary
    series: List[CandlePoint]
    range: str
    source: Optional[str] = "DHAN_HQ_CHARTS_V2"
    market_status: Optional[MarketSessionStatusSchema] = None

class DashboardOverviewResponse(BaseModel):
    market_status: str
    total_alerts: int
    security_status: str
    avg_risk_score: str
    ai_confidence: str
    featured_stock: StockSummary
    recent_alerts: List[dict]
