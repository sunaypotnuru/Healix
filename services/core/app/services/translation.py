import requests
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

def translate_text(text: str, target_lang: str, source_lang: str = "en") -> str:
    """
    Translate text using self-hosted LibreTranslate microservice.
    """
    try:
        if not text or source_lang == target_lang:
            return text
            
        response = requests.post(
            f"{settings.LIBRETRANSLATE_URL}/translate",
            json={
                "q": text,
                "source": source_lang,
                "target": target_lang,
                "format": "text"
            },
            timeout=5
        )
        response.raise_for_status()
        return response.json()["translatedText"]
    except Exception as e:
        logger.error(f"LibreTranslate error: {e}")
        return text  # Fallback to original text on failure
