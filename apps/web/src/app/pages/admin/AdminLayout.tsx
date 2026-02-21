import { Outlet, NavLink } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
    LayoutDashboard, Users, UserRoundPlus, Calendar,
    Scan, LogOut, HeartPulse, Settings, Menu, X, Eye
} from 'lucide-react';
import { useAuthStore } from '../../../lib/store';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const { signOut } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            setSidebarOpen(window.innerWidth >= 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Patients', path: '/admin/patients', icon: Users },
        { label: 'Doctors', path: '/admin/doctors', icon: UserRoundPlus },
        { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
        { label: 'AI Scans', path: '/admin/scans', icon: Scan },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: sidebarOpen ? 280 : 0,
                    opacity: sidebarOpen ? 1 : 0
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 shadow-sm z-50 flex flex-col shrink-0 overflow-hidden"
            >
                <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-lg">
                            <Eye className="w-5 h-5 text-white" />
                        </div>
                        {sidebarOpen && <span className="text-xl font-bold text-[#0F172A] whitespace-nowrap">Netra Admin</span>}
                    </div>
                    {isMobile && (
                        <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => isMobile && setSidebarOpen(false)}
                            className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                                    ? "bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white shadow-md font-medium"
                                    : "text-[#64748B] hover:bg-gray-50 hover:text-[#0F172A]"
                                }
              `}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            <span className="whitespace-nowrap">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100 shrink-0">
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-start gap-3 border-gray-200 text-[#F43F5E] hover:bg-[#F43F5E]/5 shrink-0"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="whitespace-nowrap">Sign Out</span>
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 px-6 flex items-center justify-between lg:justify-end">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 rounded-lg hover:bg-gray-100">
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-[#0F172A]">Netra Admin</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20">
                                <HeartPulse className="w-4 h-4 text-[#8B5CF6]" />
                            </div>
                            <span className="text-sm font-semibold text-[#0F172A] hidden sm:block">Super Admin</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <Outlet />
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
