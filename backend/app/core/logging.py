import logging
import re
import sys

# Redact sensitive parameters from log output
SENSITIVE_PATTERNS = [
    (re.compile(r'("password"|"secret"|"token"|"authorization"|"key")\s*:\s*"[^"]+"', re.IGNORECASE), r'\1: "[REDACTED]"'),
    (re.compile(r'Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*', re.IGNORECASE), r'Bearer [REDACTED]'),
]

class SensitiveDataFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            for pattern, replacement in SENSITIVE_PATTERNS:
                record.msg = pattern.sub(replacement, record.msg)
        return True

def setup_logging():
    logger = logging.getLogger("nsv_sentinel")
    logger.setLevel(logging.INFO)
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s"
        )
        handler.setFormatter(formatter)
        handler.addFilter(SensitiveDataFilter())
        logger.addHandler(handler)
        
    return logger

logger = setup_logging()
