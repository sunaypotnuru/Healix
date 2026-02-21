import { useState } from "react";
import { Link, useNavigate } from "react-router";
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

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0FDFA] via-white to-[#CCFBF1] flex items-center justify-center relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#0D9488]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#F43F5E]/3 rounded-full blur-3xl" />

      {/* Floating medical icons */}
      {[
        { Icon: Heart, x: "15%", y: "20%" },
        { Icon: Activity, x: "80%", y: "15%" },
        { Icon: Eye, x: "70%", y: "75%" },
      ].map(({ Icon, x, y }, i) => (
        <div key={i} className="absolute pointer-events-none opacity-[0.06]" style={{ left: x, top: y }}>
          <Icon className="w-10 h-10 text-[#0D9488]" />
        </div>
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
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Eye className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1 className="text-3xl font-bold text-[#0F172A]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Patient Login
            </motion.h1>
            <motion.p className="text-[#64748B] mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              Sign in to your Netra AI account
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div className="space-y-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
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
            </motion.div>

            <motion.div className="space-y-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
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
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white py-6 text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </motion.div>
          </form>

          <motion.div className="mt-6 text-center space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <p className="text-sm text-[#64748B]">
              Don't have an account?{" "}
              <Link to="/signup/patient" className="text-[#0D9488] font-semibold hover:underline">
                Create Account
              </Link>
            </p>
            <p className="text-sm text-[#64748B]">
              Are you a doctor?{" "}
              <Link to="/login/doctor" className="text-[#0EA5E9] font-semibold hover:underline">
                Doctor Login
              </Link>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
