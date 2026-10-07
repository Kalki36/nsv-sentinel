def test_sentiment_pipeline(client, auth_headers):
    res = client.get("/api/v1/sentiment/RELIANCE", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "trend" in data
    assert "articles" in data
    assert data["summary"]["positive"] >= 0

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

def test_explainability(client, auth_headers):
    res = client.get("/api/v1/explainability/RELIANCE", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["recommendation"] in ("BUY", "SELL", "HOLD")
    assert "positiveFactors" in data
    assert "negativeFactors" in data
