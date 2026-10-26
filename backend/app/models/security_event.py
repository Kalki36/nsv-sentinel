from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from app.core.database import Base

class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, index=True)
    event_code = Column(String(32), unique=True, index=True, nullable=False)  # SEC-501
    event_name = Column(String(128), nullable=False)  # Data validation, API request, Malformed payload
    severity = Column(String(32), nullable=False)  # Normal, Low, Medium, High
    action_taken = Column(String(128), nullable=False)  # Passed, Allowed, Quarantined, Rejected
    status = Column(String(32), nullable=False)  # Verified, Contained
    ip_address = Column(String(64), nullable=True)
    user_agent = Column(String(256), nullable=True)
    event_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
