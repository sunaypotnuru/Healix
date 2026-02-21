from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.translation import translate_text

router = APIRouter(prefix="/translation", tags=["Translation"])

class TranslationRequest(BaseModel):
    text: str
    target_lang: str
    source_lang: str = "en"

class TranslationResponse(BaseModel):
    translated_text: str

@router.post("", response_model=TranslationResponse)
async def translate(req: TranslationRequest):
    """
    Translate text to a target language.
    """
    try:
        translated = translate_text(req.text, req.target_lang, req.source_lang)
        return {"translated_text": translated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
