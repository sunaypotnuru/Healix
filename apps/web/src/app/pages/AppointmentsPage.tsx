import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Calendar, Video, Clock, XCircle, AlertCircle } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientAPI } from "../../lib/api";
import { supabase } from "../../lib/supabase";
import { format, isPast } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@mui/material";

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['patientAppointments'],
    queryFn: () => patientAPI.getAppointments().then(res => res.data)
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => patientAPI.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
      toast.success("Appointment cancelled");
    },
    onError: () => {
      toast.error("Failed to cancel appointment");
    }
  });

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-[#1F2D3D] mb-2">Failed to load appointments</h2>
        <p className="text-[#64748B] mb-6">{(error as Error).message}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['patientAppointments'] })}>Retry</Button>
      </div>
    );
  }

  const allAppointments = appointments || [];
  const upcomingAppts = allAppointments.filter(
    (a: any) => !isPast(new Date(a.date_time)) && a.status !== "cancelled"
  );
  const pastAppts = allAppointments.filter(
    (a: any) => isPast(new Date(a.date_time)) || a.status === "cancelled"
  );

  const AppointmentCard = ({ appointment }: { appointment: any }) => {
    const doctorName = appointment.profiles_doctor?.name || "Doctor";
    const specialty = appointment.profiles_doctor?.specialty || "Specialist";

    return (
      <Card className="p-6 hover:shadow-lg transition-shadow bg-white border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#1F2D3D]">
              {doctorName}
            </h3>
            <p className="text-sm text-[#1F2D3D]/70 capitalize">
              {specialty.replace("_", " ")}
            </p>
          </div>
          <Badge
            variant="outline"
            className={
              appointment.status === "confirmed" || appointment.status === "scheduled"
                ? "bg-green-50 text-green-700 border-green-200"
                : appointment.status === "cancelled"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
            }
          >
            {appointment.status.toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-[#1F2D3D]/70">
            <Calendar className="w-4 h-4" />
            {format(new Date(appointment.date_time), "EEEE, MMMM d, yyyy")}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1F2D3D]/70">
            <Clock className="w-4 h-4" />
            {format(new Date(appointment.date_time), "h:mm a")}
          </div>
          {(appointment.consultation_type === "video" || appointment.type === "video") && (
            <div className="flex items-center gap-2 text-sm text-[#0EA5E9]">
              <Video className="w-4 h-4" />
              Video Consultation
            </div>
          )}
        </div>

        {appointment.notes && (
          <p className="text-sm text-[#1F2D3D]/70 mb-4 p-3 bg-gray-50 rounded italic">
            "{appointment.notes}"
          </p>
        )}

        <div className="flex gap-3">
          {(appointment.consultation_type === "video" || appointment.type === "video") && (appointment.status === "confirmed" || appointment.status === "scheduled") && (
            <Button
              className="flex-1 bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
              onClick={() => navigate(`/patient/consultation/${appointment.id}`)}
            >
              <Video className="w-4 h-4 mr-2" />
              Join Call
            </Button>
          )}
          {(appointment.status === "confirmed" || appointment.status === "scheduled") && (
            <Button
              variant="outline"
              className="text-red-600 hover:bg-red-50 border-red-100"
              onClick={() => cancelMutation.mutate(appointment.id)}
              loading={cancelMutation.isPending}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-gray-50/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-[#1F2D3D] mb-2">My Appointments</h1>
          <p className="text-[#64748B] mb-8">Manage your consultations and upcoming visits</p>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-64 grid-cols-2 mb-8 bg-white border border-gray-200">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingAppts.length})
              </TabsTrigger>
              <TabsTrigger value="past">Past ({pastAppts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={160} className="rounded-2xl" />)}
                </div>
              ) : upcomingAppts.length === 0 ? (
                <Card className="p-12 text-center bg-white border-dashed border-2">
                  <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-[#64748B] mb-6 text-lg">No upcoming appointments found.</p>
                  <Button onClick={() => navigate("/patient/doctors")} size="lg" className="bg-[#0D9488] text-white">
                    Book Your First Appointment
                  </Button>
                </Card>
              ) : (
                upcomingAppts.map((appt: any) => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={160} className="rounded-2xl" />)}
                </div>
              ) : pastAppts.length === 0 ? (
                <Card className="p-12 text-center bg-white border-dashed border-2">
                  <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-[#64748B]">No past appointment history records found.</p>
                </Card>
              ) : (
                pastAppts.map((appt: any) => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

