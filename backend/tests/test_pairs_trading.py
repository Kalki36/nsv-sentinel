def test_get_pairs_trading_analysis(client, auth_headers):
    res = client.get("/api/v1/pairs-trading/analysis", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "current_zscore" in data
    assert "current_signal" in data
    assert "hedge_ratio" in data
    assert "adf_test" in data
    assert "stationary" in data["adf_test"]
    assert "performance" in data
    assert "decision" in data
    assert "data_integrity_hash" in data
    assert len(data["series"]) > 0

def test_run_pairs_trading_backtest(client, auth_headers):
    payload = {
        "nifty": "^NSEI",
        "banknifty": "^NSEBANK",
        "start_date": "2023-01-01",
        "end_date": "2024-06-01",
        "rolling_window": 100,
        "entry_z": 1.5,
        "exit_z": 0.5,
        "initial_capital": 500000.0,
        "trade_scale": 50.0,
        "stop_loss_pct": 0.025,
        "transaction_cost": 0.0015,
        "adf_significance": 0.05
    }
    res = client.post("/api/v1/pairs-trading/run-backtest", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["performance"]["Initial Capital"] == 500000.0
    assert "Sharpe Ratio" in data["performance"]
    assert "Win Rate (%)" in data["performance"]
