import { motion } from "motion/react";
import { MapPin, Phone, Clock, Navigation, Star, List, Grid } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState } from "react";

const hospitals = [
    { id: 1, name: "Apollo Hospitals", address: "Jubilee Hills, Hyderabad", distance: "2.3 km", rating: 4.6, phone: "+91 40-2360-7777", hours: "24/7", specialties: ["Hematology", "General Medicine"], type: "Multi-specialty" },
    { id: 2, name: "KIMS Hospital", address: "Secunderabad, Hyderabad", distance: "3.8 km", rating: 4.5, phone: "+91 40-4488-5000", hours: "24/7", specialties: ["Internal Medicine", "Pathology"], type: "Multi-specialty" },
    { id: 3, name: "Care Hospitals", address: "Banjara Hills, Hyderabad", distance: "4.1 km", rating: 4.4, phone: "+91 40-3041-8888", hours: "24/7", specialties: ["Hematology", "Oncology"], type: "Super-specialty" },
    { id: 4, name: "Yashoda Hospitals", address: "Somajiguda, Hyderabad", distance: "5.2 km", rating: 4.3, phone: "+91 40-4567-8901", hours: "24/7", specialties: ["General Medicine"], type: "Multi-specialty" },
    { id: 5, name: "Citizens Hospital", address: "Nallagandla, Hyderabad", distance: "6.5 km", rating: 4.2, phone: "+91 40-6789-0123", hours: "8 AM - 10 PM", specialties: ["Internal Medicine"], type: "Hospital" },
    { id: 6, name: "Dr. Reddy Labs Diagnostics", address: "Gachibowli, Hyderabad", distance: "7.1 km", rating: 4.4, phone: "+91 40-2345-6789", hours: "7 AM - 9 PM", specialties: ["Pathology", "Diagnostics"], type: "Diagnostic Center" },
];

export default function NearbyHospitalsPage() {
    const [view, setView] = useState<"list" | "grid">("list");

    return (
        <div className="min-h-screen pt-20 pb-12 px-6 bg-gradient-to-br from-[#F0FDFA] via-white to-[#F8FAFC]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Nearby Hospitals & Clinics</h1>
                    <p className="text-[#64748B]">Find hospitals and diagnostic centers near you for physical consultation</p>
                </motion.div>

                {/* Map placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <Card className="h-64 bg-gradient-to-br from-[#0D9488]/5 to-[#0EA5E9]/5 border border-gray-100 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-[20%] left-[30%] w-3 h-3 rounded-full bg-[#F43F5E]" />
                            <div className="absolute top-[40%] left-[50%] w-3 h-3 rounded-full bg-[#F43F5E]" />
                            <div className="absolute top-[35%] left-[65%] w-3 h-3 rounded-full bg-[#F43F5E]" />
                            <div className="absolute top-[60%] left-[40%] w-3 h-3 rounded-full bg-[#F43F5E]" />
                            <div className="absolute top-[50%] left-[70%] w-3 h-3 rounded-full bg-[#F43F5E]" />
                            <div className="absolute top-[70%] left-[55%] w-3 h-3 rounded-full bg-[#F43F5E]" />
                            {/* Animated user location */}
                            <motion.div
                                className="absolute top-[45%] left-[45%] w-4 h-4 rounded-full bg-[#0EA5E9]"
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <div className="text-center relative z-10">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <MapPin className="w-12 h-12 text-[#0D9488] mx-auto mb-3" />
                            </motion.div>
                            <p className="text-[#0F172A] font-semibold">Map View</p>
                            <p className="text-sm text-[#64748B]">Showing hospitals within 10 km of your location</p>
                            <Button className="mt-3 bg-[#0D9488] hover:bg-[#0F766E] text-white" size="sm">
                                <Navigation className="w-4 h-4 mr-2" /> Enable Location
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* View Toggle */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-[#64748B]">{hospitals.length} results found</p>
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                        <button onClick={() => setView("list")} className={`p-2 rounded-md transition-all ${view === "list" ? "bg-white shadow-sm" : ""}`}>
                            <List className="w-4 h-4" />
                        </button>
                        <button onClick={() => setView("grid")} className={`p-2 rounded-md transition-all ${view === "grid" ? "bg-white shadow-sm" : ""}`}>
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Hospital Cards */}
                <div className={view === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                    {hospitals.map((h, i) => (
                        <motion.div key={h.id}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                            <Card className={`p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${view === "list" ? "flex items-center gap-6" : ""}`}>
                                <div className={`${view === "list" ? "flex-1" : ""}`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-[#0F172A] text-lg">{h.name}</h3>
                                            <p className="text-sm text-[#64748B] flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3 h-3" /> {h.address}
                                            </p>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full bg-[#0D9488]/10 text-[#0D9488] font-medium whitespace-nowrap">{h.distance}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {h.specialties.map((s) => (
                                            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-[#64748B]">{s}</span>
                                        ))}
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9]">{h.type}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[#64748B]">
                                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#F59E0B]" /> {h.rating}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {h.hours}</span>
                                    </div>
                                </div>
                                <div className={`${view === "list" ? "flex gap-2" : "flex gap-2 mt-4"}`}>
                                    <Button size="sm" variant="outline" className="border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/5">
                                        <Phone className="w-3 h-3 mr-1" /> Call
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-[#0D9488] hover:bg-[#0F766E] text-white"
                                        onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(h.name + " " + h.address)}`, '_blank')}
                                    >
                                        <Navigation className="w-3 h-3 mr-1" /> Directions
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
