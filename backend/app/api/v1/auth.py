from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Union

from app.core.database import get_db
from app.core.config import settings
from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    get_current_user
)
from app.models.user import User, UserRole
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    ChangePasswordRequest,
    TokenResponse,
    UserResponse,
    OtpRequiredResponse,
    VerifyOtpRequest,
    ResendOtpRequest,
    OtpActionResponse
)
from app.utils.validators import sanitize_input
from app.utils.audit import log_audit_event, record_security_event
from app.services.otp_service import generate_otp, verify_otp, mask_email
from app.services.email_service import send_otp_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

def _create_token_response(user: User) -> TokenResponse:
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role.value},
        expires_delta=expires_delta
    )
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role.value,
            is_active=user.is_active
        )
    )

@router.post("/login", response_model=Union[OtpRequiredResponse, TokenResponse])
def login(request_data: LoginRequest, req: Request, db: Session = Depends(get_db)):
    """
    Authenticates user credentials against Argon2id hashed passwords.
    Dispatches a 6-digit 2FA One-Time Password (OTP) to the user's email address.
    If OTP is provided in the request or skip_otp is active, completes authentication directly.
    """
    email = sanitize_input(request_data.email).lower()
    password = request_data.password

    # Lookup user
    user = db.query(User).filter(User.email == email).first()
    client_ip = req.client.host if req.client else "127.0.0.1"

    if not user or not verify_password(password, user.password_hash):
        log_audit_event(db, actor=email, event="Failed login attempt", module="Auth", status="Error", ip_address=client_ip)
        record_security_event(db, event_name="AUTH_FAILURE", severity="High", action_taken="Rejected", status_label="Contained", ip_address=client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )

    # 1. If OTP is directly supplied with the login payload
    if request_data.otp:
        valid, msg = verify_otp(user.email, request_data.otp)
        if not valid:
            log_audit_event(db, actor=user.email, event="Failed 2FA OTP verification", module="Auth", status="Error", ip_address=client_ip)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=msg
            )
        log_audit_event(db, actor=user.email, event="Session login via 2FA OTP", module="Auth", status="Success", ip_address=client_ip)
        record_security_event(db, event_name="AUTH_SUCCESS", severity="Normal", action_taken="Allowed", status_label="Verified", ip_address=client_ip)
        return _create_token_response(user)

    # 2. If OTP is skipped for headless automated tests or disabled in settings
    if request_data.skip_otp or not settings.REQUIRE_OTP:
        log_audit_event(db, actor=user.email, event="Session login (Direct)", module="Auth", status="Success", ip_address=client_ip)
        record_security_event(db, event_name="AUTH_SUCCESS", severity="Normal", action_taken="Allowed", status_label="Verified", ip_address=client_ip)
        return _create_token_response(user)

    # 3. Standard flow: Generate 6-digit OTP and dispatch via Email
    otp = generate_otp(user.email, expire_minutes=settings.OTP_EXPIRE_MINUTES)
    email_sent, email_status = send_otp_email(
        to_email=user.email,
        otp=otp,
        user_name=user.full_name or "Analyst",
        ip_address=client_ip
    )
    masked = mask_email(user.email)

    log_audit_event(
        db,
        actor=user.email,
        event="2FA OTP dispatched" if email_sent else "2FA OTP simulated (SMTP offline)",
        module="Auth",
        status="Success",
        ip_address=client_ip
    )

    if email_sent:
        message = f"A 6-digit verification code has been dispatched to {masked}."
    else:
        message = f"SMTP unconfigured: code simulated for {masked}. Use verification code below."

    return OtpRequiredResponse(
        status="otp_required",
        message=message,
        email=user.email,
        masked_email=masked,
        expires_in=settings.OTP_EXPIRE_MINUTES * 60,
        email_sent=email_sent,
        dev_otp=otp if settings.DEBUG else None
    )

@router.post("/verify-otp", response_model=TokenResponse)
def verify_login_otp(request_data: VerifyOtpRequest, req: Request, db: Session = Depends(get_db)):
    """
    Validates the 6-digit OTP sent to the user's email address and issues a signed JWT access token.
    """
    email = sanitize_input(request_data.email).lower()
    client_ip = req.client.host if req.client else "127.0.0.1"

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )

    valid, reason = verify_otp(user.email, request_data.otp)
    if not valid:
        log_audit_event(db, actor=user.email, event="Failed 2FA OTP verification", module="Auth", status="Error", ip_address=client_ip)
        record_security_event(db, event_name="AUTH_OTP_FAILURE", severity="Medium", action_taken="Rejected", status_label="Contained", ip_address=client_ip)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=reason
        )

    log_audit_event(db, actor=user.email, event="Session login via 2FA OTP", module="Auth", status="Success", ip_address=client_ip)
    record_security_event(db, event_name="AUTH_SUCCESS", severity="Normal", action_taken="Allowed", status_label="Verified", ip_address=client_ip)

    return _create_token_response(user)

@router.post("/resend-otp", response_model=OtpActionResponse)
def resend_login_otp(request_data: ResendOtpRequest, req: Request, db: Session = Depends(get_db)):
    """
    Regenerates and resends a 2FA OTP code to the user's email address.
    """
    email = sanitize_input(request_data.email).lower()
    client_ip = req.client.host if req.client else "127.0.0.1"

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )

    otp = generate_otp(user.email, expire_minutes=settings.OTP_EXPIRE_MINUTES)
    email_sent, email_status = send_otp_email(
        to_email=user.email,
        otp=otp,
        user_name=user.full_name or "Analyst",
        ip_address=client_ip
    )
    masked = mask_email(user.email)

    log_audit_event(
        db,
        actor=user.email,
        event="2FA OTP resent" if email_sent else "2FA OTP resent (Simulated)",
        module="Auth",
        status="Success",
        ip_address=client_ip
    )

    if email_sent:
        message = f"A fresh verification code has been dispatched to {masked}."
    else:
        message = f"SMTP unconfigured: code simulated for {masked}. Use verification code below."

    return OtpActionResponse(
        status="otp_resent",
        message=message,
        email=user.email,
        masked_email=masked,
        expires_in=settings.OTP_EXPIRE_MINUTES * 60,
        email_sent=email_sent,
        dev_otp=otp if settings.DEBUG else None
    )

@router.post("/register", response_model=UserResponse)
def register(request_data: RegisterRequest, db: Session = Depends(get_db)):
    """Registers a new user account with Argon2id password hashing."""
    email = sanitize_input(request_data.email).lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    hashed_pw = hash_password(request_data.password)
    user = User(
        email=email,
        full_name=sanitize_input(request_data.full_name),
        password_hash=hashed_pw,
        role=request_data.role or UserRole.ANALYST,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    log_audit_event(db, actor=email, event="User registered", module="Auth", status="Success")
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role.value,
        is_active=user.is_active
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns the current authenticated user's profile."""
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role.value,
        is_active=user.is_active
    )

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates user password after verifying current credentials."""
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if not user or not verify_password(data.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    user.password_hash = hash_password(data.new_password)
    db.commit()
    log_audit_event(db, actor=user.email, event="Password updated", module="Auth", status="Success")
    return {"message": "Password changed successfully"}
