import React from "react";
import {
    Eye, Phone, Mail, Calendar, User, FileText, Activity,
    History, Pill, CheckCircle2, Send, X
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

interface PrescriptionSummaryProps {
    patient: {
        id: string;
        name: string;
        age: number;
        sex: string;
        blood: string;
    };
    onApprove: () => void;
    onCancel: () => void;
}

export function PrescriptionSummary({ patient, onApprove, onCancel }: PrescriptionSummaryProps) {
    const { user } = useAuth();

    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-800">
            {/* Header / Top Bar */}
            <div className="bg-slate-900 text-white p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-teal-500 p-2 rounded-lg shadow-lg shadow-teal-500/20">
                        <Eye className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Netra AI Contextual Rx</h1>
                        <p className="text-teal-200 text-sm font-medium">Doctor Review Required</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white" onClick={onCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/20" onClick={onApprove}>
                        <Send className="w-4 h-4 mr-2" />
                        Approve & Send to Patient
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row max-h-[70vh] overflow-y-auto">
                {/* Left Sidebar: Doctor & Patient Info */}
                <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-100">
                    {/* Doctor Profile */}
                    <div className="mb-8">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Consulting Doctor</h2>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-teal-100 bg-teal-500 flex items-center justify-center text-white font-bold text-xl">
                                {user?.name?.charAt(0) || 'D'}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 leading-tight">{user?.name || "Dr. Sarah"}</h3>
                                <p className="text-teal-600 text-sm font-medium">Auto-generated via AI Context</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm text-slate-600">
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100"><Mail className="w-4 h-4 text-teal-500" /></div>
                                <span className="font-medium truncate">{user?.email || "doctor@netra.ai"}</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100"><Calendar className="w-4 h-4 text-teal-500" /></div>
                                <span className="font-medium">{currentDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 w-full mb-8"></div>

                    {/* Patient Details */}
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Patient Information</h2>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="bg-teal-50 p-2 rounded-full"><User className="w-5 h-5 text-teal-600" /></div>
                                <div>
                                    <p className="font-bold text-slate-900">{patient.name}</p>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">ID: #NET-{patient.id}</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between text-xs text-slate-500 font-medium">
                                <span>Age: {patient.age}</span>
                                <span>Sex: {patient.sex}</span>
                                <span>Blood: O+</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content: Medical Summary */}
                <div className="w-full md:w-2/3 p-6 bg-white">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="p-2 bg-teal-50 rounded-lg"><FileText className="w-6 h-6 text-teal-600" /></div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">AI Proposed Treatment Plan</h2>
                            <p className="text-sm text-slate-500">Please review before sending to patient</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Symptoms */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-4 h-4 text-rose-500" />
                                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">AI Extracted Symptoms</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {["Severe conjunctiva pallor detected", "Reported fatigue", "Low energy levels"].map((symptom) => (
                                    <span key={symptom} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs rounded-full font-medium">
                                        {symptom}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Diagnosis */}
                        <section className="bg-slate-50 rounded-xl border-l-4 border-teal-500 p-4 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Primary Diagnosis Model Output</h3>
                            <p className="text-lg font-bold text-slate-900">Moderate Iron-Deficiency Anemia (94% Confirm)</p>
                        </section>

                        {/* Medications */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <Pill className="w-4 h-4 text-emerald-600" />
                                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Proposed Prescriptions</h3>
                            </div>
                            <div className="space-y-3">
                                {/* Med 1 */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="flex gap-3 items-start">
                                        <div className="bg-emerald-50 px-2 py-1 rounded text-emerald-600"><span className="font-black text-[10px]">Rx</span></div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Ferrous Sulfate (Iron Supplement)</h4>
                                            <p className="text-xs text-slate-500 font-medium">325 mg • Oral Tablet</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0 text-right">
                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wide">
                                            <CheckCircle2 className="w-3 h-3" /> Once Daily
                                        </div>
                                    </div>
                                </div>

                                {/* Med 2 */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <div className="flex gap-3 items-start">
                                        <div className="bg-emerald-50 px-2 py-1 rounded text-emerald-600"><span className="font-black text-[10px]">Rx</span></div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Vitamin C</h4>
                                            <p className="text-xs text-slate-500 font-medium">500 mg • Enhances absorption</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0 text-right">
                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wide">
                                            <CheckCircle2 className="w-3 h-3" /> With Iron
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
