"use client";

import React from "react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

interface Appointment {
  id: string;
  appointmentDate: string;
  reason: string;
  status: string;
}

interface Props {
  appointment: Appointment;
  patient: Patient;
}

export default function AppointmentDetail({ appointment, patient }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-gray-900">
      <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>

      <div className="space-y-2">
        <p><strong>Patient Name:</strong> {patient.firstName} {patient.lastName}</p>
        {patient.email && <p><strong>Email:</strong> {patient.email}</p>}
        {patient.phone && <p><strong>Phone:</strong> {patient.phone}</p>}
        <p><strong>Reason:</strong> {appointment.reason}</p>
        <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {appointment.status}</p>
      </div>
    </div>
  );
}
