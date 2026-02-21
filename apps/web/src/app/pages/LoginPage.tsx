import { useNavigate } from "react-router";
import { Eye, Stethoscope, ArrowRight, Shield } from "lucide-react";
import { Card } from "../components/ui/card";

export default function LoginPage() {
  const navigate = useNavigate();

  const roles = [
    {
      id: "patient",
      title: "I'm a Patient",
      description: "Get AI screening, find doctors, and manage health records",
      icon: Eye,
      color: "#0D9488",
      colorDark: "#0F766E",
      loginPath: "/login/patient",
      signupPath: "/signup/patient",
      loginLabel: "Patient Login",
    },
    {
      id: "doctor",
      title: "I'm a Doctor",
      description: "Manage availability, consult patients, and access AI scribes",
      icon: Stethoscope,
      color: "#0EA5E9",
      colorDark: "#0284C7",
      loginPath: "/login/doctor",
      signupPath: "/signup/doctor",
      loginLabel: "Doctor Login",
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Manage platform, approve doctors, and view analytics",
      icon: Shield,
      color: "#8B5CF6",
      colorDark: "#6D28D9",
      loginPath: "/login/admin",
      signupPath: null,
      loginLabel: "Admin Portal",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0FDFA] via-white to-[#F0F9FF] flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-16 left-16 w-80 h-80 bg-[#0D9488]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-16 right-16 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-3xl w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#0D9488] to-[#0F766E] rounded-2xl flex items-center justify-center shadow-lg">
            <Eye className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-[#0F172A]">Netra AI</span>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-[#0F172A] mb-3">
          Welcome
        </h1>
        <p className="text-lg text-[#64748B] mb-12">
          Choose your role to continue
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="p-6 cursor-pointer group border-2 border-transparent hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-white/80 relative overflow-hidden h-full hover:-translate-y-2"
              style={{ ['--hover-border' as string]: `${role.color}30` }}
              onClick={() => navigate(role.loginPath)}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"
                style={{ background: `linear-gradient(135deg, ${role.color}08, ${role.colorDark}05)` }}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-shadow group-hover:scale-105 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${role.color}, ${role.colorDark})` }}
                >
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-2">{role.title}</h2>
                <p className="text-sm text-[#64748B] mb-6 flex-grow">
                  {role.description}
                </p>
                <div
                  className="flex items-center justify-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all"
                  style={{ color: role.color }}
                >
                  <span>{role.loginLabel}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-sm text-[#64748B] mt-8">
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
            Apply as Doctor
          </span>
        </p>
      </div>
    </div>
  );
}
