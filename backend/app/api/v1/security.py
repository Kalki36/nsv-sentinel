from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from app.core.security import get_current_user
from app.schemas.security import SecurityStatusResponse, SecurityEventSchema
from app.services.security_service import get_security_status_overview, get_security_events_list

router = APIRouter(prefix="/security", tags=["Security Center"])

@router.get("/status", response_model=SecurityStatusResponse)
def get_security_status(
    mode: Optional[str] = Query("secure", description="Security mode simulation (secure, unsecure)"),
    current_user: dict = Depends(get_current_user)
):
    """Returns status of backend security validation layers and security factor explanations."""
    return get_security_status_overview(mode=mode)

@router.get("/events", response_model=List[SecurityEventSchema])
def get_security_events(current_user: dict = Depends(get_current_user)):
    """Returns log of security events (rejected malformed payloads, rate limits, signature checks)."""
    return get_security_events_list()
