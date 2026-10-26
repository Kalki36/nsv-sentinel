from fastapi import APIRouter, Depends, Query, HTTPException, status
from typing import Optional

from app.core.security import get_current_user
from app.schemas.surveillance import SurveillanceResponse, SurveillanceAlertSchema, AlertSummarySchema
from app.services.surveillance_service import get_surveillance_feed, get_alert_by_id

router = APIRouter(prefix="/surveillance", tags=["Market Surveillance"])

@router.get("/alerts", response_model=SurveillanceResponse)
def get_alerts(
    severity: Optional[str] = Query(None, description="Optional severity filter (High, Medium, Low, All)"),
    symbol: Optional[str] = Query(None, description="Optional stock symbol filter"),
    current_user: dict = Depends(get_current_user)
):
    """Returns AI-driven market surveillance anomaly alerts."""
    feed = get_surveillance_feed(severity_filter=severity, symbol_filter=symbol)
    return feed

@router.get("/alerts/{alert_id}", response_model=SurveillanceAlertSchema)
def get_alert_details(alert_id: str, current_user: dict = Depends(get_current_user)):
    """Returns detailed assessment metrics for a specific surveillance alert."""
    alert = get_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Alert '{alert_id}' not found")
    return alert

@router.get("/summary", response_model=AlertSummarySchema)
def get_surveillance_summary(current_user: dict = Depends(get_current_user)):
    """Returns summary counters for surveillance alerts by severity level."""
    feed = get_surveillance_feed()
    return feed["summary"]
