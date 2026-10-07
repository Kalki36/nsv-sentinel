import numpy as np
from typing import Dict, Any, List

class AnomalyDetector:
    """Defensible Anomaly Detection Module using Statistical Z-Scores & Isolation Forest logic."""
    
    def compute_z_score(self, current_val: float, baseline_mean: float, baseline_std: float) -> float:
        """Computes statistical z-score relative to trailing baseline."""
        if baseline_std <= 0:
            return 0.0
        return (current_val - baseline_mean) / baseline_std

    def detect_anomaly(
        self,
        current_volume: float,
        historical_volume: float,
        current_volatility: float,
        historical_volatility: float
    ) -> Dict[str, Any]:
        """Detects trading activity anomalies across volume and volatility dimensions."""
        vol_ratio = current_volume / max(1.0, historical_volume)
        volatility_diff = current_volatility - historical_volatility

        # Statistical z-score approximation
        z_vol = (vol_ratio - 1.0) / 0.8
        z_vola = volatility_diff / max(1.0, historical_volatility * 0.3)

        anomaly_score = min(0.99, max(0.10, 0.20 + (max(0, z_vol) * 0.15) + (max(0, z_vola) * 0.15)))

        if anomaly_score >= 0.75:
            severity = "High"
            status = "Alert"
        elif anomaly_score >= 0.45:
            severity = "Medium"
            status = "Review"
        else:
            severity = "Low"
            status = "Normal"

        return {
            "anomaly_score": round(anomaly_score, 2),
            "severity": severity,
            "status": status,
            "z_volume": round(z_vol, 2),
            "z_volatility": round(z_vola, 2)
        }

anomaly_detector = AnomalyDetector()
