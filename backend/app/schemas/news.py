from pydantic import BaseModel
from typing import Optional, List

class NewsArticleSchema(BaseModel):
    id: str
    symbol: str
    headline: str
    source: str
    timestamp: str
    sentiment: str  # Positive, Neutral, Negative
    confidence: int  # 0 to 100
    summary: str
