from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    article_code = Column(String(32), unique=True, index=True, nullable=False)
    symbol = Column(String(32), index=True, nullable=False)
    headline = Column(String(512), nullable=False)
    summary = Column(Text, nullable=False)
    source = Column(String(128), nullable=False)
    url = Column(String(512), nullable=True)
    published_at = Column(DateTime, nullable=False)
    content_hash = Column(String(64), nullable=False)
    ingested_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
