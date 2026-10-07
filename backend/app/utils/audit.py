from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.models.security_event import SecurityEvent
from datetime import datetime, timezone
import uuid

def log_audit_event(
    db: Session,
    actor: str,
    event: str,
    module: str,
    status: str,
    ip_address: str = None,
    user_agent: str = None,
    metadata: dict = None
):
    """Creates a durable system audit log entry."""
    log_code = f"A-{uuid.uuid4().hex[:6].upper()}"
    log_entry = AuditLog(
        log_code=log_code,
        actor=actor,
        event=event,
        module=module,
        status=status,
        ip_address=ip_address,
        user_agent=user_agent,
        metadata_json=metadata,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(log_entry)
    db.commit()
    return log_entry

def record_security_event(
    db: Session,
    event_name: str,
    severity: str,
    action_taken: str,
    status_label: str,
    ip_address: str = None,
    user_agent: str = None
):
    """Records a security center event."""
    event_code = f"SEC-{uuid.uuid4().hex[:4].upper()}"
    sec_event = SecurityEvent(
        event_code=event_code,
        event_name=event_name,
        severity=severity,
        action_taken=action_taken,
        status=status_label,
        ip_address=ip_address,
        user_agent=user_agent,
        event_timestamp=datetime.now(timezone.utc)
    )
    db.add(sec_event)
    db.commit()
    return sec_event
