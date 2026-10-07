import os
from typing import List, Union

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        from pydantic.v1 import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NSV SENTINEL"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "sqlite:///./nsv_sentinel.db"

    # JWT Authentication
    JWT_SECRET: str = "nsv_sentinel_super_secret_jwt_key_2026_academic_prototype"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Application-Level AES-256-GCM Encryption Key
    AES_SECRET_KEY: str = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Dhan HQ API Integration
    DHAN_CLIENT_ID: str = ""
    DHAN_ACCESS_TOKEN: str = ""
    DHAN_API_BASE_URL: str = "https://api.dhan.co"

    # Security Policies
    MAX_LOGIN_ATTEMPTS: int = 5
    RATE_LIMIT_PER_MINUTE: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
