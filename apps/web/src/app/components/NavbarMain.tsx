import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, Menu, X, LogOut, User, Scan, Calendar, MapPin, FileText,
  Stethoscope, Clock, Video, LayoutDashboard, ChevronDown
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuthStore } from "../../lib/store";

const patientNav = [
  { label: "Dashboard", path: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Scan Eyes", path: "/patient/scan", icon: Scan },
  { label: "Doctors", path: "/patient/doctors", icon: Video },
  { label: "Hospitals", path: "/patient/hospitals", icon: MapPin },
  { label: "Appointments", path: "/patient/appointments", icon: Calendar },
  { label: "History", path: "/patient/history", icon: FileText },
];

const doctorNav = [
  { label: "Dashboard", path: "/doctor/dashboard", icon: LayoutDashboard },
  { label: "Availability", path: "/doctor/availability", icon: Clock },
  { label: "Appointments", path: "/doctor/appointments", icon: Calendar },
];

export default function NavbarMain() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isDoctor = location.pathname.startsWith("/doctor");
  const isPatient = location.pathname.startsWith("/patient");
  const isAdmin = location.pathname.startsWith("/admin");
  const isAuth = isDoctor || isPatient || isAdmin || !!user;
  const navItems = isDoctor ? doctorNav : isPatient ? patientNav : [];
  const accentColor = isDoctor ? "#0EA5E9" : "#0D9488";

  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname.startsWith("/login") || location.pathname.startsWith("/signup");

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100"
          : "bg-white/70 backdrop-blur-md border-b border-gray-100/50"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${isDoctor ? "#0284C7" : "#0F766E"})` }}
            >
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0F172A]">Netra AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!isAuth && !isLoginPage && (
              <>
                {["Features", "How It Works", "About", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors rounded-lg hover:bg-gray-100"
                  >
                    {item}
                  </a>
                ))}
              </>
            )}
            {isAuth && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${location.pathname === item.path
                  ? `text-white shadow-md`
                  : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-100"
                  }`}
                style={location.pathname === item.path ? { backgroundColor: accentColor } : {}}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!isAuth && !isLoginPage && (
              <Button
                onClick={() => navigate("/login")}
                className="hidden md:flex text-white font-medium"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${isDoctor ? "#0284C7" : "#0F766E"})` }}
              >
                Get Started
              </Button>
            )}
            {isAuth && (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(isDoctor ? "/doctor/profile" : "/patient/profile")}
                  className="text-[#64748B]"
                >
                  <User className="w-4 h-4 mr-1" /> Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-[#F43F5E] border-[#F43F5E]/30 hover:bg-[#F43F5E]/5"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accentColor}, ${isDoctor ? "#0284C7" : "#0F766E"})` }}>
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-[#0F172A]">Netra AI</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-1">
                  {isAuth ? (
                    <>
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === item.path
                            ? "text-white"
                            : "text-[#64748B] hover:bg-gray-50"
                            }`}
                          style={location.pathname === item.path ? { backgroundColor: accentColor } : {}}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      ))}
                      <hr className="my-4" />
                      <button onClick={() => navigate(isDoctor ? "/doctor/profile" : "/patient/profile")}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#64748B] hover:bg-gray-50 w-full">
                        <User className="w-5 h-5" /> Profile
                      </button>
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#F43F5E] hover:bg-[#F43F5E]/5 w-full">
                        <LogOut className="w-5 h-5" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      {["Features", "How It Works", "About", "Contact"].map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block px-4 py-3 rounded-xl text-sm font-medium text-[#64748B] hover:bg-gray-50"
                          onClick={() => setMobileOpen(false)}>
                          {item}
                        </a>
                      ))}
                      <hr className="my-4" />
                      <Button onClick={() => navigate("/login")} className="w-full text-white"
                        style={{ background: `linear-gradient(135deg, ${accentColor}, ${isDoctor ? "#0284C7" : "#0F766E"})` }}>
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
