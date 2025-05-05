'use-client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

interface Appointment {
  id: string;
  doctorId?: string;
  patientId?: string;
  appointmentDate: string;
  reason: string;
  status: string;
  patient: Patient;
}

interface AppointmentState {
  selectedAppointment: Appointment | null;
}

const initialState: AppointmentState = {
  selectedAppointment: null,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setSelectedAppointment(state, action: PayloadAction<Appointment>) {
      state.selectedAppointment = action.payload;
    },
    clearAppointment(state) {
      state.selectedAppointment = null;
    },
  },
});

export const { setSelectedAppointment, clearAppointment } = appointmentSlice.actions;

export default appointmentSlice.reducer;
