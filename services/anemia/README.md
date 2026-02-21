# NetraAI Anemia Detection Service

This microservice provides AI-powered anemia detection by analyzing eye conjunctiva images. It uses a deep learning model (TensorFlow) and a multi-stage eye extraction pipeline.

## Structure
- `src/`: Core model logic, extraction pipeline, and configurations.
- `models/`: Trained model weights (`best_enhanced.h5`).
- `api.py`: FastAPI wrapper exposing the prediction endpoint.
- `Dockerfile`: Container configuration.

## API Endpoints

### POST `/predict`
Analyze an image for anemia.
- **Request**: Multipart form-data with a `file` field.
- **Response**:
```json
{
  "success": true,
  "prediction": "anemic",
  "is_anemic": true,
  "probability": 0.94,
  "confidence": 0.94,
  "severity": "Severe",
  "hemoglobin_level": 9.2,
  "recommendation": "..."
}
```

### GET `/health`
Check service health.

## Running Standalone (Local)
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the server:
   ```bash
   python api.py
   ```
   Server will start at `http://localhost:8001`.

## Docker Usage
Built and managed via the root `docker-compose.yml`:
```bash
docker-compose up --build anemia-service
```
