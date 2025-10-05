# app/routers/user.py

from typing import Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from geoalchemy2.functions import ST_GeomFromGeoJSON
import json

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models import Profile
from app.schemas import ProfileUpdate

router = APIRouter(prefix="/api/me", tags=["User"])


@router.patch("/profile", status_code=status.HTTP_204_NO_CONTENT)
def update_profile(
    profile_update: ProfileUpdate,
    current_user: Dict[str, str] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update authenticated user's profile."""
    user_id = current_user["user_id"]

    profile = db.query(Profile).filter(Profile.id == user_id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    # Get dict of only provided fields
    update_data = profile_update.dict(exclude_unset=True)

    # Handle last_known_location separately
    if profile_update.last_known_location:
        update_data["last_known_location"] = ST_GeomFromGeoJSON(
            profile_update.last_known_location.json()
        )

    # Apply updates to SQLAlchemy model
    for key, value in update_data.items():
        setattr(profile, key, value)

    db.commit()
