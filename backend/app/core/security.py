import base64
import hashlib
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db

ph = PasswordHasher()
security_scheme = HTTPBearer(auto_error=False)

# ---- Password Hashing (Argon2id) --------------------------------------------

def hash_password(password: str) -> str:
    """Hashes a password using Argon2id."""
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against an Argon2id hash."""
    try:
        return ph.verify(hashed_password, plain_password)
    except Exception:
        return False

# ---- JWT Token Operations ----------------------------------------------------

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a signed JWT access token."""
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "iat": now,
        "exp": expire,
        "iss": "nsv-sentinel-backend"
    })
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str) -> dict:
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            issuer="nsv-sentinel-backend"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

# ---- Application-Level Encryption (AES-256-GCM) -----------------------------

def _get_aes_key() -> bytes:
    """Derives a 32-byte key from settings."""
    raw_key = settings.AES_SECRET_KEY
    if len(raw_key) == 64:
        return bytes.fromhex(raw_key)
    return hashlib.sha256(raw_key.encode()).digest()

def encrypt_sensitive_data(plain_text: str) -> str:
    """Encrypts text using AES-256-GCM and returns base64 string (IV + Ciphertext + Tag)."""
    key = _get_aes_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)  # 96-bit nonce
    ciphertext = aesgcm.encrypt(nonce, plain_text.encode("utf-8"), None)
    return base64.b64encode(nonce + ciphertext).decode("utf-8")

def decrypt_sensitive_data(encrypted_b64: str) -> str:
    """Decrypts base64 AES-256-GCM data."""
    key = _get_aes_key()
    aesgcm = AESGCM(key)
    data = base64.b64decode(encrypted_b64.encode("utf-8"))
    nonce = data[:12]
    ciphertext = data[12:]
    decrypted = aesgcm.decrypt(nonce, ciphertext, None)
    return decrypted.decode("utf-8")

# ---- Cryptographic Integrity Hashing ----------------------------------------

def compute_integrity_hash(data_str: str) -> str:
    """Computes SHA-256 integrity hash for data records."""
    return hashlib.sha256(data_str.encode("utf-8")).hexdigest()

# ---- Authentication Dependency -----------------------------------------------

def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> dict:
    """FastAPI dependency enforcing authentication."""
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = decode_access_token(auth.credentials)
    user_id = payload.get("sub")
    email = payload.get("email")
    role = payload.get("role", "VIEWER")

    if not user_id or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed authentication payload",
        )
    
    return {
        "id": int(user_id) if str(user_id).isdigit() else user_id,
        "email": email,
        "role": role
    }

def require_role(allowed_roles: list[str]):
    """Role-based authorization dependency factory."""
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user['role']}' lacks permission for this action"
            )
        return current_user
    return role_checker
