from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Index
from app.core.database import Base

class MarketData(Base):
    __tablename__ = "market_data"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(32), index=True, nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    open = Column(Float, nullable=False)
    high = Column(Float, nullable=False)
    low = Column(Float, nullable=False)
    close = Column(Float, nullable=False)
    volume = Column(Float, nullable=False)
    volatility = Column(Float, nullable=False)
    returns = Column(Float, nullable=False, default=0.0)
    rsi = Column(Float, nullable=False, default=50.0)
    source = Column(String(64), nullable=False, default="NSE_SIM")
    integrity_hash = Column(String(64), nullable=False)
    ingested_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        Index("idx_market_symbol_timestamp", "symbol", "timestamp"),
    )
