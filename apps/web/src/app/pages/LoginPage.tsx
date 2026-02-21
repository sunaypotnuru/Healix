import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, Stethoscope, ArrowRight, Heart, Activity, Scan } from "lucide-react";
import { Card } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role: 'patient' | 'doctor' | 'admin') => {
    login(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'doctor') navigate('/doctor/dashboard');
    else navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0FDFA] via-white to-[#F0F9FF] flex items-center justify-center relative overflow-hidden">
      {/* Floating background shapes */}
      <motion.div
        className="absolute top-16 left-16 w-80 h-80 bg-[#0D9488]/5 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-16 right-16 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"
        animate={{ y: [0, -25, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#F43F5E]/3 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating icons */}
      {[
        { Icon: Heart, x: "10%", y: "15%", delay: 0 },
        { Icon: Activity, x: "85%", y: "20%", delay: 1 },
        { Icon: Scan, x: "80%", y: "75%", delay: 2 },
        { Icon: Eye, x: "12%", y: "70%", delay: 0.5 },
      ].map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: x, top: y }}
          animate={{ y: [0, -15, 0], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <Icon className="w-12 h-12 text-[#0D9488]" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 text-center max-w-3xl w-full"
      >
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-[#0D9488] to-[#0F766E] rounded-2xl flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Eye className="w-7 h-7 text-white" />
          </motion.div>
          <span className="text-3xl font-bold text-[#0F172A]">Netra AI</span>
        </motion.div>

        <motion.h1
          className="text-4xl lg:text-5xl font-bold text-[#0F172A] mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className="text-xl font-medium text-[#0D9488] mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          netraai@gmail.com
        </motion.p>
        <motion.p
          className="text-lg text-[#64748B] mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Choose your role to continue
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Patient Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <Card
              className="p-6 cursor-pointer group border-2 border-transparent hover:border-[#0D9488]/30 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/80 relative overflow-hidden h-full"
              onClick={() => handleLogin('patient')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488]/0 to-[#0D9488]/0 group-hover:from-[#0D9488]/5 group-hover:to-[#0F766E]/5 transition-all duration-500 rounded-[inherit]" />

              <div className="relative z-10 flex flex-col h-full">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-[#0D9488] to-[#0F766E] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-shadow"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <Eye className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-2">I'm a Patient</h2>
                <p className="text-sm text-[#64748B] mb-6 flex-grow">
                  Get AI screening, find doctors, and manage health records
                </p>
                <div className="flex items-center justify-center gap-2 text-[#0D9488] text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Patient Login</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Doctor Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <Card
              className="p-6 cursor-pointer group border-2 border-transparent hover:border-[#0EA5E9]/30 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/80 relative overflow-hidden h-full"
              onClick={() => handleLogin('doctor')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/0 to-[#0EA5E9]/0 group-hover:from-[#0EA5E9]/5 group-hover:to-[#0284C7]/5 transition-all duration-500 rounded-[inherit]" />

              <div className="relative z-10 flex flex-col h-full">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-shadow"
                  whileHover={{ rotate: -5, scale: 1.05 }}
                >
                  <Stethoscope className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-2">I'm a Doctor</h2>
                <p className="text-sm text-[#64748B] mb-6 flex-grow">
                  Manage availability, consult patients, and access AI scribes
                </p>
                <div className="flex items-center justify-center gap-2 text-[#0EA5E9] text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Doctor Login</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <Card
              className="p-6 cursor-pointer group border-2 border-transparent hover:border-[#8B5CF6]/30 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/80 relative overflow-hidden h-full"
              onClick={() => handleLogin('admin')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/0 to-[#8B5CF6]/0 group-hover:from-[#8B5CF6]/5 group-hover:to-[#6D28D9]/5 transition-all duration-500 rounded-[inherit]" />

              <div className="relative z-10 flex flex-col h-full">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-shadow"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                >
                  <Activity className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-2">Administrator</h2>
                <p className="text-sm text-[#64748B] mb-6 flex-grow">
                  Manage platform, approve doctors, and view analytics
                </p>
                <div className="flex items-center justify-center gap-2 text-[#8B5CF6] text-sm font-semibold group-hover:gap-3 transition-all">
                  <span>Admin Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.p
          className="text-sm text-[#64748B] mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Don't have an account?{" "}
          <span
            className="text-[#0D9488] font-semibold hover:underline cursor-pointer"
            onClick={() => navigate("/signup/patient")}
          >
            Sign up as Patient
          </span>
          {" "}or{" "}
          <span
            className="text-[#0EA5E9] font-semibold hover:underline cursor-pointer"
            onClick={() => navigate("/signup/doctor")}
          >
            Register as Doctor
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}
