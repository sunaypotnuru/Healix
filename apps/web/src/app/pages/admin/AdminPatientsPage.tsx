import { useState } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Search, MapPin, Mail, Phone, Clock, FileText, Download, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../../lib/api';
import { Skeleton } from "@mui/material";

export default function AdminPatientsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: patients, isLoading, error } = useQuery({
        queryKey: ['adminPatients'],
        queryFn: () => adminAPI.getPatients().then(res => res.data)
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton width={300} height={40} />
                    <Skeleton width={400} height={24} />
                </div>
                <Card className="p-0 border border-gray-200">
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} height={60} variant="rounded" />)}
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center bg-red-50 rounded-2xl border border-red-100">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-red-900">Failed to load patients</h3>
                <p className="text-red-700">{(error as Error).message}</p>
            </div>
        );
    }

    const filteredPatients = (patients || []).filter((p: any) =>
        (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A] mb-1">Patient Directory</h1>
                <p className="text-[#64748B]">View and manage patient accounts and records</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by ID, name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="bg-white border-gray-200 gap-2 text-[#64748B]">
                    <Download className="w-4 h-4" /> Export CSV
                </Button>
            </div>

            <Card className="border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500">
                                <th className="p-4">Patient Info</th>
                                <th className="p-4">Contact Details</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Blood/Gender</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPatients.map((patient: any) => (
                                <tr key={patient.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center font-bold text-[#0D9488]">
                                                {patient.name?.charAt(0) || patient.email?.charAt(0) || 'P'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#0F172A]">{patient.name || 'Anonymous Patient'}</p>
                                                <p className="text-xs text-gray-500 font-mono mt-0.5">{patient.id.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-[#0F172A] flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {patient.email}</p>
                                            <p className="text-sm text-[#0F172A] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {patient.phone || 'No phone'}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-sm text-[#0F172A] flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> {patient.city || 'Unknown'}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{patient.blood_type || 'N/A'}</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full">{patient.gender || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button size="sm" variant="outline" className="text-[#8B5CF6] hover:bg-[#8B5CF6]/5 border-[#8B5CF6]/20 shadow-sm">
                                            <FileText className="w-4 h-4 mr-1.5" /> View Profile
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredPatients.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No patients found matching your search.
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

