from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.schemas.risk import RiskAnalysisResponse
from app.services.risk_service import calculate_composite_risk_for_symbol
from app.utils.validators import validate_symbol

router = APIRouter(prefix="/risk", tags=["Risk Analysis"])

@router.get("/{symbol}", response_model=RiskAnalysisResponse)
def get_risk_analysis(symbol: str, current_user: dict = Depends(get_current_user)):
    """Returns dynamic composite risk score breakdown and 14-day historical trajectory."""
    valid_symbol = validate_symbol(symbol)
    return calculate_composite_risk_for_symbol(valid_symbol)
