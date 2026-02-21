import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

// Hardcoded admin credentials
const ADMIN_EMAIL = "sunaypotnuru@gmail.com";
const ADMIN_PASSWORD = "surya1688*";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Validate against hardcoded credentials
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            login("admin");
            toast.success("Welcome, Administrator!");
            navigate("/admin");
        } else {
            setError("Invalid admin credentials. Access denied.");
            toast.error("Invalid admin credentials");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F5F3FF] via-white to-[#EDE9FE] flex items-center justify-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#8B5CF6]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#6D28D9]/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md relative z-10">
                <Card className="p-8 shadow-2xl backdrop-blur-sm bg-white/90 border border-white/50">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#0F172A]">Admin Portal</h1>
                        <p className="text-[#64748B] mt-2">Authorized personnel only</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="admin-email">Admin Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                                <Input
                                    id="admin-email"
                                    type="email"
                                    placeholder="admin@netraai.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                    className="pl-11 focus:ring-2 focus:ring-[#8B5CF6]/30 transition-shadow"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="admin-password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                                <Input
                                    id="admin-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                    className="pl-11 focus:ring-2 focus:ring-[#8B5CF6]/30 transition-shadow"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white py-6 text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Login as Administrator"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#64748B]">
                            Not an admin?{" "}
                            <a href="/login" className="text-[#8B5CF6] font-semibold hover:underline cursor-pointer">
                                Go back
                            </a>
                        </p>
                    </div>

                    <div className="mt-4 p-3 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10">
                        <p className="text-xs text-center text-[#64748B]">
                            🔒 This portal is restricted to authorized administrators only.
                            Unauthorized access attempts are logged.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
