# 🚀 Implementation Guide - Healix AI Telemedicine Platform

## Quick Start Summary

✅ **What's Built:** Complete frontend telemedicine platform with 7 major features  
✅ **Backend Layer:** API integration with mock fallbacks  
✅ **Works Now:** Fully functional with demo data (no backend required)  
✅ **Production Ready:** Connect Supabase & external APIs when ready

---

## 📋 Table of Contents

1. [Immediate Use (Demo Mode)](#immediate-use-demo-mode)
2. [Backend Integration](#backend-integration)
3. [Feature Implementation Guide](#feature-implementation-guide)
4. [API Reference](#api-reference)
5. [Customization Guide](#customization-guide)

---

## 🎯 Immediate Use (Demo Mode)

### Start the Application
```bash
npm install
npm run dev
```

### Demo Credentials
- **Email:** `patient@demo.com`
- **Password:** `demo123` (or any password - mock auth accepts everything)

### What Works Out of the Box?

#### ✅ User Authentication
- Sign up with any email/password
- Sign in with demo credentials
- Sign out
- Protected routes

#### ✅ Doctor Discovery
- Browse 3 mock doctors
- Search and filter
- View detailed profiles
- See ratings and fees

#### ✅ Appointment Booking
- Book appointments
- View upcoming (1 mock appointment)
- View past (1 mock appointment)
- Cancel appointments

#### ✅ AI Anemia Detection
- Upload eye images
- Get instant mock analysis
- View confidence scores
- See hemoglobin estimates
- Get recommendations

#### ✅ Video Consultations
- Full video call UI
- Mic/camera controls
- Translation toggle
- End call functionality

#### ✅ Real-time Translation
- Language selector
- 6 supported languages
- Translation preview UI

#### ✅ Profile Management
- View profile
- Edit information
- Save changes (persists in state)

---

## 🔌 Backend Integration

### Step 1: Set Up Supabase

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get your credentials:
   - Project URL
   - Anon/Public Key

#### Create Environment File
Create `.env` in root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Run Database Migrations

Execute this SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('patient', 'doctor')),
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Doctors table
CREATE TABLE doctors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  languages TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0,
  experience_years INTEGER DEFAULT 0,
  consultation_fee DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can update own profile"
  ON doctors FOR UPDATE
  USING (user_id = auth.uid());

-- Appointments table
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id),
  doctor_id UUID REFERENCES doctors(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  type TEXT CHECK (type IN ('video', 'in-person')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  USING (
    auth.uid() = patient_id OR
    auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id)
  );

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  USING (
    auth.uid() = patient_id OR
    auth.uid() IN (SELECT user_id FROM doctors WHERE id = doctor_id)
  );

-- Availability table
CREATE TABLE availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view availability"
  ON availability FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Doctors can manage own availability"
  ON availability FOR ALL
  USING (doctor_id IN (SELECT id FROM doctors WHERE user_id = auth.uid()));

-- Anemia results table
CREATE TABLE anemia_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  confidence DECIMAL(3,2) NOT NULL,
  prediction TEXT CHECK (prediction IN ('anemic', 'normal')),
  hemoglobin_level DECIMAL(4,1),
  recommendation TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE anemia_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own results"
  ON anemia_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own results"
  ON anemia_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'patient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Create Storage Buckets
In Supabase Dashboard → Storage:

1. **anemia-images**
   - Public: Yes
   - File size limit: 10MB
   - Allowed types: image/*

2. **avatars**
   - Public: Yes
   - File size limit: 5MB
   - Allowed types: image/*

---

### Step 2: Set Up Backend APIs

The frontend expects these backend endpoints:

#### LiveKit Room Creation
```javascript
// POST /api/create-room
// Request:
{
  "appointmentId": "uuid"
}

// Response:
{
  "roomName": "appointment-uuid",
  "token": "livekit-token-here",
  "url": "wss://your-livekit-server.com"
}

// Implementation (Node.js/Express):
const { AccessToken } = require('livekit-server-sdk');

app.post('/api/create-room', async (req, res) => {
  const { appointmentId } = req.body;
  const roomName = `appointment-${appointmentId}`;
  
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: req.user.id,
    }
  );
  
  at.addGrant({ roomJoin: true, room: roomName });
  
  res.json({
    roomName,
    token: at.toJwt(),
    url: process.env.LIVEKIT_URL,
  });
});
```

#### Google Cloud Translation
```javascript
// POST /api/translate
// Request:
{
  "text": "Hello, how are you?",
  "targetLanguage": "es",
  "sourceLanguage": "en"
}

// Response:
{
  "translatedText": "Hola, ¿cómo estás?",
  "detectedLanguage": "en"
}

// Implementation:
const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage, sourceLanguage } = req.body;
  
  const [translation] = await translate.translate(text, {
    from: sourceLanguage === 'auto' ? undefined : sourceLanguage,
    to: targetLanguage,
  });
  
  res.json({
    translatedText: translation,
    detectedLanguage: sourceLanguage,
  });
});
```

#### Healix AI Anemia Detection
```javascript
// POST /api/detect-anemia
// Request:
{
  "imageUrl": "https://storage.url/image.jpg"
}

// Response:
{
  "confidence": 0.87,
  "prediction": "anemic",
  "hemoglobin_level": 10.5,
  "recommendation": "Consultation recommended...",
  "processed_image_url": "https://..."
}

// Implementation:
app.post('/api/detect-anemia', async (req, res) => {
  const { imageUrl } = req.body;
  
  // Call Healix API
  const response = await fetch('https://healix-api.com/analyze', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HEALIX_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  
  const result = await response.json();
  res.json(result);
});
```

---

## 🔧 Feature Implementation Guide

### Feature 1: User Authentication

**Frontend:** ✅ Complete  
**Backend:** Supabase Auth

**Test it:**
1. Go to `/signup`
2. Enter email/password
3. Create account
4. Sign in at `/login`

**API Calls Used:**
- `authAPI.signUp(email, password, userData)`
- `authAPI.signIn(email, password)`
- `authAPI.signOut()`
- `authAPI.getCurrentUser()`

---

### Feature 2: Doctor Discovery

**Frontend:** ✅ Complete  
**Backend:** Supabase Database

**Test it:**
1. Go to `/doctors`
2. Browse doctors
3. Search by name
4. Click profile

**Add Mock Doctors to Database:**
```sql
-- Insert doctor users
INSERT INTO profiles (id, email, full_name, user_type)
VALUES 
  (uuid_generate_v4(), 'dr.sarah@healix.com', 'Dr. Sarah Johnson', 'doctor'),
  (uuid_generate_v4(), 'dr.chen@healix.com', 'Dr. Michael Chen', 'doctor');

-- Insert doctor details
INSERT INTO doctors (user_id, specialty, languages, rating, experience_years, consultation_fee, bio)
SELECT 
  id,
  'hematology',
  ARRAY['English', 'Spanish'],
  4.8,
  12,
  150,
  'Specialist in blood disorders and anemia treatment.'
FROM profiles
WHERE email = 'dr.sarah@healix.com';
```

**API Calls:**
- `doctorAPI.getDoctors(filters)`
- `doctorAPI.getDoctor(id)`
- `doctorAPI.searchDoctors(term, filters)`

---

### Feature 3: Appointment Booking

**Frontend:** ✅ Complete  
**Backend:** Supabase Database

**Test it:**
1. Click "Book Appointment" on doctor profile
2. Appointment created
3. View in `/appointments`

**API Calls:**
- `appointmentAPI.createAppointment(data)`
- `appointmentAPI.getAppointments(userId)`
- `appointmentAPI.updateAppointment(id, updates)`
- `appointmentAPI.cancelAppointment(id)`

---

### Feature 4: AI Anemia Detection

**Frontend:** ✅ Complete  
**Backend:** Healix API + Supabase Storage

**Test it:**
1. Go to `/anemia-detection`
2. Upload eye image
3. Click "Analyze"
4. View results

**Implementation Flow:**
1. User uploads image
2. Frontend uploads to Supabase Storage
3. Frontend calls `/api/detect-anemia` with image URL
4. Backend calls Healix API
5. Results saved to database
6. Frontend displays results

**API Calls:**
- `anemiaAPI.detectAnemia(imageFile)`
- `anemiaAPI.saveResult(data)`
- `anemiaAPI.getResults(userId)`

---

### Feature 5: Video Consultations

**Frontend:** ✅ Complete  
**Backend:** LiveKit + Backend API

**Test it:**
1. Go to appointment
2. Click "Join Call"
3. Video call page opens
4. Controls work (mock)

**Production Setup:**
1. Create LiveKit account
2. Set up backend endpoint `/api/create-room`
3. Update LiveKit URL in env
4. Frontend auto-connects

**API Calls:**
- `videoAPI.createRoom(appointmentId)`
- `videoAPI.endRoom(roomName)`

---

### Feature 6: Real-time Translation

**Frontend:** ✅ Complete  
**Backend:** Google Cloud Translation

**Test it:**
1. Join video call
2. Click translation toggle
3. Select language
4. UI shows translation panel

**Production Setup:**
1. Enable Google Cloud Translation API
2. Set up backend endpoint `/api/translate`
3. Frontend auto-translates

**API Calls:**
- `translationAPI.translateText(text, targetLang, sourceLang)`
- `translationAPI.getSupportedLanguages()`

---

### Feature 7: Availability Management

**Frontend:** Ready for implementation  
**Backend:** Supabase Database

**To Implement:**
1. Create availability page for doctors
2. Use `availabilityAPI` functions
3. Display time slots

**API Calls:**
- `availabilityAPI.getDoctorAvailability(doctorId)`
- `availabilityAPI.setAvailability(data)`
- `availabilityAPI.deleteAvailability(id)`
- `availabilityAPI.getAvailableSlots(doctorId, date)`

---

## 📚 API Reference

### Auth API

```javascript
import { authAPI } from '../lib/api';

// Sign up
const { data, error } = await authAPI.signUp(
  'email@example.com',
  'password123',
  { full_name: 'John Doe', user_type: 'patient' }
);

// Sign in
const { data, error } = await authAPI.signIn('email@example.com', 'password123');

// Sign out
await authAPI.signOut();

// Get current user
const { user, error } = await authAPI.getCurrentUser();

// Listen to auth changes
authAPI.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});
```

### Doctor API

```javascript
import { doctorAPI } from '../lib/api';

// Get all doctors
const { data } = await doctorAPI.getDoctors();

// Filter doctors
const { data } = await doctorAPI.getDoctors({
  specialty: 'hematology',
  language: 'Spanish',
  available: true
});

// Get single doctor
const { data } = await doctorAPI.getDoctor('doctor-id');

// Search doctors
const { data } = await doctorAPI.searchDoctors('Sarah', { specialty: 'hematology' });
```

### Appointment API

```javascript
import { appointmentAPI } from '../lib/api';

// Create appointment
const { data } = await appointmentAPI.createAppointment({
  patient_id: 'user-id',
  doctor_id: 'doctor-id',
  scheduled_at: new Date().toISOString(),
  type: 'video',
  status: 'pending',
  notes: 'Follow-up consultation'
});

// Get user's appointments
const { data } = await appointmentAPI.getAppointments('user-id', 'patient');

// Update appointment
const { data } = await appointmentAPI.updateAppointment('appt-id', {
  status: 'confirmed'
});

// Cancel appointment
await appointmentAPI.cancelAppointment('appt-id');
```

### Anemia API

```javascript
import { anemiaAPI } from '../lib/api';

// Detect anemia from image
const { data } = await anemiaAPI.detectAnemia(imageFile);

// Save result
await anemiaAPI.saveResult({
  user_id: 'user-id',
  confidence: 0.87,
  prediction: 'anemic',
  hemoglobin_level: 10.5,
  recommendation: 'Consult a doctor'
});

// Get user's results
const { data } = await anemiaAPI.getResults('user-id');
```

---

## 🎨 Customization Guide

### Change Colors

Edit `/src/styles/theme.css`:
```css
:root {
  --color-primary: #2ECC71;     /* Change primary green */
  --color-secondary: #3498DB;    /* Change medical blue */
  --color-accent: #E74C3C;       /* Change alert red */
}
```

### Add New Page

1. Create page in `/src/app/pages/NewPage.tsx`
2. Add route in `/src/app/routes.ts`
3. Add navigation link in `/src/app/components/NavbarMain.tsx`

Example:
```typescript
// 1. Create /src/app/pages/MessagesPage.tsx
export default function MessagesPage() {
  return <div>Messages</div>;
}

// 2. Add to routes.ts
import MessagesPage from "./pages/MessagesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      // ... existing routes
      { path: "messages", Component: MessagesPage },
    ],
  },
]);

