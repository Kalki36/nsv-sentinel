def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_login_success(client):
    res = client.post("/api/v1/auth/login", json={
        "email": "analyst@nsv-sentinel.edu",
        "password": "Sentinel@2026"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "analyst@nsv-sentinel.edu"

def test_login_invalid_password(client):
    res = client.post("/api/v1/auth/login", json={
        "email": "analyst@nsv-sentinel.edu",
        "password": "WrongPassword123!"
    })
    assert res.status_code == 401
    assert "Invalid" in res.json()["detail"]

def test_get_me_authenticated(client, auth_headers):
    res = client.get("/api/v1/auth/me", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["email"] == "analyst@nsv-sentinel.edu"

def test_protected_route_unauthorized(client):
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401
