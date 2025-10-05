# app/routers/admin.py

from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from geoalchemy2.functions import ST_GeomFromGeoJSON, ST_Within
from app.database import get_db
from app.dependencies.auth import get_current_user, require_role
from app.models import Alert, AnalystFeedback, Profile, UserRoleEnum
from app.schemas import AlertCreate, AlertResponse, AnalystFeedbackCreate, AnalystFeedbackResponse, SetUserRole
from app.tasks import trigger_keyword_tuner
import httpx
import os

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.post("/alerts/create", status_code=status.HTTP_202_ACCEPTED, response_model=AlertResponse)
def create_alert(
    alert: AlertCreate,
    current_user: Dict[str, str] = Depends(require_role(UserRoleEnum.OFFICIAL)),
    db: Session = Depends(get_db),
):
    """Create and dispatch a geo-targeted alert."""

    # Convert Pydantic model to dict
    alert_data = alert.dict()
    alert_data["created_by"] = current_user["user_id"]
    alert_data["affected_area"] = ST_GeomFromGeoJSON(alert.affected_area.json())

    # Insert alert into DB
    db_alert = Alert(**alert_data)
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)

    # Geospatial query to find push tokens in affected area
    query = text("""
        SELECT push_token
        FROM profiles
        WHERE push_token IS NOT NULL
        AND ST_Within(last_known_location, ST_GeomFromGeoJSON(:affected_area))
    """)
    result = db.execute(query, {"affected_area": alert.affected_area.json()}).fetchall()
    push_tokens = [row[0] for row in result if row[0]]

    # Send notifications via Expo Push API (synchronously)
    if push_tokens:
        expo_url = os.getenv("EXPO_PUSH_URL", "https://exp.host/--/api/v2/push/send")
        with httpx.Client() as client:
            for i in range(0, len(push_tokens), 100):
                chunk = push_tokens[i:i+100]
                payload = [{"to": t, "title": alert.title, "body": alert.message} for t in chunk]
                try:
                    client.post(expo_url, json=payload)
                except httpx.HTTPStatusError:
                    # Log error but continue
                    pass

    return db_alert


@router.post("/feedback", status_code=status.HTTP_201_CREATED, response_model=AnalystFeedbackResponse)
def create_feedback(
    feedback: AnalystFeedbackCreate,
    current_user: Dict[str, str] = Depends(require_role(UserRoleEnum.OFFICIAL)),
    db: Session = Depends(get_db),
):
    """Log analyst feedback on social media post."""

    feedback_data = feedback.dict()
    feedback_data["created_by"] = current_user["user_id"]

    db_feedback = AnalystFeedback(**feedback_data)
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)

    # Queue background job for keyword tuner
    trigger_keyword_tuner(db_feedback.id)

    return db_feedback


@router.post("/users/{user_id}/set-role", status_code=status.HTTP_204_NO_CONTENT)
def set_user_role(
    user_id: str,
    role_data: SetUserRole,
    current_user: Dict[str, str] = Depends(require_role(UserRoleEnum.OFFICIAL)),
    db: Session = Depends(get_db),
):
    """Promote or demote a user's role."""

    profile = db.query(Profile).filter(Profile.id == user_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    profile.role = role_data.new_role
    db.commit()
