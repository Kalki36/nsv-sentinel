from pydantic import BaseModel
from typing import List, Optional

class AlertDetailSchema(BaseModel):
    type: str
    historicalVolume: str
    currentVolume: str
    deviation: str
    historicalVolatility: str
    currentVolatility: str
    manipulationRisk: str
    assessment: str

class SurveillanceAlertSchema(BaseModel):
    id: str
    symbol: str
    activity: str
    anomalyScore: float
    risk: str
    status: str
    detectedAt: str
    detail: AlertDetailSchema

class AlertSummarySchema(BaseModel):
    total: int
    critical: int
    medium: int
    normal: int

class SurveillanceResponse(BaseModel):
    alerts: List[SurveillanceAlertSchema]
    summary: AlertSummarySchema
