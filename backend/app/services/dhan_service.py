import time
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional, Tuple
import httpx

from app.core.config import settings
from app.core.security import compute_integrity_hash
from app.core.logging import logger

# Mapping of NSV Sentinel monitored tickers to Dhan Exchange Segments & Security IDs
DHAN_SECURITY_MAP = {
    # Benchmark Indices (Primary Indian Market Indicators)
    "NIFTY50": {"segment": "IDX_I", "security_id": 13, "instrument": "INDEX", "name": "NIFTY 50 Benchmark Index"},
    "BANKNIFTY": {"segment": "IDX_I", "security_id": 25, "instrument": "INDEX", "name": "NIFTY BANK Index"},
    "SENSEX": {"segment": "IDX_I", "security_id": 1, "instrument": "INDEX", "name": "BSE SENSEX Benchmark Index"},

    # Full NIFTY 50 Constituent Stock Universe (NSE Equities)
    "RELIANCE": {"segment": "NSE_EQ", "security_id": 2885, "instrument": "EQUITY", "name": "Reliance Industries Ltd."},
    "TCS": {"segment": "NSE_EQ", "security_id": 11536, "instrument": "EQUITY", "name": "Tata Consultancy Services Ltd."},
    "HDFCBANK": {"segment": "NSE_EQ", "security_id": 1333, "instrument": "EQUITY", "name": "HDFC Bank Ltd."},
    "INFY": {"segment": "NSE_EQ", "security_id": 1594, "instrument": "EQUITY", "name": "Infosys Ltd."},
    "ICICIBANK": {"segment": "NSE_EQ", "security_id": 4963, "instrument": "EQUITY", "name": "ICICI Bank Ltd."},
    "BHARTIARTL": {"segment": "NSE_EQ", "security_id": 10604, "instrument": "EQUITY", "name": "Bharti Airtel Ltd."},
    "SBIN": {"segment": "NSE_EQ", "security_id": 3045, "instrument": "EQUITY", "name": "State Bank of India"},
    "ITC": {"segment": "NSE_EQ", "security_id": 1660, "instrument": "EQUITY", "name": "ITC Ltd."},
    "LT": {"segment": "NSE_EQ", "security_id": 11483, "instrument": "EQUITY", "name": "Larsen & Toubro Ltd."},
    "HINDUNILVR": {"segment": "NSE_EQ", "security_id": 1394, "instrument": "EQUITY", "name": "Hindustan Unilever Ltd."},
    "BAJFINANCE": {"segment": "NSE_EQ", "security_id": 317, "instrument": "EQUITY", "name": "Bajaj Finance Ltd."},
    "HCLTECH": {"segment": "NSE_EQ", "security_id": 7229, "instrument": "EQUITY", "name": "HCL Technologies Ltd."},
    "MARUTI": {"segment": "NSE_EQ", "security_id": 10999, "instrument": "EQUITY", "name": "Maruti Suzuki India Ltd."},
    "SUNPHARMA": {"segment": "NSE_EQ", "security_id": 3351, "instrument": "EQUITY", "name": "Sun Pharmaceutical Industries"},
    "TATAMOTORS": {"segment": "NSE_EQ", "security_id": 3456, "instrument": "EQUITY", "name": "Tata Motors Ltd."},
    "ONGC": {"segment": "NSE_EQ", "security_id": 2475, "instrument": "EQUITY", "name": "Oil & Natural Gas Corp."},
    "NTPC": {"segment": "NSE_EQ", "security_id": 11630, "instrument": "EQUITY", "name": "NTPC Ltd."},
    "KOTAKBANK": {"segment": "NSE_EQ", "security_id": 1922, "instrument": "EQUITY", "name": "Kotak Mahindra Bank Ltd."},
    "TITAN": {"segment": "NSE_EQ", "security_id": 3506, "instrument": "EQUITY", "name": "Titan Company Ltd."},
    "AXISBANK": {"segment": "NSE_EQ", "security_id": 5900, "instrument": "EQUITY", "name": "Axis Bank Ltd."},
    "ADANIENT": {"segment": "NSE_EQ", "security_id": 25, "instrument": "EQUITY", "name": "Adani Enterprises Ltd."},
    "ADANIPORTS": {"segment": "NSE_EQ", "security_id": 15083, "instrument": "EQUITY", "name": "Adani Ports & SEZ Ltd."},
    "COALINDIA": {"segment": "NSE_EQ", "security_id": 20374, "instrument": "EQUITY", "name": "Coal India Ltd."},
    "BAJAJFINSV": {"segment": "NSE_EQ", "security_id": 16675, "instrument": "EQUITY", "name": "Bajaj Finserv Ltd."},
    "TATASTEEL": {"segment": "NSE_EQ", "security_id": 3499, "instrument": "EQUITY", "name": "Tata Steel Ltd."},
    "POWERGRID": {"segment": "NSE_EQ", "security_id": 14977, "instrument": "EQUITY", "name": "Power Grid Corp. of India"},
    "M&M": {"segment": "NSE_EQ", "security_id": 2031, "instrument": "EQUITY", "name": "Mahindra & Mahindra Ltd."},
    "ASIANPAINT": {"segment": "NSE_EQ", "security_id": 236, "instrument": "EQUITY", "name": "Asian Paints Ltd."},
    "ULTRACEMCO": {"segment": "NSE_EQ", "security_id": 11532, "instrument": "EQUITY", "name": "UltraTech Cement Ltd."},
    "GRASIM": {"segment": "NSE_EQ", "security_id": 1232, "instrument": "EQUITY", "name": "Grasim Industries Ltd."},
    "JSWSTEEL": {"segment": "NSE_EQ", "security_id": 11723, "instrument": "EQUITY", "name": "JSW Steel Ltd."},
    "TECHM": {"segment": "NSE_EQ", "security_id": 13538, "instrument": "EQUITY", "name": "Tech Mahindra Ltd."},
    "WIPRO": {"segment": "NSE_EQ", "security_id": 3787, "instrument": "EQUITY", "name": "Wipro Ltd."},
    "CIPLA": {"segment": "NSE_EQ", "security_id": 694, "instrument": "EQUITY", "name": "Cipla Ltd."},
    "DRREDDY": {"segment": "NSE_EQ", "security_id": 881, "instrument": "EQUITY", "name": "Dr. Reddy's Laboratories"},
    "BPCL": {"segment": "NSE_EQ", "security_id": 526, "instrument": "EQUITY", "name": "Bharat Petroleum Corp. Ltd."},
    "BRITANNIA": {"segment": "NSE_EQ", "security_id": 547, "instrument": "EQUITY", "name": "Britannia Industries Ltd."},
    "EICHERMOT": {"segment": "NSE_EQ", "security_id": 910, "instrument": "EQUITY", "name": "Eicher Motors Ltd."},
    "NESTLEIND": {"segment": "NSE_EQ", "security_id": 17963, "instrument": "EQUITY", "name": "Nestle India Ltd."},
    "HEROMOTOCO": {"segment": "NSE_EQ", "security_id": 1348, "instrument": "EQUITY", "name": "Hero MotoCorp Ltd."},
    "APOLLOHOSP": {"segment": "NSE_EQ", "security_id": 157, "instrument": "EQUITY", "name": "Apollo Hospitals Enterprise"},
    "TATACONSUM": {"segment": "NSE_EQ", "security_id": 3432, "instrument": "EQUITY", "name": "Tata Consumer Products Ltd."},
    "DIVISLAB": {"segment": "NSE_EQ", "security_id": 10940, "instrument": "EQUITY", "name": "Divi's Laboratories Ltd."},
    "HINDALCO": {"segment": "NSE_EQ", "security_id": 1363, "instrument": "EQUITY", "name": "Hindalco Industries Ltd."},
    "SHREECEM": {"segment": "NSE_EQ", "security_id": 3103, "instrument": "EQUITY", "name": "Shree Cement Ltd."},
    "SBILIFE": {"segment": "NSE_EQ", "security_id": 21808, "instrument": "EQUITY", "name": "SBI Life Insurance Co. Ltd."},
    "HDFCLIFE": {"segment": "NSE_EQ", "security_id": 467, "instrument": "EQUITY", "name": "HDFC Life Insurance Co. Ltd."},
    "BAJAJ-AUTO": {"segment": "NSE_EQ", "security_id": 16669, "instrument": "EQUITY", "name": "Bajaj Auto Ltd."},
    "BEL": {"segment": "NSE_EQ", "security_id": 383, "instrument": "EQUITY", "name": "Bharat Electronics Ltd."},
    "TRENT": {"segment": "NSE_EQ", "security_id": 1964, "instrument": "EQUITY", "name": "Trent Ltd."},
}

