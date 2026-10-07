from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class SentimentResult(Base):
    __tablename__ = "sentiment_results"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("news_articles.id"), nullable=False)
    symbol = Column(String(32), index=True, nullable=False)
    positive_prob = Column(Float, nullable=False)
    neutral_prob = Column(Float, nullable=False)
    negative_prob = Column(Float, nullable=False)
    predicted_sentiment = Column(String(32), nullable=False)  # Positive, Neutral, Negative
    confidence = Column(Float, nullable=False)  # 0 to 100
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    article = relationship("NewsArticle", backref="sentiment_result")
