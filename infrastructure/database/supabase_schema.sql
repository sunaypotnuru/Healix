-- ╔══════════════════════════════════════════════════════════════╗
-- ║     NetraAI Consult Platform — Supabase Schema Migration     ║
-- ║     Run this in: Supabase Dashboard → SQL Editor → New Query ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ─────────────────────────────────────────────────────────────
-- Drop existing tables to start fresh (WARNING: Data Loss!)
-- ─────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.prescriptions CASCADE;
DROP TABLE IF EXISTS public.scans CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.profiles_doctor CASCADE;
DROP TABLE IF EXISTS public.profiles_patient CASCADE;
DROP TYPE IF EXISTS appointment_status CASCADE;
DROP TYPE IF EXISTS appointment_type CASCADE;
DROP TYPE IF EXISTS anemia_status CASCADE;

-- ─────────────────────────────────────────────────────────────
-- 1. ENUMS
-- ─────────────────────────────────────────────────────────────
CREATE TYPE appointment_status AS ENUM ('scheduled', 'in-progress', 'completed', 'cancelled');
CREATE TYPE appointment_type AS ENUM ('video', 'in-person');
CREATE TYPE anemia_status AS ENUM ('Normal', 'Mild Anemia', 'Moderate Anemia', 'Severe Anemia');

-- ─────────────────────────────────────────────────────────────
-- 2. PATIENT PROFILES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.profiles_patient (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  blood_type TEXT,
  health_score INTEGER DEFAULT 0,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 3. DOCTOR PROFILES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.profiles_doctor (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  hospital TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  email TEXT NOT NULL,
  avatar_url TEXT,
  available BOOLEAN DEFAULT true,
  consultation_fee DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 4. APPOINTMENTS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles_patient(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles_doctor(id) ON DELETE CASCADE,
  date_time TIMESTAMPTZ NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  type appointment_type NOT NULL,
  reason TEXT,
  notes TEXT,
  meeting_url TEXT,  -- LiveKit room URL / token info
  livekit_room TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_appointments_patient ON public.appointments(patient_id, date_time);
CREATE INDEX idx_appointments_doctor ON public.appointments(doctor_id, date_time);

-- ─────────────────────────────────────────────────────────────
-- 5. SCANS (Anemia Results)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles_patient(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  hemoglobin_level DECIMAL(4,1),
  status anemia_status,
  confidence_score DECIMAL(5,2),
  processed_by_ai BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scans_patient ON public.scans(patient_id, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 6. PRESCRIPTIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles_patient(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles_doctor(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  diagnosis TEXT NOT NULL,
  medications JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Array of { name, dosage, duration, instructions }
  additional_notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_prescriptions_patient ON public.prescriptions(patient_id, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 7. NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'appointment', 'scan_result', 'prescription', 'verification'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, read, created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- 8. AUDIT LOGS (HIPAA Compliance)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT, -- Might be an ID or URL depending on what was accessed
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ═════════════════════════════════════════════════════════════
-- Row Level Security (RLS) Configuration
-- Enable RLS for all tables. For the backend, the `service_role`
-- key bypasses these policies completely.
-- ═════════════════════════════════════════════════════════════
ALTER TABLE public.profiles_patient ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles_doctor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Add basic blanket select policies for testing (adjust as needed for prod frontend)
CREATE POLICY "Public read doctor profiles" ON public.profiles_doctor FOR SELECT USING (true);
CREATE POLICY "Users view own patient profile" ON public.profiles_patient FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Scans Policies
CREATE POLICY "Patients view own scans" ON public.scans FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors view patient scans" ON public.scans FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE public.appointments.doctor_id = auth.uid() 
    AND public.appointments.patient_id = public.scans.patient_id
  )
);

-- Prescription Policies
CREATE POLICY "Patients view own prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors view own issued prescriptions" ON public.prescriptions FOR SELECT USING (auth.uid() = doctor_id);

-- Notification Policies
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Optional: Triggers to auto-update 'updated_at' columns
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_patient_modtime BEFORE UPDATE ON public.profiles_patient FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER update_doctor_modtime BEFORE UPDATE ON public.profiles_doctor FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE TRIGGER update_appointment_modtime BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
