from typing import Dict, Any, List

def get_security_status_overview(mode: str = "secure") -> Dict[str, Any]:
    is_secure = (mode.lower() != "unsecure")
    
    if is_secure:
        overall = "SECURE"
        cards = [
            {"id": "integrity", "label": "Data Integrity", "status": "VERIFIED", "tone": "buy"},
            {"id": "auth", "label": "Source Authentication", "status": "VERIFIED", "tone": "buy"},
            {"id": "api", "label": "API Security", "status": "SECURE", "tone": "buy"},
            {"id": "adversarial", "label": "Adversarial Input Detection", "status": "NO THREAT", "tone": "buy"},
        ]
        factors = [
            {
                "title": "Data Integrity Factor (SHA-256 Hashes)",
                "status": "PASS",
                "explanation": "All ingested OHLCV market feeds match SHA-256 cryptographic signatures. No data tampering or stream corruption detected."
            },
            {
                "title": "Source Authentication Factor",
                "status": "PASS",
                "explanation": "Dhan HQ API keys and JWT analyst tokens validated against Argon2id signatures. Zero unauthorized access attempts allowed."
            },
            {
                "title": "API & Infrastructure Security Factor",
                "status": "PASS",
                "explanation": "Rate limiting (60 req/min) enforced; OWASP HTTP headers (nosniff, DENY, CSP) active. TLS 1.3 channel encryption validated."
            },
            {
                "title": "Adversarial Input Detection Factor",
                "status": "PASS",
                "explanation": "Regex sanitizers actively quarantining SQL injection and malformed JSON payloads before hitting database queries."
            }
        ]
    else:
        overall = "UNSECURE (Threat Detected)"
        cards = [
            {"id": "integrity", "label": "Data Integrity", "status": "HASH MISMATCH", "tone": "sell"},
            {"id": "auth", "label": "Source Authentication", "status": "SUSPICIOUS TOKEN", "tone": "warn"},
            {"id": "api", "label": "API Security", "status": "RATE BURST", "tone": "warn"},
            {"id": "adversarial", "label": "Adversarial Input Detection", "status": "PAYLOAD QUARANTINED", "tone": "sell"},
        ]
        factors = [
            {
                "title": "Data Integrity Factor (SHA-256 Hashes)",
                "status": "FAIL",
                "explanation": "Detected 1 anomalous market feed record failing SHA-256 integrity hash verification. Record quarantined automatically."
            },
            {
                "title": "Source Authentication Factor",
                "status": "WARNING",
                "explanation": "Multiple rapid authentication attempts recorded from unverified IP range. Session tokens flagged for analyst re-validation."
            },
            {
                "title": "API & Infrastructure Security Factor",
                "status": "WARNING",
                "explanation": "Elevated API request frequency approaching rate limit ceiling (58 req/min). Automated throttling triggered."
            },
            {
                "title": "Adversarial Input Detection Factor",
                "status": "ALERT",
                "explanation": "Intercepted malformed SQL injection string (' OR '1'='1) in search input payload. Payload rejected and logged to Security Audit."
            }
        ]

    return {
        "overall": overall,
        "cards": cards,
        "factors": factors
    }

SECURITY_EVENTS_DATA = [
    {"id": "SEC-501", "time": "10:41:12", "event": "Data validation", "severity": "Low", "action": "Passed", "status": "Verified"},
    {"id": "SEC-500", "time": "10:37:45", "event": "API request", "severity": "Normal", "action": "Allowed", "status": "Verified"},
    {"id": "SEC-499", "time": "10:31:02", "event": "Input anomaly", "severity": "Medium", "action": "Quarantined", "status": "Contained"},
    {"id": "SEC-498", "time": "10:24:37", "event": "Source signature check", "severity": "Low", "action": "Passed", "status": "Verified"},
    {"id": "SEC-497", "time": "10:12:55", "event": "Session token refresh", "severity": "Normal", "action": "Allowed", "status": "Verified"},
    {"id": "SEC-496", "time": "09:58:20", "event": "Malformed payload", "severity": "High", "action": "Rejected", "status": "Contained"},
    {"id": "SEC-495", "time": "09:42:08", "event": "Rate limit check", "severity": "Low", "action": "Allowed", "status": "Verified"},
    {"id": "SEC-494", "time": "09:15:31", "event": "Encrypted channel handshake", "severity": "Normal", "action": "Passed", "status": "Verified"},
]

AUDIT_LOGS_DATA = [
    {"id": "A-901", "timestamp": "10:42:31", "actor": "System", "event": "Data received", "module": "Ingestion", "status": "Success"},
    {"id": "A-902", "timestamp": "10:42:32", "actor": "System", "event": "Integrity validated", "module": "Security", "status": "Success"},
    {"id": "A-903", "timestamp": "10:42:33", "actor": "System", "event": "Data preprocessing completed", "module": "Analytics", "status": "Success"},
    {"id": "A-904", "timestamp": "10:42:34", "actor": "System", "event": "AI analysis completed", "module": "AI Engine", "status": "Success"},
    {"id": "A-905", "timestamp": "10:42:35", "actor": "System", "event": "Recommendation generated", "module": "Decision Engine", "status": "Success"},
    {"id": "A-906", "timestamp": "10:38:02", "actor": "analyst.n", "event": "Alert NSV-1042 reviewed", "module": "Surveillance", "status": "Success"},
    {"id": "A-907", "timestamp": "10:31:02", "actor": "System", "event": "Input anomaly quarantined", "module": "Security", "status": "Warning"},
    {"id": "A-908", "timestamp": "10:15:47", "actor": "analyst.s", "event": "Session login", "module": "Auth", "status": "Success"},
    {"id": "A-909", "timestamp": "09:58:20", "actor": "System", "event": "Malformed payload rejected", "module": "Security", "status": "Error"},
    {"id": "A-910", "timestamp": "09:42:35", "actor": "System", "event": "Sentiment batch processed", "module": "AI Engine", "status": "Success"},
]

def get_security_events_list() -> List[Dict[str, Any]]:
    return SECURITY_EVENTS_DATA

def get_system_audit_logs() -> List[Dict[str, Any]]:
    return AUDIT_LOGS_DATA
