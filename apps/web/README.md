# 🏥 Healix AI - Complete Telemedicine Platform

A full-featured healthcare platform with AI-powered anemia detection, video consultations, real-time translation, and comprehensive appointment management.

## ✨ Features

### 1. 🔐 User Authentication & Profiles
- Secure sign up/sign in with Supabase JWT
- User profiles with customizable settings
- Role-based access (Patient/Doctor)
- Mock authentication for demo/testing

### 2. 👨‍⚕️ Doctor Discovery & Matching
- Browse certified specialists
- Filter by specialty, language, availability
- Search by name or expertise
- View detailed doctor profiles with ratings
- See consultation fees and experience

### 3. 📅 Availability Management
- Doctors can set availability schedules
- Time slot management
- View available appointment times
- Booking conflict prevention

### 4. 🗓️ Appointment Booking
- Easy appointment scheduling
- Upcoming and past appointments view
- Appointment status tracking (pending/confirmed/completed/cancelled)
- Cancellation support
- Video and in-person consultation types

### 5. 📹 Video Consultations (LiveKit)
- HD video calls between patients and doctors
- Audio/video controls (mute, camera on/off)
- Real-time connection status
- Professional call interface
- LiveKit integration ready

### 6. 🌍 Real-time Audio Translation (Google Cloud)
- Multi-language support (English, Spanish, French, Hindi, Chinese, Arabic)
- Toggle translation during video calls
- Language selector
- Real-time subtitle display
- Google Cloud Translation API ready

### 7. 🩺 AI Anemia Detection (Healix)
- Upload eye images for analysis
- Conjunctiva analysis
- Confidence scoring
- Hemoglobin level estimation
- Detailed recommendations
- Result history tracking
- Mock AI for testing

---

## 🏗️ Architecture

### Backend Integration Layer (`/src/lib/`)

#### `supabase.js`
- Supabase client initialization
- Auth helpers (signUp, signIn, signOut, getCurrentUser)
- Database helpers (profiles, doctors, appointments, availability, anemia_results)
- Storage helpers for image uploads
- Configuration detection

#### `api.js`
- Unified API layer for all features
- **Mock fallbacks** for every function - works without backend!
- Auth API (sign up, sign in, sign out)
- Profile API (get, update)
- Doctor API (search, filter, get details)
- Appointment API (create, get, update, cancel)
- Availability API (get slots, set availability)
- Video API (create room, LiveKit tokens)
- Translation API (translate text, get languages)
- Anemia API (detect, save results, get history)

#### `store.js` (Zustand State Management)
- `useAuthStore` - User authentication state
- `useAppointmentStore` - Appointments management
- `useVideoStore` - Video call state
- `useAnemiaStore` - Detection results

---

## 📂 Project Structure

```
src/
├── lib/
│   ├── supabase.js       # Supabase client & helpers
│   ├── api.js            # All API functions with mock fallbacks
│   └── store.js          # Global state management
│
├── app/
│   ├── App.tsx           # Router provider
│   ├── routes.ts         # Route configuration
│   │
│   ├── pages/
│   │   ├── Root.tsx                 # Root layout with navbar
│   │   ├── HomePage.tsx             # Landing page
│   │   ├── LoginPage.tsx            # Sign in
│   │   ├── SignUpPage.tsx           # Register
│   │   ├── DashboardPage.tsx        # User dashboard
│   │   ├── DoctorsPage.tsx          # Browse doctors
│   │   ├── DoctorDetailPage.tsx     # Doctor profile & booking
│   │   ├── AppointmentsPage.tsx     # Manage appointments
│   │   ├── VideoCallPage.tsx        # Video consultation
│   │   ├── AnemiaDetectionPage.tsx  # AI detection
│   │   ├── ProfilePage.tsx          # User settings
│   │   └── NotFoundPage.tsx         # 404 page
│   │
│   └── components/
│       ├── NavbarMain.tsx           # Main navigation
│       ├── HeroStoryAnimation.tsx   # Animated hero section
│       ├── HowItWorks.tsx          # Feature showcase
│       ├── AboutSection.tsx        # About
│       ├── Footer.tsx              # Footer
│       └── ui/                     # Radix UI components
│
└── styles/
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Demo Mode (No Backend Required)
```bash
npm run dev
```

The app works fully with mock data! All features are functional for testing and demo purposes.

### 3. Connect Real Backend (Optional)

Create `.env` file:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_LIVEKIT_URL=wss://your-livekit-server.com
```

