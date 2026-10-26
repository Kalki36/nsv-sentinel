from app.services.otp_service import get_active_otp

def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_login_initiates_otp_dispatch(client):
    """When credentials are valid, /auth/login generates and dispatches an OTP to the user's email."""
    res = client.post("/api/v1/auth/login", json={
        "email": "analyst@nsv-sentinel.edu",
        "password": "Sentinel@2026"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "otp_required"
    assert "email" in data
    assert data["email"] == "analyst@nsv-sentinel.edu"
    assert "masked_email" in data
    assert "dev_otp" in data
    assert len(data["dev_otp"]) == 6

def test_verify_otp_success(client):
    """Verifying a valid OTP completes 2FA authentication and returns a JWT access token."""
    # Step 1: initiate login
    res_login = client.post("/api/v1/auth/login", json={
        "email": "analyst@nsv-sentinel.edu",
        "password": "Sentinel@2026"
    })
    assert res_login.status_code == 200
    otp = res_login.json()["dev_otp"]

    # Step 2: verify OTP
    res_verify = client.post("/api/v1/auth/verify-otp", json={
        "email": "analyst@nsv-sentinel.edu",
        "otp": otp
    })
    assert res_verify.status_code == 200
    data = res_verify.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "analyst@nsv-sentinel.edu"

def test_verify_otp_invalid(client):
    """Submitting an invalid OTP returns a 400 Bad Request with attempt countdown."""
    client.post("/api/v1/auth/login", json={
        "email": "analyst@nsv-sentinel.edu",
        "password": "Sentinel@2026"
    })
    res_verify = client.post("/api/v1/auth/verify-otp", json={
        "email": "analyst@nsv-sentinel.edu",
        "otp": "000000"
    })
    assert res_verify.status_code == 400
    assert "Invalid verification code" in res_verify.json()["detail"]

def test_resend_otp(client):
    """Resending OTP generates a fresh code and updates the active code."""
    res = client.post("/api/v1/auth/resend-otp", json={
        "email": "analyst@nsv-sentinel.edu"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "otp_resent"
    assert "dev_otp" in data
    assert len(data["dev_otp"]) == 6

def test_login_direct_with_otp_param(client):
    """Single-step login when OTP is provided along with credentials."""
    otp = get_active_otp("analyst@nsv-sentinel.edu")
    if not otp:
        # Request OTP first
        res_init = client.post("/api/v1/auth/login", json={
            "email": "analyst@nsv-sentinel.edu",
            "password": "Sentinel@2026"
        })
        otp = res_init.json()["dev_otp"]

    res = client.post("/api/v1/auth/login", json={
        "email": "analyst@nsv-sentinel.edu",
        "password": "Sentinel@2026",
        "otp": otp
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "analyst@nsv-sentinel.edu"

def test_login_success_skip_otp(client):
    """Headless or bypass login when skip_otp=True is set."""
    res = client.post("/api/v1/auth/login", json={
        "email": "analyst@nsv-sentinel.edu",
        "password": "Sentinel@2026",
        "skip_otp": True
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
