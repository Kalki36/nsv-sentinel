def test_sentiment_pipeline(client, auth_headers):
    res = client.get("/api/v1/sentiment/RELIANCE", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "trend" in data
    assert "articles" in data
    assert data["summary"]["positive"] >= 0
    assert len(data["articles"]) > 0
    for article in data["articles"]:
        assert article["sentiment"] in ("Positive", "Neutral", "Negative")
        assert 0 <= article["confidence"] <= 100

def test_sentiment_pipeline_searched_stock(client, auth_headers):
    res = client.get("/api/v1/sentiment/TATAMOTORS?range=7D", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["symbol"] == "TATAMOTORS"
    assert "feed_source" in data
    assert len(data["articles"]) > 0
    assert "positive" in data["summary"]
    assert "neutral" in data["summary"]
    assert "negative" in data["summary"]

def test_news_feed_endpoint(client, auth_headers):
    res = client.get("/api/v1/sentiment/news?symbol=INFY", headers=auth_headers)
    assert res.status_code == 200
    articles = res.json()
    assert isinstance(articles, list)
    assert len(articles) > 0
    assert articles[0]["symbol"] == "INFY"
    assert articles[0]["sentiment"] in ("Positive", "Neutral", "Negative")

def test_surveillance_alerts(client, auth_headers):
    res = client.get("/api/v1/surveillance/alerts", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data["alerts"]) > 0
    assert data["summary"]["total"] >= 1

def test_risk_analysis(client, auth_headers):
    res = client.get("/api/v1/risk/RELIANCE", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "breakdown" in data
    assert data["breakdown"]["overall"] > 0

def test_decision_engine(client, auth_headers):
    res = client.get("/api/v1/decisions/RELIANCE", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["recommendation"] in ("BUY", "SELL", "HOLD")
    assert 0 <= data["confidence"] <= 100
    assert "prediction" in data
    assert data["prediction"]["weights"]["pairs_trading_weight"] == 0.35
    assert data["prediction"]["weights"]["sentiment_analysis_weight"] == 0.35
    assert data["prediction"]["weights"]["market_sentiment_weight"] == 0.30

def test_future_prediction_formula_endpoint(client, auth_headers):
    res = client.get("/api/v1/decisions/RELIANCE/prediction", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["symbol"] == "RELIANCE"
    assert "predicted_target_price" in data
    assert "predicted_return_pct" in data
    assert "component_scores" in data
    assert "pairs_trading" in data["component_scores"]
    assert "sentiment_analysis" in data["component_scores"]
    assert "market_sentiment" in data["component_scores"]
    assert len(data["trajectory"]) == 7

def test_dhan_live_market_feed(client, auth_headers):
    res = client.get("/api/v1/market/live-feed/dhan", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert data["configured"] is True
    assert data["client_id"] == "1114191288"

def test_explainability(client, auth_headers):
    res = client.get("/api/v1/explainability/RELIANCE", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["recommendation"] in ("BUY", "SELL", "HOLD")
    assert "positiveFactors" in data
    assert "negativeFactors" in data
