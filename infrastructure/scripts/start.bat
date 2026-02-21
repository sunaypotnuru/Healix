@echo off
echo =======================================
echo     Starting Netra AI Consult Platform
echo =======================================
echo.

echo Starting Backend Server (FastAPI)...
start "Netra AI Backend" cmd /k "cd services\core && venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Anemia AI Service (FastAPI)...
start "Netra AI Anemia" cmd /k "cd services\anemia && venv\Scripts\python.exe -m uvicorn api:app --host 0.0.0.0 --port 8001 --reload"

echo Starting Frontend Server (Vite React)...
start "Netra AI Frontend" cmd /k "cd apps\web && npm run dev"

echo.
echo Servers are running in separate terminal windows.
echo Frontend URL: http://localhost:5173
echo Core Backend API: http://localhost:8000
echo Anemia Service: http://localhost:8001
echo API Docs: http://localhost:8000/docs
echo =======================================
