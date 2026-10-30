from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.user import UserRole

class LoginRequest(BaseModel):
    email: str = Field(..., description="User email or username")
    password: str = Field(..., description="User password")
    otp: Optional[str] = Field(None, description="Optional 6-digit OTP code for single-step login")
    skip_otp: Optional[bool] = Field(False, description="Flag for headless testing to bypass OTP")

class RegisterRequest(BaseModel):
    email: EmailStr = Field(..., description="Valid email address")
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8, description="Strong password (min 8 chars)")
    role: Optional[UserRole] = UserRole.ANALYST
    otp: Optional[str] = Field(None, description="Optional 6-digit registration verification code")

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(...)
    new_password: str = Field(..., min_length=8)

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class OtpRequiredResponse(BaseModel):
    status: str = "otp_required"
    message: str
    email: str
    masked_email: str
    expires_in: int
    email_sent: bool = False
    dev_otp: Optional[str] = None

class VerifyOtpRequest(BaseModel):
    email: str = Field(..., description="User email address")
    otp: str = Field(..., min_length=4, max_length=10, description="6-digit verification code")

class ResendOtpRequest(BaseModel):
    email: str = Field(..., description="User email address")

class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address")

class ResetPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="Registered email address")
    token: str = Field(..., description="Password reset token or 6-digit verification code")
    new_password: str = Field(..., min_length=8, description="New secure password (min 8 chars)")

class GoogleAuthRequest(BaseModel):
    credential: Optional[str] = Field(None, description="Google ID Token JWT from Google Identity Services")
    email: Optional[EmailStr] = Field(None, description="Google verified email address")
    name: Optional[str] = Field(None, description="Google account display name")
    google_id: Optional[str] = Field(None, description="Google unique subject ID")

class OAuthResetPasswordRequest(BaseModel):
    email: Optional[EmailStr] = Field(None, description="Google verified email address")
    credential: Optional[str] = Field(None, description="Google ID Token JWT")
    google_id: Optional[str] = Field(None, description="Google unique subject ID")
    new_password: str = Field(..., min_length=8, description="New secure password (min 8 chars)")

class OAuthVerifyOtpRequest(BaseModel):
    email: Optional[EmailStr] = Field(None, description="Google verified email address")
    credential: Optional[str] = Field(None, description="Google ID Token JWT")
    google_id: Optional[str] = Field(None, description="Google unique subject ID")

class OtpActionResponse(BaseModel):
    status: str
    message: str
    email: str
    masked_email: str
    expires_in: int
    email_sent: bool = False
    dev_otp: Optional[str] = None
