# 🏥 NetraAI - Intelligent Telemedicine & AI-Powered Anemia Detection

A **production-grade, full-stack telemedicine platform** with real-time video consultations, AI-powered anemia detection via conjunctiva analysis, multilingual support, and comprehensive appointment management.

---

## 📊 Project Status: PRODUCTION READY ✅

- ✅ Full end-to-end integration
- ✅ AI microservice fully operational
- ✅ Real-time video consultations (LiveKit)
- ✅ Multilingual translation (LibreTranslate)
- ✅ HIPAA-compliant database schema
- ✅ Comprehensive admin panel
- ✅ Docker containerized deployment

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  NETRAI TELEMEDICINE PLATFORM               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   FRONTEND       │  │   ADMIN PANEL    │                │
│  │ (React + Vite)   │  │  (React + CSS)   │                │
│  │ :3000            │  │                  │                │
│  └────────┬─────────┘  └────────┬─────────┘                │
│           │                     │                           │
│           └─────────┬───────────┘                           │
│                     ↓                                        │
│        ┌─────────────────────────┐                         │
│        │   BACKEND API           │                         │
│        │  (FastAPI + Supabase)   │                         │
│        │  :8000                  │                         │
│        └────────┬──────┬────┬────┘                         │
│                 │      │    │                               │
│     ┌───────────┘      │    └──────────┐                   │
│     ↓                  ↓               ↓                    │
│  ┌────────┐      ┌──────────┐    ┌───────────┐            │
│  │DATABASE│      │ AI MODEL │    │TRANSLATION│            │
│  │Supabase│      │  Service │    │ Service   │            │
│  │        │      │  :8001   │    │ :5000     │            │
│  └────────┘      └──────────┘    └───────────┘            │
│                                                              │
│  VIDEO CALLS: LiveKit (wss://...)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** (or Docker + Docker Compose)
- **Real Supabase credentials** (or use bypass mode for UI testing)
- **LiveKit API keys** (for video consultations)
- **Node.js 18+** (if running locally)
- **Python 3.10+** (if running locally)

### 1️⃣ Clone & Configure

```bash
cd C:\netrai-consult\consult-module

# Copy and update environment variables
cp .env.example .env

# Edit .env with your:
# - Supabase URL and keys
# - LiveKit credentials
# - Other service URLs
```

### 2️⃣ Build & Run (Docker)

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### 3️⃣ Access the Platform

| Service            | URL                        |
| ------------------ | -------------------------- |
| **Frontend**       | http://localhost:3000      |
| **Backend API**    | http://localhost:8000      |
| **API Swagger**    | http://localhost:8000/docs |
| **Anemia Service** | http://localhost:8001      |
| **Translation**    | http://localhost:5000      |

### 4️⃣ Demo Mode (No Real Credentials)

For testing the **UI without Supabase/LiveKit credentials**:

```bash
# In .env, set:
BYPASS_AUTH=true
VITE_BYPASS_AUTH=true

# Then login with demo emails:
# Patient: patient@demo.com (any password)
# Doctor: doctor@demo.com (any password)
# Admin: admin@demo.com (any password)
```

---

## 📁 Project Structure

```
consult-module/
├── apps/
│   └── web/                          # React Frontend (Vite)
│       ├── src/
│       │   ├── app/                  # Pages & components
│       │   │   ├── pages/            # Page components
│       │   │   ├── components/       # Reusable UI components
│       │   │   ├── contexts/         # React contexts
│       │   │   ├── routes.tsx        # Route definitions
│       │   │   └── App.tsx           # Main app component
│       │   ├── lib/
│       │   │   ├── api.ts            # Axios API client
│       │   │   ├── supabase.ts       # Supabase setup
│       │   │   └── store.ts          # Zustand state management
│       │   └── styles/               # Global CSS
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── Dockerfile
│
├── services/
│   ├── core/                         # Backend API (FastAPI)
│   │   ├── app/
│   │   │   ├── main.py               # FastAPI app setup
│   │   │   ├── core/
│       │   │   ├── config.py         # Settings & config
│       │   │   ├── security.py       # JWT & Auth
│       │   │   └── schemas.py        # Pydantic models
│       │   ├── routes/               # API endpoints
│       │   │   ├── patient.py
│       │   │   ├── doctor.py
│       │   │   ├── admin.py
│       │   │   ├── video.py
│       │   │   ├── ml.py
│       │   │   └── translation.py
│       │   ├── services/             # Business logic
│       │   │   ├── supabase.py
│       │   │   ├── livekit.py
│       │   │   └── translation.py
│       │   ├── requirements.txt
│       │   └── Dockerfile
│   │
│   └── anemia/                       # AI Microservice (Python/TensorFlow)
│       ├── src/
│       │   ├── pipeline.py           # ML pipeline
│       │   ├── model.py              # Neural network
│       │   ├── eye_extractor.py      # MediaPipe extraction
│       │   ├── gradcam.py            # Explainability
│       │   └── __init__.py
│       ├── models/
│       │   └── best_enhanced.h5      # Trained model weights
│       ├── api.py                    # FastAPI wrapper
│       ├── requirements.txt
│       └── Dockerfile
│
├── infrastructure/
│   ├── database/
│   │   ├── supabase_schema.sql       # Database schema
│   │   └── supabase/
│   │       └── config.toml
│   ├── nginx/
│   │   └── nginx.conf                # Production reverse proxy
│   └── scripts/
│       ├── start.bat                 # Windows startup
│       └── verify_system.py
│
├── docker-compose.yml                # Service orchestration
├── .env.example                      # Environment template
├── .env                              # Local configuration
└── README.md                         # This file
```

---

## 🧑‍💼 User Roles & Features

### 👤 Patient Portal

| Feature                           | Status |
| --------------------------------- | ------ |
| Sign up / Login                   | ✅     |
| View profile & settings           | ✅     |
| Browse & search doctors           | ✅     |
| Book appointments                 | ✅     |
| View upcoming appointments        | ✅     |
| Start video consultation          | ✅     |
| Real-time translation during call | ✅     |
| Upload eye image for AI scan      | ✅     |
| View anemia detection results     | ✅     |
| View medical history              | ✅     |
| View prescriptions                | ✅     |

### 👨‍⚕️ Doctor Portal

| Feature                                 | Status |
| --------------------------------------- | ------ |
| Sign up / Login (verification required) | ✅     |
| View profile & specializations          | ✅     |
| Set availability schedules              | ✅     |
| View scheduled appointments             | ✅     |
| Accept/decline appointments             | ✅     |
| Join video consultations                | ✅     |
| View patient records & scans            | ✅     |
| Create prescriptions                    | ✅     |
| View consultation history               | ✅     |

### 🔐 Admin Portal

| Feature                         | Status |
| ------------------------------- | ------ |
| Dashboard with system stats     | ✅     |
| Verify/approve doctors          | ✅     |
| Manage users (activate/block)   | ✅     |
| View all appointments           | ✅     |
| View AI scan results            | ✅     |
| System settings & configuration | ✅     |
| Audit logs & compliance         | ✅     |

---

## 🔌 API Documentation

### Quick Swagger UI

Visit: **http://localhost:8000/docs**

### Key Endpoints

#### Authentication

```
POST   /api/v1/auth/sign-up          # Register new user
POST   /api/v1/auth/sign-in          # Login
POST   /api/v1/auth/sign-out         # Logout
POST   /api/v1/auth/confirm-email    # Dev: Auto-confirm email
```

#### Patient Appointments

```
GET    /api/v1/patient/appointments        # List appointments
POST   /api/v1/patient/appointments        # Book appointment
PUT    /api/v1/patient/appointments/{id}   # Update appointment
```

#### Anemia Scanning

```
POST   /api/v1/patient/scans/upload        # Upload eye image & analyze
GET    /api/v1/patient/scans               # Get scan history
```

#### Video Consultations

```
GET    /api/v1/video/token                 # Get LiveKit token
POST   /api/v1/video/webhook               # LiveKit event webhook
```

#### Real-time Translation

```
POST   /api/v1/translation                 # Translate text
```

#### Doctor Management

```
GET    /api/v1/doctors                     # List all doctors
GET    /api/v1/doctor/dashboard            # Doctor dashboard data
GET    /api/v1/doctor/appointments         # Doctor's appointments
```

#### Admin Operations

```
GET    /api/v1/admin/stats                 # System statistics
GET    /api/v1/admin/doctors/pending       # Pending verifications
PUT    /api/v1/admin/doctors/{id}/verify   # Verify doctor
```

---

## 🔧 Development & Testing

### Running Locally (Without Docker)

#### 1. Frontend

```bash
cd apps/web
npm install
npm run dev      # Runs on http://localhost:5173
```

#### 2. Backend

```bash
cd services/core
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

#### 3. AI Service

```bash
cd services/anemia
python -m pip install -r requirements.txt
python api.py
```

#### 4. LibreTranslate

```bash
docker run -d -p 5000:5000 libretranslate/libretranslate:latest
```

### Running Tests

```bash
# Backend unit tests
cd services/core
pytest tests/

# Frontend component tests
cd apps/web
npm run test
```

---

## 🐛 Troubleshooting

### Issue: "Supabase connection failed"

**Solution:**

1. Verify `.env` has correct `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
2. Check network connectivity: `ping your-project.supabase.co`
3. Enable bypass mode for UI testing: Set `BYPASS_AUTH=true` in `.env`

### Issue: "AI service returned 404"

**Solution:**

1. Ensure anemia-service container is running: `docker-compose ps`
2. Check logs: `docker-compose logs anemia-service`
3. Verify `ANEMIA_API_URL` in backend `.env` matches container URL

### Issue: "Video call not starting"

**Solution:**

1. Verify LiveKit URL is correct in `.env`: `LIVEKIT_URL=wss://...`
2. Check API key & secret: `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`
3. Check browser console for WebSocket errors

### Issue: "Translation not working"

**Solution:**

1. Ensure LibreTranslate container is running: `docker-compose logs libretranslate`
2. Test translation manually:
   ```bash
   curl -X POST http://localhost:5000/translate \
     -H "Content-Type: application/json" \
     -d '{"q": "Hello", "source": "en", "target": "hi"}'
   ```

### Issue: "Build failed during docker-compose up"

**Solution:**

```bash
# Clean build
docker-compose down -v
docker-compose up --build --no-cache

# Check logs
docker-compose logs [service-name]
```

---

## 📋 Pre-deployment Checklist

- [ ] All environment variables set in `.env`
- [ ] Supabase database schema initialized (run `supabase_schema.sql`)
- [ ] LiveKit credentials verified
- [ ] Docker images build without errors: `docker-compose build`
- [ ] All services start: `docker-compose up`
- [ ] Frontend loads: http://localhost:3000
- [ ] API Swagger works: http://localhost:8000/docs
- [ ] Can login and create test patient account
- [ ] Can upload test image for anemia scan
- [ ] Video call token generation works
- [ ] Translation API responds

---

## 🚢 Production Deployment

### Environment Setup

```bash
# Production .env should have:
ENVIRONMENT=production
BYPASS_AUTH=false
VITE_BYPASS_AUTH=false

# Real domain URLs
VITE_API_URL=https://api.your-domain.com
LIVEKIT_URL=wss://your-domain.livekit.cloud
```

### Deploy with Docker

```bash
# Build production images
docker build -t netrai-frontend:prod apps/web
docker build -t netrai-backend:prod services/core
docker build -t netrai-anemia:prod services/anemia

# Deploy using docker-compose with production overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Nginx Reverse Proxy

See `infrastructure/nginx/nginx.conf` for production-ready proxy configuration.

---

## 📊 Database Schema

### Core Tables

- `profiles_patient` - Patient profiles
- `profiles_doctor` - Doctor profiles & specializations
- `appointments` - Appointment records
- `scans` - AI anemia scan results
- `prescriptions` - Doctor-issued prescriptions
- `notifications` - System notifications
- `audit_logs` - HIPAA compliance logging

See `infrastructure/database/supabase_schema.sql` for complete schema.

---

## 🔐 Security Features

✅ **JWT Authentication** - Supabase Auth with stateless tokens  
✅ **Row-Level Security** - Database RLS policies  
✅ **Input Validation** - Pydantic models on backend  
✅ **CORS Protection** - Configured for frontend domain  
✅ **HIPAA Compliance** - Audit logging for all data access  
✅ **Encryption** - TLS/SSL for all communications  
✅ **Rate Limiting** - Configurable per endpoint

---

## 📝 Environment Variables Guide

| Variable                 | Purpose              | Example                      |
| ------------------------ | -------------------- | ---------------------------- |
| `SUPABASE_URL`           | Database connection  | `https://xxx.supabase.co`    |
| `SUPABASE_SERVICE_KEY`   | Backend API auth     | JWT token                    |
| `VITE_SUPABASE_ANON_KEY` | Frontend auth        | JWT token                    |
| `LIVEKIT_API_KEY`        | Video service auth   | `API...`                     |
| `LIVEKIT_URL`            | Video WebSocket      | `wss://...`                  |
| `ANEMIA_API_URL`         | AI service URL       | `http://anemia-service:8001` |
| `LIBRETRANSLATE_URL`     | Translation service  | `http://libretranslate:5000` |
| `VITE_API_URL`           | Backend for frontend | `http://localhost:8000`      |
| `BYPASS_AUTH`            | Skip auth (dev only) | `true/false`                 |

---

## 🤝 Contributing

See individual service README files:

- `apps/web/README.md` - Frontend
- `services/core/README.md` - Backend (if available)
- `services/anemia/README.md` - AI Service

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Support & Issues

For bugs and feature requests, please:

1. Check existing issues
2. Provide detailed reproduction steps
3. Include environment info (OS, Docker version, etc.)
4. Attach relevant error logs

---

**Built with ❤️ for healthcare**

### [Services] Anemia Engine

A high-performance Python microservice that extracts the lower conjunctiva from eye images and predicts anemia severity using a custom-trained CNN model.

### [Infrastructure] Self-Hosted Translation

Utilizes LibreTranslate for private, real-time translation during consultations, supporting Hindi, Tamil, Telugu, and other major Indian languages.

## 🔑 Environment Setup

Copy `.env.example` to `.env` and fill in your Supabase and LiveKit credentials.

## ⚖️ License

MIT
