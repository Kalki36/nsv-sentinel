from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base

class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(32), index=True, nullable=False)
    overall_score = Column(Float, nullable=False)  # 0 to 100
    market_risk = Column(Float, nullable=False)
    volatility_risk = Column(Float, nullable=False)
    manipulation_risk = Column(Float, nullable=False)
    sentiment_risk = Column(Float, nullable=False)
    security_risk = Column(Float, nullable=False)
    risk_level = Column(String(32), nullable=False)  # HIGH, MODERATE, LOW
    calculated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
