from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, JSON, DateTime
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    log_code = Column(String(32), unique=True, index=True, nullable=False)  # A-901
    actor = Column(String(128), nullable=False)  # System, analyst.n
    event = Column(String(256), nullable=False)  # Data received, Alert reviewed
    module = Column(String(64), nullable=False)  # Ingestion, Security, Analytics, AI Engine, Decision Engine, Auth
    status = Column(String(32), nullable=False)  # Success, Warning, Error
    ip_address = Column(String(64), nullable=True)
    user_agent = Column(String(256), nullable=True)
    metadata_json = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
