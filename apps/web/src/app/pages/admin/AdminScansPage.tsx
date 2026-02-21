import { useState } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/card';
import { Search, Filter, Scan, Eye, MapPin, Activity, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { adminAPI } from '../../../lib/api';
import { Skeleton } from "@mui/material";

export default function AdminScansPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [riskFilter, setRiskFilter] = useState('All');

    const { data: scans, isLoading, error } = useQuery({
        queryKey: ['adminScans'],
        queryFn: () => adminAPI.getScans().then(res => res.data)
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton width={300} height={40} />
                <Card className="p-8"><Skeleton variant="rounded" height={300} /></Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center bg-red-50 rounded-2xl">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <h3 className="font-bold text-red-900">Failed to load scans</h3>
                <p>{(error as Error).message}</p>
            </div>
        );
    }

    const filtered = (scans || []).filter((s: any) => {
        const matchesSearch = (s.profiles_patient?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.id || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = riskFilter === 'All' ? true : (s.prediction || '').includes(riskFilter);
        return matchesSearch && matchesRisk;
    });

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A] mb-1">Global AI Scans</h1>
                <p className="text-[#64748B]">Platform-wide conjunctiva analysis scan history</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search Scan ID or Patient Name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#8B5CF6] transition-colors bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                    <Filter className="w-5 h-5 text-gray-400 shrink-0 mr-1" />
                    {['All', 'High', 'Moderate', 'Low', 'Normal'].map(f => (
                        <button
                            key={f}
                            onClick={() => setRiskFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${riskFilter === f
                                ? "bg-[#0F172A] text-white shadow-md"
                                : "bg-white border border-gray-200 text-[#64748B] hover:bg-gray-50"
                                }`}
                        >
                            {f === 'All' ? 'All Results' : f}
                        </button>
                    ))}
                </div>
            </div>

            <Card className="border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500">
                                <th className="p-4">Scan ID</th>
                                <th className="p-4">Patient</th>
                                <th className="p-4">Scan Date</th>
                                <th className="p-4">AI Prediction</th>
                                <th className="p-4 text-right">Raw Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((scan: any) => (
                                <tr key={scan.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center shrink-0">
                                                <Scan className="w-5 h-5 text-[#8B5CF6]" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#0F172A] font-mono text-sm">{scan.id.slice(0, 8)}...</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Activity className="w-3 h-3" /> Netra AI V2</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-[#0F172A] text-sm">{scan.profiles_patient?.name || 'Anonymous'}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> India</p>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-[#0F172A]">
                                        {new Date(scan.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${(scan.prediction || '').includes("Low") || (scan.prediction || '').includes("Normal") ? "bg-[#22C55E]/10 text-[#22C55E]" :
                                                    (scan.prediction || '').includes("Moderate") ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                                                        "bg-[#F43F5E]/10 text-[#F43F5E]"
                                                }`}>
                                                {scan.prediction || 'Unknown'}
                                            </span>
                                            <span className="text-xs font-semibold text-[#64748B]">Confidence: {Math.round((scan.confidence || 0) * 100)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <a href={scan.image_url} target="_blank" rel="noreferrer">
                                            <Button size="sm" variant="ghost" className="text-[#8B5CF6] hover:bg-[#8B5CF6]/10">
                                                <Eye className="w-4 h-4 mr-1.5" /> View Image
                                            </Button>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No scans found matching filters.
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

