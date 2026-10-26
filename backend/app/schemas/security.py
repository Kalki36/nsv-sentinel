from pydantic import BaseModel
from typing import List, Optional

class SecurityCardSchema(BaseModel):
    id: str
    label: str
    status: str
    tone: str

class SecurityFactorSchema(BaseModel):
    title: str
    status: str
    explanation: str

class SecurityStatusResponse(BaseModel):
    overall: str
    cards: List[SecurityCardSchema]
    factors: Optional[List[SecurityFactorSchema]] = None

class SecurityEventSchema(BaseModel):
    id: str
    time: str
    event: str
    severity: str
    action: str
    status: str

class AuditLogSchema(BaseModel):
    id: str
    timestamp: str
    actor: str
    event: str
    module: str
    status: str
