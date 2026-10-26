# NSV Sentinel — Frontend to Backend API Mapping Document

## 1. Executive Summary & Architecture Overview

**NSV SENTINEL** is a Secure AI-Powered Financial Market Surveillance and Decision Support Platform.
This document maps each user interface page, component, form, table, chart, and state management construct from the React/Vite frontend to its corresponding FastAPI backend REST API endpoint.

---

## 2. Frontend Page to Backend API Mapping Table

| Frontend Page / Component | Visual Elements / Features | Mock Data Source (Current) | Target Backend API Endpoint (FastAPI) | HTTP Method | Description & Data Transferred |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Login** (`Login.jsx`) | Form: Email/Username, Password, Remember Me | `loginRequest()` in `services/api.js` | `/api/v1/auth/login` | `POST` | Authenticates credentials with Argon2id/bcrypt; returns JWT access token & user profile. |
| | Auth State Check | `AuthContext.jsx` | `/api/v1/auth/me` | `GET` | Validates JWT token on app boot / route change to populate current user state. |
| **Overview Dashboard** (`Overview.jsx`) | Pipeline Status Ribbon, Market KPI Cards | Static / `services/api.js` | `/api/v1/dashboard/overview` | `GET` | Returns aggregated metrics (market status, active alerts, overall security status, avg risk score, AI confidence). |
| | Featured Stock Panel & Market Chart | `stocks.js` | `/api/v1/market/{symbol}?range=1D` | `GET` | OHLCV price series & stock summary for key symbol (`RELIANCE`). |
| | Recent Surveillance Alerts Table | `alerts.js` | `/api/v1/surveillance/alerts?limit=5` | `GET` | Latest 5 high/medium anomaly alerts. |
| **Market Analytics** (`MarketAnalytics.jsx`) | Symbol, Range (1D..1Y), Market, Metric Selectors | `generateSeries()` | `/api/v1/market/{symbol}/history?range={range}` | `GET` | Historical price, volume, volatility, moving average, and daily returns time series. |
| | Stock Summary Cards | `STOCKS` | `/api/v1/market/{symbol}` | `GET` | Real-time / latest validated quotes, change %, volume, volatility, RSI, risk score. |
| **Market Surveillance** (`MarketSurveillance.jsx`) | Surveillance Alert KPIs (Total, High, Medium, Low) | `ALERT_SUMMARY` | `/api/v1/surveillance/summary` | `GET` | Anomaly alert counts grouped by severity. |
| | Anomaly Detection Table & Filters | `ALERTS` | `/api/v1/surveillance/alerts?severity={filter}` | `GET` | List of statistical z-score / Isolation Forest anomaly alerts. |
| | Alert Detail Modal (`AlertDetail.jsx`) | Alert detail modal with volume/volatility deviation | `ALERTS.find()` | `/api/v1/surveillance/alerts/{alert_id}` | `GET` | Complete anomaly breakdown and compliance assessment notes. |
| **Sentiment Intelligence** (`SentimentIntelligence.jsx`) | FinBERT Sentiment Distribution Card | `getSentimentSummary()` | `/api/v1/sentiment/{symbol}/summary` | `GET` | Positive/Neutral/Negative probability breakdown from FinBERT. |
| | Sentiment Trend Chart | `generateSentimentTrend()` | `/api/v1/sentiment/{symbol}/trend?range={range}` | `GET` | Time series of sentiment scores across 24H, 7D, 30D. |
| | Financial News Feed & Article Modal | `NEWS` | `/api/v1/sentiment/news?symbol={symbol}` | `GET` | Ingested financial news articles with FinBERT sentiment labels and confidence scores. |
| **Security Center** (`SecurityCenter.jsx`) | Security Validation Cards (Data Integrity, Source Auth, API Security, Adversarial Input) | `SECURITY_STATUS` | `/api/v1/security/status` | `GET` | Status of backend security controls, integrity hash verifications, and input validation filters. |
| | Security Event Log Table & Detail Modal | `SECURITY_EVENTS` | `/api/v1/security/events` | `GET` | Audit log of security triggers (rejected malformed payloads, rate limit checks, integrity failures). |
| **AI Decisions** (`AIDecisions.jsx`) | Decision Recommendation Card (BUY / SELL / HOLD + Confidence %) | `getDecision()` | `/api/v1/decisions/{symbol}` | `GET` | Machine learning decision support recommendation, confidence percentage, and supporting logic. |
| | Decision Factors Bar Chart | `factors` array | `/api/v1/decisions/{symbol}/factors` | `GET` | Weighted impact of market trend, sentiment, volume, volatility, and risk scores. |
| | Decision Narrative Summary | `summary` text | Included in `/api/v1/decisions/{symbol}` | `GET` | Human-readable AI decision rationale. |
| **Risk Analysis** (`RiskAnalysis.jsx`) | Overall Risk Score Radial Gauge | `RISK_BREAKDOWN` | `/api/v1/risk/{symbol}` | `GET` | Composite score (0-100) calculated from weighted market, volatility, anomaly, sentiment, and security risk factors. |
| | Risk Breakdown Progress Bars & Radar | `RISK_BREAKDOWN` | Included in `/api/v1/risk/{symbol}` | `GET` | Granular risk vector scores: Market Risk, Volatility Risk, Surveillance Risk, Sentiment Risk, Security Risk. |
| | 14-Day Risk History Area Chart | `generateRiskHistory()` | `/api/v1/risk/{symbol}/history` | `GET` | Historical composite risk trajectory. |
| **AI Explainability** (`Explainability.jsx`) | Recommendation & Confidence Header | `getExplainability()` | `/api/v1/explainability/{symbol}` | `GET` | Feature-contribution explanation of the recommendation model. |
| | Positive & Negative Factor Breakdown | `positiveFactors`, `negativeFactors` | Included in `/api/v1/explainability/{symbol}` | `GET` | Directional feature weights explaining why a decision was reached. |
| | Narrative Explanation & Disclosure | `explanation` text | Included in `/api/v1/explainability/{symbol}` | `GET` | Clear model disclosure and feature contribution breakdown. |
| **Audit Logs** (`AuditLogs.jsx`) | System Audit Trail Table with Module & Status Filters | `AUDIT_LOGS` | `/api/v1/audit-logs?module={module}&status={status}` | `GET` | Immutable chronological system event log (Authentication, Ingestion, Surveillance, AI Engine, Security). |
| **Settings** (`Settings.jsx`) | User Profile Form | Hardcoded state | `/api/v1/users/me` | `GET` / `PATCH` | Fetch and update user profile information. |
| | Security / Password Update Form | Hardcoded state | `/api/v1/auth/change-password` | `POST` | Change user password securely with Argon2id validation. |
| | Data Sources Status | Static UI | `/api/v1/system/data-sources` | `GET` | Status of live external feeds (NSE/BSE, News API, FinBERT model server). |
| **Stock Detail** (`StockDetail.jsx`) | Unified Symbol Deep-Dive Page (Tabs for Overview, Analytics, Surveillance, Sentiment, Risk, AI Decision, Explainability) | Combination of mock calls | Aggregated fetch calling `/api/v1/market/{symbol}`, `/api/v1/surveillance/alerts?symbol={symbol}`, `/api/v1/sentiment/{symbol}`, `/api/v1/risk/{symbol}`, `/api/v1/decisions/{symbol}`, `/api/v1/explainability/{symbol}` | `GET` | Deep-dive analytical view for a single selected symbol. |

---

## 3. Frontend Service Layer Integration Strategy

The frontend service file `src/services/api.js` currently uses mock promises with simulated latency (`resolveAfter`).
During Phase 13 integration, each function in `src/services/api.js` will be updated to fetch from the FastAPI backend using standard HTTP headers (including `Authorization: Bearer <token>`):

```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

function authHeaders() {
  const token = localStorage.getItem("nsv_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
```

This guarantees 100% backward compatibility with all React components and pages without requiring any layout or UI changes.
