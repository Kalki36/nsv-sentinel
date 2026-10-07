from typing import List, Dict, Any
from app.ai.finbert import finbert

NEWS_ARTICLES = [
    {
        "id": "N-1",
        "symbol": "RELIANCE",
        "headline": "Reliance Industries posts strong quarterly retail segment growth",
        "source": "Economic Times",
        "timestamp": "09:12 AM",
        "summary": "The company's retail arm reported double-digit revenue growth, with analysts citing store expansion and improved footfall as key drivers."
    },
    {
        "id": "N-2",
        "symbol": "RELIANCE",
        "headline": "Analysts split on Reliance's near-term capex outlook",
        "source": "Mint",
        "timestamp": "08:40 AM",
        "summary": "Coverage notes diverging analyst views on planned capital expenditure, with no clear consensus on near-term earnings impact."
    },
    {
        "id": "N-3",
        "symbol": "ADANIENT",
        "headline": "Adani Enterprises shares slide amid regulatory scrutiny reports",
        "source": "Business Standard",
        "timestamp": "07:55 AM",
        "summary": "Reports of renewed regulatory scrutiny weighed on sentiment, with the stock among the session's largest decliners."
    },
    {
        "id": "N-4",
        "symbol": "TCS",
        "headline": "TCS wins multi-year digital transformation deal in Europe",
        "source": "Livemint",
        "timestamp": "07:20 AM",
        "summary": "The multi-year engagement adds to the company's European order book, reinforcing its position in enterprise digital services."
    },
    {
        "id": "N-5",
        "symbol": "INFY",
        "headline": "Infosys maintains full-year revenue guidance",
        "source": "Reuters",
        "timestamp": "06:58 AM",
        "summary": "Management reiterated prior guidance, citing steady demand offset by continued caution in discretionary tech spending."
    },
    {
        "id": "N-6",
        "symbol": "TATAMOTORS",
        "headline": "Tata Motors EV sales accelerate ahead of festive season",
        "source": "CNBC-TV18",
        "timestamp": "06:30 AM",
        "summary": "Early festive-season bookings for the company's electric vehicle lineup came in ahead of internal estimates."
    },
    {
        "id": "N-7",
        "symbol": "HDFCBANK",
        "headline": "HDFC Bank net interest margin steady in latest quarter",
        "source": "Financial Express",
        "timestamp": "06:05 AM",
        "summary": "Margins held broadly flat quarter-on-quarter, in line with analyst expectations amid a stable rate environment."
    }
]

def get_processed_news() -> List[Dict[str, Any]]:
    """Runs advanced FinBERT inference on news articles and attaches sentiment vectors + key drivers."""
    processed = []
    for item in NEWS_ARTICLES:
        res = finbert.analyze_financial_text(item["headline"], item["summary"])
        processed.append({
            **item,
            "sentiment": res["predicted_sentiment"],
            "confidence": res["confidence"],
            "positive_prob": res["positive_prob"],
            "neutral_prob": res["neutral_prob"],
            "negative_prob": res["negative_prob"],
            "drivers": res["drivers"]
        })
    return processed

def get_sentiment_for_symbol(symbol: str, range_str: str = "7D") -> Dict[str, Any]:
    articles = [a for a in get_processed_news() if a["symbol"] == symbol]
    
    total = len(articles) or 1
    pos_cnt = len([a for a in articles if a["sentiment"] == "Positive"])
    neu_cnt = len([a for a in articles if a["sentiment"] == "Neutral"])
    neg_cnt = len([a for a in articles if a["sentiment"] == "Negative"])
    
    if not articles:
        pos_pct, neu_pct, neg_pct = 72, 18, 10
    else:
        pos_pct = int((pos_cnt / total) * 100)
        neu_pct = int((neu_cnt / total) * 100)
        neg_pct = int((neg_cnt / total) * 100)
        
    points_map = {"24H": 12, "7D": 7, "30D": 30}
    points = points_map.get(range_str, 7)
    trend = []
    
    for i in range(points):
        label = f"{i*2}:00" if range_str == "24H" else f"D{i+1}"
        pos_v = max(10.0, min(90.0, pos_pct + (i * 2 - 5)))
        neg_v = max(5.0, min(50.0, neg_pct + (3 - i)))
        neu_v = max(0.0, 100.0 - pos_v - neg_v)
        trend.append({
            "label": label,
            "positive": round(pos_v, 1),
            "neutral": round(neu_v, 1),
            "negative": round(neg_v, 1)
        })

    return {
        "summary": {
            "positive": pos_pct,
            "neutral": neu_pct,
            "negative": neg_pct
        },
        "trend": trend,
        "articles": articles
    }
