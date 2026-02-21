import { useState } from "react";
// @ts-ignore
import { Link, useNavigate } from "react-router";
// @ts-ignore
import { motion } from "motion/react";
import { Eye, Mail, Lock, Heart, Activity } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { useAuthStore } from "../../lib/store";
import { toast } from "sonner";

export default function PatientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (result.success) {
      toast.success("Welcome back!");
      navigate("/patient/dashboard");
    } else {
      toast.error(result.error?.message || "Failed to sign in");
    }
  };

  // Removed demo login

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0FDFA] via-white to-[#CCFBF1] flex items-center justify-center relative overflow-hidden">
      {/* Floating background shapes */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-[#0D9488]/5 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"
        animate={{ y: [0, -25, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#F43F5E]/3 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating medical icons */}
      {[
        { Icon: Heart, x: "15%", y: "20%", delay: 0 },
        { Icon: Activity, x: "80%", y: "15%", delay: 1 },
        { Icon: Eye, x: "70%", y: "75%", delay: 2 },
      ].map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: x, top: y }}
          animate={{ y: [0, -15, 0], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <Icon className="w-10 h-10 text-[#0D9488]" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 shadow-2xl backdrop-blur-sm bg-white/80 border border-white/50">
          <div className="flex flex-col items-center mb-8">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-[#0D9488] to-[#0F766E] rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Eye className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-[#0F172A]">Patient Login</h1>
            <p className="text-[#64748B] mt-2">Sign in to your Netra AI account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 focus:ring-2 focus:ring-[#0D9488]/30 transition-shadow"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 focus:ring-2 focus:ring-[#0D9488]/30 transition-shadow"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white py-6 text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Demo login removed */}
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-[#64748B]">
              Don't have an account?{" "}
              <Link to="/signup/patient" className="text-[#0D9488] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-[#64748B]">
              Are you a doctor?{" "}
              <Link to="/login/doctor" className="text-[#0EA5E9] font-semibold hover:underline">
                Doctor Login
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