The app will automatically detect configuration and switch to real APIs.

---

## 🗄️ Database Schema (Supabase)

### Tables

#### `profiles`
```sql
- id (uuid, FK to auth.users)
- full_name (text)
- email (text)
- phone (text)
- user_type (text: 'patient' | 'doctor')
- avatar_url (text)
- date_of_birth (date)
- gender (text)
- created_at (timestamp)
```

#### `doctors`
```sql
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- specialty (text)
- languages (text[])
- rating (decimal)
- experience_years (integer)
- consultation_fee (decimal)
- is_available (boolean)
- bio (text)
- created_at (timestamp)
```

#### `appointments`
```sql
- id (uuid, PK)
- patient_id (uuid, FK to profiles)
- doctor_id (uuid, FK to doctors)
- scheduled_at (timestamp)
- status (text: 'pending' | 'confirmed' | 'completed' | 'cancelled')
- type (text: 'video' | 'in-person')
- notes (text)
- created_at (timestamp)
- cancelled_at (timestamp)
```

#### `availability`
```sql
- id (uuid, PK)
- doctor_id (uuid, FK to doctors)
- day_of_week (integer: 0-6)
- start_time (time)
- end_time (time)
- is_available (boolean)
```

#### `anemia_results`
```sql
- id (uuid, PK)
- user_id (uuid, FK to profiles)
- confidence (decimal)
- prediction (text: 'anemic' | 'normal')
- hemoglobin_level (decimal)
- recommendation (text)
- image_url (text)
- created_at (timestamp)
```

### Storage Buckets

- `anemia-images` - Eye images for anemia detection
- `avatars` - User profile pictures

---

## 🔌 External API Integration

### LiveKit (Video Consultations)
The platform is ready for LiveKit integration:
- Room creation API call in `/src/lib/api.js` → `videoAPI.createRoom()`
- Token generation should be done on your backend
- Set `VITE_LIVEKIT_URL` in environment variables

**Backend endpoint needed:**
```javascript
POST /api/create-room
{
  appointmentId: string
}
Response: {
  roomName: string,
  token: string,
  url: string
}
```

### Google Cloud Translation API
Translation integration ready:
- Text translation in `/src/lib/api.js` → `translationAPI.translateText()`
- Should be proxied through your backend for security
- Supports 6+ languages

**Backend endpoint needed:**
```javascript
POST /api/translate
{
  text: string,
  targetLanguage: string,
  sourceLanguage: string
}
Response: {
  translatedText: string,
  detectedLanguage: string
}
```

### Healix AI (Anemia Detection)
AI detection integration:
- Image analysis in `/src/lib/api.js` → `anemiaAPI.detectAnemia()`
- Upload image to Supabase Storage first
- Call Healix API with image URL

**Backend endpoint needed:**
```javascript
POST /api/detect-anemia
{
  imageUrl: string
}
Response: {
  confidence: number,
  prediction: 'anemic' | 'normal',
  hemoglobin_level: number,
  recommendation: string
}
```

---

## 🎨 Design System

### Colors
- **Primary Green:** `#2ECC71` (Medical, Success)
- **Dark Green:** `#27AE60`
- **Medical Blue:** `#3498DB` (Trust, Technology)
- **Dark Blue:** `#2980B9`
- **Alert Red:** `#E74C3C` (Warnings)
- **Dark Navy:** `#1F2D3D` (Text, Headers)
- **Soft Background:** `#F8F9FA`

