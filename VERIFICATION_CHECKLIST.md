# ✅ NetraAI - Complete Verification Checklist

This checklist ensures all components of the NetraAI platform are functioning correctly before deployment.

---

## 🔍 Pre-Build Verification

### Environment Configuration

- [ ] `.env` file exists in root directory
- [ ] All required variables are set (check `.env.example`)
- [ ] `SUPABASE_URL` is reachable
- [ ] `SUPABASE_SERVICE_KEY` is valid
- [ ] `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are valid (if using video)
- [ ] `ANEMIA_API_URL` points to correct service
- [ ] `LIBRETRANSLATE_URL` is configured
- [ ] Ports 3000, 8000, 5000, 8001 are available
- [ ] Docker Desktop is running (if using Docker)
- [ ] Internet connectivity verified

### File Structure

- [ ] `apps/web/` exists with `package.json`
- [ ] `services/core/` exists with `requirements.txt`
- [ ] `services/anemia/` exists with trained model
- [ ] `infrastructure/database/supabase_schema.sql` exists
- [ ] `docker-compose.yml` is valid YAML
- [ ] All Node.js dependencies can resolve
- [ ] All Python dependencies can resolve

---

## 🏗️ Build Phase Verification

### Frontend Build

- [ ] `npm install` completes without errors
- [ ] TypeScript compilation succeeds: `npm run build`
- [ ] No console errors during `npm run dev`
- [ ] Vite dev server starts on expected port
- [ ] Hot module replacement works
- [ ] All imports resolve correctly
- [ ] No "not exported" errors for API functions
- [ ] Asset optimization completes

### Backend Build

- [ ] `pip install -r requirements.txt` completes
- [ ] All Python imports resolve
- [ ] FastAPI app initializes without errors
- [ ] Pydantic models validate correctly
- [ ] Supabase client initializes
- [ ] LiveKit client initializes
- [ ] Hot reload works with `--reload` flag

### AI Service Build

- [ ] TensorFlow imports successfully
- [ ] Model weights load (`best_enhanced.h5`)
- [ ] OpenCV and MediaPipe initialize
- [ ] API stub responds to `/health`
- [ ] Handles image file uploads
- [ ] Returns valid JSON responses

### Docker Build

- [ ] `docker-compose build` completes without errors
- [ ] All images build successfully
  - [ ] `netrai-frontend:latest`
  - [ ] `netrai-backend:latest`
  - [ ] `netrai-anemia-service:latest`
  - [ ] `libretranslate:latest` (pulled)
- [ ] No build warnings or deprecated features
- [ ] Images are reasonable size (not bloated)

---

## 🚀 Service Startup Verification

### Container Startup

- [ ] `docker-compose up` starts all services
- [ ] No services crash during startup
- [ ] All services show "running" status
- [ ] Logs show no error messages
- [ ] All ports bind successfully

### Health Checks

- [ ] Backend responds: `curl http://localhost:8000/health`
- [ ] AI Service responds: `curl http://localhost:8001/health`
- [ ] Translation service responds: `curl -X POST http://localhost:5000/translate`
- [ ] Frontend loads: `http://localhost:3000`
- [ ] Swagger UI loads: `http://localhost:8000/docs`

### Database Connectivity

- [ ] Supabase tables exist and are accessible
- [ ] Can query `profiles_patient` table
- [ ] Can query `profiles_doctor` table
- [ ] Can query `appointments` table
- [ ] Row-level security policies are in place
- [ ] Indexes are properly created
- [ ] No connection pool exhaustion

---

## 🧪 Authentication Flow Testing

### Sign Up (Patient)

- [ ] Can navigate to signup page
- [ ] Email validation works
- [ ] Password strength validation works
- [ ] Submit creates Supabase user
- [ ] Auto-confirms email (in dev mode)
- [ ] Redirects to login after signup
- [ ] Can login with new credentials
- [ ] Profile auto-created in database

### Sign Up (Doctor)

- [ ] Can navigate to doctor signup
- [ ] All doctor-specific fields present
- [ ] Specialty field has valid options
- [ ] Hospital field accepts input
- [ ] Consultation fee field validates
- [ ] Creates doctor profile in database
- [ ] Doctor listed as unverified in admin

### Login Flow

- [ ] Can login with email/password
- [ ] Invalid credentials rejected
- [ ] JWT token stored in localStorage
- [ ] Token included in API requests
- [ ] Token auto-refresh on expiry
- [ ] Logout clears token
- [ ] Protected routes redirect to login

### Bypass Auth (Development)

- [ ] `BYPASS_AUTH=true` enables bypass mode
- [ ] Can login with any email/password combination
- [ ] Bypass mode creates mock user with correct role
- [ ] Dashboard shows bypass mode indicator (optional)
- [ ] Can toggle between roles

