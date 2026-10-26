def test_get_stocks_list(client, auth_headers):
    res = client.get("/api/v1/market/stocks", headers=auth_headers)
    assert res.status_code == 200
    stocks = res.json()
    assert len(stocks) >= 6
    assert any(s["symbol"] == "RELIANCE" for s in stocks)

def test_get_stock_history(client, auth_headers):
    res = client.get("/api/v1/market/RELIANCE/history?range=1M", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["stock"]["symbol"] == "RELIANCE"
    assert len(data["series"]) == 30
    assert data["range"] == "1M"
