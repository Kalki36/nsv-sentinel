from typing import Dict, Any

FUNDAMENTAL_DATA = {
    "RELIANCE": {
        "symbol": "RELIANCE",
        "companyName": "Reliance Industries Ltd.",
        "healthScore": 86.5,
        "healthRating": "Strong",
        "netSales": 891311.0,        # ₹ Cr
        "cashEquivalents": 224617.0, # ₹ Cr
        "pbdit": 178677.0,           # ₹ Cr
        "opMargin": 18.2,            # %
        "pbtLessOi": 104210.0,       # ₹ Cr
        "pat": 79020.0,              # ₹ Cr
        "eps": 116.8                 # ₹
    },
    "TCS": {
        "symbol": "TCS",
        "companyName": "Tata Consultancy Services Ltd.",
        "healthScore": 92.0,
        "healthRating": "Strong",
        "netSales": 240893.0,
        "cashEquivalents": 48210.0,
        "pbdit": 68420.0,
        "opMargin": 26.4,
        "pbtLessOi": 61240.0,
        "pat": 45908.0,
        "eps": 125.4
    },
    "INFY": {
        "symbol": "INFY",
        "companyName": "Infosys Ltd.",
        "healthScore": 84.0,
        "healthRating": "Strong",
        "netSales": 153670.0,
        "cashEquivalents": 32140.0,
        "pbdit": 39820.0,
        "opMargin": 24.1,
        "pbtLessOi": 35410.0,
        "pat": 26233.0,
        "eps": 63.2
    },
    "HDFCBANK": {
        "symbol": "HDFCBANK",
        "companyName": "HDFC Bank Ltd.",
        "healthScore": 88.5,
        "healthRating": "Strong",
        "netSales": 205170.0,
        "cashEquivalents": 182410.0,
        "pbdit": 92410.0,
        "opMargin": 42.6,
        "pbtLessOi": 84120.0,
        "pat": 60812.0,
        "eps": 80.1
    },
    "ADANIENT": {
        "symbol": "ADANIENT",
        "companyName": "Adani Enterprises Ltd.",
        "healthScore": 58.0,
        "healthRating": "Caution",
        "netSales": 96420.0,
        "cashEquivalents": 12410.0,
        "pbdit": 13810.0,
        "opMargin": 11.8,
        "pbtLessOi": 6410.0,
        "pat": 3240.0,
        "eps": 28.4
    },
    "TATAMOTORS": {
        "symbol": "TATAMOTORS",
        "companyName": "Tata Motors Ltd.",
        "healthScore": 79.0,
        "healthRating": "Stable",
        "netSales": 437928.0,
        "cashEquivalents": 42100.0,
        "pbdit": 62410.0,
        "opMargin": 14.2,
        "pbtLessOi": 41200.0,
        "pat": 31800.0,
        "eps": 83.1
    },
    "NIFTY50": {
        "symbol": "NIFTY50",
        "companyName": "NIFTY 50 Benchmark Aggregate",
        "healthScore": 85.0,
        "healthRating": "Strong",
        "netSales": 4250000.0,
        "cashEquivalents": 980000.0,
        "pbdit": 980000.0,
        "opMargin": 21.5,
        "pbtLessOi": 780000.0,
        "pat": 580000.0,
        "eps": 940.0
    },
    "BANKNIFTY": {
        "symbol": "BANKNIFTY",
        "companyName": "BANK NIFTY Aggregate",
        "healthScore": 87.0,
        "healthRating": "Strong",
        "netSales": 1850000.0,
        "cashEquivalents": 840000.0,
        "pbdit": 720000.0,
        "opMargin": 38.2,
        "pbtLessOi": 620000.0,
        "pat": 460000.0,
        "eps": 2150.0
    }
}

def get_company_fundamentals(symbol: str) -> Dict[str, Any]:
    return FUNDAMENTAL_DATA.get(symbol, FUNDAMENTAL_DATA["RELIANCE"])
