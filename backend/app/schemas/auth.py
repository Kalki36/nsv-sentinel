from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from app.models.user import UserRole

class LoginRequest(BaseModel):
    email: str = Field(..., description="User email or username")
    password: str = Field(..., description="User password")

class RegisterRequest(BaseModel):
    email: EmailStr = Field(..., description="Valid email address")
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8, description="Strong password (min 8 chars)")
    role: Optional[UserRole] = UserRole.ANALYST

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
