import math
from typing import Dict, Any
from app.services.market_service import get_stock_by_symbol
from app.services.sentiment_service import get_sentiment_for_symbol
from app.services.surveillance_service import get_surveillance_feed

def calculate_composite_risk_for_symbol(symbol: str) -> Dict[str, Any]:
    stock = get_stock_by_symbol(symbol)
    sentiment_data = get_sentiment_for_symbol(symbol)
    surveillance_data = get_surveillance_feed(symbol_filter=symbol)

    volatility = stock.get("volatility", 15.0)
    sentiment_neg = sentiment_data["summary"]["negative"]
    has_alert = any(a["risk"] in ("High", "Medium") for a in surveillance_data["alerts"])
    alert_severity = "High" if any(a["risk"] == "High" for a in surveillance_data["alerts"]) else ("Medium" if has_alert else "Low")

    # 1. Market Risk
    market_risk = min(95.0, max(15.0, abs(stock.get("change", 0.0)) * 12.0 + 30.0))

    # 2. Volatility Risk
    volatility_risk = min(98.0, max(10.0, volatility * 2.2))

    # 3. Surveillance Anomaly Risk
    manipulation_risk = 82.0 if alert_severity == "High" else (48.0 if alert_severity == "Medium" else 12.0)

    # 4. Sentiment Risk
    sentiment_risk = min(90.0, max(10.0, sentiment_neg * 1.6 + 15.0))

    # 5. Security & Integrity Risk
    security_risk = 18.0 if symbol in ("RELIANCE", "ADANIENT") else 8.0

    # Composite formula
    overall = (0.25 * market_risk) + (0.25 * volatility_risk) + (0.20 * manipulation_risk) + (0.15 * sentiment_risk) + (0.15 * security_risk)
    overall_score = round(min(100.0, max(0.0, overall)), 1)

    breakdown = {
        "overall": overall_score,
        "market": round(market_risk, 1),
        "volatility": round(volatility_risk, 1),
        "manipulation": round(manipulation_risk, 1),
        "sentiment": round(sentiment_risk, 1),
        "security": round(security_risk, 1),
    }

    # Generate 14-Day Trajectory
    history = []
    for i in range(14):
        label = f"D-{14 - i}"
        val = max(10.0, min(95.0, overall_score + (math.sin(i * 0.6 + len(symbol)) * 9.0)))
        history.append({"label": label, "risk": round(val)})

    return {
        "breakdown": breakdown,
        "history": history
    }

get_risk_analysis_for_symbol = calculate_composite_risk_for_symbol
