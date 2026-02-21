from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import numpy as np
import cv2
from pathlib import Path
import sys
import logging

# Add src to path so we can import the pipeline and its dependencies
sys.path.append(str(Path(__file__).parent / "src"))
from pipeline import get_pipeline

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NetraAI Anemia Service")

@app.post("/predict")
async def predict(file: UploadFile = File(None), payload: dict = None):
    """
    Handle both File upload and JSON URL requests.
    """
    try:
        img = None
        filename = "unknown.jpg"

        if file:
            logger.info(f"Received file upload prediction: {file.filename}")
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            filename = file.filename
        elif payload and "image_url" in payload:
            image_url = payload["image_url"]
            logger.info(f"Received URL prediction request: {image_url}")
            import httpx
            async with httpx.AsyncClient() as client:
                resp = await client.get(image_url)
                if resp.status_code == 200:
                    nparr = np.frombuffer(resp.content, np.uint8)
                    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                    filename = Path(image_url).name
        
        if img is None:
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": "Invalid image or missing input"}
            )
        
        pipeline = get_pipeline()
        result = pipeline.predict(
            img, 
            save_heatmap=False, 
            save_original=False, 
            save_cropped=False,
            image_source=filename
        )
        
        if not result.get('success', False):
            return JSONResponse(
                status_code=500,
                content=result
            )

        # Standardize response format for the backend
        return {
            "success": True,
            "prediction": result.get('diagnosis', 'INCONCLUSIVE').lower(),
            "is_anemic": result.get('is_anemic'),
            "probability": result.get('probability'),
            "confidence": result.get('confidence'),
            "severity": result.get('severity'),
            "hemoglobin_level": result.get('hemoglobin_estimate'),
            "recommendation": "Please consult a doctor for a definitive diagnosis." if result.get('is_anemic') else "Your results appear normal, but maintain a healthy diet."
        }
    
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "anemia-service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
