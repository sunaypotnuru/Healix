import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Search, Star, MapPin, Languages, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { doctorAPI } from "../../lib/api";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: doctors = [], isLoading: loading, error } = useQuery({
    queryKey: ['doctors', searchTerm],
    queryFn: () => (searchTerm.trim() ? doctorAPI.searchDoctors(searchTerm) : doctorAPI.getDoctors()).then(res => res.data)
  });

  const handleSearch = () => {
    // searchTerm change will trigger refetch via queryKey
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-[#0F172A] mb-2">Find a Doctor</h1>
          <p className="text-[#0F172A]/70 mb-8">
            Connect with certified specialists for your healthcare needs
          </p>

          {/* Search */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name, specialty, or language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-11 h-12"
              />
            </div>
            <Button onClick={handleSearch} size="lg" className="bg-[#0D9488] hover:bg-[#0F766E]">
              Search
            </Button>
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-[#0F172A]/70">Loading doctors...</div>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#0F172A]/70">No doctors found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor: any, index: number) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-[#0D9488]/20">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className="bg-[#0D9488] text-white text-xl">
                          {doctor.profiles?.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-[#0F172A]">
                          {doctor.profiles?.full_name || doctor.name}
                        </h3>
                        <p className="text-sm text-[#0F172A]/70 capitalize">
                          {doctor.specialty?.replace("_", " ")}
                        </p>
                      </div>
                      {doctor.is_available && (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          Available
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-[#0F172A]/70 mb-4 line-clamp-2">{doctor.bio}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{doctor.rating}</span>
                        <span className="text-[#0F172A]/70">
                          • {doctor.experience_years} years exp.
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#0F172A]/70">
                        <Languages className="w-4 h-4" />
                        {doctor.languages?.join(", ")}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#0F172A]/70">
                        <DollarSign className="w-4 h-4" />
                        ${doctor.consultation_fee} per consultation
                      </div>
                    </div>

                    <Button
                      className="w-full bg-[#0D9488] hover:bg-[#0F766E]"
                      onClick={() => navigate(`/patient/doctors/${doctor.id}`)}
                    >
                      View Profile & Book
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
