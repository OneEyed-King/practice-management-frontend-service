"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSelectedAppointment } from "@/redux/appointmentSlice";

interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  status: string;
  reason: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  // const doctorId = "ebd0abfb-b228-4264-b6cb-e47f870c1b57"; // Replace later
  const doctorId ="fd7c6477-5bb2-4779-b991-9fa5c7d1afad";
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/appointment/upcoming-by-doctor`, {
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          params: { doctorId, _: Date.now() },
        });
        setAppointments(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleCardClick = (appointment: Appointment) => {
    dispatch(setSelectedAppointment(appointment)); // save selected appointment in redux
    router.push(`/appointment/${appointment.id}`);  // navigate to details page
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upcoming Appointments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No upcoming appointments found.</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-4 bg-white shadow rounded-xl border text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => handleCardClick(appt)}
            >
              <h2 className="text-lg font-semibold">
                Patient: {appt.patient.firstName} {appt.patient.lastName}
              </h2>
              <p>Date: {new Date(appt.appointmentDate).toLocaleString()}</p>
              <p>Status: {appt.status}</p>
              <p>Reason: {appt.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
