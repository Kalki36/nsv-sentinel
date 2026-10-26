import math
from typing import Dict, Any, List, Optional

from app.services.market_service import get_stock_by_symbol, get_stocks_list
from app.services.sentiment_service import get_sentiment_for_symbol
from app.services.surveillance_service import get_surveillance_feed
from app.services.risk_service import get_risk_analysis_for_symbol
from app.schemas.pairs_trading import PairsTradingConfigSchema
from app.services.pairs_trading_service import execute_pairs_trading_analysis

def calculate_stock_prediction(symbol: str) -> Dict[str, Any]:
    """Calculates future price and directional prediction using the multi-factor weighted formula:
    Composite Score = 0.35 * S_pairs + 0.35 * S_sentiment + 0.30 * S_market
    """
    stock = get_stock_by_symbol(symbol)
    sentiment_data = get_sentiment_for_symbol(symbol)
    
    current_price = float(stock.get("price", 1000.0))
    volatility = float(stock.get("volatility", 15.0))
    rsi = float(stock.get("rsi", 55.0))
    price_change = float(stock.get("change", 0.0))

    # ---- Factor 1: Pairs Trading Statistical Arbitrage Signal (Weight: 35%) ----
    # Evaluate mean-reversion pressure from spread Z-score
    try:
        if symbol in ("BANKNIFTY", "NIFTY50"):
            pairs_analysis = execute_pairs_trading_analysis(PairsTradingConfigSchema())
            zscore = float(pairs_analysis.get("current_zscore", -1.45))
            if symbol == "NIFTY50":
                # Nifty is the short leg when BankNifty spread is low
                zscore = -zscore
        else:
            # Equities relative ratio vs benchmark index Z-score
            all_stocks = get_stocks_list()
            nifty_meta = next((s for s in all_stocks if s["symbol"] == "NIFTY50"), None)
            nifty_price = float(nifty_meta["price"]) if nifty_meta else 22500.0
            ratio = current_price / (nifty_price or 1.0)
            base_ratio = float(stock.get("base_price", current_price)) / (float(nifty_meta.get("base_price", nifty_price)) if nifty_meta else 22500.0)
            deviation = (ratio - base_ratio) / (base_ratio * 0.04 or 1.0)
            zscore = round(max(-3.0, min(3.0, deviation)), 2)
    except Exception:
        zscore = -0.5

    # Mean-reversion signal: negative Z-score means spread is undervalued -> positive expected drift
    # Bounded in [-100, +100]
    s_pairs = round(-math.tanh(zscore / 1.5) * 100.0, 1)

    # ---- Factor 2: FinBERT News Sentiment Signal (Weight: 35%) ----
    pos_pct = sentiment_data["summary"]["positive"]
    neg_pct = sentiment_data["summary"]["negative"]
    
    # Average confidence from classified articles
    articles = sentiment_data.get("articles", [])
    avg_conf = (
        sum(a.get("confidence", 70) for a in articles) / len(articles)
        if articles else 75.0
    )
    # Net sentiment scaled by NLP confidence: [-100, +100]
    s_sentiment = round(((pos_pct - neg_pct) * (avg_conf / 100.0)), 1)
    s_sentiment = max(-100.0, min(100.0, s_sentiment))

    # ---- Factor 3: Market Sentiment & Technical Momentum Signal (Weight: 30%) ----
    # Moving average distance
    ma_approx = current_price * (1.0 - (price_change * 0.003))
    delta_ma = ((current_price - ma_approx) / (ma_approx or 1.0)) * 100.0
    rsi_norm = (rsi - 50.0) * 2.0  # [-100, +100]
    s_market = round(max(-100.0, min(100.0, (0.55 * delta_ma * 8.0) + (0.45 * rsi_norm))), 1)

    # ---- Composite Multi-Factor Prediction Formula ----
    w_pairs = 0.35
    w_sentiment = 0.35
    w_market = 0.30
    
    composite_score = round(
        (w_pairs * s_pairs) + (w_sentiment * s_sentiment) + (w_market * s_market),
        1
    )

    # Forward 7-Day return forecast
    vol_scale = max(0.5, min(2.5, volatility / 15.0))
    predicted_return_pct = round((composite_score / 100.0) * vol_scale * 3.2, 2)
    predicted_target_price = round(current_price * (1.0 + (predicted_return_pct / 100.0)), 2)

    # Categorical recommendation
    if composite_score >= 40.0:
        recommendation = "STRONG BUY"
    elif composite_score >= 15.0:
        recommendation = "BUY"
    elif composite_score <= -40.0:
        recommendation = "STRONG SELL"
    elif composite_score <= -15.0:
        recommendation = "SELL"
    else:
        recommendation = "HOLD"

    confidence_score = int(round(min(95.0, max(52.0, 56.0 + abs(composite_score) * 0.40))))

    # Multi-day forward trajectory points (Day +1 to Day +7)
    trajectory: List[Dict[str, Any]] = []
    for day in range(1, 8):
        progress = math.sqrt(day / 7.0)
        proj_p = round(current_price + (predicted_target_price - current_price) * progress, 2)
        band = round(proj_p * (0.006 * math.sqrt(day) * vol_scale), 2)
        trajectory.append({
            "day": f"D+{day}",
            "predicted_price": proj_p,
            "confidence_upper": round(proj_p + band, 2),
            "confidence_lower": round(proj_p - band, 2)
        })

    return {
        "symbol": symbol,
        "current_price": current_price,
        "predicted_target_price": predicted_target_price,
        "predicted_return_pct": predicted_return_pct,
        "recommendation": recommendation,
        "confidence_score": confidence_score,
        "composite_score": composite_score,
        "weights": {
            "pairs_trading_weight": w_pairs,
            "sentiment_analysis_weight": w_sentiment,
            "market_sentiment_weight": w_market
        },
        "component_scores": {
            "pairs_trading": s_pairs,
            "sentiment_analysis": s_sentiment,
            "market_sentiment": s_market
        },
        "formula": "Composite Index = (0.35 * S_pairs) + (0.35 * S_finbert) + (0.30 * S_market)",
        "timeframe": "7-Day Forward Horizon",
        "trajectory": trajectory
    }

