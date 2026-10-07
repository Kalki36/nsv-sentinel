import httpx
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.security import compute_integrity_hash

logger = logging.getLogger("nsv_sentinel")

class DhanMarketDataProvider:
    """Dhan HQ API v2 Market Data Provider.
    Fetches market quotes, depth, and historical OHLCV candle charts for Indian securities & indices.
    """
    
    def __init__(self):
        self.base_url = settings.DHAN_API_BASE_URL
        self.client_id = settings.DHAN_CLIENT_ID
        self.access_token = settings.DHAN_ACCESS_TOKEN
        
    def _headers(self) -> Dict[str, str]:
        return {
          "access-token": self.access_token,
          "client-id": self.client_id,
          "Content-Type": "application/json"
        }

    def fetch_live_quote(self, security_id: str, exchange_segment: str = "NSE_EQ") -> Optional[Dict[str, Any]]:
        """Fetches live market quote from Dhan API v2."""
        if not self.client_id or not self.access_token:
            return None

        try:
            with httpx.Client(timeout=5.0) as client:
                res = client.post(
                    f"{self.base_url}/v2/marketfeed/quote",
                    headers=self._headers(),
                    json={"securityId": security_id, "exchangeSegment": exchange_segment}
                )
                if res.status_code == 200:
                    data = res.json()
                    integrity_hash = compute_integrity_hash(str(data))
                    return {
                        **data,
                        "integrity_hash": integrity_hash,
                        "source": "DHAN_HQ_API"
                    }
        except Exception as err:
            logger.warning(f"[Dhan API] Unable to connect to Dhan live quote service: {err}")
        return None

dhan_provider = DhanMarketDataProvider()
