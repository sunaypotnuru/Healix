import { useNavigate } from "react-router";
import { HeroStoryAnimation } from "../components/HeroStoryAnimation";
import { HowItWorks } from "../components/HowItWorks";
import { AboutSection } from "../components/AboutSection";
import { ContactSection } from "../components/ContactSection";
import { Eye, Video, Globe, Stethoscope, Calendar, Shield, MapPin, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useAuthStore } from "../../lib/store";
import "../components/hero-animations.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const features = [
    { icon: Eye, title: "AI Anemia Detection", description: "Advanced conjunctiva analysis using AI to detect pallor — a key indicator of anemia", color: "#0D9488" },
    { icon: Stethoscope, title: "Find Expert Doctors", description: "Connect with certified hematologists and specialists for professional care", color: "#0EA5E9" },
    { icon: Calendar, title: "Easy Booking", description: "Book consultations with preset time slots that fit your schedule", color: "#F43F5E" },
    { icon: Video, title: "Smart Video Consultations", description: "AI-assisted video calls with automated note-taking and summaries", color: "#8B5CF6" },
    { icon: Globe, title: "Real-time Translation", description: "Break language barriers — speak your language, doctor hears theirs", color: "#F59E0B" },
    { icon: MapPin, title: "Nearby Hospitals", description: "Find physical consultation centers and diagnostic labs near you", color: "#22C55E" },
    { icon: FileText, title: "Medical Records", description: "Unified health history — past scans, prescriptions, and consultation summaries", color: "#EC4899" },
    { icon: Shield, title: "Secure & Private", description: "End-to-end encrypted platform with full data privacy compliance", color: "#6366F1" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroStoryAnimation />

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#0D9488] uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-bold text-[#0F172A] mt-2 mb-4">
              End-to-End Healthcare Platform
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              From AI-powered screening to multilingual video consultations — everything you need in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="feature-card p-6 h-full border border-gray-100 group relative overflow-hidden cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"
                  style={{ background: `linear-gradient(135deg, ${feature.color}08, ${feature.color}03)` }}
                />
                <div className="relative z-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${feature.color}12` }}
                  >
                    <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              onClick={() => navigate(user ? "/patient/dashboard" : "/login")}
              className="bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white px-12 py-6 text-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
            >
              <span className="relative z-10">{user ? "Go to Dashboard" : "Get Started Free"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* About */}
      <AboutSection />

      {/* Contact */}
      <ContactSection />
    </div>
  );
}