---

## 👨‍⚕️ Patient Dashboard Testing

### Dashboard Load

- [ ] Patient can access dashboard
- [ ] Loads user profile information
- [ ] Shows upcoming appointments (real data)
- [ ] Shows recent scans (real data)
- [ ] Shows prescriptions (real data)
- [ ] Health score displays correctly
- [ ] Profile image loads (if set)

### Profile Management

- [ ] Can edit patient profile
- [ ] Updates persist to database
- [ ] Can upload profile picture
- [ ] Can update blood type
- [ ] Can update contact information
- [ ] Form validation works
- [ ] Success/error toasts appear

---

## 🏥 Doctor Discovery & Booking Testing

### Doctor List

- [ ] Doctor listing page loads
- [ ] Shows all verified doctors
- [ ] Search by name works
- [ ] Filter by specialty works
- [ ] Filter by language works
- [ ] Shows doctor ratings
- [ ] Shows consultation fees
- [ ] Shows availability status

### Doctor Detail Page

- [ ] Can click on doctor card
- [ ] Detail page loads with correct data
- [ ] Shows doctor's full profile
- [ ] Shows availability calendar
- [ ] Shows previous patient reviews
- [ ] "Book Appointment" button appears

### Appointment Booking

- [ ] Can select available time slot
- [ ] Can select consultation type (video/in-person)
- [ ] Can add appointment reason
- [ ] Form validation prevents empty fields
- [ ] API call completes successfully
- [ ] Appointment stored in database
- [ ] Patient receives confirmation
- [ ] Doctor sees new appointment
- [ ] Confirmation email sent (if configured)

---

## 📅 Appointment Management Testing

### View Appointments

- [ ] Patient sees upcoming appointments
- [ ] Patient sees past appointments
- [ ] Shows appointment status badges
- [ ] Shows doctor information
- [ ] Shows appointment date/time
- [ ] Shows consultation type
- [ ] Click appointment shows details

### Modify Appointment

- [ ] Can cancel appointment
- [ ] Can reschedule appointment
- [ ] Cancellation updates database
- [ ] Doctor notified of cancellation
- [ ] Patient can only manage own appointments
- [ ] Doctor can accept/decline

### Doctor Appointments

- [ ] Doctor sees all their appointments
- [ ] Can mark as completed
- [ ] Can view patient details
- [ ] Can add appointment notes
- [ ] Cannot modify other doctor's appointments

---

## 📹 Video Consultation Testing

### Room Setup

- [ ] LiveKit token generation works
- [ ] Token is valid JWT
- [ ] Contains correct room name
- [ ] Contains user identity
- [ ] Server URL is reachable

### Joining Call

- [ ] Can join video room
- [ ] Audio/video permissions requested
- [ ] Camera feed appears
- [ ] Microphone works
- [ ] No latency/lag issues
- [ ] Stream quality is good
- [ ] Network indicator shows status

### Call Controls

- [ ] Can mute/unmute audio
- [ ] Can turn camera on/off
- [ ] Can share screen (if enabled)
- [ ] Can see remote video
- [ ] Can hear remote audio
- [ ] Both parties see each other
- [ ] Connection persists without drops

### Ending Call

- [ ] Can end call cleanly
- [ ] Participants disconnect properly
- [ ] Room closes after timeout
- [ ] Appointment marked as completed
- [ ] Duration recorded correctly

---

## 🌐 Translation Testing

### Translation Availability

- [ ] LibreTranslate service is running
- [ ] Responds to translation requests
- [ ] Supports required languages:
  - [ ] English
  - [ ] Hindi
  - [ ] Tamil
  - [ ] Telugu
  - [ ] Kannada
  - [ ] Malayalam

### Translation During Call

- [ ] Real-time translation toggle works
- [ ] Text input field for translation
- [ ] Translates to target language
- [ ] Subtitles display on screen
- [ ] Translation doesn't block call
- [ ] Multiple languages can be tried

### API Translation

- [ ] `POST /api/v1/translation` endpoint works
- [ ] Correct `target_lang` parameter required
- [ ] Request validation works
- [ ] Response includes translated text
- [ ] Error handling for invalid languages

---

## 🩺 AI Anemia Detection Testing

### Image Upload

- [ ] Can navigate to scan page
- [ ] Can select image file
- [ ] Image preview displays
- [ ] Supported formats: JPG, PNG, WebP
- [ ] File size validation works
- [ ] Cannot upload non-image files

### Scan Processing

- [ ] Image sends to backend
- [ ] Backend forwards to AI service
- [ ] Loading indicator appears
- [ ] Processing completes within timeout
- [ ] Results display correctly with:
  - [ ] Anemia status (Normal/Mild/Moderate/Severe)
  - [ ] Hemoglobin level
  - [ ] Confidence score
  - [ ] Recommendations
  - [ ] Timestamp

