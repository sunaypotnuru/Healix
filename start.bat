@echo off
REM ═════════════════════════════════════════════════════════════════════════════
REM NetraAI Quick Start Script for Windows
REM This script automates the setup and launch of the entire platform
REM ═════════════════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion
cls

echo.
echo ╔═════════════════════════════════════════════════════════════════╗
echo ║          🏥 NetraAI - Telemedicine Platform                    ║
echo ║             Quick Start Script for Windows                     ║
echo ╚═════════════════════════════════════════════════════════════════╝
echo.

REM Check prerequisites
echo [1/5] Checking prerequisites...
echo.

where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Docker not found in PATH
    echo    Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

where docker-compose >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Docker Compose not found in PATH
    echo    Docker Desktop includes Docker Compose, reinstall Docker
    pause
    exit /b 1
)

echo ✅ Docker Desktop found
echo ✅ Docker Compose found
echo.

REM Check if Docker daemon is running
echo [2/5] Checking Docker daemon...
docker ps >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Docker daemon is not running
    echo    Please start Docker Desktop from your applications
    pause
    exit /b 1
)
echo ✅ Docker daemon is running
echo.

REM Check if .env exists
echo [3/5] Checking configuration...
if not exist ".env" (
    echo ⚠️  WARNING: .env file not found
    echo    Creating .env from template...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✅ Created .env file
        echo.
        echo 📝 IMPORTANT: Edit .env with your credentials:
        echo    - SUPABASE_URL
        echo    - SUPABASE_SERVICE_KEY
        echo    - VITE_SUPABASE_ANON_KEY
        echo    - LIVEKIT_API_KEY
        echo    - LIVEKIT_API_SECRET
        echo.
        set /p "response=Continue anyways? (y/n) "
        if /i not "!response!"=="y" exit /b 0
    ) else (
        echo ❌ ERROR: .env.example not found
        pause
        exit /b 1
    )
)
echo ✅ Configuration file found
echo.

REM Build images
echo [4/5] Building Docker images...
echo    This may take 2-5 minutes on first run...
docker-compose build --no-cache
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Docker build failed
    echo    Check the logs above for more information
    pause
    exit /b 1
)
echo ✅ Docker images built successfully
echo.

REM Start services
echo [5/5] Starting services...
docker-compose up -d --remove-orphans
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Failed to start services
    echo    Run: docker-compose logs
    pause
    exit /b 1
)
echo.

REM Wait for services to be ready
echo ⏳ Waiting for services to start (30 seconds)...
timeout /t 5 /nobreak

setlocal enabledelayedexpansion
set /A counter=0
:wait_loop
set /A counter+=1
if !counter! gtr 25 goto services_started

docker ps | find "netrai" >nul
if %ERRORLEVEL% EQU 0 goto services_started

timeout /t 1 /nobreak
goto wait_loop

:services_started
echo.
echo ╔═════════════════════════════════════════════════════════════════╗
echo ║                    ✅ STARTUP COMPLETE                         ║
echo ╚═════════════════════════════════════════════════════════════════╝
echo.

REM Display service status
echo 📊 Service Status:
docker-compose ps
echo.

REM Display URLs
echo 🌐 Access Points:
echo.
echo    Frontend (Web Portal):
echo    👉 http://localhost:3000
echo.
echo    Backend API (Swagger Docs):
echo    👉 http://localhost:8000/docs
echo.
echo    Anemia Detection Service:
echo    👉 http://localhost:8001
echo.
echo    LibreTranslate (Auto Translation):
echo    👉 http://localhost:5000
echo.

REM Demo mode info
echo 🔐 Demo Mode:
echo    To test without real Supabase credentials:
echo    1. Edit .env: Set BYPASS_AUTH=true
echo    2. Restart: docker-compose down && docker-compose up
echo    3. Login with any email (e.g., patient@demo.com)
echo.

REM Helpful commands
echo 💡 Useful Commands:
echo.
echo    View all logs:
echo    👉 docker-compose logs -f
echo.
echo    View specific service logs:
echo    👉 docker-compose logs -f backend
echo.
echo    Stop everything:
echo    👉 docker-compose down
echo.
echo    Stop everything and remove data:
echo    👉 docker-compose down -v
echo.
echo    Execute command in container:
echo    👉 docker-compose exec backend bash
echo.

echo 📖 Documentation:
echo    See README.md for detailed setup instructions
echo    See DEPLOYMENT_GUIDE.md for production deployment
echo    See VERIFICATION_CHECKLIST.md for testing procedures
echo.

echo ✨ System is ready! Open http://localhost:3000 in your browser.
echo.
pause
