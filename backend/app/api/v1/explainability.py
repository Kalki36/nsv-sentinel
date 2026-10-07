from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.schemas.decision import ExplainabilityResponse
from app.services.decision_service import get_explainability_for_symbol
from app.utils.validators import validate_symbol

router = APIRouter(prefix="/explainability", tags=["AI Explainability"])

@router.get("/{symbol}", response_model=ExplainabilityResponse)
def get_explainability(symbol: str, current_user: dict = Depends(get_current_user)):
    """Returns feature-contribution directional drivers explaining the recommendation model's output."""
    valid_symbol = validate_symbol(symbol)
    return get_explainability_for_symbol(valid_symbol)