### Results Storage

- [ ] Scan saved to database
- [ ] Image stored in Supabase Storage
- [ ] Patient can view scan history
- [ ] Doctor can see patient scans
- [ ] Results include analysis details
- [ ] Can download/export results

### AI Fallback

- [ ] If AI service down, mock result appears
- [ ] Mock result is realistic
- [ ] User can still test UI
- [ ] Error message shown (if configured)

---

## 👨‍⚕️ Doctor Features Testing

### Doctor Dashboard

- [ ] Shows today's appointments
- [ ] Shows patient count
- [ ] Shows revenue metrics
- [ ] Shows pending tasks
- [ ] Shows patient notifications
- [ ] Profile shows specialty/qualifications

### Availability Management

- [ ] Can set working hours
- [ ] Can set days of availability
- [ ] Can set break times
- [ ] Calendar UI is intuitive
- [ ] Changes persist to database
- [ ] Patients see updated availability

### Prescription Issuance

- [ ] Can create prescription
- [ ] Can add multiple medications
- [ ] Can set dosage/duration
- [ ] Can add special instructions
- [ ] Can set expiration date
- [ ] Patient receives prescription
- [ ] PDF generation works (if implemented)

---

## 🔐 Admin Portal Testing

### Admin Dashboard

- [ ] Can access admin area
- [ ] Only admins can access
- [ ] Shows system statistics:
  - [ ] Total users
  - [ ] Active appointments
  - [ ] Pending verifications
  - [ ] Revenue metrics

### Doctor Verification

- [ ] Can see pending doctors
- [ ] Can view doctor details/credentials
- [ ] Can approve/reject doctors
- [ ] Doctor added to verified list on approval
- [ ] Doctor removed on rejection
- [ ] Doctor notified

### User Management

- [ ] Can view all users
- [ ] Can filter by role
- [ ] Can search users
- [ ] Can view user details
- [ ] Can activate/deactivate users
- [ ] Cannot delete self

### System Settings

- [ ] Can view system configuration
- [ ] Can update settings (if editable)
- [ ] Can view audit logs
- [ ] Can export reports
- [ ] Can manage translations

---

## 🔄 Data Flow & Integration Testing

### End-to-End Patient Flow

1. [ ] Patient signs up
2. [ ] Patient logs in
3. [ ] Patient browses doctors
4. [ ] Patient books appointment
5. [ ] Doctor accepts appointment
6. [ ] Patient joins video call
7. [ ] Consultation happens with translation
8. [ ] Patient uploads scan image
9. [ ] AI analyzes and returns results
10. [ ] Doctor creates prescription
11. [ ] Patient views prescription
12. [ ] Appointment marked complete

### End-to-End Doctor Flow

1. [ ] Doctor signs up
2. [ ] Admin verifies doctor
3. [ ] Doctor logs in
4. [ ] Doctor sets availability
5. [ ] Doctor sees appointments
6. [ ] Patient books with doctor
7. [ ] Doctor accepts appointment
8. [ ] Doctor joins video call
9. [ ] Video consultation completes
10. [ ] Doctor creates prescription
11. [ ] Doctor completes appointment

### End-to-End Admin Flow

1. [ ] Admin logs in
2. [ ] Admin views dashboard stats
3. [ ] Admin sees pending doctors
4. [ ] Admin verifies doctor
5. [ ] Admin manages users
6. [ ] Admin views appointments
7. [ ] Admin exports reports
8. [ ] Admin updates settings

---

## 📊 API Testing

### Authentication Endpoints

- [ ] `POST /api/v1/auth/sign-up` returns 200
- [ ] `POST /api/v1/auth/sign-in` returns token
- [ ] `POST /api/v1/auth/sign-out` works
- [ ] Unauthorized requests rejected

### Patient Endpoints

- [ ] `GET /api/v1/patient/dashboard` returns data
- [ ] `GET /api/v1/patient/appointments` returns list
- [ ] `POST /api/v1/patient/appointments` creates appointment
- [ ] `POST /api/v1/patient/scans/upload` accepts image
- [ ] `GET /api/v1/patient/scans` returns history

### Doctor Endpoints

- [ ] `GET /api/v1/doctor/dashboard` returns data
- [ ] `GET /api/v1/doctor/appointments` returns list
- [ ] `PUT /api/v1/doctor/availability` updates availability
- [ ] `POST /api/v1/doctor/prescriptions` creates prescription

### Admin Endpoints

- [ ] `GET /api/v1/admin/stats` returns statistics
- [ ] `GET /api/v1/admin/doctors/pending` returns pending doctors
- [ ] `PUT /api/v1/admin/doctors/:id/verify` verifies doctor

### Video Endpoints

