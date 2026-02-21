import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
// @ts-ignore
import { motion } from "motion/react";
import {
  Star,
  MapPin,
  Languages,
  DollarSign,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { patientAPI, appointmentAPI } from "../../lib/api";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../lib/store";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: doctor, isLoading: loading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles_doctor")
        .select("*, profiles:id(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: (bookingData: any) => patientAPI.bookAppointment(bookingData),
    onSuccess: () => {
      toast.success("Appointment booked successfully!");
      queryClient.invalidateQueries({ queryKey: ["patientDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["patientAppointments"] });
      navigate("/patient/appointments");
    },
    onError: () => {
      toast.error("Failed to book appointment");
    },
  });

  const handleBook = () => {
    if (!user) {
      toast.error("Please sign in to book an appointment");
      navigate("/login");
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    bookingMutation.mutate({
      doctor_id: id,
      date_time: tomorrow.toISOString(),
      consultation_type: "video",
      reason: "General Consultation",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-[#0F172A]/70">Loading...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-[#0F172A]/70">Doctor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/doctors")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctors
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8">
            <div className="flex items-start gap-6 mb-8">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-[#0D9488] text-white text-3xl">
                  {(doctor.profiles?.full_name || doctor.name || "?").charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
                      {doctor.profiles?.full_name || doctor.name}
                    </h1>
                    <p className="text-lg text-[#0F172A]/70 capitalize mb-3">
                      {doctor.specialty?.replace("_", " ")}
                    </p>
                  </div>
                  {doctor.is_available && (
                    <Badge className="bg-green-100 text-green-700">
                      Available
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{doctor.rating}</span>
                  </div>
                  <span className="text-[#0F172A]/70">
                    {doctor.experience_years} years experience
                  </span>
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-[#0F172A]/70" />
                    <span className="text-[#0F172A]/70">
                      {doctor.languages?.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-3">About</h2>
                <p className="text-[#0F172A]/70">{doctor.bio}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#0F172A] mb-3">
                  Consultation Fee
                </h2>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#0D9488]" />
                  <span className="text-2xl font-bold text-[#0F172A]">
                    ${doctor.consultation_fee}
                  </span>
                  <span className="text-[#0F172A]/70">per session</span>
                </div>
              </div>

              <div className="pt-6 border-t">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white hover:shadow-xl transition-shadow"
                  onClick={handleBook}
                  disabled={bookingMutation.isPending || !doctor.is_available}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {bookingMutation.isPending
                    ? "Booking..."
                    : "Book Appointment"}
                </Button>
                {!doctor.is_available && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    Doctor is currently unavailable
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
