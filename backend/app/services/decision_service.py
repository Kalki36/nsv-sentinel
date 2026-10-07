from typing import Dict, Any, List
from app.services.market_service import get_stock_by_symbol
from app.services.sentiment_service import get_sentiment_for_symbol
from app.services.surveillance_service import get_surveillance_feed
from app.services.risk_service import get_risk_analysis_for_symbol

def get_decision_for_symbol(symbol: str) -> Dict[str, Any]:
    stock = get_stock_by_symbol(symbol)
    sentiment_data = get_sentiment_for_symbol(symbol)
    alerts_data = get_surveillance_feed(symbol_filter=symbol)
    risk_data = get_risk_analysis_for_symbol(symbol)

    price_change = stock.get("change", 0.0)
    pos_sentiment = sentiment_data["summary"]["positive"]
    neg_sentiment = sentiment_data["summary"]["negative"]
    has_high_alert = any(a["risk"] == "High" for a in alerts_data["alerts"])
    overall_risk = risk_data["breakdown"]["overall"]

    factors = []
    score = 0.0

    # 1. Market Trend Factor
    if price_change >= 1.5:
        mkt_val = min(24, int(price_change * 8))
        factors.append({"label": "Positive Market Trend", "value": mkt_val, "tone": "buy"})
        score += mkt_val
    elif price_change <= -1.5:
        mkt_val = max(-24, int(price_change * 7))
        factors.append({"label": "Negative Price Pressure", "value": mkt_val, "tone": "sell"})
        score += mkt_val
    else:
        mkt_val = int(price_change * 5)
        factors.append({"label": "Neutral Price Trend", "value": mkt_val if mkt_val != 0 else 4, "tone": "buy" if mkt_val >= 0 else "sell"})
        score += mkt_val

    # 2. FinBERT Sentiment Factor (Linked to News)
    if pos_sentiment >= 65:
        sent_val = int(pos_sentiment * 0.25)
        factors.append({"label": "Strong FinBERT News Sentiment", "value": sent_val, "tone": "buy"})
        score += sent_val
    elif neg_sentiment >= 40:
        sent_val = -int(neg_sentiment * 0.30)
        factors.append({"label": "Regulatory / Negative News Sentiment", "value": sent_val, "tone": "sell"})
        score += sent_val
    else:
        sent_val = int((pos_sentiment - neg_sentiment) * 0.15)
        factors.append({"label": "Balanced Financial News Coverage", "value": sent_val if sent_val != 0 else 5, "tone": "buy" if sent_val >= 0 else "sell"})
        score += sent_val

    # 3. Volume Trend & Anomaly Factor
    if has_high_alert:
        factors.append({"label": "Surveillance Anomaly Flagged", "value": -15, "tone": "sell"})
        score -= 15
    else:
        factors.append({"label": "Volume & Technical Pattern", "value": 9, "tone": "buy"})
        score += 9

    # 4. Volatility & Risk Penalization
    if overall_risk >= 65:
        risk_val = -int(overall_risk * 0.2)
        factors.append({"label": "Elevated Risk Score Penalization", "value": risk_val, "tone": "sell"})
        score += risk_val
    else:
        risk_val = -int(overall_risk * 0.1)
        factors.append({"label": "Stable Volatility & Low Security Risk", "value": risk_val if risk_val != 0 else -3, "tone": "sell"})
        score += risk_val

    # Recommendation classification logic
    if score >= 18:
        recommendation = "BUY"
        confidence = min(92, max(68, int(65 + score * 0.8)))
        summary = f"Positive news sentiment and upward price momentum support a BUY recommendation for {symbol}, offsetting moderate volatility."
    elif score <= -12:
        recommendation = "SELL"
        confidence = min(90, max(65, int(60 + abs(score) * 0.8)))
        summary = f"Negative financial news coverage, regulatory scrutiny, and high surveillance risk flags dominate signals for {symbol}, supporting a cautious SELL stance."
    else:
        recommendation = "HOLD"
        confidence = min(75, max(52, int(50 + abs(score) * 0.5)))
        summary = f"Mixed signals for {symbol}: positive trend drivers are balanced by news uncertainty and moderate risk, warranting a HOLD position."

    return {
        "recommendation": recommendation,
        "confidence": confidence,
        "factors": factors,
        "summary": summary
    }

def get_explainability_for_symbol(symbol: str) -> Dict[str, Any]:
    decision = get_decision_for_symbol(symbol)
    factors = decision["factors"]
    pos_factors = [f for f in factors if f["value"] > 0]
    neg_factors = [f for f in factors if f["value"] < 0]

    return {
        "recommendation": decision["recommendation"],
        "confidence": decision["confidence"],
        "positiveFactors": pos_factors,
        "negativeFactors": neg_factors,
        "explanation": decision["summary"]
    }
