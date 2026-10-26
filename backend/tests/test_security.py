def test_sql_injection_payload_rejected(client):
    malicious_inputs = [
        "' OR '1'='1",
        "1; DROP TABLE users;",
        "UNION SELECT * FROM users--"
    ]
    for payload in malicious_inputs:
        res = client.post("/api/v1/auth/login", json={
            "email": payload,
            "password": "Password123!"
        })
        # Must be rejected gracefully as 400 or 401 without 500 error or stack trace
        assert res.status_code in (400, 401)
        assert "Internal" not in res.text

def test_invalid_symbol_rejected(client, auth_headers):
    res = client.get("/api/v1/market/INVALID_SYM;DROP", headers=auth_headers)
    assert res.status_code == 400
    assert "Invalid symbol" in res.json()["detail"]

def test_security_headers_present(client):
    res = client.get("/health")
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "DENY"
    assert res.headers.get("X-XSS-Protection") == "1; mode=block"
    assert "default-src 'self'" in res.headers.get("Content-Security-Policy")

def test_malformed_jwt_token(client):
    headers = {"Authorization": "Bearer malformed.invalid.token"}
    res = client.get("/api/v1/auth/me", headers=headers)
    assert res.status_code == 401
