import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/card';
import { Search, Calendar, Video, Clock, Filter, Eye, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockAppointments = [
    { id: "APT-1042", patient: "Rahul Verma", doctor: "Dr. Arun Mehta", date: "Feb 20, 2026", time: "10:00 AM", status: "Completed", type: "Video Call", amt: "₹500" },
    { id: "APT-1043", patient: "Neha Sharma", doctor: "Dr. Priya Singh", date: "Feb 21, 2026", time: "02:30 PM", status: "Scheduled", type: "Video Call", amt: "₹450" },
    { id: "APT-1044", patient: "Amit Patel", doctor: "Dr. K. Sharma", date: "Feb 22, 2026", time: "11:00 AM", status: "Scheduled", type: "In-Person", amt: "₹800" },
    { id: "APT-1045", patient: "Sunita Devi", doctor: "Dr. R. Kumar", date: "Feb 18, 2026", time: "04:00 PM", status: "Cancelled", type: "Video Call", amt: "Returned" },
];

export default function AdminAppointmentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filtered = mockAppointments.filter(a =>
        (a.patient.toLowerCase().includes(searchTerm.toLowerCase()) || a.doctor.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'All' ? true : a.status === statusFilter)
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A] mb-1">Platform Appointments</h1>
                <p className="text-[#64748B]">Monitor all scheduled, completed, and cancelled consultations</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search APT ID, Patient, or Doctor..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                    <Filter className="w-5 h-5 text-gray-400 shrink-0 mr-1" />
                    {['All', 'Scheduled', 'Completed', 'Cancelled'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${statusFilter === s
                                ? "bg-[#0F172A] text-white shadow-md"
                                : "bg-white border border-gray-200 text-[#64748B] hover:bg-gray-50"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <Card className="border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500">
                                <th className="p-4">Appt ID & Type</th>
                                <th className="p-4">Patient</th>
                                <th className="p-4">Doctor</th>
                                <th className="p-4">Date & Time</th>
                                <th className="p-4">Status & Fee</th>
                                <th className="p-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((apt) => (
                                <tr key={apt.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="p-4">
                                        <p className="font-bold text-[#0F172A] font-mono text-sm">{apt.id}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            {apt.type === "Video Call" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                            {apt.type}
                                        </p>
                                    </td>
                                    <td className="p-4 font-medium text-[#0F172A] text-sm">{apt.patient}</td>
                                    <td className="p-4 text-sm text-gray-600">{apt.doctor}</td>
                                    <td className="p-4">
                                        <p className="text-sm font-medium text-[#0F172A]">{apt.date}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {apt.time}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${apt.status === "Scheduled" ? "bg-[#0EA5E9]/10 text-[#0EA5E9]" :
                                                apt.status === "Completed" ? "bg-[#22C55E]/10 text-[#22C55E]" :
                                                    "bg-[#F43F5E]/10 text-[#F43F5E]"
                                                }`}>
                                                {apt.status}
                                            </span>
                                            <span className="text-xs font-semibold text-[#64748B]">{apt.amt}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button size="sm" variant="ghost" className="text-[#8B5CF6] hover:bg-[#8B5CF6]/10">
                                            <Eye className="w-4 h-4 mr-1.5" /> View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No appointments found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
}
