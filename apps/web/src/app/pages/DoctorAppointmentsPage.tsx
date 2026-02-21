import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Calendar, Video, User, FileText, Clock, ChevronDown, Check, X, AlertCircle } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { PrescriptionSummary } from "../components/PrescriptionSummary";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorAPI } from "../../lib/api";
import { Skeleton } from "@mui/material";
import { format, isToday, isFuture } from "date-fns";

export default function DoctorAppointmentsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "today" | "upcoming">("all");
    const [selectedPatientForRx, setSelectedPatientForRx] = useState<any | null>(null);

    const { data: appointments, isLoading, error } = useQuery({
        queryKey: ['doctorAppointments'],
        queryFn: () => doctorAPI.getAppointments().then(res => res.data)
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) =>
            doctorAPI.updateAppointmentStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctorAppointments'] });
            toast.success("Appointment status updated");
        },
        onError: () => {
            toast.error("Failed to update status");
        }
    });

    const handleApproveRx = () => {
        setSelectedPatientForRx(null);
        toast.success("Prescription signed and sent to patient.");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0F9FF] via-white to-[#F8FAFC]">
                <div className="max-w-4xl mx-auto space-y-4">
                    <Skeleton width={300} height={60} />
                    <Skeleton width={200} height={30} className="mb-8" />
                    {[1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={100} className="rounded-2xl" />)}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-20 px-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Failed to load appointments</h2>
                <p className="text-[#64748B] mb-6">{(error as Error).message}</p>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['doctorAppointments'] })}>Retry</Button>
            </div>
        );
    }

    const filtered = (appointments || []).filter((a: any) => {
        const d = new Date(a.date_time);
        if (filter === "today") return isToday(d);
        if (filter === "upcoming") return isFuture(d) && !isToday(d);
        return true;
    });

    return (
        <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0F9FF] via-white to-[#F8FAFC]">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Patient Schedule</h1>
                    <p className="text-[#64748B]">Manage your consultations and patient records</p>
                </motion.div>

                <div className="flex gap-2 mb-6">
                    {(["all", "today", "upcoming"] as const).map((f) => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === f ? "bg-[#0EA5E9] text-white shadow-md" : "bg-white text-[#64748B] hover:bg-gray-50 border border-gray-100"
                                }`}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filtered.map((apt: any, i: number) => {
                        const patient = apt.profiles_patient || {};
                        const dateObj = new Date(apt.date_time);
                        const isExpanded = expandedId === apt.id;

                        return (
                            <motion.div key={apt.id}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                                <Card className={`border border-gray-100 overflow-hidden transition-all ${isExpanded ? 'shadow-lg ring-1 ring-[#0EA5E9]/20' : 'hover:shadow-md'}`}>
                                    <div className="p-5 flex items-center gap-4 cursor-pointer"
                                        onClick={() => setExpandedId(isExpanded ? null : apt.id)}>
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold bg-[#0EA5E9]/10 text-[#0EA5E9]`}>
                                            {patient.avatar_url ? (
                                                <img src={patient.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                (patient.name || "P").charAt(0)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-[#0F172A] truncate">{patient.name || "Unknown Patient"}</h3>
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${apt.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#64748B] font-medium">{apt.notes || "General Consultation"}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-[#0F172A]">{format(dateObj, "MMM d")} — {format(dateObj, "h:mm a")}</p>
                                            <div className="flex items-center gap-1 text-[10px] font-black text-[#0EA5E9] justify-end uppercase tracking-widest">
                                                <Video className="w-3 h-3" /> {apt.type || 'Video'}
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-gray-50 p-6 bg-gray-50/30"
                                            >
                                                <div className="grid sm:grid-cols-2 gap-8">
                                                    <div>
                                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <User className="w-4 h-4" /> Personal Details
                                                        </h4>
                                                        <div className="space-y-3">
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-[#64748B] font-medium">Age / Gender</span>
                                                                <span className="text-[#0F172A] font-bold">{patient.age || 'N/A'} / {patient.gender || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-[#64748B] font-medium">Blood Type</span>
                                                                <span className="text-rose-600 font-bold">{patient.blood_type || 'Unknown'}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center text-sm">
                                                                <span className="text-[#64748B] font-medium">Reason for Visit</span>
                                                                <span className="text-[#0F172A] font-bold">{apt.notes || 'Routine Checkup'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                            <FileText className="w-4 h-4" /> Clinical History
                                                        </h4>
                                                        <div className="space-y-4">
                                                            <div className="p-3 bg-white border border-gray-100 rounded-xl">
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Medications</p>
                                                                <p className="text-sm text-[#0F172A] font-medium">None currently listed in profile.</p>
                                                            </div>
                                                            <div className="p-3 bg-white border border-gray-100 rounded-xl">
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Allergies</p>
                                                                <p className="text-sm text-[#0F172A] font-medium">No recorded allergies.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                                                    <Button
                                                        className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold h-11 px-6 rounded-xl shadow-lg"
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/doctor/consultation/${apt.id}`); }}
                                                    >
                                                        <Video className="w-4 h-4 mr-2" /> Join Room
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/5 font-bold h-11 px-6 rounded-xl"
                                                        onClick={(e) => { e.stopPropagation(); setSelectedPatientForRx(apt); }}
                                                    >
                                                        <FileText className="w-4 h-4 mr-2" /> Review Scans
                                                    </Button>

                                                    {apt.status === 'scheduled' && (
                                                        <Button
                                                            variant="outline"
                                                            className="border-green-500 text-green-600 hover:bg-green-50 font-bold h-11 px-6 rounded-xl ml-auto"
                                                            onClick={(e) => { e.stopPropagation(); statusMutation.mutate({ id: apt.id, status: 'confirmed' }); }}
                                                            loading={statusMutation.isPending}
                                                        >
                                                            <Check className="w-4 h-4 mr-2" /> Confirm
                                                        </Button>
                                                    )}

                                                    {apt.status !== 'cancelled' && (
                                                        <Button
                                                            variant="outline"
                                                            className="border-rose-500 text-rose-500 hover:bg-rose-50 font-bold h-11 px-6 rounded-xl"
                                                            onClick={(e) => { e.stopPropagation(); statusMutation.mutate({ id: apt.id, status: 'cancelled' }); }}
                                                            loading={statusMutation.isPending}
                                                        >
                                                            <X className="w-4 h-4 mr-2" /> Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-400">Empty Schedule</h3>
                            <p className="text-sm text-gray-300">No appointments found for the selected filter.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Prescription Modal */}
            <AnimatePresence>
                {selectedPatientForRx && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedPatientForRx(null)}
                        />
                        <motion.div
                            className="relative w-full max-w-4xl z-10"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        >
                            <PrescriptionSummary
                                patient={{
                                    id: selectedPatientForRx.profiles_patient?.id,
                                    name: selectedPatientForRx.profiles_patient?.name,
                                    age: selectedPatientForRx.profiles_patient?.age,
                                    sex: selectedPatientForRx.profiles_patient?.gender,
                                    blood: selectedPatientForRx.profiles_patient?.blood_type || 'O+'
                                }}
                                onApprove={handleApproveRx}
                                onCancel={() => setSelectedPatientForRx(null)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
