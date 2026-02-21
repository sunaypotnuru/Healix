#!/bin/bash

# ═════════════════════════════════════════════════════════════════════════════
# NetraAI Quick Start Script for macOS/Linux
# This script automates the setup and launch of the entire platform
# ═════════════════════════════════════════════════════════════════════════════

set -e

clear

echo ""
echo "╔═════════════════════════════════════════════════════════════════╗"
echo "║          🏥 NetraAI - Telemedicine Platform                    ║"
echo "║             Quick Start Script for macOS/Linux                 ║"
echo "╚═════════════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
echo "[1/5] Checking prerequisites..."
echo ""

if ! command -v docker &> /dev/null; then
    echo "❌ ERROR: Docker not found in PATH"
    echo "   Please install Docker from https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ ERROR: Docker Compose not found in PATH"
    echo "   macOS: brew install docker-compose"
    echo "   Linux: sudo apt-get install docker-compose"
    exit 1
fi

echo "✅ Docker found"
echo "✅ Docker Compose found"
echo ""

# Check if Docker daemon is running
echo "[2/5] Checking Docker daemon..."
if ! docker ps &> /dev/null; then
    echo "❌ ERROR: Docker daemon is not running"
    echo "   macOS: Please start Docker Desktop"
    echo "   Linux: Run: sudo systemctl start docker"
    exit 1
fi
echo "✅ Docker daemon is running"
echo ""

# Check if .env exists
echo "[3/5] Checking configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found"
    echo "   Creating .env from template..."
    if [ -f ".env.example" ]; then
        cp ".env.example" ".env"
        echo "✅ Created .env file"
        echo ""
        echo "📝 IMPORTANT: Edit .env with your credentials:"
        echo "   - SUPABASE_URL"
        echo "   - SUPABASE_SERVICE_KEY"
        echo "   - VITE_SUPABASE_ANON_KEY"
        echo "   - LIVEKIT_API_KEY"
        echo "   - LIVEKIT_API_SECRET"
        echo ""
        read -p "Continue anyways? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 0
        fi
    else
        echo "❌ ERROR: .env.example not found"
        exit 1
    fi
fi
echo "✅ Configuration file found"
echo ""

# Build images
echo "[4/5] Building Docker images..."
echo "   This may take 2-5 minutes on first run..."
docker-compose build --no-cache
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Docker build failed"
    echo "   Check the logs above for more information"
    exit 1
fi
echo "✅ Docker images built successfully"
echo ""

# Start services
echo "[5/5] Starting services..."
docker-compose up -d --remove-orphans
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Failed to start services"
    echo "   Run: docker-compose logs"
    exit 1
fi
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 5

counter=0
max_attempts=25
while [ $counter -lt $max_attempts ]; do
    if docker-compose ps | grep -q "Up"; then
        break
    fi
    counter=$((counter + 1))
    sleep 1
done

echo ""
echo "╔═════════════════════════════════════════════════════════════════╗"
echo "║                    ✅ STARTUP COMPLETE                         ║"
echo "╚═════════════════════════════════════════════════════════════════╝"
echo ""

# Display service status
echo "📊 Service Status:"
docker-compose ps
echo ""

# Display URLs
echo "🌐 Access Points:"
echo ""
echo "   Frontend (Web Portal):"
echo "   👉 http://localhost:3000"
echo ""
echo "   Backend API (Swagger Docs):"
echo "   👉 http://localhost:8000/docs"
echo ""
echo "   Anemia Detection Service:"
echo "   👉 http://localhost:8001"
echo ""
echo "   LibreTranslate (Auto Translation):"
echo "   👉 http://localhost:5000"
echo ""

# Demo mode info
echo "🔐 Demo Mode:"
echo "   To test without real Supabase credentials:"
echo "   1. Edit .env: Set BYPASS_AUTH=true"
echo "   2. Restart: docker-compose down && docker-compose up"
echo "   3. Login with any email (e.g., patient@demo.com)"
echo ""

# Helpful commands
echo "💡 Useful Commands:"
echo ""
echo "   View all logs:"
echo "   👉 docker-compose logs -f"
echo ""
echo "   View specific service logs:"
echo "   👉 docker-compose logs -f backend"
echo ""
echo "   Stop everything:"
echo "   👉 docker-compose down"
echo ""
echo "   Stop everything and remove data:"
echo "   👉 docker-compose down -v"
echo ""
echo "   Execute command in container:"
echo "   👉 docker-compose exec backend bash"
echo ""

echo "📖 Documentation:"
echo "   See README.md for detailed setup instructions"
echo "   See DEPLOYMENT_GUIDE.md for production deployment"
echo "   See VERIFICATION_CHECKLIST.md for testing procedures"
echo ""

echo "✨ System is ready! Open http://localhost:3000 in your browser."
echo ""
