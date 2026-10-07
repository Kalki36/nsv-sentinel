from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from app.core.security import get_current_user
from app.schemas.security import AuditLogSchema
from app.services.security_service import get_system_audit_logs

router = APIRouter(prefix="/audit-logs", tags=["Audit Trail"])

@router.get("", response_model=List[AuditLogSchema])
def get_audit_logs(
    module: Optional[str] = Query(None, description="Optional module filter"),
    status: Optional[str] = Query(None, description="Optional status filter (Success, Warning, Error)"),
    current_user: dict = Depends(get_current_user)
):
    """Returns chronological immutable audit log trail."""
    logs = get_system_audit_logs()
    if module and module != "All":
        logs = [l for l in logs if l["module"] == module]
    if status and status != "All":
        logs = [l for l in logs if l["status"] == status]
    return logs
