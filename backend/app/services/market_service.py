import math
import hashlib
from abc import ABC, abstractmethod
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.market_data import MarketData
from app.core.security import compute_integrity_hash

# Baseline stock and index Universe
STOCKS_METADATA = [
    {"symbol": "NIFTY50", "name": "NIFTY 50 Benchmark Index", "exchange": "NSE", "sector": "Index", "price": 24850.40, "base_price": 24850.40, "change": 0.85, "volume": "345.2M", "volatility": 12.1, "rsi": 61, "riskScore": 28},
    {"symbol": "BANKNIFTY", "name": "NIFTY BANK Index", "exchange": "NSE", "sector": "Index", "price": 52140.75, "base_price": 52140.75, "change": 1.14, "volume": "189.4M", "volatility": 14.8, "rsi": 63, "riskScore": 32},
    {"symbol": "RELIANCE", "name": "Reliance Industries Ltd.", "exchange": "NSE", "sector": "Energy", "price": 1425.60, "base_price": 1425.60, "change": 2.34, "volume": "8.2M", "volatility": 18.4, "rsi": 64, "riskScore": 62},
    {"symbol": "TCS", "name": "Tata Consultancy Services", "exchange": "NSE", "sector": "IT Services", "price": 3812.15, "base_price": 3812.15, "change": -0.58, "volume": "2.1M", "volatility": 11.2, "rsi": 48, "riskScore": 24},
    {"symbol": "INFY", "name": "Infosys Ltd.", "exchange": "NSE", "sector": "IT Services", "price": 1542.30, "base_price": 1542.30, "change": 1.12, "volume": "5.4M", "volatility": 15.7, "rsi": 58, "riskScore": 41},
    {"symbol": "HDFCBANK", "name": "HDFC Bank Ltd.", "exchange": "NSE", "sector": "Banking", "price": 1689.90, "base_price": 1689.90, "change": 0.24, "volume": "6.8M", "volatility": 9.8, "rsi": 52, "riskScore": 22},
    {"symbol": "ADANIENT", "name": "Adani Enterprises Ltd.", "exchange": "NSE", "sector": "Conglomerate", "price": 2984.40, "base_price": 2984.40, "change": -4.12, "volume": "11.6M", "volatility": 34.9, "rsi": 71, "riskScore": 84},
    {"symbol": "TATAMOTORS", "name": "Tata Motors Ltd.", "exchange": "NSE", "sector": "Automobile", "price": 987.25, "base_price": 987.25, "change": 3.05, "volume": "9.3M", "volatility": 22.1, "rsi": 66, "riskScore": 55},
]

class BaseMarketDataProvider(ABC):
    @abstractmethod
    def fetch_quotes(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def fetch_history(self, symbol: str, range_str: str) -> List[Dict[str, Any]]:
        pass

class AcademicDevMarketDataProvider(BaseMarketDataProvider):
    """Development market data provider for academic prototype validation."""
    
    def fetch_quotes(self) -> List[Dict[str, Any]]:
        return STOCKS_METADATA

    def fetch_history(self, symbol: str, range_str: str) -> List[Dict[str, Any]]:
        meta = next((s for s in STOCKS_METADATA if s["symbol"] == symbol), STOCKS_METADATA[0])
        base_price = meta["base_price"]
        
        points_map = {"1D": 26, "1W": 7, "1M": 30, "3M": 90, "1Y": 52}
        points = points_map.get(range_str, 30)
        
        series = []
        price = base_price * 0.95
        
        for i in range(points):
            angle = (i + len(symbol)) * 0.35
            drift = math.sin(angle) * (base_price * 0.015)
            price = max(price + drift, base_price * 0.5)
            volume = int(1_000_000 + (abs(math.cos(angle)) * 8_000_000))
            volatility = round(8.0 + (abs(math.sin(angle * 1.5)) * 25.0), 1)
            returns = round((drift / base_price) * 100, 2)
            ma = round(price * (0.985 + (math.sin(angle * 0.5) * 0.02)), 2)
            
            if range_str == "1D":
                label = f"{9 + (i // 4):02d}:{(i % 4) * 15:02d}"
            elif range_str == "1W":
                days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                label = days[i % 7]
            elif range_str in ("1M", "3M"):
                label = f"Day {i + 1}"
            else:
                label = f"Wk {i + 1}"
                
            series.append({
                "label": label,
                "price": round(price, 2),
                "ma": ma,
                "volume": volume,
                "volatility": volatility,
                "returns": returns
            })
            
        return series

provider = AcademicDevMarketDataProvider()

def validate_ohlcv_record(open_p: float, high_p: float, low_p: float, close_p: float, volume: float):
    if open_p <= 0 or high_p <= 0 or low_p <= 0 or close_p <= 0:
        raise HTTPException(status_code=400, detail="Price metrics must be positive numbers")
    if high_p < max(open_p, close_p, low_p):
        raise HTTPException(status_code=400, detail="High price cannot be less than open, close, or low")
    if low_p > min(open_p, close_p, high_p):
        raise HTTPException(status_code=400, detail="Low price cannot be greater than open, close, or high")
    if volume < 0:
        raise HTTPException(status_code=400, detail="Volume cannot be negative")

def get_stocks_list() -> List[Dict[str, Any]]:
    return provider.fetch_quotes()

def get_stock_by_symbol(symbol: str) -> Dict[str, Any]:
    stocks = provider.fetch_quotes()
    stock = next((s for s in stocks if s["symbol"] == symbol), None)
    if not stock:
        stock = stocks[0]
    return stock

def get_stock_series(symbol: str, range_str: str) -> Dict[str, Any]:
    stock = get_stock_by_symbol(symbol)
    series = provider.fetch_history(symbol, range_str)
    return {
        "stock": stock,
        "series": series,
        "range": range_str
    }
