from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from app.core.database import Base

class SurveillanceAlert(Base):
    __tablename__ = "surveillance_alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_code = Column(String(32), unique=True, index=True, nullable=False)  # NSV-1042
    symbol = Column(String(32), index=True, nullable=False)
    activity_type = Column(String(128), nullable=False)  # Unusual Volume, Price Movement, Volatility Spike
    anomaly_score = Column(Float, nullable=False)  # 0.0 to 1.0
    risk_level = Column(String(32), nullable=False)  # High, Medium, Low
    status = Column(String(32), nullable=False)  # Alert, Review, Normal
    historical_volume = Column(String(32), nullable=False)
    current_volume = Column(String(32), nullable=False)
    deviation = Column(String(32), nullable=False)
    historical_volatility = Column(String(32), nullable=False)
    current_volatility = Column(String(32), nullable=False)
    assessment = Column(Text, nullable=False)
    detected_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