### Typography
- **Primary Font:** Poppins or Inter
- **Headings:** Bold, 32px-56px
- **Body:** Regular, 16px-18px
- **Captions:** 14px

### Components
- Radix UI for accessibility
- Tailwind CSS v4 for styling
- Motion (Framer Motion) for animations

---

## 🧪 Testing Features Without Backend

### Demo Login
1. Go to `/login`
2. Click "Use Demo Credentials"
3. Credentials auto-fill: `patient@demo.com` / `demo123`
4. Or create any account - works with mock data

### What Works in Demo Mode?
✅ User authentication (mock)  
✅ Browse doctors (3 mock doctors)  
✅ Book appointments  
✅ View appointments (2 mock appointments)  
✅ Anemia detection (simulated AI)  
✅ Video call UI (no real connection)  
✅ Translation UI (mock translation)  
✅ Profile management  
✅ All navigation and UI

---

## 📱 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with features |
| `/login` | Login | Sign in page |
| `/signup` | Sign Up | Registration |
| `/dashboard` | Dashboard | User overview |
| `/doctors` | Doctors | Browse specialists |
| `/doctors/:id` | Doctor Detail | Profile & booking |
| `/appointments` | Appointments | Manage consultations |
| `/video/:appointmentId` | Video Call | Consultation room |
| `/anemia-detection` | Anemia Detection | AI screening |
| `/profile` | Profile | User settings |

---

## 🔧 Configuration

### Environment Variables (Optional)

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# LiveKit
VITE_LIVEKIT_URL=wss://your-livekit-server.com

# Google Cloud (handled by backend)
# No frontend env vars needed - use backend proxy
```

### Feature Flags
The app automatically detects if Supabase is configured:
- If configured: Uses real Supabase APIs
- If not: Falls back to mock data
- Check: `isSupabaseConfigured()` in `/src/lib/supabase.js`

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect repository
2. Set environment variables
3. Deploy `dist/` folder

### Backend Requirements
For full functionality, you need:
1. **Supabase project** with tables and auth
2. **Backend API** for:
   - LiveKit room creation
   - Google Cloud Translation proxy
   - Healix AI integration
3. **Storage buckets** configured

---

## 🎯 Key Files to Preserve

**✅ DO NOT MODIFY** (Backend Integration):
- `/src/lib/supabase.js`
- `/src/lib/api.js`
- `/src/lib/store.js`

**✏️ FREELY MODIFY** (Frontend):
- `/src/app/pages/*.tsx`
- `/src/app/components/*.tsx`
- `/src/styles/*.css`
- `/src/app/routes.ts`

---

## 📦 Dependencies

### Core
- React 18.3
- React Router 7
- TypeScript

### Backend
- @supabase/supabase-js (Database & Auth)
- livekit-client (Video calls)

### State Management
- Zustand (Global state)

### UI Components
- Radix UI (Accessible components)
- Tailwind CSS v4 (Styling)
- Motion (Animations)
- Lucide React (Icons)

### Utilities
- date-fns (Date formatting)
- sonner (Toasts)
- react-hook-form (Forms)

---

## 🤝 Contributing

### Adding New Features

1. **Add API function** in `/src/lib/api.js` with mock fallback
2. **Create page** in `/src/app/pages/`
3. **Add route** in `/src/app/routes.ts`
4. **Update store** if needed in `/src/lib/store.js`

Example:
```javascript
// In api.js
export const newFeatureAPI = {
  doSomething: async (data) => {
    if (!isSupabaseConfigured()) {
      return { data: mockData, error: null };
    }
    return await db.doSomething(data);
  },
};
```

---

## 📞 Support

For questions or issues:
- Check mock data in `/src/lib/api.js`
- Review Supabase setup in `/src/lib/supabase.js`
- Verify environment variables
- Check browser console for errors

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 🎉 Credits

- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide Icons
- **Images:** Unsplash
- **Design:** Medical theme optimized for healthcare

---

**Built with ❤️ for healthcare innovation**
