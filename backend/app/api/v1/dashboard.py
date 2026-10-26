from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.schemas.market import DashboardOverviewResponse
from app.services.market_service import get_stock_by_symbol

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview(current_user: dict = Depends(get_current_user)):
    """Aggregates system-wide intelligence metrics for the main Overview dashboard."""
    featured_stock = get_stock_by_symbol("RELIANCE")
    
    mock_recent_alerts = [
        {
            "id": "NSV-1042",
            "symbol": "RELIANCE",
            "activity": "Unusual Volume",
            "anomalyScore": 0.91,
            "risk": "High",
            "status": "Alert",
            "detectedAt": "10:41:58",
            "detail": {
                "type": "Unusual Trading Activity",
                "historicalVolume": "1.2M",
                "currentVolume": "5.8M",
                "deviation": "+383%",
                "historicalVolatility": "14%",
                "currentVolatility": "29%",
                "manipulationRisk": "High",
                "assessment": "Potential suspicious activity detected. Volume and volatility deviate sharply from baseline."
            }
        },
        {
            "id": "NSV-1029",
            "symbol": "ADANIENT",
            "activity": "Volatility Spike",
            "anomalyScore": 0.88,
            "risk": "High",
            "status": "Alert",
            "detectedAt": "09:41:03",
            "detail": {
                "type": "Volatility Spike",
                "historicalVolume": "7.1M",
                "currentVolume": "11.6M",
                "deviation": "+63%",
                "historicalVolatility": "19%",
                "currentVolatility": "35%",
                "manipulationRisk": "High",
                "assessment": "Volatility has more than doubled against the trailing baseline."
            }
        }
    ]

    return DashboardOverviewResponse(
        market_status="ACTIVE",
        total_alerts=7,
        security_status="SECURE",
        avg_risk_score="62 / 100",
        ai_confidence="87%",
        featured_stock=featured_stock,
        recent_alerts=mock_recent_alerts
    )