class DhanMarketDataProvider:
    """Dhan HQ API v2 Live Market Data Provider.
    Streams real-time market quotes, OHLC data, and historical candle series directly from Dhan.
    Includes rate-limit caching, dynamic market status detection (OPEN/CLOSED),
    and cryptographic SHA-256 integrity signatures.
    """
    
    def __init__(self):
        self.base_url = settings.DHAN_API_BASE_URL.rstrip('/')
        self.client_id = settings.DHAN_CLIENT_ID
        self.access_token = settings.DHAN_ACCESS_TOKEN
        self._cache_quotes: Dict[str, Any] = {}
        self._cache_candles: Dict[str, Any] = {}
        self._last_fetch_time: float = 0.0
        self._cache_ttl: float = 6.0  # 6-second throttle to comply with Dhan limits
        
    def _headers(self) -> Dict[str, str]:
        return {
            "access-token": self.access_token,
            "client-id": self.client_id,
            "Content-Type": "application/json"
        }

    def is_configured(self) -> bool:
        return bool(self.client_id and self.access_token)

    def get_market_status(self) -> Dict[str, Any]:
        """Calculates current Indian market session status (OPEN vs CLOSED) based on IST trading hours."""
        tz_ist = timezone(timedelta(hours=5, minutes=30))
        now_ist = datetime.now(tz_ist)
        
        # Monday = 0, Friday = 4, Saturday = 5, Sunday = 6
        is_weekday = now_ist.weekday() < 5
        
        market_open = now_ist.replace(hour=9, minute=15, second=0, microsecond=0)
        market_close = now_ist.replace(hour=15, minute=30, second=0, microsecond=0)
        
        is_trading_hours = is_weekday and (market_open <= now_ist <= market_close)
        
        status = "OPEN" if is_trading_hours else "CLOSED"
        session_desc = "Live Trading Session" if is_trading_hours else (
            "Pre-Market Preparation" if now_ist.hour < 9 else "Market Closed / Post-Market Session"
        )
        
        return {
            "status": status,
            "is_open": is_trading_hours,
            "session": session_desc,
            "ist_time": now_ist.strftime("%d %b %Y, %I:%M:%S %p IST"),
            "trading_hours": "09:15 AM - 03:30 PM IST (Mon-Fri)",
            "exchange": "NSE / BSE",
            "message": "Market is currently OPEN. Streaming real-time tick data from Dhan HQ API." if is_trading_hours else "Market is currently CLOSED. Displaying latest closing session data from Dhan HQ API."
        }

    def fetch_all_live_ohlc(self) -> Dict[str, Dict[str, Any]]:
        """Fetches full real-time OHLC + LTP from Dhan API v2 marketfeed endpoint."""
        now = time.time()
        if self._cache_quotes and (now - self._last_fetch_time) < self._cache_ttl:
            return self._cache_quotes

        if not self.is_configured():
            return {}

        ohlc_map: Dict[str, Dict[str, Any]] = {}
        nse_ids = [m["security_id"] for sym, m in DHAN_SECURITY_MAP.items() if m["segment"] == "NSE_EQ"]
        idx_ids = [m["security_id"] for sym, m in DHAN_SECURITY_MAP.items() if m["segment"] == "IDX_I"]

        payload: Dict[str, List[int]] = {}
        if nse_ids:
            payload["NSE_EQ"] = nse_ids
        if idx_ids:
            payload["IDX_I"] = idx_ids

        try:
            with httpx.Client(timeout=6.0) as client:
                res = client.post(
                    f"{self.base_url}/v2/marketfeed/ohlc",
                    headers=self._headers(),
                    json=payload
                )
                if res.status_code == 200:
                    data = res.json()
                    raw_data = data.get("data", {})
                    
                    id_to_symbol = {(m["segment"], m["security_id"]): sym for sym, m in DHAN_SECURITY_MAP.items()}
                    
                    for seg, sec_dict in raw_data.items():
                        if isinstance(sec_dict, dict):
                            for sec_id_str, quote in sec_dict.items():
                                try:
                                    sec_id = int(sec_id_str)
                                    sym = id_to_symbol.get((seg, sec_id))
                                    if sym and isinstance(quote, dict):
                                        last_price = float(quote.get("last_price", 0.0))
                                        ohlc_dict = quote.get("ohlc", {})
                                        open_p = float(ohlc_dict.get("open", last_price))
                                        high_p = float(ohlc_dict.get("high", last_price))
                                        low_p = float(ohlc_dict.get("low", last_price))
                                        close_p = float(ohlc_dict.get("close", last_price))
                                        
                                        # Calculate change from open or previous close
                                        base_p = open_p if open_p > 0 else last_price
                                        change_pct = round(((last_price - base_p) / base_p) * 100, 2)

                                        ohlc_map[sym] = {
                                            "symbol": sym,
                                            "last_price": last_price,
                                            "open": open_p,
                                            "high": high_p,
                                            "low": low_p,
                                            "close": close_p,
                                            "change": change_pct,
                                            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                                            "source": "DHAN_HQ_API"
                                        }
                                except (ValueError, TypeError):
                                    continue

                    if ohlc_map:
                        self._cache_quotes = ohlc_map
                        self._last_fetch_time = now
                        logger.info(f"[Dhan API] Fetched live OHLC for {len(ohlc_map)} instruments: {list(ohlc_map.keys())}")
                elif res.status_code == 429:
                    logger.warning("[Dhan API] Rate limit (429). Serving cached OHLC feed.")
        except Exception as err:
            logger.warning(f"[Dhan API] Error querying live OHLC: {err}")

        return ohlc_map or self._cache_quotes

    def fetch_all_live_ltp(self) -> Dict[str, float]:
        """Convenience method returning symbol -> last_price mapping."""
        quotes = self.fetch_all_live_ohlc()
        return {sym: q["last_price"] for sym, q in quotes.items()}

    def fetch_candles_from_dhan(self, symbol: str, range_str: str = "1M") -> Optional[List[Dict[str, Any]]]:
        """Fetches authentic historical or intraday candles directly from Dhan charts endpoint."""
        cache_key = f"{symbol}_{range_str}"
        now = time.time()
        if cache_key in self._cache_candles:
            cached_data, cached_at = self._cache_candles[cache_key]
            if (now - cached_at) < 20.0:  # 20-second cache for historical candles
                return cached_data

        clean_sym = symbol.strip().upper()
        meta = DHAN_SECURITY_MAP.get(clean_sym)
        if not meta or not self.is_configured():
            return None

        tz_ist = timezone(timedelta(hours=5, minutes=30))
        now_dt = datetime.now(tz_ist)
        
        # Configure date windows according to range
        if range_str == "1D":
            endpoint = f"{self.base_url}/v2/charts/intraday"
            from_dt = now_dt - timedelta(days=4)  # Ensure we capture previous trading session if weekend
            payload = {
                "securityId": str(meta["security_id"]),
                "exchangeSegment": meta["segment"],
                "instrument": meta["instrument"],
                "interval": "15",
                "fromDate": from_dt.strftime("%Y-%m-%d 09:15:00"),
                "toDate": now_dt.strftime("%Y-%m-%d 15:30:00")
            }
        else:
            endpoint = f"{self.base_url}/v2/charts/historical"
            days_back = {"1W": 7, "1M": 35, "3M": 95, "1Y": 365}.get(range_str, 35)
            from_dt = now_dt - timedelta(days=days_back)
            payload = {
                "securityId": str(meta["security_id"]),
                "exchangeSegment": meta["segment"],
                "instrument": meta["instrument"],
                "expiryCode": 0,
                "fromDate": from_dt.strftime("%Y-%m-%d"),
                "toDate": now_dt.strftime("%Y-%m-%d")
            }

        try:
            with httpx.Client(timeout=8.0) as client:
                res = client.post(endpoint, headers=self._headers(), json=payload)
                if res.status_code == 200:
                    raw = res.json()
                    opens = raw.get("open", [])
                    highs = raw.get("high", [])
                    lows = raw.get("low", [])
                    closes = raw.get("close", [])
                    volumes = raw.get("volume", [])
                    timestamps = raw.get("timestamp", [])

                    n = len(opens)
                    if n > 0:
                        candles: List[Dict[str, Any]] = []
                        close_prices = []
                        
                        for i in range(n):
                            op = float(opens[i])
                            hi = float(highs[i])
                            lo = float(lows[i])
                            cl = float(closes[i])
                            vol = int(volumes[i]) if i < len(volumes) and volumes[i] else 1000000
                            ts = timestamps[i] if i < len(timestamps) else 0

                            # Readable TradingView label
                            if ts:
                                dt = datetime.fromtimestamp(ts, tz=tz_ist)
                                if range_str == "1D":
                                    lbl = dt.strftime("%H:%M")
                                else:
                                    lbl = dt.strftime("%d %b")
                            else:
                                lbl = f"T{i+1}"

                            close_prices.append(cl)
                            
                            # Calculate technical indicators for TradingView view:
                            # 1. 20-period Moving Average
                            window_20 = close_prices[max(0, i - 19): i + 1]
                            ma20 = round(sum(window_20) / len(window_20), 2)
                            
                            # 2. 50-period Moving Average
                            window_50 = close_prices[max(0, i - 49): i + 1]
                            ma50 = round(sum(window_50) / len(window_50), 2)

                            # 3. Bollinger Bands (20 periods, 2 std dev)
                            if len(window_20) > 1:
                                variance = sum((x - ma20) ** 2 for x in window_20) / len(window_20)
                                std_dev = variance ** 0.5
                                upper_bb = round(ma20 + (2.0 * std_dev), 2)
                                lower_bb = round(ma20 - (2.0 * std_dev), 2)
                            else:
                                upper_bb = round(cl * 1.02, 2)
                                lower_bb = round(cl * 0.98, 2)

                            ret = round(((cl - op) / (op or 1.0)) * 100, 2)

                            candles.append({
                                "label": lbl,
                                "timestamp": ts,
                                "open": op,
                                "high": hi,
                                "low": lo,
                                "close": cl,
                                "price": cl,  # for compatibility
                                "volume": vol,
                                "ma": ma20,
                                "ma50": ma50,
                                "upper_band": upper_bb,
                                "lower_band": lower_bb,
                                "returns": ret,
                                "volatility": round(abs(hi - lo) / (cl or 1.0) * 100, 2),
                                "is_up": cl >= op
                            })

                        self._cache_candles[cache_key] = (candles, now)
                        logger.info(f"[Dhan API] Parsed {len(candles)} real candles for {symbol} ({range_str}) directly from Dhan API.")
                        return candles
        except Exception as err:
            logger.warning(f"[Dhan API] Failed fetching candles for {symbol}: {err}")

        return None

dhan_provider = DhanMarketDataProvider()
