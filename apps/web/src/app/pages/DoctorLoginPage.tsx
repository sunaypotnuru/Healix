import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Stethoscope, Mail, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { useAuthStore } from "../../lib/store";
import { toast } from "sonner";

export default function DoctorLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signIn, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn(email, password);
        if (result.success) {
            toast.success("Welcome back, Doctor!");
            navigate("/doctor/dashboard");
        } else {
            toast.error(result.error?.message || "Failed to sign in");
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0F9FF] via-white to-[#E0F2FE] flex items-center justify-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-[#0EA5E9]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#0D9488]/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative z-10">
                <Card className="p-8 shadow-2xl backdrop-blur-sm bg-white/90 border border-white/50">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <Stethoscope className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#0F172A]">Doctor Login</h1>
                        <p className="text-[#64748B] mt-2">Access your Netra AI practice portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="doctor@hospital.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 focus:ring-2 focus:ring-[#0EA5E9]/30 transition-shadow"
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
                                    className="pl-11 focus:ring-2 focus:ring-[#0EA5E9]/30 transition-shadow"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white py-6 text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Login"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-[#64748B]">
                            New to Netra AI?{" "}
                            <Link to="/signup/doctor" className="text-[#0EA5E9] font-semibold hover:underline">
                                Apply to Join
                            </Link>
                        </p>
                        <p className="text-sm text-[#64748B]">
                            Are you a patient?{" "}
                            <Link to="/login/patient" className="text-[#0D9488] font-semibold hover:underline">
                                Patient Login
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
