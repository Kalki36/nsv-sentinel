from typing import List, Dict, Any, Optional

SURVEILLANCE_ALERTS = [
  {
    "id": "NSV-1042",
    "symbol": "RELIANCE",
    "activity": "Unusual Volume",
    "anomalyScore": 0.91,
    "risk": "High",
    "status": "Alert",
    "detectedAt": "10:41:58",
    "detail": {
      "type": "Unusual Trading Activity",
      "historicalVolume": "1.2M",
      "currentVolume": "5.8M",
      "deviation": "+383%",
      "historicalVolatility": "14%",
      "currentVolatility": "29%",
      "manipulationRisk": "High",
      "assessment": "Potential suspicious / anomalous market activity detected. Volume and volatility deviate sharply from the 30-day baseline. Requires further review by a compliance analyst."
    }
  },
  {
    "id": "NSV-1038",
    "symbol": "TCS",
    "activity": "Price Movement",
    "anomalyScore": 0.32,
    "risk": "Low",
    "status": "Normal",
    "detectedAt": "10:22:14",
    "detail": {
      "type": "Minor Price Deviation",
      "historicalVolume": "1.9M",
      "currentVolume": "2.1M",
      "deviation": "+11%",
      "historicalVolatility": "10%",
      "currentVolatility": "11%",
      "manipulationRisk": "Low",
      "assessment": "Movement is within expected statistical range. No further review required at this time."
    }
  },
  {
    "id": "NSV-1035",
    "symbol": "INFY",
    "activity": "Unusual Volume",
    "anomalyScore": 0.74,
    "risk": "Medium",
    "status": "Review",
    "detectedAt": "09:58:47",
    "detail": {
      "type": "Abnormal Trading Pattern",
      "historicalVolume": "3.0M",
      "currentVolume": "5.4M",
      "deviation": "+80%",
      "historicalVolatility": "13%",
      "currentVolatility": "18%",
      "manipulationRisk": "Medium",
      "assessment": "Volume deviation exceeds the moderate threshold. Flagged for analyst review; no conclusive pattern identified yet."
    }
  },
  {
    "id": "NSV-1029",
    "symbol": "ADANIENT",
    "activity": "Volatility Spike",
    "anomalyScore": 0.88,
    "risk": "High",
    "status": "Alert",
    "detectedAt": "09:41:03",
    "detail": {
      "type": "Volatility Spike",
      "historicalVolume": "7.1M",
      "currentVolume": "11.6M",
      "deviation": "+63%",
      "historicalVolatility": "19%",
      "currentVolatility": "35%",
      "manipulationRisk": "High",
      "assessment": "Volatility has more than doubled against the trailing baseline. Potential suspicious activity detected; escalated for review."
    }
  },
  {
    "id": "NSV-1021",
    "symbol": "TATAMOTORS",
    "activity": "Abnormal Trading Pattern",
    "anomalyScore": 0.58,
    "risk": "Medium",
    "status": "Review",
    "detectedAt": "09:15:39",
    "detail": {
      "type": "Abnormal Trading Pattern",
      "historicalVolume": "4.4M",
      "currentVolume": "9.3M",
      "deviation": "+111%",
      "historicalVolatility": "16%",
      "currentVolatility": "22%",
      "manipulationRisk": "Medium",
      "assessment": "Pattern deviates from typical intraday behavior. Under active monitoring, no conclusion reached."
    }
  },
  {
    "id": "NSV-1015",
    "symbol": "HDFCBANK",
    "activity": "Price Anomaly",
    "anomalyScore": 0.21,
    "risk": "Low",
    "status": "Normal",
    "detectedAt": "08:52:11",
    "detail": {
      "type": "Price Anomaly",
      "historicalVolume": "6.2M",
      "currentVolume": "6.8M",
      "deviation": "+9%",
      "historicalVolatility": "9%",
      "currentVolatility": "10%",
      "manipulationRisk": "Low",
      "assessment": "Within normal statistical bounds. No action required."
    }
  },
  {
    "id": "NSV-1009",
    "symbol": "RELIANCE",
    "activity": "Price Anomaly",
    "anomalyScore": 0.44,
    "risk": "Medium",
    "status": "Review",
    "detectedAt": "08:30:52",
    "detail": {
      "type": "Price Anomaly",
      "historicalVolume": "1.4M",
      "currentVolume": "2.0M",
      "deviation": "+43%",
      "historicalVolatility": "15%",
      "currentVolatility": "19%",
      "manipulationRisk": "Medium",
      "assessment": "Mild deviation flagged by the anomaly model. Queued for analyst review."
    }
  }
]

def get_surveillance_feed(severity_filter: Optional[str] = None, symbol_filter: Optional[str] = None) -> Dict[str, Any]:
    alerts = SURVEILLANCE_ALERTS
    if severity_filter and severity_filter != "All":
        alerts = [a for a in alerts if a["risk"] == severity_filter]
    if symbol_filter:
        alerts = [a for a in alerts if a["symbol"] == symbol_filter]

    summary = {
        "total": len(SURVEILLANCE_ALERTS),
        "critical": len([a for a in SURVEILLANCE_ALERTS if a["risk"] == "High"]),
        "medium": len([a for a in SURVEILLANCE_ALERTS if a["risk"] == "Medium"]),
        "normal": len([a for a in SURVEILLANCE_ALERTS if a["risk"] == "Low"])
    }

    return {
        "alerts": alerts,
        "summary": summary
    }

def get_alert_by_id(alert_id: str) -> Optional[Dict[str, Any]]:
    return next((a for a in SURVEILLANCE_ALERTS if a["id"] == alert_id), None)
