# app/routers/reports.py

import json # <-- Add json import
from typing import Dict
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
# Import ST_AsGeoJSON
from geoalchemy2.functions import ST_GeomFromGeoJSON, ST_AsGeoJSON 
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models import CitizenReport, UserRoleEnum
from app.schemas import CitizenReportCreate, CitizenReportResponse
from app.tasks import trigger_event_correlation

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.post("/citizen", status_code=status.HTTP_201_CREATED, response_model=CitizenReportResponse)
def create_citizen_report(
    report: CitizenReportCreate,
    current_user: Dict[str, str] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a new citizen hazard report."""
    report_data = report.dict(exclude={"location"})
    report_data["user_id"] = current_user["user_id"]
    report_data["user_role"] = current_user["user_role"]
    report_data["location"] = ST_GeomFromGeoJSON(report.location.json())
    report_data["media_urls"] = [str(url) for url in report.media_urls]

    db_report = CitizenReport(**report_data)
    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    trigger_event_correlation(db_report.id)

    # --- THE FIX IS HERE ---
    # Convert the raw geometry from the DB back into a JSON-friendly dict
    # so it matches the Pydantic response model.
    location_geojson_str = db.scalar(ST_AsGeoJSON(db_report.location))
    db_report.location = json.loads(location_geojson_str)

    return db_report