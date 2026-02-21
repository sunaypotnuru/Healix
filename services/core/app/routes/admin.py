from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.core.security import get_current_admin
from app.models.schemas import TokenPayload, UserRole
from app.services.supabase import supabase

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats")
async def get_platform_stats(current_user: TokenPayload = Depends(get_current_admin)):
    """Platform wide statistics overview."""
    try:
        pat_res = supabase.table("profiles_patient").select("id", count="exact").execute()
        doc_res = supabase.table("profiles_doctor").select("id", count="exact").execute()
        appt_res = supabase.table("appointments").select("id", count="exact").execute()
        scan_res = supabase.table("scans").select("id", count="exact").execute()
        
        return {
            "total_patients": pat_res.count,
            "total_doctors": doc_res.count,
            "total_appointments": appt_res.count,
            "total_scans": scan_res.count,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/doctors/pending")
async def get_pending_doctors(current_user: TokenPayload = Depends(get_current_admin)):
    """List unverified doctors requiring admin approval."""
    res = supabase.table("profiles_doctor").select("*").eq("is_verified", False).execute()
    return res.data

@router.put("/doctors/{id}/verify")
async def verify_doctor(id: str, payload: dict, current_user: TokenPayload = Depends(get_current_admin)):
    """Approve or revoke a doctor's profile verification."""
    verified = payload.get("verified", True)
    res = supabase.table("profiles_doctor").update({"is_verified": verified}).eq("id", id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Doctor not found.")
    return res.data[0]

@router.put("/users/{id}/role")
async def update_user_role(id: str, role: UserRole, current_user: TokenPayload = Depends(get_current_admin)):
    """
    Update a user's role.
    Note: Supabase Auth metadata updates are strictly admin-only.
    """
    try:
        # We use supabase.auth.admin to update user metadata
        supabase.auth.admin.update_user_by_id(
            id,
            {"user_metadata": {"role": role.value}}
        )
        return {"message": f"Role updated to {role.value} successfully.", "user_id": id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patients")
async def get_all_patients(current_user: TokenPayload = Depends(get_current_admin)):
    """List all patient profiles."""
    res = supabase.table("profiles_patient").select("*").execute()
    return res.data

@router.get("/doctors")
async def get_all_doctors(current_user: TokenPayload = Depends(get_current_admin)):
    """List all doctor profiles."""
    res = supabase.table("profiles_doctor").select("*").execute()
    return res.data

@router.get("/appointments")
async def get_all_appointments(current_user: TokenPayload = Depends(get_current_admin)):
    """List all appointments with patient and doctor info."""
    res = supabase.table("appointments").select("*, profiles_patient(name), profiles_doctor(name)").execute()
    return res.data

@router.get("/scans")
async def get_all_scans(current_user: TokenPayload = Depends(get_current_admin)):
    """List all AI scans performed on the platform."""
    res = supabase.table("scans").select("*, profiles_patient(name)").execute()
    return res.data
