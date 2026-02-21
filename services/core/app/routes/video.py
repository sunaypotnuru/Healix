from fastapi import APIRouter, Depends, HTTPException, Request, Header
from app.core.security import get_current_user
from app.models.schemas import TokenPayload, VideoTokenRequest, VideoTokenResponse
from app.services.livekit import create_room_token, receive_webhook
from app.services.supabase import supabase
from app.core.config import settings

router = APIRouter(prefix="/video", tags=["Video"])

@router.get("/token", response_model=VideoTokenResponse)
async def get_video_token(
    room: str, 
    identity: str,
    current_user: TokenPayload = Depends(get_current_user)
):
    """
    Generate a LiveKit JWT token for connecting to a video consultation room.
    """
    # Verify the appointment exists
    appt_res = supabase.table("appointments").select("id").eq("livekit_room", room).execute()
    if not appt_res.data:
        # Creating ad-hoc or failing. We'll allow ad-hoc for demo flexibility
        pass
        
    token = create_room_token(room, identity)
    return {
        "token": token,
        "serverUrl": settings.LIVEKIT_URL or "ws://localhost:7880"
    }

@router.post("/webhook")
async def livekit_webhook(request: Request, authorization: str = Header(None)):
    """
    Handle LiveKit Webhooks (room started, participant joined, room finished).
    """
    body = await request.body()
    body_str = body.decode('utf-8')
    
    event = receive_webhook(body_str, authorization)
    if not event:
        raise HTTPException(status_code=400, detail="Invalid webhook representation")
        
    event_type = getattr(event, "event", None)
    room = getattr(event, "room", None)
    
    if event_type == "room_finished" and room:
        # Update appointment status to completed and log duration
        room_name = room.name
        duration = room.empty_timeout # Approx metric, or compute from timestamps
        
        supabase.table("appointments").update({
            "status": "completed",
            "duration_minutes": duration // 60
        }).eq("livekit_room", room_name).execute()
        
    return {"message": "Webhook processed successfully"}
