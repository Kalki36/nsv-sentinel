from fastapi import APIRouter, Depends, Query
from typing import List, Dict, Any

from app.core.security import get_current_user, get_optional_user
from app.schemas.market import StockSummary, MarketDataSeriesResponse
from app.schemas.fundamental import CompanyFundamentalSchema
from app.services.market_service import get_stocks_list, get_stock_by_symbol, get_stock_series
from app.services.fundamental_service import get_company_fundamentals
from app.services.dhan_service import dhan_provider
from app.utils.validators import validate_symbol, validate_range

router = APIRouter(prefix="/market", tags=["Market Data"])

@router.get("/status")
def get_market_status():
    """Returns dynamic Indian market status (OPEN or CLOSED) with trading hours and IST timestamp."""
    from app.services.market_service import get_market_session_status
    return get_market_session_status()

@router.get("/live-feed/dhan")
def get_dhan_live_status(current_user: dict = Depends(get_optional_user)) -> Dict[str, Any]:
    """Returns real-time Dhan HQ API connection health and streaming quotes."""
    live_quotes = dhan_provider.fetch_all_live_ltp()
    return {
        "status": "connected" if live_quotes else "idle",
        "configured": dhan_provider.is_configured(),
        "client_id": dhan_provider.client_id,
        "instruments_tracked": len(live_quotes),
        "live_ltp": live_quotes,
        "source": "DHAN_HQ_API_V2"
    }

@router.get("/stocks", response_model=List[StockSummary])
def list_stocks(current_user: dict = Depends(get_optional_user)):
    """Returns list of monitored stock universe with latest quotes."""
    return get_stocks_list()

@router.get("/{symbol}", response_model=StockSummary)
def get_stock(symbol: str, current_user: dict = Depends(get_optional_user)):
    """Returns quote metrics for a specific symbol."""
    valid_symbol = validate_symbol(symbol)
    return get_stock_by_symbol(valid_symbol)

@router.get("/{symbol}/history", response_model=MarketDataSeriesResponse)
def get_stock_history(
    symbol: str,
    range: str = Query("1D", description="Time period range (1D, 1W, 1M, 3M, 1Y)"),
    current_user: dict = Depends(get_optional_user)
):
    """Returns validated OHLCV time series data for technical analysis charts."""
    valid_symbol = validate_symbol(symbol)
    valid_range = validate_range(range)
    return get_stock_series(valid_symbol, valid_range)

@router.get("/{symbol}/fundamentals", response_model=CompanyFundamentalSchema)
def get_fundamentals(symbol: str, current_user: dict = Depends(get_current_user)):
    """Returns 7 core company fundamental metrics & hemispherical health score."""
    valid_symbol = validate_symbol(symbol)
    return get_company_fundamentals(valid_symbol)
