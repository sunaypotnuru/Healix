import { create } from 'zustand';
import { authAPI, profileAPI } from './api';

interface AuthState {
  user: any;
  profile: any;
  loading: boolean;
  error: string | null;
  setUser: (user: any) => void;
  setProfile: (profile: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; data?: any; error?: any; needsLogin?: boolean }>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ success: boolean; error?: any; data?: any }>;
}

// Auth Store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,

  setUser: (user: any) => set({ user }),
  setProfile: (profile: any) => set({ profile }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });

    try {
      if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
        let role = 'patient';
        if (email.includes('doctor')) role = 'doctor';
        if (email.includes('admin')) role = 'admin';
        localStorage.setItem('bypassRole', role);
        localStorage.setItem('bypassEmail', email);

        const user = {
          id: '00000000-0000-0000-0000-000000000000',
          email: email,
          name: `Demo ${role}`,
          role: role
        };
        set({ user, loading: false });
        return { success: true, data: { user } };
      }

      console.log('[Auth] Attempting login with:', email);
      const { data, error } = await authAPI.login(email, password);

      if (error) {
        console.error('[Auth] Login failed:', error);
        set({ error: error.message, loading: false });
        return { success: false, error };
      }

      console.log('[Auth] Login successful, user:', data.user.email);
      
      // Determine role safely
      const role = data.user.user_metadata?.role || 'patient';

      // Fetch profile with timeout (don't block login on profile fetch)
      let profileData = null;
      try {
        const profilePromise = profileAPI.getProfile(data.user.id, role);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
        );
        
        const pRes: any = await Promise.race([profilePromise, timeoutPromise]);
        if (pRes && pRes.data) profileData = pRes.data;
        console.log('[Auth] Profile loaded successfully');
      } catch (e) {
        console.warn('[Auth] Profile fetch failed (non-blocking):', e);
        // Don't return error - profile is optional for login
      }

      const userData = { ...data.user, role };
      set({ user: userData, profile: profileData, loading: false });
      console.log('[Auth] Login complete, redirecting...');
      return { success: true, data };
    } catch (err: any) {
      console.error('[Auth] Unexpected error during login:', err);
      set({ error: err.message, loading: false });
      return { success: false, error: err };
    }
  },

  signUp: async (email: string, password: string, userData: any) => {
    set({ loading: true, error: null });

    try {
      userData.role = userData.role || 'patient';

      if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
        localStorage.setItem('bypassRole', userData.role);
        localStorage.setItem('bypassEmail', email);
        const user = {
          id: '00000000-0000-0000-0000-000000000000',
          email: email,
          name: userData.full_name || `Demo ${userData.role}`,
          role: userData.role
        };
        set({ user, loading: false });
        return { success: true, data: { user } };
      }

      const { data, error }: { data: any, error: any } = await authAPI.register(email, password, userData);

      if (error) {
        set({ error: error.message, loading: false });
        return { success: false, error };
      }

      // Auto-confirm email via backend admin API (Supabase requires email confirmation for sessions)
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        await fetch(`${apiUrl}/api/v1/auth/confirm-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: data.user.id })
        });
      } catch (e) {
        console.warn('Email auto-confirm failed (non-critical):', e);
      }

      // Re-sign in to get a valid session (signup alone doesn't create one if email was unconfirmed)
      const { data: loginData, error: loginError } = await authAPI.login(email, password);

      if (loginError) {
        // Signup succeeded but auto-login failed — still a successful registration
        console.warn('Auto-login after signup failed:', loginError);
        set({ user: { ...data.user, role: userData.role }, profile: null, loading: false });
        return { success: true, data, needsLogin: true };
      }

      // Fetch profile
      let profileData = null;
      try {
        const pRes = await profileAPI.getProfile(loginData.user.id, userData.role);
        if (pRes.data) profileData = pRes.data;
      } catch (e) {
        console.warn('Silent fallback: New registration profile not yet generated.');
      }

      set({ user: { ...loginData.user, role: userData.role }, profile: profileData, loading: false });
      return { success: true, data: loginData };
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { success: false, error: err };
    }
  },

  signOut: async () => {
    set({ loading: true });
    await authAPI.logout();
    set({ user: null, profile: null, loading: false });
  },

  loadUser: async () => {
    set({ loading: true });
    const { data: { user }, error } = await authAPI.getCurrentUser();

    if (error || !user) {
      set({ user: null, profile: null, loading: false });
      return;
    }

    const role = user.user_metadata?.role || 'patient';

    let profileData = null;
    try {
      const pRes = await profileAPI.getProfile(user.id, role);
      if (pRes.data) profileData = pRes.data;
    } catch (e) {
      console.warn('Silent fallback: Could not fetch initial profile details state.');
    }

    set({ user: { ...user, role }, profile: profileData, loading: false });
  },

  updateProfile: async (updates: any) => {
    const { user, profile } = get();
    if (!user) return { success: false };

    const role = user.role || 'patient';
    const { data, error } = await profileAPI.updateProfile(user.id, updates, role);

    if (error) {
      return { success: false, error };
    }

    // Since Supabase `update` might return nothing if not using `.select()`, 
    // manually hydrate state locally if backend successfully pushed data
    set({ profile: { ...profile, ...updates } });
    return { success: true, data };
  },
}));

interface AppointmentState {
  appointments: any[];
  loading: boolean;
  selectedAppointment: any | null;
  setAppointments: (appointments: any[]) => void;
  setLoading: (loading: boolean) => void;
  setSelectedAppointment: (appointment: any | null) => void;
  addAppointment: (appointment: any) => void;
  updateAppointment: (id: string, updates: any) => void;
  removeAppointment: (id: string) => void;
}

// Appointment Store
export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  loading: false,
  selectedAppointment: null,

  setAppointments: (appointments: any[]) => set({ appointments }),
  setLoading: (loading: boolean) => set({ loading }),
  setSelectedAppointment: (appointment: any | null) => set({ selectedAppointment: appointment }),

  addAppointment: (appointment: any) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),

  updateAppointment: (id: string, updates: any) =>
    set((state) => ({
      appointments: state.appointments.map((appt) =>
        appt.id === id ? { ...appt, ...updates } : appt
      ),
    })),

  removeAppointment: (id: string) =>
    set((state) => ({
      appointments: state.appointments.filter((appt) => appt.id !== id),
    })),
}));

interface VideoState {
  roomName: string | null;
  token: string | null;
  isInCall: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  translationEnabled: boolean;
  targetLanguage: string;
  setRoomInfo: (roomName: string | null, token: string | null) => void;
  setInCall: (isInCall: boolean) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleTranslation: () => void;
  setTargetLanguage: (language: string) => void;
  reset: () => void;
}

// Video Call Store
export const useVideoStore = create<VideoState>((set) => ({
  roomName: null,
  token: null,
  isInCall: false,
  isMuted: false,
  isVideoOff: false,
  translationEnabled: false,
  targetLanguage: 'en',

  setRoomInfo: (roomName: string | null, token: string | null) => set({ roomName, token }),
  setInCall: (isInCall: boolean) => set({ isInCall }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleVideo: () => set((state) => ({ isVideoOff: !state.isVideoOff })),
  toggleTranslation: () => set((state) => ({ translationEnabled: !state.translationEnabled })),
  setTargetLanguage: (language: string) => set({ targetLanguage: language }),

  reset: () =>
    set({
      roomName: null,
      token: null,
      isInCall: false,
      isMuted: false,
      isVideoOff: false,
      translationEnabled: false,
      targetLanguage: 'en',
    }),
}));

interface AnemiaState {
  results: any[];
  currentResult: any | null;
  loading: boolean;
  setResults: (results: any[]) => void;
  setCurrentResult: (result: any | null) => void;
  setLoading: (loading: boolean) => void;
  addResult: (result: any) => void;
}

// Anemia Detection Store
export const useAnemiaStore = create<AnemiaState>((set) => ({
  results: [],
  currentResult: null,
  loading: false,

  setResults: (results: any[]) => set({ results }),
  setCurrentResult: (result: any | null) => set({ currentResult: result }),
  setLoading: (loading: boolean) => set({ loading }),

  addResult: (result: any) =>
    set((state) => ({
      results: [result, ...state.results],
      currentResult: result,
    })),
}));
