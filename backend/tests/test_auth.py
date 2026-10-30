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

def test_forgot_and_reset_password_flow(client):
    """Verifies complete forgot password request and reset PIN execution."""
    res_forgot = client.post("/api/v1/auth/forgot-password", json={
        "email": "analyst@nsv-sentinel.edu"
    })
    assert res_forgot.status_code == 200
    data_forgot = res_forgot.json()
    assert data_forgot["status"] == "success"
    code = data_forgot.get("dev_code")
    assert code is not None

    # Reset with the code
    res_reset = client.post("/api/v1/auth/reset-password", json={
        "email": "analyst@nsv-sentinel.edu",
        "token": code,
        "new_password": "NewSentinelPassword@2026"
    })
    assert res_reset.status_code == 200
    assert "success" in res_reset.json()["status"]

    # Verify login with new password
    res_login = client.post("/api/v1/auth/login", json={
        "email": "analyst@nsv-sentinel.edu",
        "password": "NewSentinelPassword@2026",
        "skip_otp": True
    })
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()

def test_google_oauth_login(client):
    """Verifies instant seamless onboarding and authentication via Google OAuth 2.0."""
    res = client.post("/api/v1/auth/google", json={
        "email": "sammmy9923@gmail.com",
        "name": "Samyak Padliya",
        "google_id": "google_1029384756"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "sammmy9923@gmail.com"
    assert data["user"]["role"] == "ANALYST"

def test_registration_with_email_otp_flow(client):
    """Verifies complete account registration with 6-digit email OTP verification."""
    test_email = "newanalyst_2026@testmail.com"
    test_pw = "CustomUserPassword#2026"

    # Step 1: Request Registration OTP
    res_req = client.post("/api/v1/auth/register/request-otp", json={
        "email": test_email,
        "full_name": "Test User Analyst",
        "password": test_pw,
        "role": "ANALYST"
    })
    assert res_req.status_code == 200
    data_req = res_req.json()
    assert data_req["status"] == "otp_required"
    reg_otp = data_req.get("dev_otp")
    assert reg_otp is not None and len(reg_otp) == 6

    # Step 2: Verify Registration OTP
    res_ver = client.post("/api/v1/auth/register/verify-otp", json={
        "email": test_email,
        "otp": reg_otp
    })
    assert res_ver.status_code == 200
    data_ver = res_ver.json()
    assert "access_token" in data_ver
    assert data_ver["user"]["email"] == test_email

    # Step 3: Verify login works with the user's custom password
    res_login = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": test_pw,
        "skip_otp": True
    })
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()

def test_oauth_reset_password(client):
    """Verifies password reset executed via Google OAuth identity verification."""
    res = client.post("/api/v1/auth/reset-password/oauth", json={
        "email": "analyst@nsv-sentinel.edu",
        "google_id": "google_test_reset_9988",
        "new_password": "OAuthVerifiedPassword#2026"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "analyst@nsv-sentinel.edu"

    # Verify login works with the updated password
    res_login = client.post("/api/v1/auth/login", json={
        "email": "analyst@nsv-sentinel.edu",
        "password": "OAuthVerifiedPassword#2026",
        "skip_otp": True
    })
    assert res_login.status_code == 200

def test_oauth_verify_otp(client):
    """Verifies instant OTP / 2FA completion via Google OAuth."""
    res = client.post("/api/v1/auth/verify-otp/oauth", json={
        "email": "analyst@nsv-sentinel.edu",
        "google_id": "google_test_otp_4455"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "analyst@nsv-sentinel.edu"
