"""
api.py - Optional FastAPI deployment layer
Path: src/api.py
Keep as optional - not needed for local pipeline
"""

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import numpy as np
import cv2
import io
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent))
from pipeline import get_pipeline

app = FastAPI(title="NetraAI API")

@app.post("/predict/anemia")
async def predict_anemia(file: UploadFile = File(...)):
    """
    Upload image → extract conjunctiva → predict → return result
    """
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Get pipeline
        pipeline = get_pipeline()
        
        # Predict
        result = pipeline.predict(img, save_heatmap=False)
        
        return {
            "success": True,
            "is_anemic": result['is_anemic'],
            "probability": result['probability'],
            "confidence": result['confidence'],
            "severity": result['severity'],
            "hemoglobin_estimate": result['hemoglobin_estimate']
        }
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.get("/health")
async def health():
    return {"status": "healthy", "model": "best_enhanced.h5"}