def get_decision_for_symbol(symbol: str) -> Dict[str, Any]:
    """Returns AI decision recommendation synthesized with the multi-factor prediction model."""
    pred = calculate_stock_prediction(symbol)
    comp_score = pred["composite_score"]
    components = pred["component_scores"]

    factors = [
        {
            "label": f"Pairs Arbitrage Factor ({components['pairs_trading']:+.1f})",
            "value": round(components["pairs_trading"] * 0.35, 1),
            "tone": "buy" if components["pairs_trading"] >= 0 else "sell"
        },
        {
            "label": f"FinBERT News Sentiment Factor ({components['sentiment_analysis']:+.1f})",
            "value": round(components["sentiment_analysis"] * 0.35, 1),
            "tone": "buy" if components["sentiment_analysis"] >= 0 else "sell"
        },
        {
            "label": f"Market Sentiment & Momentum ({components['market_sentiment']:+.1f})",
            "value": round(components["market_sentiment"] * 0.30, 1),
            "tone": "buy" if components["market_sentiment"] >= 0 else "sell"
        }
    ]

    rec = pred["recommendation"]
    # Normalize to base BUY/SELL/HOLD for legacy compatibility
    legacy_rec = "BUY" if "BUY" in rec else ("SELL" if "SELL" in rec else "HOLD")
    
    summary = (
        f"Multi-Factor Prediction Model assigns {pred['recommendation']} to {symbol} "
        f"with {pred['confidence_score']}% confidence. "
        f"Projected 7-day target: ₹{pred['predicted_target_price']:,.2f} ({pred['predicted_return_pct']:+,.2f}%). "
        f"Synthesized from 35% Pairs Trading mean-reversion, 35% FinBERT sentiment, and 30% Market momentum."
    )

    return {
        "recommendation": legacy_rec,
        "confidence": pred["confidence_score"],
        "factors": factors,
        "summary": summary,
        "prediction": pred
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
        "explanation": decision["summary"],
        "prediction": decision.get("prediction")
    }
