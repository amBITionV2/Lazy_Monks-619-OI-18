# app/models.py

from sqlalchemy import Column, Enum, ForeignKey, String, DateTime, func, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from geoalchemy2 import Geometry
import enum

Base = declarative_base()

# Enums (match schemas.py)
class UserRoleEnum(str, enum.Enum):
    PUBLIC = "PUBLIC"
    VERIFIED_VOLUNTEER = "VERIFIED_VOLUNTEER"
    OFFICIAL = "OFFICIAL"

class HazardTypeEnum(str, enum.Enum):
    HIGH_WAVES = "HIGH_WAVES"
    SWELL_SURGE = "SWELL_SURGE"
    COASTAL_FLOODING = "COASTAL_FLOODING"
    UNUSUAL_TIDE = "UNUSUAL_TIDE"
    TSUNAMI_SIGHTING = "TSUNAMI_SIGHTING"
    OTHER = "OTHER"

class AlertSeverityEnum(str, enum.Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"

# Profile model
class Profile(Base):
    __tablename__ = "profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    full_name = Column(String)
    role = Column(Enum(UserRoleEnum, name="user_role_enum"), default=UserRoleEnum.PUBLIC, nullable=False)
    push_token = Column(String)
    last_known_location = Column(Geometry(geometry_type='POINT', srid=4326))

# CitizenReport model
class CitizenReport(Base):
    __tablename__ = "citizen_reports"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    hazard_type = Column(Enum(HazardTypeEnum, name="hazard_type_enum"), nullable=False)
    description = Column(String)
    location = Column(Geometry(geometry_type='POINT', srid=4326), nullable=False)
    media_urls = Column(ARRAY(String), default=[])
    created_at = Column(DateTime, server_default=func.now())
    user_role = Column(Enum(UserRoleEnum, name="user_role_enum"), nullable=False)

# Alert model
class Alert(Base):
    __tablename__ = "alerts"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    severity = Column(Enum(AlertSeverityEnum, name="alert_severity_enum"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    affected_area = Column(Geometry(geometry_type='POLYGON', srid=4326), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)

# AnalystFeedback model
class AnalystFeedback(Base):
    __tablename__ = "analyst_feedback"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())
    social_post_id = Column(UUID(as_uuid=True), nullable=False)
    action = Column(String, nullable=False)
    correction_data = Column(JSON)
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())