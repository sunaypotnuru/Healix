import logging
from typing import Optional
from livekit.api import AccessToken, VideoGrants, WebhookReceiver, TokenVerifier

from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Webhook Receiver if keys are present
receiver = None
if settings.LIVEKIT_API_KEY and settings.LIVEKIT_API_SECRET:
    verifier = TokenVerifier(
        settings.LIVEKIT_API_KEY,
        settings.LIVEKIT_API_SECRET
    )
    receiver = WebhookReceiver(verifier)

def create_room_token(room_name: str, identity: str) -> str:
    """Generate a JWT token for a user to join a LiveKit room."""
    if not settings.LIVEKIT_API_KEY or not settings.LIVEKIT_API_SECRET:
        # Fallback for demo environments
        logger.warning("LIVEKIT credentials missing. MOCK mode enabled.")
        return "MOCK_LIVEKIT_TOKEN"

    grant = VideoGrants(roomJoin=True, room=room_name)
    access_token = AccessToken(
        settings.LIVEKIT_API_KEY, 
        settings.LIVEKIT_API_SECRET
    )
    access_token.with_identity(identity).with_grant(grant)
    return access_token.to_jwt()

def receive_webhook(request_body: str, auth_header: str) -> Optional[dict]:
    """Validate and process a LiveKit webhook event."""
    if not receiver:
        logger.warning("Webhook receiver not configured.")
        return None
    try:
        event = receiver.receive(request_body, auth_header)
        # Convert the protobuf-like event to dict for easy handling
        return event
    except Exception as e:
        logger.error(f"Failed to validate LiveKit webhook: {e}")
        return None
