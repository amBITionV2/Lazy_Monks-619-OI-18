# app/main.py

from typing import Dict
from fastapi import Depends, FastAPI
from app.dependencies.auth import get_current_user
from app.routers import user, reports, admin

app = FastAPI(
    title="Samudra Prahari Backend",
    description="API for coastal hazard reporting and alerting",
    version="1.0",
)

# Include routers
app.include_router(user.router)
app.include_router(reports.router)
app.include_router(admin.router)

@app.get("/test-auth")
def test_auth(current_user: Dict[str, str] = Depends(get_current_user)):
    return current_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)