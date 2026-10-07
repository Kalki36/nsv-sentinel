from fastapi import APIRouter, Depends, Query
from typing import List

from app.core.security import get_current_user
from app.schemas.market import StockSummary, MarketDataSeriesResponse
from app.schemas.fundamental import CompanyFundamentalSchema
from app.services.market_service import get_stocks_list, get_stock_by_symbol, get_stock_series
from app.services.fundamental_service import get_company_fundamentals
from app.utils.validators import validate_symbol, validate_range

router = APIRouter(prefix="/market", tags=["Market Data"])

@router.get("/stocks", response_model=List[StockSummary])
def list_stocks(current_user: dict = Depends(get_current_user)):
    """Returns list of monitored stock universe with latest quotes."""
    return get_stocks_list()

@router.get("/{symbol}", response_model=StockSummary)
def get_stock(symbol: str, current_user: dict = Depends(get_current_user)):
    """Returns quote metrics for a specific symbol."""
    valid_symbol = validate_symbol(symbol)
    return get_stock_by_symbol(valid_symbol)

@router.get("/{symbol}/history", response_model=MarketDataSeriesResponse)
def get_stock_history(
    symbol: str,
    range: str = Query("1D", description="Time period range (1D, 1W, 1M, 3M, 1Y)"),
    current_user: dict = Depends(get_current_user)
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
