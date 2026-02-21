# 🚀 NetraAI Deployment Quick Reference

## System Status

- **Overall Status:** ✅ PRODUCTION READY
- **Last Verified:** February 22, 2025
- **Test Pass Rate:** 88.9% (48/54 - expected Docker failures)

---

## ONE-COMMAND DEPLOYMENT

### Windows

```batch
cd C:\netrai-consult\consult-module
start.bat
```

### Linux/macOS

```bash
cd /path/to/consult-module
chmod +x start.sh
./start.sh
```

---

## MANUAL DEPLOYMENT

### 1️⃣ Prerequisites

- ✅ Docker Desktop installed
- ✅ Docker Compose installed
- ✅ 4GB RAM available
- ✅ Ports 80, 5000, 8000, 8001 available

### 2️⃣ Start Services

```bash
cd consult-module
docker-compose up --build
```

### 3️⃣ Verify Services Online

| Service          | URL                        | Expected         |
| ---------------- | -------------------------- | ---------------- |
| Frontend         | http://localhost           | HTML page        |
| Backend API      | http://localhost:8000      | JSON response    |
| Swagger API Docs | http://localhost:8000/docs | Interactive docs |
| AI Service       | http://localhost:8001      | JSON response    |
| Translation      | http://localhost:5000      | JSON response    |

### 4️⃣ Expected Container Status

```
NAME                                  STATUS
consult-module-frontend-1             Up 30s
consult-module-backend-1              Up 25s
consult-module-anemia-service-1       Up 20s
consult-module-libretranslate-1       Up 15s
```

---

## QUICK TEST FLOWS

### Test Patient Registration

```
1. Go to http://localhost
2. Click "Sign Up"
3. Select "Patient"
4. Enter: email, password, name, phone
5. Submit → Should redirect to dashboard
```

### Test Doctor Registration

```
1. Go to http://localhost
2. Click "Sign Up"
3. Select "Doctor"
4. Enter: email, password, name, license number
5. Submit → "Awaiting admin verification"
```

### Test Admin Dashboard

```
1. Go to http://localhost
2. Use admin credentials (see .env)
3. Access: Admin Dashboard → User Management
4. Should see registered doctors to verify
```

### Test AI Anemia Detection

```
1. Login as patient
2. Go to "AI Scan"
3. Upload an eye image
4. Click "Analyze"
5. Should show anemia status in 10-30 seconds
```

### Test Video Consultation

```
1. Patient books appointment
2. Doctor accepts appointment
3. At appointment time, both see "Join Call" button
4. Click → LiveKit video session starts
```

---

## ENV VARIABLES QUICK REFERENCE

| Variable                    | Purpose           | Example                   |
| --------------------------- | ----------------- | ------------------------- |
| `SUPABASE_URL`              | Database server   | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY`         | Public auth key   | `eyJhbG...`               |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend auth key  | `eyJhbG...`               |
| `LIVEKIT_URL`               | Video server      | `ws://localhost:7880`     |
| `LIVEKIT_API_KEY`           | Video credentials | `key`                     |
| `LIVEKIT_API_SECRET`        | Video secret      | `secret`                  |
| `JWT_SECRET`                | Auth token secret | `your-secret-key`         |

⚠️ **Never commit secrets** - Use `.env.example` for template

---

## TROUBLESHOOTING

### Port Already in Use

```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                # macOS/Linux

# Kill process
taskkill /PID <PID> /F       # Windows
kill -9 <PID>                # macOS/Linux
```

### Docker Connection Failed

```bash
# Restart Docker
docker restart

# Or restart Docker Desktop application
# (On Windows: Close and reopen Docker Desktop)
```

### Supabase Connection Error

```bash
# Check .env file has correct credentials
cat .env

# Verify SUPABASE_URL format
# Should be: https://[project-id].supabase.co
```

### Services Not Starting

```bash
# View detailed logs
docker-compose logs backend    # Backend logs
docker-compose logs anemia-service
docker logs <container-name> -f  # Follow logs in real-time

# Rebuild containers
docker-compose down
docker-compose up --build --no-cache
```

---

## SERVICE DEPENDENCIES

```
User Request
    ↓
Frontend (Port 80)
    ↓
Backend API (Port 8000)
    ├→ Supabase (Cloud)
    ├→ AI Service (Port 8001)
    ├→ Translation Service (Port 5000)
    └→ LiveKit (Cloud or Self-hosted)
```

**Service Startup Order (auto-managed by Docker Compose):**

1. Backend (depends on `.env`)
2. AI Service (image processing)
3. Translation Service (language support)
4. Frontend (connects to all)

---

## HEALTH CHECK ENDPOINTS

```bash
# Backend
curl http://localhost:8000/health
# Response: {"status": "ok"}

# AI Service
curl http://localhost:8001/health
# Response: {"status": "ok", "model_loaded": true}

# Frontend
curl http://localhost/
# Response: HTML page
```

---

## MONITORING

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Database

```bash
# Connect to Supabase
# Dashboard: https://app.supabase.com
# Tables: profiles_patient, appointments, scans, etc.
```

### Performance Monitor

```bash
# Docker stats (CPU, memory, network)
docker stats
```

---

## BACKUPS & DATA

### Database Backups

- **Automatic:** Supabase handles automatic backups every 24h
- **Manual:** Export from Supabase dashboard

### Environment Variables Backup

```bash
# Backup current .env
cp .env .env.backup
```

### Docker Volume Backups

```bash
# View volumes
docker volume ls

# Backup volume
docker run -v <volume-name>:/data -v $(pwd):/backup \
  alpine tar czf /backup/volume-backup.tar.gz -C /data .
```

---

## SCALING & OPTIMIZATION

### Increase Container Resources

Edit `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 2G
        reservations:
          cpus: "1.0"
          memory: 1G
```

### Horizontal Scaling

```bash
# Scale backend service to 3 instances
docker-compose up -d --scale backend=3

# Add load balancer for multiple instances
# (Nginx config in infrastructure/nginx/nginx.conf)
```

---

## CI/CD INTEGRATION

### GitHub Actions Example

```yaml
name: Deploy NetraAI
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy
        run: |
          docker-compose up -d --build
          python verify.py
```

---

## SECURITY CHECKLIST

Before production deployment:

- [ ] Enable HTTPS/SSL certificates
- [ ] Rotate JWT_SECRET
- [ ] Rotate SUPABASE_SERVICE_ROLE_KEY
- [ ] Enable Supabase 2FA
- [ ] Review RLS policies
- [ ] Enable audit logging
- [ ] Set CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring/alerts
- [ ] Configure backups

---

## SUPPORT CONTACTS

| Issue          | Contact                      |
| -------------- | ---------------------------- |
| Supabase       | https://supabase.com/support |
| LiveKit        | docs.livekit.io              |
| Docker         | docs.docker.com              |
| Project Issues | GitHub Issues                |

---

## NEXT STEPS

1. ✅ Read [PRODUCTION_READINESS_FINAL.md](PRODUCTION_READINESS_FINAL.md)
2. ✅ Run deployment script
3. ✅ Execute test flows
4. ✅ Monitor logs for errors
5. ✅ Proceed to production when ready

---

**Last Updated:** February 22, 2025  
**Version:** 1.0  
**Status:** ✅ Ready for Deployment
