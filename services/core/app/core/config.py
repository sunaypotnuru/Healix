from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Supabase (Database & Auth)
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str

    # LiveKit (Video Calls)
    LIVEKIT_API_KEY: Optional[str] = None
    LIVEKIT_API_SECRET: Optional[str] = None
    LIVEKIT_URL: Optional[str] = None

    # External ML API
    ANEMIA_API_URL: str = "http://localhost:8001"

    # Translation Service
    LIBRETRANSLATE_URL: str = "http://libretranslate:5000"

    # Frontend/API
    API_V1_STR: str = "/api/v1"

    # Development
    BYPASS_AUTH: bool = False

    model_config = {
        "env_file": "../../.env",
        "extra": "ignore",
        "case_sensitive": True
    }

settings = Settings()
