from fastapi import APIRouter, Depends, Query, Header
from typing import List, Optional

from app.core.security import get_current_user
from app.schemas.news import NewsArticleSchema
from app.schemas.sentiment import SentimentResponse
from app.services.sentiment_service import get_processed_news, get_sentiment_for_symbol
from app.utils.validators import validate_symbol, validate_range

router = APIRouter(prefix="/sentiment", tags=["Sentiment Intelligence"])

@router.get("/news", response_model=List[NewsArticleSchema])
def get_news_feed(
    symbol: Optional[str] = Query(None, description="Optional stock symbol filter"),
    api_key: Optional[str] = Query(None, description="Optional NewsAPI key override"),
    x_news_api_key: Optional[str] = Header(None, alias="X-News-Api-Key"),
    current_user: dict = Depends(get_current_user)
):
    """Returns financial news feed with live NewsAPI or curated feeds and FinBERT sentiment classifications."""
    effective_key = api_key or x_news_api_key
    valid_symbol = validate_symbol(symbol, strict=False) if symbol else None
    return get_processed_news(symbol=valid_symbol, api_key=effective_key)

@router.get("/{symbol}", response_model=SentimentResponse)
def get_sentiment(
    symbol: str,
    range: str = Query("7D", description="Time window range (24H, 7D, 30D)"),
    api_key: Optional[str] = Query(None, description="Optional NewsAPI key override"),
    x_news_api_key: Optional[str] = Header(None, alias="X-News-Api-Key"),
    current_user: dict = Depends(get_current_user)
):
    """Returns FinBERT sentiment analysis summary, historical sentiment trend, and associated news articles."""
    valid_symbol = validate_symbol(symbol, strict=False)
    valid_range = validate_range(range)
    effective_key = api_key or x_news_api_key
    return get_sentiment_for_symbol(valid_symbol, valid_range, api_key=effective_key)