- [ ] `GET /api/v1/video/token` returns JWT token
- [ ] Token is valid for LiveKit
- [ ] Invalid room parameter rejected

### Translation Endpoints

- [ ] `POST /api/v1/translation` translates text
- [ ] Supports multiple language pairs
- [ ] Invalid language codes rejected

---

## 🎨 UI/UX Verification

### Frontend Styling

- [ ] Consistent color scheme throughout
- [ ] All Radix UI components styled
- [ ] Tailwind CSS classes applied correctly
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Dark mode toggle works (if implemented)
- [ ] No layout shifts or jumps

### Navigation

- [ ] All menu items accessible
- [ ] Back buttons work correctly
- [ ] Breadcrumbs display correctly
- [ ] Route transitions smooth
- [ ] Prevented navigation when unsaved changes

### Notifications

- [ ] Toast notifications appear for actions
- [ ] Success messages show (green)
- [ ] Error messages show (red)
- [ ] Warning messages show (yellow)
- [ ] Auto-dismiss after timeout
- [ ] Can manually dismiss

### Accessibility

- [ ] All buttons have labels
- [ ] Form inputs have labels
- [ ] Images have alt text
- [ ] Color contrast sufficient
- [ ] Keyboard navigation works
- [ ] Screen reader compatible (partial)

---

## 📱 Responsive Design Testing

### Mobile (iPhone/Android)

- [ ] Layout adapts to 375px width
- [ ] Touch targets are at least 44px
- [ ] No horizontal scrolling
- [ ] Forms are usable on mobile
- [ ] Video calls work on mobile
- [ ] All features accessible

### Tablet

- [ ] Layout optimization for 768px
- [ ] Two-column layouts work
- [ ] Drawer navigation functions correctly

### Desktop

- [ ] Full layout at 1920px+
- [ ] Multi-column dashboards work
- [ ] Side navigation visible
- [ ] All features visible

---

## 🔒 Security Verification

### Authentication Security

- [ ] Passwords not stored in browser
- [ ] JWT tokens used (not sessions)
- [ ] Tokens have expiration
- [ ] HTTPS enforced in production
- [ ] CORS properly configured

### Data Security

- [ ] Patient data not accessible to other patients
- [ ] Doctor data only visible to authorized users
- [ ] Row-level security policies enforced
- [ ] Audit logs created for sensitive actions
- [ ] No sensitive data in logs

### Input Validation

- [ ] Email addresses validated
- [ ] Phone numbers validated
- [ ] File uploads scanned for malicious content
- [ ] SQL injection prevented (Supabase handles)
- [ ] XSS prevention (React handles)

---

## 🐛 Error Handling Testing

### Network Errors

- [ ] Timeout errors handled gracefully
- [ ] Connection refused shown
- [ ] Recovery option provided
- [ ] Retry mechanism works

### Validation Errors

- [ ] Form validation messages clear
- [ ] API errors displayed to user
- [ ] Error doesn't crash app
- [ ] User can correct and retry

### Server Errors

- [ ] 500 errors handled
- [ ] Service unavailable shown
- [ ] Error logging occurs
- [ ] User can contact support

---

## 📈 Performance Verification

### Frontend Performance

- [ ] Page load: < 3 seconds
- [ ] Interaction response: < 100ms
- [ ] First contentful paint: < 2 seconds
- [ ] Lighthouse score: > 80

### Backend Performance

- [ ] API response time: < 200ms
- [ ] Database queries optimized
- [ ] No N+1 queries
- [ ] Caching implemented

### AI Service Performance

- [ ] Image processing: < 30 seconds
- [ ] Model inference time: < 10 seconds
- [ ] Memory usage reasonable
- [ ] Can handle concurrent requests

---

## 🚀 Deployment Readiness

### Code Quality

- [ ] No console errors or warnings
- [ ] No TypeScript errors
- [ ] No Python linting errors
- [ ] Code follows style guide

### Documentation

- [ ] README.md complete and accurate
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment procedures documented
- [ ] Troubleshooting guide included

### Testing

- [ ] All critical paths tested manually
- [ ] Unit tests pass (if any)
- [ ] Integration tests pass
- [ ] Load testing completed

### Deployment

- [ ] Docker build succeeds
- [ ] All services start correctly
- [ ] Health checks pass
- [ ] Can be scaled horizontally
- [ ] Backup/recovery plan ready

---

## 📋 Sign-Off

**Verification Date:** ****\_\_\_****  
**Verified By:** ****\_\_\_****  
**Status:** ☐ READY FOR PRODUCTION / ☐ NEEDS FIXES

**Outstanding Issues:**

```
(List any issues found)
```

**Estimated Fix Time:** ****\_\_\_****

---

**Last Updated:** February 22, 2026  
**Version:** 1.0.0
