# Netra AI — Backend Architecture & Integration Guide

Now that the Netra AI frontend is fully functional regarding routing, component states, layouts, and role-based access, the final step for a production-ready application is integrating a robust Backend as a Service (BaaS) and custom API infrastructure. 

This document provides precise, step-by-step instructions on how to design and connect the backend to this exact React/Vite frontend.

---

## 1. Suggested Technology Stack
Given the rapid, React-based nature of this frontend, the highly recommended backend stack is:
- **Database & Authentication:** Supabase (PostgreSQL + GoTrue Auth)
- **File Storage (PDFs & Scans):** Supabase Storage or AWS S3
- **Video Conferencing:** LiveKit Cloud (already stubbed in `package.json`)
- **Email/Notifications:** Resend or SendGrid
- **Machine Learning API:** FastAPI (Python) or a serverless function endpoint hosted on AWS Lambda/Vercel to process the Eye Scans.

---

## 2. Database Schema Design (PostgreSQL)

You will need the following core tables to replace the current `src/lib/mockData.ts` structures:

### `users` (Managed by Supabase Auth)
- Use standard auth triggers.
- Requires a `role` enum defined as: `patient`, `doctor`, `admin`.

### `profiles_patient`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key, foreign key to `users.id` |
| `name` | String | Full name |
| `age` | Integer | |
| `gender` | String | |
| `blood_type` | String | e.g., "O+" |
| `health_score` | Integer | Calculated metric |

### `profiles_doctor`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key, foreign key to `users.id` |
| `name` | String | e.g., "Dr. Sarah" |
| `specialty` | String | e.g., "Hematologist" |
| `hospital` | String | |
| `rating` | Float | |
| `is_verified` | Boolean | Must be toggled by an `admin` |

### `appointments`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | String | Primary Key (UUID) |
| `patient_id` | UUID | FK -> `profiles_patient.id` |
| `doctor_id` | UUID | FK -> `profiles_doctor.id` |
| `date_time` | Timestamp | Scheduled time |
| `status` | Enum | `scheduled`, `completed`, `canceled` |
| `type` | Enum | `video`, `in-person` |

### `scans` (AI Anemia Detections)
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | String | Primary Key |
| `patient_id` | UUID | FK -> `profiles_patient.id` |
| `image_url` | String | URL to stored conjunctiva image bucket |
| `hemoglobin_level` | Float | AI predicted value (g/dL) |
| `status` | Enum | `Normal`, `Mild Anemia`, `Severe Anemia` |
| `timestamp` | Timestamp | When the scan occurred |

---

## 3. Required API Endpoints

The frontend expects several REST/GraphQL endpoints to feed the Dashboards.

### Authentication Flow
- **`POST /auth/login`**: Should return JWT and standard user object `{ id, email, role, name, notifications[] }`.
- **`POST /auth/signup/patient`** & **`POST /auth/signup/doctor`**: Route to respective profile tables.

### Patient Endpoints
- **`GET /api/patient/dashboard`**: A composite endpoint. Should return the nested profile, upcoming `appointments[]`, recent `scans[]`, and calculated `health_score`.
- **`POST /api/patient/scan`**: 
  1. Uploads base64/blob image to cloud storage.
  2. Forwards image URL to Python ML microservice.
  3. Saves the ML prediction result to the `scans` table.
  4. Returns the result payload to the frontend `ResultCard.tsx`.

### Doctor Endpoints
- **`GET /api/doctor/dashboard`**: Returns `patients[]` (for waitlist) and `revenue[]` timeseries data for the charts.
- **`POST /api/doctor/prescription/generate`**:
  - **Input:** `{ patient_id, doctor_id, diagnosis, rx_text }`
  - **Action:** Generates a PDF (using a library like `puppeteer` or `pdfkit` formatting the `PrescriptionPad` layout), uploads it to Storage, and triggers a SendGrid email to the `patient.email`.

### Admin Endpoints
- **`GET /api/admin/stats`**: Aggregate queries calculating total users, total scans processed, and pending doctor verifications.
- **`PUT /api/admin/doctors/:id/verify`**: Updates `is_verified` boolean on doctor profile.

---

## 4. LiveKit Video Integration Strategy
Currently, `VideoCallPage.tsx` uses mock UI. To make it real:
1. Spin up a **LiveKit Cloud** instance.
2. In your backend, create an endpoint: **`GET /api/video/token?roomContext=appointmentId`**.
3. Use the LiveKit server SDK to sign a JWT token allowing the user into that unique room.
4. Replace the mock video divs in `VideoCallPage.tsx` with `<LiveKitRoom token={token} ... />` components wrapped around standard `<VideoTrack />` renders.

---

## 5. Step-by-Step Replacement Guide

1. **Delete `mockData.ts`**: Remove `src/lib/mockData.ts` to reveal all type errors.
2. **Install Axios / React Query**: `npm install @tanstack/react-query axios`
3. **Connect Auth**: Update `src/contexts/AuthContext.tsx`. Replace the hardcoded `setMockUser()` logic with actual `await supabase.auth.signInWithPassword()` calls.
4. **Update Loaders**: Go to `DashboardPage.tsx` and `DoctorDashboardPage.tsx`. Replace standard imports with `useQuery()` hooks that fetch data from your new endpoints.
5. **Handle Loading States**: Since the frontend already has `PageLoadingSkeleton.tsx` and Framer animations, simply wrap your `isLoading` states from React Query around these existing premium loaders.
