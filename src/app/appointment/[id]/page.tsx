"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import AppointmentDetail from "@/components/appointment-details";
import { useRouter } from "next/navigation"; // 👈 to navigate programmatically
import axios from "axios";

export default function AppointmentPage() {
  const selectedAppointment = useSelector(
    (state: RootState) => state.appointment.selectedAppointment
  );
  const router = useRouter();

  if (!selectedAppointment) {
    return <div>No appointment found. Please go back and select again.</div>;
  }

  const handleStartCall = async () => {
    try {
      const response = await axios.post(`http://localhost:3002/call/start`, {
        appointmentId: selectedAppointment.id,
        userId: selectedAppointment.doctorId, // 👈 pass doctorId
        role: "doctor", // 👈 hardcoded for now
      });

      const { roomId } = response.data;

      console.log("Room ID:", roomId);

      // Now navigate to call page, maybe /call/[roomId]
      router.push(`/call/${roomId}`);
    } catch (error) {
      console.error("Failed to start call:", error);
      alert("Failed to start call. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <AppointmentDetail
        appointment={{
          id: selectedAppointment.id,
          appointmentDate: selectedAppointment.appointmentDate,
          reason: selectedAppointment.reason,
          status: selectedAppointment.status,
        }}
        patient={selectedAppointment.patient}
      />

      <button
        onClick={handleStartCall}
        className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
      >
        Start Call
      </button>
    </div>
  );
}
