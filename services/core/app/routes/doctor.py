from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
import json

from app.core.security import get_current_doctor
from app.models.schemas import (
    TokenPayload, DoctorProfileResponse, AppointmentResponse, 
    ScanResponse, PrescriptionCreate, PrescriptionResponse,
    AppointmentUpdateStatus
)
from app.services.supabase import supabase

router = APIRouter(prefix="/doctor", tags=["Doctor"])
public_router = APIRouter(prefix="/doctors", tags=["Public Doctors"])

@public_router.get("")
async def get_all_doctors(q: Optional[str] = None):
    """List all verified doctors for patients with optional search."""
    query = supabase.table("profiles_doctor").select("*, profiles:id(*)")
    
    if q:
        # Simple search across name and specialty
        # Note: or_ is used for complex filters in Supabase
        res = query.or_(f"name.ilike.%{q}%,specialty.ilike.%{q}%").execute()
    else:
        res = query.execute()
        
    return res.data

@router.get("/dashboard")
async def get_dashboard(current_user: TokenPayload = Depends(get_current_doctor)):
    """Fetch aggregated dashboard data for the doctor."""
    try:
        # Get profile
        profile_res = supabase.table("profiles_doctor").select("*").eq("id", current_user.sub).execute()
        
        if not profile_res.data:
            # Auto-create profile if missing (due to no DB trigger on signup)
            user_auth = supabase.auth.admin.get_user_by_id(current_user.sub)
            meta = user_auth.user.user_metadata if user_auth and user_auth.user else {}
            name = meta.get("full_name") or meta.get("name") or "New Doctor"
            specialty = meta.get("specialty", "General")
            
            # Use fallback consultation fee from Meta if preset
            fee = meta.get("consultation_fee", 0)
            if isinstance(fee, str) and fee.isdigit():
                fee = int(fee)
            elif not isinstance(fee, (int, float)):
                fee = 0
            
            new_profile = {
                "id": current_user.sub,
                "email": current_user.email,
                "name": name,
                "specialty": specialty,
                "consultation_fee": fee
            }
            supabase.table("profiles_doctor").insert(new_profile).execute()
            profile = new_profile
        else:
            profile = profile_res.data[0]

        # Get today's appointments
        today = datetime.now().date().isoformat()
        appts_res = supabase.table("appointments").select("*, profiles_patient(name, age, avatar_url)").eq("doctor_id", current_user.sub).gte("date_time", today).execute()
        
        # Get pending scans assigned to this doctor's patients
        pat_ids = [appt["patient_id"] for appt in appts_res.data] if appts_res.data else []
        scans_data = []
        if pat_ids:
            scans_res = supabase.table("scans").select("*, profiles_patient(name)").in_("patient_id", list(set(pat_ids))).eq("processed_by_ai", False).execute()
            scans_data = scans_res.data

        # Aggregate super simple stats
        revenue = sum([profile.get("consultation_fee", 0) for _ in appts_res.data]) if profile else 0
        stats = {
            "appointments_today": len(appts_res.data) if appts_res.data else 0,
            "pending_patients": len(scans_data),
            "revenue_today": revenue
        }

        return {
            "profile": profile,
            "appointments": appts_res.data,
            "pending_scans": scans_data,
            "stats": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patients")
async def get_patients(current_user: TokenPayload = Depends(get_current_doctor)):
    """List patients that have booked an appointment with this doctor."""
    appts_res = supabase.table("appointments").select("patient_id").eq("doctor_id", current_user.sub).execute()
    if not appts_res.data:
        return []
    patient_ids = list(set([a["patient_id"] for a in appts_res.data]))
    patients_res = supabase.table("profiles_patient").select("*").in_("id", patient_ids).execute()
    return patients_res.data

@router.put("/appointments/{id}/status", response_model=AppointmentResponse)
async def update_appointment_status(id: str, update: AppointmentUpdateStatus, current_user: TokenPayload = Depends(get_current_doctor)):
    """Update appointment status (e.g. mark as completed)."""
    res = supabase.table("appointments").update({"status": update.status}).eq("id", id).eq("doctor_id", current_user.sub).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Appointment not found or not authorized.")
    return res.data[0]

@router.post("/prescriptions", response_model=PrescriptionResponse)
async def create_prescription(rx: PrescriptionCreate, current_user: TokenPayload = Depends(get_current_doctor)):
    """Generate a prescription for a patient."""
    data = rx.model_dump()
    data["doctor_id"] = current_user.sub
    
    # Store JSONB correctly
    data["medications"] = [med for med in rx.medications]
    
    res = supabase.table("prescriptions").insert(data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to create prescription.")
    return res.data[0]
@router.get("/appointments", response_model=List[AppointmentResponse])
async def get_appointments(current_user: TokenPayload = Depends(get_current_doctor)):
    """Get all appointments for the doctor with patient details."""
    res = supabase.table("appointments").select("*, profiles_patient(name, age, gender, blood_type, avatar_url)").eq("doctor_id", current_user.sub).order("date_time", desc=True).execute()
    return res.data
@router.put("/availability")
async def update_availability(payload: dict, current_user: TokenPayload = Depends(get_current_doctor)):
    """Update doctor's weekly availability slots."""
    availability = payload.get("availability")
    res = supabase.table("profiles_doctor").update({"availability": availability}).eq("id", current_user.sub).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to update availability.")
    return res.data[0]
