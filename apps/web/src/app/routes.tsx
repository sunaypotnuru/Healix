import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PatientLoginPage from "./pages/PatientLoginPage";
import DoctorLoginPage from "./pages/DoctorLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import SignUpPage from "./pages/SignUpPage";
import DoctorSignUpPage from "./pages/DoctorSignUpPage";
import DashboardPage from "./pages/DashboardPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import VideoCallPage from "./pages/VideoCallPage";
import AnemiaDetectionPage from "./pages/AnemiaDetectionPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import NearbyHospitalsPage from "./pages/NearbyHospitalsPage";
import MedicalHistoryPage from "./pages/MedicalHistoryPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import DoctorAppointmentsPage from "./pages/DoctorAppointmentsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayoutWrapper from "./components/AdminLayoutWrapper";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPatientsPage from "./pages/admin/AdminPatientsPage";
import AdminDoctorsPage from "./pages/admin/AdminDoctorsPage";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";
import AdminScansPage from "./pages/admin/AdminScansPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            // Public
            { index: true, Component: HomePage },
            { path: "login", Component: LoginPage },
            { path: "login/patient", Component: PatientLoginPage },
            { path: "login/doctor", Component: DoctorLoginPage },
            { path: "login/admin", Component: AdminLoginPage },
            { path: "signup/patient", Component: SignUpPage },
            { path: "signup/doctor", Component: DoctorSignUpPage },

            // Patient Portal (Protected)
            {
                path: "patient",
                element: <ProtectedRoute allowedRoles={['patient']} />,
                children: [
                    { path: "dashboard", Component: DashboardPage },
                    { path: "scan", Component: AnemiaDetectionPage },
                    { path: "hospitals", Component: NearbyHospitalsPage },
                    { path: "doctors", Component: DoctorsPage },
                    { path: "doctors/:id", Component: DoctorDetailPage },
                    { path: "appointments", Component: AppointmentsPage },
                    { path: "consultation/:appointmentId", Component: VideoCallPage },
                    { path: "history", Component: MedicalHistoryPage },
                    { path: "profile", Component: ProfilePage },
                ]
            },

            // Doctor Portal (Protected)
            {
                path: "doctor",
                element: <ProtectedRoute allowedRoles={['doctor']} />,
                children: [
                    { path: "dashboard", Component: DoctorDashboardPage },
                    { path: "availability", Component: AvailabilityPage },
                    { path: "appointments", Component: DoctorAppointmentsPage },
                    { path: "consultation/:appointmentId", Component: VideoCallPage },
                    { path: "profile", Component: ProfilePage },
                ]
            },

            // Admin Portal (Protected via AdminLayoutWrapper which uses AdminRoute)
            {
                path: "admin",
                Component: AdminLayoutWrapper,
                children: [
                    { index: true, Component: AdminDashboardPage },
                    { path: "dashboard", Component: AdminDashboardPage },
                    { path: "patients", Component: AdminPatientsPage },
                    { path: "doctors", Component: AdminDoctorsPage },
                    { path: "appointments", Component: AdminAppointmentsPage },
                    { path: "scans", Component: AdminScansPage },
                    { path: "settings", Component: AdminSettingsPage },
                ]
            },

            // Legacy redirects (keep old routes working)
            { path: "dashboard", Component: DashboardPage },
            { path: "doctors", Component: DoctorsPage },
            { path: "doctors/:id", Component: DoctorDetailPage },
            { path: "appointments", Component: AppointmentsPage },
            { path: "video/:appointmentId", Component: VideoCallPage },
            { path: "anemia-detection", Component: AnemiaDetectionPage },
            { path: "profile", Component: ProfilePage },

            // 404
            { path: "*", Component: NotFoundPage },
        ],
    },
]);
