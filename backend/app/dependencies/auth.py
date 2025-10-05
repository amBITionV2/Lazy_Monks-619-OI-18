# app/dependencies/auth.py

import os
from typing import Dict
from fastapi import Depends, HTTPException, status, Request
from jose import JWTError, jwt
from app.schemas import UserRoleEnum

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
if not SUPABASE_JWT_SECRET:
    raise ValueError("SUPABASE_JWT_SECRET not set in .env")

def get_token(request: Request) -> str:
    """Extract Bearer token from Authorization header."""
    auth = request.headers.get("Authorization")
    if not auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    scheme, token = auth.split()
    if scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

# In app/dependencies/auth.py

def get_current_user(token: str = Depends(get_token)) -> Dict[str, str]:
    """Validate JWT and extract user_id (sub) and user_role (custom claim)."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
            options={"verify_signature": True, "verify_exp": True},
        )
        
        # ADD THIS LINE TO SEE THE PAYLOAD
        print("✅ DECODED PAYLOAD ON BACKEND:", payload)
        
        user_id: str = payload.get("sub")
        user_role: str = payload.get("user_role") 

        if user_id is None or user_role is None:
            # This will print if the validation check fails
            print("❌ VALIDATION FAILED: user_id or user_role is missing from payload.")
            raise credentials_exception
        
        return {"user_id": user_id, "user_role": user_role}
    
    except JWTError as e:
        # This will print if the token signature or expiration is invalid
        print("❌ JWT DECODING ERROR:", e)
        raise credentials_exception

def require_role(required_role: UserRoleEnum):
    """Dependency to enforce role-based access."""
    def role_checker(current_user: Dict[str, str] = Depends(get_current_user)):
        if current_user["user_role"] != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {required_role} role",
            )
        return current_user
    return role_checker