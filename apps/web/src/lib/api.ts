import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { supabase } from "./supabase";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  } else {
    console.warn(
      "[API Interceptor] No session found, request will be unauthenticated:",
      config.url,
    );
  }
  return config;
});

// Auth (using Supabase directly, but we can keep these here for convenience)
export const authAPI = {
  login: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  register: (email: string, password: string, userData: any) =>
    supabase.auth.signUp({ email, password, options: { data: userData } }),
  logout: () => supabase.auth.signOut(),
  getCurrentUser: () => supabase.auth.getUser(),
  onAuthStateChange: (callback: (event: any, session: any) => void) =>
    supabase.auth.onAuthStateChange(callback),
};

// Profile endpoints (if needed beyond direct Supabase usage)
export const profileAPI = {
  getProfile: (
    userId: string,
    role: "patient" | "doctor" | "admin" = "patient",
  ) => {
    const table = role === "doctor" ? "profiles_doctor" : "profiles_patient";
    return supabase.from(table).select("*").eq("id", userId).single();
  },
  updateProfile: (
    userId: string,
    updates: any,
    role: "patient" | "doctor" | "admin" = "patient",
  ) => {
    const table = role === "doctor" ? "profiles_doctor" : "profiles_patient";
    return supabase.from(table).update(updates).eq("id", userId);
  },
};

// Patient endpoints
export const patientAPI = {
  getDashboard: () => api.get("/api/v1/patient/dashboard"),
  getScans: () => api.get("/api/v1/patient/scans"),
  uploadScan: (formData: FormData) =>
    api.post("/api/v1/patient/scans/upload", formData),
  getAppointments: (params?: any) =>
    api.get("/api/v1/patient/appointments", { params }),
  bookAppointment: (data: any) =>
    api.post("/api/v1/patient/appointments", data),
  getPrescriptions: () => api.get("/api/v1/patient/prescriptions"),
  getHistory: () => api.get("/api/v1/patient/history"),
  cancelAppointment: (id: string) =>
    api.put(`/api/v1/patient/appointments/${id}/cancel`),
  rescheduleAppointment: (id: string, data: any) =>
    api.put(`/api/v1/patient/appointments/${id}/reschedule`, data),
};

// Doctor endpoints
export const doctorAPI = {
  getDashboard: () => api.get("/api/v1/doctor/dashboard"),
  getPatients: () => api.get("/api/v1/doctor/patients"),
  getPatientDetails: (id: string) => api.get(`/api/v1/doctor/patients/${id}`),
  createPrescription: (data: any) =>
    api.post("/api/v1/doctor/prescriptions", data),
  updateAppointmentStatus: (id: string, status: string) =>
    api.put(`/api/v1/doctor/appointments/${id}/status`, { status }),
  getAppointments: () => api.get("/api/v1/doctor/appointments"),
  updateAvailability: (availability: any) =>
    api.put("/api/v1/doctor/availability", { availability }),
  getPendingScans: () => api.get("/api/v1/doctor/scans/pending"),
  getDoctors: () => api.get("/api/v1/doctors"),
  searchDoctors: (q: string) => api.get("/api/v1/doctors", { params: { q } }),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get("/api/v1/admin/stats"),
  getPendingDoctors: () => api.get("/api/v1/admin/doctors/pending"),
  verifyDoctor: (id: string, verified: boolean) =>
    api.put(`/api/v1/admin/doctors/${id}/verify`, { verified }),
  getPatients: () => api.get("/api/v1/admin/patients"),
  getDoctors: () => api.get("/api/v1/admin/doctors"),
  getAppointments: () => api.get("/api/v1/admin/appointments"),
  getScans: () => api.get("/api/v1/admin/scans"),
  updateUserRole: (id: string, role: string) =>
    api.put(`/api/v1/admin/users/${id}/role`, { role }),
};

// Video endpoints
export const videoAPI = {
  getToken: (room: string, identity: string) =>
    api.get("/api/v1/video/token", { params: { room, identity } }),
};

// ML (Anemia) Proxy mapping directly to the new FastApi proxy route
export const anemiaAPI = {
  detectAnemia: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/v1/patient/scans/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Appointments (consolidated convenience API)
export const appointmentAPI = {
  createAppointment: (data: any) =>
    api.post("/api/v1/patient/appointments", data),
  getAppointments: (params?: any) =>
    api.get("/api/v1/patient/appointments", { params }),
  getAppointmentById: (id: string) =>
    api.get(`/api/v1/patient/appointments/${id}`),
  updateAppointment: (id: string, updates: any) =>
    api.put(`/api/v1/patient/appointments/${id}`, updates),
  cancelAppointment: (id: string) =>
    api.put(`/api/v1/patient/appointments/${id}/cancel`),
  rescheduleAppointment: (id: string, data: any) =>
    api.put(`/api/v1/patient/appointments/${id}/reschedule`, data),
  getDoctorAppointments: () => api.get("/api/v1/doctor/appointments"),
  updateAppointmentStatus: (id: string, status: string) =>
    api.put(`/api/v1/doctor/appointments/${id}/status`, { status }),
};

// Translation proxy
export const translationAPI = {
  translateText: (text: string, tgt: string, src: string = "en") =>
    api
      .post("/api/v1/translation", { text, target_lang: tgt, source_lang: src })
      .then((res) => res.data),
};

export default api;
