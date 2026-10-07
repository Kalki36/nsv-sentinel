from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.schemas.decision import DecisionResponse
from app.services.decision_service import get_decision_for_symbol
from app.utils.validators import validate_symbol

router = APIRouter(prefix="/decisions", tags=["AI Decisions"])

@router.get("/{symbol}", response_model=DecisionResponse)
def get_ai_decision(symbol: str, current_user: dict = Depends(get_current_user)):
    """Returns AI decision-support recommendation, confidence score, and supporting factors."""
    valid_symbol = validate_symbol(symbol)
    return get_decision_for_symbol(valid_symbol)
