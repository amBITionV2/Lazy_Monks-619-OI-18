# app/schemas.py

import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional, Tuple, Dict

from pydantic import BaseModel, Field, HttpUrl

# Enums (match database ENUM types)
class UserRoleEnum(str, Enum):
    PUBLIC = "PUBLIC"
    VERIFIED_VOLUNTEER = "VERIFIED_VOLUNTEER"
    OFFICIAL = "OFFICIAL"

class HazardTypeEnum(str, Enum):
    HIGH_WAVES = "HIGH_WAVES"
    SWELL_SURGE = "SWELL_SURGE"
    COASTAL_FLOODING = "COASTAL_FLOODING"
    UNUSUAL_TIDE = "UNUSUAL_TIDE"
    TSUNAMI_SIGHTING = "TSUNAMI_SIGHTING"
    OTHER = "OTHER"

class AlertSeverityEnum(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"

# GeoJSON Schemas
class GeoPoint(BaseModel):
    type: str = "Point"
    coordinates: Tuple[float, float]  # (longitude, latitude)

class GeoPolygon(BaseModel):
    type: str = "Polygon"
    coordinates: List[List[Tuple[float, float]]]

# API Request Body Schemas
class CitizenReportCreate(BaseModel):
    hazard_type: HazardTypeEnum
    description: Optional[str] = None
    location: GeoPoint
    media_urls: List[HttpUrl] = Field(default_factory=list)

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    push_token: Optional[str] = None
    last_known_location: Optional[GeoPoint] = None

class AlertCreate(BaseModel):
    severity: AlertSeverityEnum
    title: str
    message: str
    affected_area: GeoPolygon

class AnalystFeedbackCreate(BaseModel):
    social_post_id: uuid.UUID
    action: str  # e.g., 'CONFIRMED', 'DISMISSED'
    correction_data: Optional[Dict] = None

class SetUserRole(BaseModel):
    new_role: UserRoleEnum

# Response Schemas
class CitizenReportResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    hazard_type: HazardTypeEnum
    description: Optional[str]
    location: GeoPoint
    media_urls: List[str]
    created_at: datetime
    user_role: UserRoleEnum

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class AlertResponse(BaseModel):
    id: uuid.UUID
    severity: AlertSeverityEnum
    title: str
    message: str
    affected_area: GeoPolygon
    created_at: datetime
    created_by: uuid.UUID

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class AnalystFeedbackResponse(BaseModel):
    id: uuid.UUID
    social_post_id: uuid.UUID
    action: str
    correction_data: Optional[Dict]
    created_by: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }