# OWASP & Security Controls Verification Checklist — NSV SENTINEL

This checklist maps implemented security controls in **NSV SENTINEL** against the **OWASP Top 10** and **OWASP API Security Top 10** standards.

---

## OWASP Top 10 Controls Mapping

| OWASP Category | Control Description | Backend Implementation File(s) | Automated Test File | Status |
| :--- | :--- | :--- | :--- | :---: |
| **A01: Broken Access Control** | Authentication required for protected endpoints via HTTPBearer JWT tokens; role-based access checks (`require_role`); users cannot access unauthorized resources without permissions. | `app/core/security.py`, `app/api/v1/auth.py` | `tests/test_auth.py` | **PASS** |
| **A02: Cryptographic Failures** | Argon2id password hashing; AES-256-GCM application-level encryption for sensitive fields; SHA-256 integrity hash verification; no secrets stored in source code. | `app/core/security.py`, `app/utils/encryption.py` | `tests/test_security.py` | **PASS** |
| **A03: Injection** | SQLAlchemy 2.x ORM parameterized queries preventing SQL injection; strict Pydantic schema validation; regex input filters checking for SQL injection payloads (`' OR '1'='1`). | `app/utils/validators.py`, `app/api/v1/` | `tests/test_security.py` | **PASS** |
| **A04: Insecure Design** | Explicit security event pipeline; rate limiting parameters; fail-safe defaults; role-scoped API access decisions. | `app/main.py`, `app/core/config.py` | `tests/test_security.py` | **PASS** |
| **A05: Security Misconfiguration** | OWASP HTTP security headers (`nosniff`, `DENY`, `CSP`, `X-XSS-Protection`); environment-variable driven configuration; structured JSON error responses masking internal stack traces. | `app/main.py`, `app/core/logging.py` | `tests/test_security.py` | **PASS** |
| **A06: Vulnerable & Outdated Components** | Dependencies explicitly version-pinned in `requirements.txt`; minimal dependency footprint. | `backend/requirements.txt` | Manual Audit | **PASS** |
| **A07: Identification & Auth Failures** | Argon2id password verification; JWT signature and expiration validation; generic invalid login error messages preventing user enumeration. | `app/core/security.py`, `app/api/v1/auth.py` | `tests/test_auth.py` | **PASS** |
| **A08: Software & Data Integrity Failures** | OHLCV input data range and mathematical relationship validation (`high >= max(open, close, low)`); SHA-256 content hashing. | `app/services/market_service.py`, `app/utils/validators.py` | `tests/test_market.py` | **PASS** |
| **A09: Security Logging & Monitoring Failures** | Structured audit logging (`AuditLog` model) and security event log (`SecurityEvent` model); automatic redaction of secrets, passwords, and tokens from log output. | `app/core/logging.py`, `app/utils/audit.py` | `tests/test_auth.py` | **PASS** |
| **A10: Server-Side Request Forgery (SSRF)** | Server-side allowlist for symbol queries and internal data provider routes; arbitrary URL fetching disabled. | `app/utils/validators.py` | `tests/test_security.py` | **PASS** |

---

## OWASP API Security Top 10 Mapping

| API Security Vector | Control Implemented | Verification Method | Status |
| :--- | :--- | :--- | :---: |
| **API1: Broken Object Level Auth** | User ID & role validated from signed JWT claims on object fetch. | Automated Test | **PASS** |
| **API2: Broken Authentication** | JWT signature verification + Argon2id hash check. | Automated Test | **PASS** |
| **API3: Broken Property Level Auth** | Explicit Pydantic response schemas filtering internal fields. | Schema Inspection | **PASS** |
| **API4: Unrestricted Consumption** | Page size limits and default pagination ranges enforced. | Code Audit | **PASS** |
| **API5: Broken Function Level Auth** | Role authorization decorator (`require_role(["ADMIN"])`). | Automated Test | **PASS** |
| **API6: Unrestricted Access to Flows** | Authentication required before invoking machine learning inference. | Code Audit | **PASS** |
| **API7: Server Side Request Forgery** | External URLs validated against explicit domain allowlists. | Code Audit | **PASS** |
| **API8: Security Misconfiguration** | CORS restricted to configured `FRONTEND_URL`; strict security headers. | Automated Test | **PASS** |
| **API9: Improper Inventory** | OpenAPI versioned route schemas (`/api/v1/...`). | Schema Audit | **PASS** |
| **API10: Unsafe Consumption of APIs** | Financial data integrity verified via SHA-256 hashes prior to ingestion. | Automated Test | **PASS** |
