import re
from fastapi import HTTPException, status
from app.services.dhan_service import DHAN_SECURITY_MAP

ALLOWED_SYMBOLS = set(DHAN_SECURITY_MAP.keys()) | {
    "NIFTY50", "BANKNIFTY", "SENSEX", "^NSEI", "^NSEBANK", "^BSESN"
}
ALLOWED_RANGES = {"1D", "1W", "1M", "3M", "1Y", "24H", "7D", "15D", "30D"}
ALLOWED_MARKETS = {"NSE", "BSE"}

SQL_INJECTION_PATTERNS = [
    re.compile(r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|UNION|CREATE|TRUNCATE)\b)", re.IGNORECASE),
    re.compile(r"(--|/\*|\*/|;|')", re.IGNORECASE)
]

def validate_symbol(symbol: str, strict: bool = True) -> str:
    """Validates and normalizes stock symbol against allowlist or format rules with injection checks."""
    cleaned = symbol.strip().upper()
    for pattern in SQL_INJECTION_PATTERNS:
        if pattern.search(cleaned):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid symbol '{symbol}'."
            )
    if not re.match(r"^[A-Z0-9^._-]{1,20}$", cleaned):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid symbol '{symbol}'."
        )
    if strict and cleaned not in ALLOWED_SYMBOLS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid symbol '{symbol}'. Allowed symbols: {sorted(list(ALLOWED_SYMBOLS))}"
        )
    return cleaned

def validate_range(range_str: str) -> str:
    """Validates time period range parameter."""
    cleaned = range_str.strip().upper()
    if cleaned not in ALLOWED_RANGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid range '{range_str}'. Allowed ranges: {sorted(list(ALLOWED_RANGES))}"
        )
    return cleaned

def sanitize_input(text: str) -> str:
    """Checks for suspicious SQL injection keywords and strips dangerous XSS tags."""
    if not text:
        return text
    
    # Check for SQL Injection patterns in user input text fields
    for pattern in SQL_INJECTION_PATTERNS:
        if pattern.search(text):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Security policy violation: Suspicious query payload detected."
            )
            
    # Simple HTML tag stripping for XSS prevention
    clean = re.sub(r'<[^>]*>', '', text)
    return clean
