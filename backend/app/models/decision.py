from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime
from app.core.database import Base

class AIDecision(Base):
    __tablename__ = "ai_decisions"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(32), index=True, nullable=False)
    recommendation = Column(String(32), nullable=False)  # BUY, SELL, HOLD
    confidence = Column(Float, nullable=False)  # 0 to 100
    summary = Column(Text, nullable=False)
    factor_contributions_json = Column(JSON, nullable=False)  # list of {label, value, tone}
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
