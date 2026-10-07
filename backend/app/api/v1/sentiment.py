from fastapi import APIRouter, Depends, Query
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
    current_user: dict = Depends(get_current_user)
):
    """Returns financial news feed with persisted FinBERT sentiment classifications."""
    all_news = get_processed_news()
    if symbol:
        valid_symbol = validate_symbol(symbol)
        return [n for n in all_news if n["symbol"] == valid_symbol]
    return all_news

@router.get("/{symbol}", response_model=SentimentResponse)
def get_sentiment(
    symbol: str,
    range: str = Query("7D", description="Time window range (24H, 7D, 30D)"),
    current_user: dict = Depends(get_current_user)
):
    """Returns FinBERT sentiment analysis summary, historical sentiment trend, and associated articles."""
    valid_symbol = validate_symbol(symbol)
    valid_range = validate_range(range)
    return get_sentiment_for_symbol(valid_symbol, valid_range)
