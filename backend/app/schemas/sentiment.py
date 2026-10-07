from pydantic import BaseModel
from typing import List
from app.schemas.news import NewsArticleSchema

class SentimentSummary(BaseModel):
    positive: int
    neutral: int
    negative: int

class SentimentTrendPoint(BaseModel):
    label: str
    positive: float
    neutral: float
    negative: float

class SentimentResponse(BaseModel):
    summary: SentimentSummary
    trend: List[SentimentTrendPoint]
    articles: List[NewsArticleSchema]
