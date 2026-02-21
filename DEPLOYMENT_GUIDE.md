# 🚀 NetraAI - Complete Deployment Guide

This guide covers local development, staging, and production deployment of the NetraAI telemedicine platform.

---

## 📋 Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Docker Compose Deployment](#docker-compose-deployment)
3. [Production Deployment](#production-deployment)
4. [Monitoring & Maintenance](#monitoring--maintenance)
5. [Troubleshooting](#troubleshooting)

---

## 🏠 Local Development Setup

### Prerequisites Installation

#### Windows

```powershell
# Install Docker Desktop
# Visit: https://www.docker.com/products/docker-desktop
# Then verify installation:
docker --version
docker-compose --version

# Install Node.js 18+
# Visit: https://nodejs.org/
# Verify:
node --version
npm --version

# Install Python 3.10+
# Visit: https://www.python.org/
# Verify:
python --version
```

#### macOS/Linux

```bash
# Using Homebrew (macOS)
brew install docker docker-compose node@18 python@3.10

# Or manually install each component
# Docker: https://docs.docker.com/install/
# Node: https://nodejs.org/
# Python: https://www.python.org/
```

### Step 1: Clone & Configure

```bash
# Navigate to project
cd C:\netrai-consult\consult-module

# Create .env from template
cp .env.example .env

# Edit .env with your credentials
# nano .env  (or use your editor)
```

### Step 2: Configure Supabase

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Fill in project details
   - Get credentials from Project Settings → API

2. **Update .env**

   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Initialize Database Schema**
   ```bash
   # Copy the SQL from infrastructure/database/supabase_schema.sql
   # Paste it into Supabase Dashboard → SQL Editor → New Query
   # Click "Run"
   ```

### Step 3: Configure LiveKit (Optional - for Video)

1. **Create LiveKit Account**
   - Go to https://cloud.livekit.io
   - Sign up or login
   - Create a new project
   - Generate API Key and Secret

2. **Update .env**
   ```env
   LIVEKIT_API_KEY=your-api-key
   LIVEKIT_API_SECRET=your-api-secret
   LIVEKIT_URL=wss://your-project.livekit.cloud
   ```

### Step 4: Run Locally (No Docker)

#### Terminal 1: Frontend

```bash
cd apps/web
npm install
npm run dev
# Opens at http://localhost:5173
```

#### Terminal 2: Backend

```bash
cd services/core
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
# Runs at http://localhost:8000
```

#### Terminal 3: AI Service

```bash
cd services/anemia
python -m venv venv
# (activate venv as above)
pip install -r requirements.txt
python api.py
# Runs at http://localhost:8001
```

#### Terminal 4: Translation Service

```bash
docker run -d -p 5000:5000 libretranslate/libretranslate:latest \
  --load-only en,hi,ta,te,kn,ml,pa,bn,gu,mr,or
```

### Step 5: Test the System

```bash
# Frontend
http://localhost:5173 (or 3000 if vite changes)

# Backend API Docs
http://localhost:8000/docs

# API Health Check
curl http://localhost:8000/health

# AI Service Health
curl http://localhost:8001/health

# Translation Test
curl -X POST http://localhost:5000/translate \
  -H "Content-Type: application/json" \
  -d '{"q":"Hello","source":"en","target":"hi"}'
```

---

## 🐳 Docker Compose Deployment

### Quick Start (Recommended)

```bash
# Clone repository
git clone <repo-url>
cd consult-module

# Create .env
cp .env.example .env

# Update .env with real credentials
# Edit: .env

# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### Access Points

| Service     | URL                        | Purpose                      |
| ----------- | -------------------------- | ---------------------------- |
| Frontend    | http://localhost:3000      | Patient/Doctor/Admin portals |
| Backend     | http://localhost:8000/docs | API Swagger documentation    |
| AI Service  | http://localhost:8001      | Anemia detection API         |
| Translation | http://localhost:5000      | FastAPI interface            |

### Common Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f anemia-service

# Stop all services
docker-compose down

# Stop and remove volumes (CAUTION: data loss)
docker-compose down -v

# Rebuild specific service
docker-compose up --build backend

# Execute command in container
docker-compose exec backend sh
docker-compose exec backend python -m pytest
```

### Troubleshooting Docker Builds

```bash
# Clear build cache
docker-compose build --no-cache

# Inspect image layers
docker history netrai-backend

# Debug a failed build
docker-compose build --verbose backend

# Remove unused images/volumes
docker system prune -a
```

---

## 🌍 Production Deployment

### 1. Environment Preparation

Create `.env.production`:

```env
# Production settings
ENVIRONMENT=production
BYPASS_AUTH=false
VITE_BYPASS_AUTH=false

# Real domain (NOT localhost)
VITE_API_URL=https://api.yourdomain.com
LIVEKIT_URL=wss://yourdomain.livekit.cloud

# Production Supabase (dedicated instance)
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_SERVICE_KEY=prod-service-key

# Real LiveKit credentials
LIVEKIT_API_KEY=prod-key
LIVEKIT_API_SECRET=prod-secret

# Production database
ANEMIA_API_URL=http://anemia-service:8001
LIBRETRANSLATE_URL=http://libretranslate:5000
```

### 2. Database Migration

```bash
# Backup existing database
pg_dump -h $SUPABASE_HOST -U postgres production_db > backup.sql

# Run schema (in Supabase SQL Editor)
# Copy contents of infrastructure/database/supabase_schema.sql

# Migrate data (if applicable)
psql -h $PROD_HOST -U postgres production_db < data_migration.sql
```

### 3. Docker Image Building for Production

```bash
# Build production images
docker build -t netrai-frontend:1.0.0 apps/web
docker build -t netrai-backend:1.0.0 services/core
docker build -t netrai-anemia:1.0.0 services/anemia

# Tag for registry (e.g., Docker Hub, AWS ECR, Azure ACR)
docker tag netrai-frontend:1.0.0 registry.yourcompany.com/netrai-frontend:1.0.0
docker tag netrai-backend:1.0.0 registry.yourcompany.com/netrai-backend:1.0.0
docker tag netrai-anemia:1.0.0 registry.yourcompany.com/netrai-anemia:1.0.0

# Push to registry
docker push registry.yourcompany.com/netrai-frontend:1.0.0
docker push registry.yourcompany.com/netrai-backend:1.0.0
docker push registry.yourcompany.com/netrai-anemia:1.0.0
```

### 4. Kubernetes Deployment (Optional)

```bash
# Create namespace
kubectl create namespace netrai

# Apply configurations
kubectl apply -f infrastructure/k8s/frontend.yaml
kubectl apply -f infrastructure/k8s/backend.yaml
kubectl apply -f infrastructure/k8s/anemia.yaml
kubectl apply -f infrastructure/k8s/ingress.yaml

# Monitor deployment
kubectl get pods -n netrai
kubectl logs -n netrai deployment/backend
```

### 5. SSL/TLS Certificate Setup (Nginx)

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Update Nginx config
# See infrastructure/nginx/nginx.conf
```

### 6. Deploy with Docker Swarm (Alternative to K8s)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c infrastructure/swarm/docker-compose.prod.yml netrai

# Monitor services
docker service ls
docker service logs netrai_backend
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Frontend
curl -I http://domain.com

# Backend
curl http://api.domain.com/health

# AI Service (internal)
docker-compose exec anemia-service curl http://localhost:8001/health

# Database
docker-compose exec backend python -c \
  "from app.services.supabase import supabase; print(supabase.auth.get_session())"

# All services
docker-compose ps --format "table {{.Service}}\t{{.Status}}"
```

### Logs Management

```bash
# View logs with timestamps
docker-compose logs --timestamps backend

# Follow specific service
docker-compose logs -f backend --tail=50

# Save logs to file
docker-compose logs > logs-$(date +%Y%m%d-%H%M%S).txt

# Clean up old logs
docker exec $(docker ps -q -f name=backend) \
  sh -c 'truncate -s 0 /var/log/app.log'
```

### Database Maintenance

```bash
# Backup Supabase database
pg_dump -h db.yourdomain.com -U postgres mydb > backup-$(date +%Y%m%d).sql

# Vacuum & analyze (optimize)
vacuumdb -h db.yourdomain.com -U postgres mydb -a -v

# Row count check
psql -h db.yourdomain.com -U postgres mydb -c "\
  SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size \
  FROM pg_tables \
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

### Performance Monitoring

```bash
# Monitor container resources
docker stats

# Check most CPU-intensive processes
docker stats --no-stream | sort -k 4 -rh

# Memory usage
docker system df

# Network I/O
docker stats --no-stream | grep backend
```

---

## 🔧 Troubleshooting

### Issue: Services fail to start

**Diagnosis:**

```bash
docker-compose logs
docker-compose ps --all
```

**Solutions:**

```bash
# Clean startup
docker-compose down -v
docker-compose up --build --force-recreate

# Check port conflicts
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Free up ports (Windows)
taskkill /PID <PID> /F
```

### Issue: Database connection timeout

**Check:**

```bash
# Verify .env has correct credentials
grep SUPABASE .env

# Test connection manually
curl https://your-project.supabase.co/rest/v1/?apikey=your-key

# Check Supabase status
# Visit: https://status.supabase.com
```

### Issue: Video calls not working

**Debug:**

```bash
# Check LiveKit connectivity
curl https://your-domain.livekit.cloud/metrics

# Verify credentials
echo $LIVEKIT_API_KEY
echo $LIVEKIT_API_SECRET

# Check browser console for WebSocket errors
# Browser DevTools → Console tab
```

### Issue: High memory usage

**Fix:**

```bash
# Increase Docker limits in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

# Apply changes
docker-compose down
docker-compose up --build
```

### Issue: Disk space low

```bash
# Clean unused Docker resources
docker system prune -a --volumes

# Check disk usage
du -sh /var/lib/docker/containers/*
df -h /var/lib/docker

# Rotate Docker logs
cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
```

---

## 📈 Scaling for Production

### Horizontal Scaling (Multiple Instances)

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  backend:
    image: netrai-backend:1.0.0
    deploy:
      replicas: 3
    environment:
      - WORKERS=4

  anemia-service:
    image: netrai-anemia:1.0.0
    deploy:
      replicas: 2
```

### Load Balancing

```nginx
# nginx.conf
upstream backend {
  server backend-1:8000;
  server backend-2:8000;
  server backend-3:8000;
}

server {
  listen 80;
  server_name api.yourdomain.com;

  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

### Database Connection Pooling

```python
# app/core/config.py
# Set in backend service
SQLALCHEMY_POOL_SIZE = 20
SQLALCHEMY_MAX_OVERFLOW = 40
SQLALCHEMY_POOL_RECYCLE = 3600
```

---

## ✅ Pre-Launch Checklist

- [ ] All `.env` variables configured
- [ ] Database schema applied
- [ ] SSL certificates installed
- [ ] Backup procedures documented
- [ ] Monitoring/alerting configured
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Disaster recovery plan ready
- [ ] Documentation updated
- [ ] Team trained on deployment

---

**Ready to deploy? Start with the [Quick Start](#quick-start) section!**
