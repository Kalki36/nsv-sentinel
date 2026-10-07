# NSV SENTINEL
### Secure AI-Powered Financial Market Surveillance and Decision Support Platform

NSV SENTINEL is a full-stack, security-hardened academic prototype combining real-time financial data analytics, FinBERT sentiment intelligence, statistical z-score & Isolation Forest anomaly surveillance, risk modeling, AI decision support, and OWASP-aligned cybersecurity controls.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+

---

### 1. Backend Setup & Startup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment settings
cp .env.example .env

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

FastAPI server runs on: `http://localhost:8000`
Swagger OpenAPI Docs available at: `http://localhost:8000/api/v1/docs`

---

### 2. Run Backend Tests

```bash
cd backend
pytest -v
```

---

### 3. Frontend Setup & Startup

```bash
# From project root directory
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔐 Seed User Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Analyst** | `analyst@nsv-sentinel.edu` | `Sentinel@2026` |
| **Admin** | `admin@nsv-sentinel.edu` | `Admin@Sentinel2026` |

---

## 📚 Project Documentation
- [Frontend to Backend API Mapping](docs/frontend-backend-mapping.md)
- [OWASP Security Controls Checklist](docs/security-checklist.md)
- [Technical API Architecture](docs/api-architecture.md)
