// Mock security/validation layer data. In production this is populated by the
// backend cybersecurity validation layer (input validation, source auth, AES-based
// integrity checks) via GET /api/security/status and GET /api/security/events.

export const SECURITY_STATUS = {
  overall: "SECURE",
  cards: [
    { id: "integrity", label: "Data Integrity", status: "VERIFIED", tone: "buy" },
    { id: "auth", label: "Source Authentication", status: "VERIFIED", tone: "buy" },
    { id: "api", label: "API Security", status: "SECURE", tone: "buy" },
    { id: "adversarial", label: "Adversarial Input Detection", status: "NO THREAT", tone: "buy" },
  ],
};

export const SECURITY_EVENTS = [
  { id: "SEC-501", time: "10:41:12", event: "Data validation", severity: "Low", action: "Passed", status: "Verified" },
  { id: "SEC-500", time: "10:37:45", event: "API request", severity: "Normal", action: "Allowed", status: "Verified" },
  { id: "SEC-499", time: "10:31:02", event: "Input anomaly", severity: "Medium", action: "Quarantined", status: "Contained" },
  { id: "SEC-498", time: "10:24:37", event: "Source signature check", severity: "Low", action: "Passed", status: "Verified" },
  { id: "SEC-497", time: "10:12:55", event: "Session token refresh", severity: "Normal", action: "Allowed", status: "Verified" },
  { id: "SEC-496", time: "09:58:20", event: "Malformed payload", severity: "High", action: "Rejected", status: "Contained" },
  { id: "SEC-495", time: "09:42:08", event: "Rate limit check", severity: "Low", action: "Allowed", status: "Verified" },
  { id: "SEC-494", time: "09:15:31", event: "Encrypted channel handshake", severity: "Normal", action: "Passed", status: "Verified" },
];