// 3. Add link in NavbarMain.tsx
<Link to="/messages">Messages</Link>
```

### Add New API Function

1. Add to `/src/lib/api.js`
2. Include mock fallback
3. Use in component

Example:
```javascript
// In /src/lib/api.js
export const messagesAPI = {
  getMessages: async (userId) => {
    if (!isSupabaseConfigured()) {
      return { data: mockMessages, error: null };
    }
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },
};

// In component
import { messagesAPI } from '../lib/api';

const { data } = await messagesAPI.getMessages(user.id);
```

---

## ✅ Testing Checklist

### Demo Mode Tests
- [ ] Sign up new user
- [ ] Sign in with demo credentials
- [ ] Browse doctors
- [ ] Book appointment
- [ ] View appointments
- [ ] Upload anemia detection image
- [ ] View detection results
- [ ] Join video call
- [ ] Toggle translation
- [ ] Update profile
- [ ] Sign out

### Production Tests (After Supabase Setup)
- [ ] Real sign up creates database profile
- [ ] Sign in with real credentials
- [ ] Doctors load from database
- [ ] Appointments save to database
- [ ] Anemia images upload to storage
- [ ] Results save to database
- [ ] Real-time data updates

---

## 🐛 Troubleshooting

### Issue: "Supabase not configured" in console
**Solution:** This is normal! App works with mock data.  
**To fix:** Add Supabase credentials to `.env`

### Issue: Can't sign in
**Solution:** Use demo credentials or create new account (works with mock auth)

### Issue: No doctors showing
**Solution:** Mock data has 3 doctors. Check `/src/lib/api.js` MOCK_DATA

### Issue: Video call not connecting
**Solution:** Video UI works, but real connection needs LiveKit backend

### Issue: Translation not working
**Solution:** Translation UI works, but real translation needs Google Cloud backend

---

## 📞 Support Resources

- **Mock Data:** Check `/src/lib/api.js` → `MOCK_DATA`
- **API Functions:** See `/src/lib/api.js` → All `*API` exports
- **Database:** See `/src/lib/supabase.js` → `db` helpers
- **State:** See `/src/lib/store.js` → Zustand stores

---

## 🎯 Next Steps

1. **Test Demo Mode** - Verify all features work
2. **Set Up Supabase** - Create project and tables
3. **Add Real Data** - Insert doctors, test users
4. **Set Up Backend** - Create API endpoints
5. **Connect LiveKit** - Enable video calls
6. **Connect Google Cloud** - Enable translation
7. **Connect Healix** - Enable real AI detection
8. **Customize UI** - Match your brand
9. **Deploy** - Vercel/Netlify
10. **Launch** 🚀

---

**Happy Building! 🏥**
