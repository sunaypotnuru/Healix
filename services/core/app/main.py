from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.routes import patient, doctor, admin, video, ml, translation

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Netra AI Backend API",
    description="Telemedicine platform specializing in AI-powered anemia detection.",
    version="3.0.0",
)

# CORS for React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── API Routers ─────────────────────────────────────────
app.include_router(patient.router, prefix=settings.API_V1_STR)
app.include_router(doctor.router, prefix=settings.API_V1_STR)
app.include_router(doctor.public_router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(video.router, prefix=settings.API_V1_STR)
app.include_router(ml.router, prefix=settings.API_V1_STR)
app.include_router(translation.router, prefix=settings.API_V1_STR)
from app.services.supabase import supabase as supabase_admin

@app.get("/")
async def root():
    return {"message": "Netra AI API v3.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/api/v1/auth/confirm-email")
async def confirm_email(payload: dict):
    """Auto-confirm a user's email after signup (dev/demo mode).
    Supabase requires email confirmation before granting sessions.
    Since we don't have email delivery configured, this endpoint
    uses the Admin API to confirm the email immediately."""
    user_id = payload.get("user_id")
    if not user_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="user_id is required")
    try:
        supabase_admin.auth.admin.update_user_by_id(user_id, {"email_confirm": True})
        return {"confirmed": True}
    except Exception as e:
        return {"confirmed": False, "error": str(e)}
