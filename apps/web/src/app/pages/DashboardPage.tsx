import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Eye, MapPin, Calendar, FileText, Scan, Video, Clock,
  ChevronRight, Activity, Heart, ArrowRight, ChevronDown, Users, AlertCircle
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@mui/material";
import { patientAPI } from "../../lib/api";

const quickActions = [
  { label: "Scan Eyes", desc: "AI-powered anemia detection", icon: Eye, path: "/patient/scan", color: "#0D9488", bg: "#F0FDFA" },
  { label: "Find a Doctor", desc: "Book online consultation", icon: Video, path: "/patient/doctors", color: "#0EA5E9", bg: "#F0F9FF" },
  { label: "Nearby Hospitals", desc: "Physical consultation", icon: MapPin, path: "/patient/hospitals", color: "#F59E0B", bg: "#FFFBEB" },
  { label: "Medical History", desc: "View past records", icon: FileText, path: "/patient/history", color: "#22C55E", bg: "#F0FDF4" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showFamilyDropdown, setShowFamilyDropdown] = useState(false);

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['patientDashboard'],
    queryFn: () => patientAPI.getDashboard().then(res => res.data)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0FDFA] via-white to-[#F8FAFC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Skeleton width={300} height={50} className="rounded-xl" />
              <Skeleton width={200} height={30} className="mt-2" />
            </div>
            <Skeleton variant="rounded" width={220} height={48} className="rounded-xl" />
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <Skeleton variant="rounded" height={280} className="lg:col-span-2 rounded-3xl" />
            <Skeleton variant="rounded" height={280} className="rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rounded" height={160} className="rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-6 flex flex-col items-center justify-center text-center bg-gray-50">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Unable to load dashboard</h2>
        <p className="text-[#64748B] max-w-md mb-6">{(error as Error).message}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['patientDashboard'] })} className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-8">
          Try Again
        </Button>
      </div>
    );
  }

  const profile = dashboardData?.profile || {};
  const upcomingAppointments = dashboardData?.upcoming_appointments || [];
  const recentScans = dashboardData?.recent_scans || [];

  const healthScoreVal = profile.health_score || 72;
  const healthScoreData = [
    { name: 'Healthy', value: healthScoreVal, color: '#22C55E' },
    { name: 'Risk', value: 100 - healthScoreVal, color: '#F1F5F9' },
  ];

  const familyMembers = [
    { id: profile.id, name: profile.name || "Self", relation: "Self", avatar: (profile.name || "S").charAt(0) },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0FDFA] via-white to-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F172A]">Welcome, {profile.name?.split(' ')[0]}! 👋</h1>
            <p className="text-[#64748B] text-lg">Your health journey at a glance</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFamilyDropdown(!showFamilyDropdown)}
              className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm hover:border-[#0D9488] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 text-[#0D9488] font-bold flex items-center justify-center">
                {familyMembers[0].avatar}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#0F172A] leading-tight">{familyMembers[0].name}</p>
                <p className="text-xs text-gray-500 leading-tight">{familyMembers[0].relation}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
            </button>

            <AnimatePresence>
              {showFamilyDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 px-2"
                >
                  <div className="px-3 py-2 border-b border-gray-50 flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-500 uppercase">Profile Sync</span>
                  </div>
                  {familyMembers.map((member) => (
                    <button
                      key={member.id}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0D9488]/10 text-[#0D9488]"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#0D9488] text-white">
                        {member.avatar}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-bold leading-tight">{member.name}</p>
                        <p className="text-xs leading-tight text-[#0D9488]/70">{member.relation}</p>
                      </div>
                    </button>
                  ))}
                  <div className="px-2 mt-2 pt-2 border-t border-gray-50">
                    <Button variant="outline" className="w-full text-xs h-8 border-dashed border-gray-300 text-gray-600" onClick={() => navigate('/patient/profile')}>
                      Manage Profiles
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="bg-gradient-to-r from-[#0D9488] to-[#0F766E] rounded-3xl p-8 text-white relative overflow-hidden h-full shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10 flex flex-col justify-center h-full text-left">
                <h2 className="text-2xl font-bold mb-3">Time for your next screening</h2>
                <p className="text-white/80 mb-6 max-w-sm">
                  {recentScans.length > 0
                    ? `Your last AI scan was ${new Date(recentScans[0].created_at).toLocaleDateString()}. Regular monitoring helps track your hemoglobin trends.`
                    : "Welcome to Netra AI! Start your health journey with an AI-powered conjunctiva scan to check for anemia risk."}
                </p>
                <Button
                  onClick={() => navigate("/patient/scan")}
                  className="bg-white text-[#0D9488] hover:bg-white/90 font-bold w-max shadow-xl px-6 py-6"
                >
                  <Scan className="w-5 h-5 mr-2" /> Start Smart Scan
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 border border-gray-100 flex flex-col h-full bg-white relative overflow-hidden">
              <h3 className="font-bold text-[#0F172A] mb-1">Health Score</h3>
              <p className="text-sm text-[#64748B] mb-4">Overall Wellness Index</p>

              <div className="flex-1 relative min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthScoreData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius="75%"
                      outerRadius="100%"
                      dataKey="value"
                      stroke="none"
                    >
                      {healthScoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center w-full">
                  <div className="text-4xl font-black text-[#22C55E]">{healthScoreVal}<span className="text-lg text-gray-400">/100</span></div>
                  <p className={`text-sm font-semibold px-3 py-1 rounded-full w-max mx-auto mt-2 ${healthScoreVal >= 80 ? "bg-[#22C55E]/10 text-[#22C55E]" :
                      healthScoreVal >= 60 ? "bg-[#F59E0B]/10 text-[#F59E0B]" : "bg-[#F43F5E]/10 text-[#F43F5E]"
                    }`}>
                    {healthScoreVal >= 80 ? "Excellent" : healthScoreVal >= 60 ? "Good" : "At Risk"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card
                className="p-5 cursor-pointer border border-white/50 bg-white/70 backdrop-blur-md hover:shadow-lg transition-all duration-300 group"
                onClick={() => navigate(action.path)}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: action.bg }}>
                  <action.icon className="w-6 h-6" style={{ color: action.color }} />
                </div>
                <h3 className="font-semibold text-[#0F172A] mb-1">{action.label}</h3>
                <p className="text-sm text-[#64748B] line-clamp-1">{action.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: action.color }}>
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 border border-gray-100 bg-white h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#0F172A]">Recent AI Scans</h2>
                <Button variant="ghost" size="sm" className="text-[#0D9488]" onClick={() => navigate("/patient/history")}>View All</Button>
              </div>
              <div className="space-y-4">
                {recentScans.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No recent scans found.</p>
                  </div>
                ) : recentScans.map((scan: any, i: number) => {
                  const isAnemic = (scan.prediction || '').toLowerCase() === "anemic";
                  const isNormal = (scan.prediction || '').toLowerCase() === "normal";
                  return (
                    <div
                      key={scan.id || i}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate('/patient/history')}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAnemic ? "bg-[#F43F5E]/10" : (isNormal ? "bg-[#22C55E]/10" : "bg-orange-100")
                          }`}>
                          <Eye className={`w-5 h-5 ${isAnemic ? "text-[#F43F5E]" : (isNormal ? "text-[#22C55E]" : "text-orange-500")}`} />
                        </div>
                        <div>
                          <p className="font-bold text-[#0F172A]">{new Date(scan.created_at).toLocaleDateString()}</p>
                          <p className="text-xs text-[#64748B]">Confidence: {Math.round((scan.confidence || 0) * 100)}%</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${isAnemic ? "bg-[#F43F5E]/10 text-[#F43F5E]" : (isNormal ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-orange-100 text-orange-600")
                        }`}>{scan.prediction || "Completed"}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 border border-gray-100 bg-white h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#0F172A]">Upcoming Visits</h2>
                <Button variant="ghost" size="sm" className="text-[#0EA5E9]" onClick={() => navigate("/patient/appointments")}>View All</Button>
              </div>
              <div className="space-y-4 flex-1">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No upcoming appointments.</p>
                  </div>
                ) : upcomingAppointments.map((apt: any, i: number) => {
                  const doctorName = apt.profiles_doctor?.name || "Doctor";
                  const specialty = apt.profiles_doctor?.specialty || "Specialist";
                  const time = new Date(apt.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={apt.id || i}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] font-bold text-lg shrink-0 overflow-hidden">
                        {apt.profiles_doctor?.avatar_url ? (
                          <img src={apt.profiles_doctor.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          doctorName.includes("Dr. ") ? doctorName.split("Dr. ")[1].charAt(0) : doctorName.charAt(0)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#0F172A] truncate">Dr. {doctorName.replace("Dr. ", "")}</p>
                        <p className="text-xs text-[#64748B] truncate capitalize">{specialty.replace("_", " ")}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#0F172A]">{time}</p>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#0EA5E9] justify-end uppercase">
                          <Video className="w-3 h-3" /> {apt.consultation_type || 'Video'}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-auto pt-6">
                  <Button
                    onClick={() => navigate("/patient/doctors")}
                    className="w-full bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] hover:from-[#0F766E] hover:to-[#0284C7] text-white font-bold h-12 rounded-xl shadow-md"
                  >
                    Book New Consultation
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

