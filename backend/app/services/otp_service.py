import secrets
import time
from typing import Optional, Tuple, Dict, Any

# In-memory OTP storage:
# email -> { "otp": str, "expires_at": float, "created_at": float, "attempts": int }
_OTP_CACHE: Dict[str, Dict[str, Any]] = {}

def mask_email(email: str) -> str:
    """Masks an email address for safe display (e.g., analyst@nsv-sentinel.edu -> a*****t@nsv-sentinel.edu)."""
    if not email or "@" not in email:
        return email
    local_part, domain = email.split("@", 1)
    if len(local_part) <= 2:
        masked_local = local_part[0] + "*"
    else:
        masked_local = local_part[0] + ("*" * min(len(local_part) - 2, 5)) + local_part[-1]
    return f"{masked_local}@{domain}"

def generate_otp(email: str, expire_minutes: int = 10) -> str:
    """
    Generates a cryptographically secure 6-digit numeric OTP and stores it with an expiration timestamp.
    """
    normalized_email = email.strip().lower()
    # 6-digit numeric code
    otp = "".join(secrets.choice("0123456789") for _ in range(6))
    now = time.time()
    
    _OTP_CACHE[normalized_email] = {
        "otp": otp,
        "expires_at": now + (expire_minutes * 60),
        "created_at": now,
        "attempts": 0,
    }
    return otp

def get_active_otp(email: str) -> Optional[str]:
    """Retrieves current valid OTP for testing or development introspection."""
    normalized_email = email.strip().lower()
    record = _OTP_CACHE.get(normalized_email)
    if not record:
        return None
    if time.time() > record["expires_at"]:
        _OTP_CACHE.pop(normalized_email, None)
        return None
    return record["otp"]

def verify_otp(email: str, otp: str) -> Tuple[bool, str]:
    """
    Validates a submitted OTP against the cached record.
    Returns (True, "OK") on success or (False, error_reason) on failure.
    """
    normalized_email = email.strip().lower()
    record = _OTP_CACHE.get(normalized_email)

    if not record:
        return False, "No active verification code found. Please request a new OTP."

    now = time.time()
    if now > record["expires_at"]:
        _OTP_CACHE.pop(normalized_email, None)
        return False, "Verification code has expired. Please request a new code."

    # Max 5 attempts
    record["attempts"] += 1
    if record["attempts"] > 5:
        _OTP_CACHE.pop(normalized_email, None)
        return False, "Maximum verification attempts exceeded. Please request a new code."

    # Constant-time comparison to prevent timing attacks
    submitted_clean = otp.strip().replace(" ", "").replace("-", "")
    if secrets.compare_digest(record["otp"], submitted_clean):
        # Verification succeeded: invalidate the used OTP
        _OTP_CACHE.pop(normalized_email, None)
        return True, "Verification successful"

    remaining = max(0, 5 - record["attempts"])
    return False, f"Invalid verification code. {remaining} attempt(s) remaining."

def clear_otp(email: str) -> None:
    """Removes any pending OTP for an email."""
    normalized_email = email.strip().lower()
    _OTP_CACHE.pop(normalized_email, None)
