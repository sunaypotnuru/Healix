import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Shield, Mail, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { useAuthStore } from "../../lib/store";
import { toast } from "sonner";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }

        console.log('[AdminLogin] Starting sign in for:', email);
        const result = await signIn(email, password);
        
        console.log('[AdminLogin] Sign in result:', result.success ? 'SUCCESS' : 'FAILED');
        
        if (result.success) {
            toast.success("Welcome back, Administrator!");
            console.log('[AdminLogin] Navigating to dashboard...');
            navigate("/admin/dashboard");
        } else {
            const errorMsg = result.error?.message || result.error?.toString() || "Failed to sign in";
            console.error('[AdminLogin] Error:', errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#0F172A] via-[#0F172A] to-[#1E293B] flex items-center justify-center relative overflow-hidden">
            {/* Background shapes */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-[#7C3AED]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="p-8 shadow-2xl backdrop-blur-sm bg-[#1E293B]/80 border border-[#7C3AED]/30">
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <Shield className="w-8 h-8 text-white" />
                        </motion.div>
                        <motion.h1 className="text-3xl font-bold text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            Admin Login
                        </motion.h1>
                        <motion.p className="text-[#94A3B8] mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                            Access the Netra AI administration panel
                        </motion.p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div className="space-y-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <Label htmlFor="email" className="text-[#E2E8F0]">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div className="space-y-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                            <Label htmlFor="password" className="text-[#E2E8F0]">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </motion.div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
