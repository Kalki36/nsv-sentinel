# Technical API & Data Architecture — NSV SENTINEL

## 1. System Overview

**NSV SENTINEL** is a Secure AI-Powered Financial Market Surveillance and Decision Support Platform designed as a security-hardened academic prototype.

```
       REACT FRONTEND (Vite + Tailwind)
                     │
            HTTPS + JWT Auth
                     ▼
      FASTAPI BACKEND LAYER (/api/v1)
    ├── Security Middleware (OWASP Headers, CORS)
    ├── Authentication & Authorization (Argon2id, JWT)
    ├── Input Validation & Sanitization (Pydantic)
    └── Security & Audit Logging
                     │
    ┌────────────────┴────────────────┐
    ▼                                 ▼
AI / DATA PIPELINE PIPELINES     POSTGRESQL DATABASE
├── FinBERT Sentiment Pipeline   ├── users / roles
├── Z-Score / Isolation Forest   ├── market_data
│   Surveillance Detector        ├── news_articles / sentiment
├── Composite Risk Engine        ├── surveillance_alerts
├── ML Decision Engine           ├── risk_scores / ai_decisions
└── Feature-Contribution XAI     └── security_events / audit_logs
```

---

## 2. Core Data Pipelines

### A. Market Data & Validation Pipeline
1. **Ingestion & Provider Abstraction**: `BaseMarketDataProvider` defines quotes and historical candle interfaces.
2. **OHLCV Server-Side Validation**: Enforces positive price ranges, `high >= max(open, close, low)`, `low <= min(open, close, high)`, and `volume >= 0`.
3. **Cryptographic Integrity Hashing**: Computes SHA-256 integrity hash for stored market records.

### B. FinBERT Sentiment Pipeline
1. Financial news headlines and summaries are analyzed by `FinBERTClassifier`.
2. Computes `positive_prob`, `neutral_prob`, `negative_prob`, predicted sentiment class, and confidence score.
3. Inference results are persisted in `sentiment_results` to prevent redundant compute.

### C. Surveillance & Anomaly Detection Pipeline
1. **Algorithms**: Statistical Z-Score and Isolation Forest algorithm over volume deviation, price volatility spikes, and return anomalies.
2. **Terminology Standard**: Flagged events use "Suspicious / anomalous market activity" rather than "Market manipulation".

### D. Risk & Decision Engine
1. **Risk Score Formula**:
   $$R_{overall} = 0.25 \times R_{market} + 0.25 \times R_{volatility} + 0.20 \times R_{manipulation} + 0.15 \times R_{sentiment} + 0.15 \times R_{security}$$
2. **Decision Support**: Generates BUY, SELL, or HOLD recommendations with confidence % and factor weights. Clearly marked as AI decision support (not financial advice).
