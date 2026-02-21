import { useState } from "react";
// @ts-ignore
import { Link, useNavigate } from "react-router";
// @ts-ignore
import { motion, AnimatePresence } from "motion/react";
import { Stethoscope, Mail, Lock, User, Phone, Globe, Clock, DollarSign, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useAuthStore } from "../../lib/store";
import { toast } from "sonner";

const steps = [
    { title: "Personal Info", icon: User },
    { title: "Professional", icon: Stethoscope },
    { title: "Practice Details", icon: Clock },
];

export default function DoctorSignUpPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        full_name: "",
        phone: "",
        role: "doctor",
        specialty: "",
        experience_years: "",
        languages: [] as string[],
        consultation_fee: "",
        bio: "",
        available_days: [] as string[],
    });
    const { signUp, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { email, password, ...userData } = formData;
        const result = await signUp(email, password, userData);
        if (result.success) {
            setSubmitted(true);
            toast.success("Application submitted successfully!");
        } else {
            toast.error(result.error?.message || "Failed to submit application");
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    return (
        <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0F9FF] via-white to-[#E0F2FE] flex items-center justify-center relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 right-20 w-72 h-72 bg-[#0EA5E9]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#0D9488]/5 rounded-full blur-3xl" />

            {/* Success State */}
            {submitted ? (
                <div className="w-full max-w-lg relative z-10">
                    <Card className="p-8 shadow-2xl backdrop-blur-sm bg-white/90 border border-white/50 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Check className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#0F172A] mb-3">Application Submitted!</h2>
                        <p className="text-lg text-[#64748B] mb-6 leading-relaxed">
                            Thank you for applying to join the Netra AI medical network.
                        </p>
                        <div className="p-4 bg-[#F59E0B]/10 rounded-xl border border-[#F59E0B]/20 mb-6">
                            <p className="text-sm text-[#92400E] font-medium">
                                ⏳ Your application is <strong>pending admin review</strong>. You will be able to access the
                                platform once an administrator approves your registration.
                            </p>
                        </div>
                        <p className="text-sm text-[#64748B] mb-8">
                            This process usually takes 24-48 hours. You will receive an email notification
                            once your application is approved.
                        </p>
                        <Button
                            onClick={() => navigate("/")}
                            className="bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white px-8 py-5 text-lg"
                        >
                            Return to Home
                        </Button>
                    </Card>
                </div>
            ) : (

                <div
                    className="w-full max-w-lg relative z-10"
                >
                    <Card className="p-8 shadow-2xl backdrop-blur-sm bg-white/80 border border-white/50">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                <Stethoscope className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-[#0F172A]">Apply to Join</h1>
                            <p className="text-[#64748B] mt-1">Apply to the Netra AI medical network</p>
                        </div>

                        {/* Step indicator */}
                        <div className="flex items-center justify-center gap-2 mb-8">
                            {steps.map((step, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${index < currentStep ? "bg-[#0EA5E9] text-white" :
                                        index === currentStep ? "bg-[#0EA5E9]/20 text-[#0EA5E9] border-2 border-[#0EA5E9]" :
                                            "bg-gray-100 text-gray-400"
                                        }`}>
                                        {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-12 h-0.5 transition-colors ${index < currentStep ? "bg-[#0EA5E9]" : "bg-gray-200"
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit}>
                            {currentStep === 0 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                                            <Input placeholder="Dr. John Smith" value={formData.full_name} onChange={(e) => updateField("full_name", e.target.value)} className="pl-11" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                                            <Input type="email" placeholder="doctor@hospital.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className="pl-11" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                                            <Input type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className="pl-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                                            <Input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => updateField("password", e.target.value)} className="pl-11" required minLength={6} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Specialty</Label>
                                        <Select value={formData.specialty} onValueChange={(v) => updateField("specialty", v)}>
                                            <SelectTrigger><SelectValue placeholder="Select specialty" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hematology">Hematology</SelectItem>
                                                <SelectItem value="general_medicine">General Medicine</SelectItem>
                                                <SelectItem value="internal_medicine">Internal Medicine</SelectItem>
                                                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                                <SelectItem value="ophthalmology">Ophthalmology</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Years of Experience</Label>
                                        <Input type="number" placeholder="e.g. 10" value={formData.experience_years} onChange={(e) => updateField("experience_years", e.target.value)} min={0} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Languages Spoken</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                                            <Input placeholder="English, Hindi, Telugu..." value={formData.languages.join(", ")} onChange={(e) => updateField("languages", e.target.value.split(",").map(l => l.trim()))} className="pl-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bio</Label>
                                        <textarea placeholder="Tell patients about your expertise..." value={formData.bio} onChange={(e) => updateField("bio", e.target.value)} rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all resize-none bg-[#F8FAFC]" />
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Consultation Fee (₹)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                                            <Input type="number" placeholder="500" value={formData.consultation_fee} onChange={(e) => updateField("consultation_fee", e.target.value)} className="pl-11" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Available Days</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                                <button key={day} type="button"
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${formData.available_days.includes(day) ? "bg-[#0EA5E9] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                    onClick={() => {
                                                        const days = formData.available_days.includes(day)
                                                            ? formData.available_days.filter(d => d !== day)
                                                            : [...formData.available_days, day];
                                                        updateField("available_days", days);
                                                    }}
                                                >{day}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-[#0EA5E9]/5 rounded-xl border border-[#0EA5E9]/20 mt-4">
                                        <p className="text-sm text-[#0F172A]/70">
                                            You can manage detailed time slots after registration from your dashboard.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between mt-8 gap-4">
                                {currentStep > 0 ? (
                                    <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Back
                                    </Button>
                                ) : <div className="flex-1" />}
                                {currentStep < steps.length - 1 ? (
                                    <Button type="button" onClick={nextStep} className="flex-1 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white">
                                        Next <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                ) : (
                                    <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white">
                                        {loading ? "Submitting..." : "Submit Application"}
                                    </Button>
                                )}
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-[#64748B]">
                                Already registered?{" "}
                                <Link to="/login/doctor" className="text-[#0EA5E9] font-semibold hover:underline">Sign in</Link>
                            </p>
                        </div>
                    </Card>
                </div>

            )}
        </div>
    );
}
