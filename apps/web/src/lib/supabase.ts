import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Validate configuration on startup
if (supabaseUrl === 'https://your-project.supabase.co' || !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.error('[Supabase] ❌ Configuration not found! Please check your .env file.');
  console.error('[Supabase] VITE_SUPABASE_URL:', supabaseUrl);
  console.error('[Supabase] VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[SET]' : '[NOT SET]');
} else {
  console.log('[Supabase] ✅ Configuration loaded successfully');
  console.log('[Supabase] URL:', supabaseUrl);
}

// Create Supabase client with auth persistence
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return (
    !!import.meta.env.VITE_SUPABASE_URL &&
    !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'
  );
};

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData: any = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: any, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helpers
export const db = {
  // Profiles
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Doctors
  getDoctors: async (filters: any = {}) => {
    let query = supabase
      .from('doctors')
      .select('*, profiles(*)');

    if (filters.specialty) {
      query = query.eq('specialty', filters.specialty);
    }
    if (filters.language) {
      query = query.contains('languages', [filters.language]);
    }
    if (filters.available) {
      query = query.eq('is_available', true);
    }

    const { data, error } = await query;
    return { data, error };
  },

  getDoctor: async (doctorId: string) => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, profiles(*)')
      .eq('id', doctorId)
      .single();
    return { data, error };
  },

  // Appointments
  createAppointment: async (appointmentData: any) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();
    return { data, error };
  },

  getAppointments: async (userId: string, userType: 'patient' | 'doctor' = 'patient') => {
    const column = userType === 'patient' ? 'patient_id' : 'doctor_id';
    const { data, error } = await supabase
      .from('appointments')
      .select('*, doctor:doctors(*, profiles(*)), patient:profiles(*)')
      .eq(column, userId)
      .order('scheduled_at', { ascending: true });
    return { data, error };
  },

  updateAppointment: async (appointmentId: string, updates: any) => {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', appointmentId)
      .select()
      .single();
    return { data, error };
  },

  // Availability
  getDoctorAvailability: async (doctorId: string) => {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('start_time', { ascending: true });
    return { data, error };
  },

  setAvailability: async (availabilityData: any) => {
    const { data, error } = await supabase
      .from('availability')
      .insert(availabilityData)
      .select()
      .single();
    return { data, error };
  },

  deleteAvailability: async (availabilityId: string) => {
    const { error } = await supabase
      .from('availability')
      .delete()
      .eq('id', availabilityId);
    return { error };
  },

  // Anemia Detection Results
  saveAnemiaResult: async (resultData: any) => {
    const { data, error } = await supabase
      .from('anemia_results')
      .insert(resultData)
      .select()
      .single();
    return { data, error };
  },

  getAnemiaResults: async (userId: string) => {
    const { data, error } = await supabase
      .from('anemia_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },
};

// Storage helpers
export const storage = {
  uploadImage: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { error };
  },
};
