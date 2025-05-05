"use client";

import { useEffect, useState } from "react";
import {
  TextField,
  Autocomplete,
  Button,
  Typography,
  Container,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { startOfWeek, addDays, format } from "date-fns";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
};

type Slot = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

const dayOrder = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const getDateFromDayOfWeek = (day: string): Date => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday
  const dayIndexMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const index = dayIndexMap[day.toLowerCase()];
  return addDays(weekStart, index);
};

export default function CreateAppointmentPage() {
  const [patientMode, setPatientMode] = useState<"existing" | "new">("existing");
  const [patientOptions, setPatientOptions] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatientForm, setNewPatientForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    phone: "",
    email: "",
  });

  const [doctorOptions, setDoctorOptions] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [slotOptions, setSlotOptions] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [reason, setReason] = useState("");

  const fetchPatients = async (search: string) => {
    try {
      const res = await fetch(`http://localhost:3001/patient/get-by-name?firstName=${search}`);
      const data = await res.json();
      setPatientOptions(data || []);
    } catch (err) {
      console.error("Error fetching patients", err);
    }
  };

  const fetchDoctors = async (search: string) => {
    try {
      const res = await fetch(`http://localhost:3001/doctor/get-by-name?firstName=${search}`);
      const data = await res.json();
      setDoctorOptions(data || []);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

  const fetchSlots = async (doctorId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/doctor/${doctorId}/slots`);
      const data = await res.json();
      setSlotOptions(data || []);
    } catch (err) {
      console.error("Error fetching slots", err);
    }
  };

  useEffect(() => {
    if (selectedDoctor?.id) fetchSlots(selectedDoctor.id);
    else setSlotOptions([]);
  }, [selectedDoctor]);

  const handleSubmit = async () => {
    try {
      let patientId = selectedPatient?.id;

      if (patientMode === "new") {
        const res = await fetch("http://localhost:3001/patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newPatientForm,
            age: Number(newPatientForm.age),
            user: {},
          }),
        });

        if (!res.ok) throw new Error("Failed to create patient");
        const newPatient = await res.json();
        patientId = newPatient.id;
      }

      const slot = slotOptions.find((s) => s.id === selectedSlotId);
      if (!slot || !patientId || !selectedDoctor)
        return alert("Incomplete data");

      const slotDate = getDateFromDayOfWeek(slot.dayOfWeek);
      const [hours, minutes] = slot.startTime.split(":").map(Number);
      const dateWithTime = new Date(slotDate);
      dateWithTime.setHours(hours, minutes, 0, 0); // sets the slot time
      
      const appointmentDate = dateWithTime.toISOString(); // this includes both date & time
      
      const response = await fetch("http://localhost:3001/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: { existingPatientId: patientId },
          doctorId: selectedDoctor.id,
          slotId: selectedSlotId,
          appointmentDate,
          reason,
        }),
      });

      if (!response.ok) throw new Error("Failed to create appointment");

      alert("Appointment booked successfully!");
      setSelectedPatient(null);
      setSelectedDoctor(null);
      setSelectedSlotId("");
      setSlotOptions([]);
      setReason("");
      setNewPatientForm({
        firstName: "",
        lastName: "",
        gender: "",
        age: "",
        phone: "",
        email: "",
      });
      setPatientMode("existing");
    } catch (err) {
      console.error(err);
      alert("Error submitting appointment");
    }
  };

  const slotsByDay: { [key: string]: { date: Date; slots: Slot[] } } = {};

  dayOrder.forEach((day) => {
    slotsByDay[day] = {
      date: getDateFromDayOfWeek(day),
      slots: slotOptions.filter((slot) => slot.dayOfWeek.toLowerCase() === day),
    };
  });

  const maxRows = Math.max(...Object.values(slotsByDay).map((obj) => obj.slots.length));

  return (
    <Container maxWidth="md" className="mt-10">
      <Paper elevation={3} className="p-6">
        <Typography variant="h4" gutterBottom>
          Create Appointment
        </Typography>

        <Typography variant="h6" className="mt-4">
          Patient
        </Typography>
        <RadioGroup
          row
          value={patientMode}
          onChange={(e) => setPatientMode(e.target.value as "existing" | "new")}
        >
          <FormControlLabel value="existing" control={<Radio />} label="Existing Patient" />
          <FormControlLabel value="new" control={<Radio />} label="New Patient" />
        </RadioGroup>

        {patientMode === "existing" ? (
          <Autocomplete
            options={patientOptions}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            onInputChange={(e, val) => fetchPatients(val)}
            onChange={(e, val) => setSelectedPatient(val)}
            value={selectedPatient}
            renderInput={(params) => (
              <TextField {...params} label="Search Patient" variant="outlined" margin="normal" fullWidth />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.firstName} {option.lastName} - {option.email}
              </li>
            )}
          />
        ) : (
          <div className="space-y-2 mt-2">
            {["firstName", "lastName", "gender", "age", "phone", "email"].map((field) => (
              <TextField
                key={field}
                label={field[0].toUpperCase() + field.slice(1)}
                type={field === "age" ? "number" : "text"}
                fullWidth
                value={(newPatientForm as any)[field]}
                onChange={(e) =>
                  setNewPatientForm((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
              />
            ))}
          </div>
        )}

        <Autocomplete
          options={doctorOptions}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          onInputChange={(e, val) => fetchDoctors(val)}
          onChange={(e, val) => setSelectedDoctor(val)}
          value={selectedDoctor}
          renderInput={(params) => (
            <TextField {...params} label="Search Doctor" variant="outlined" margin="normal" fullWidth />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.firstName} {option.lastName} - {option.specialization}
            </li>
          )}
        />

        {slotOptions.length > 0 && (
          <div className="mt-6">
            <Typography variant="h6" gutterBottom>
              Select Slot
            </Typography>
            <div className="overflow-auto">
              <div className="flex justify-between font-semibold text-center">
                {dayOrder.map((day) => {
                  const date = slotsByDay[day].date;
                  const label = `${day.slice(0, 3).toUpperCase()} ${format(date, "MMM d")}`;
                  return (
                    <div key={day} className="flex-1 text-sm">
                      {label}
                    </div>
                  );
                })}
              </div>
              <div className="flex">
                {dayOrder.map((day) => {
                  const { slots } = slotsByDay[day];
                  return (
                    <div key={day} className="flex-1 flex flex-col gap-2 mt-2 items-center">
                      {Array.from({ length: maxRows }).map((_, idx) => {
                        const slot = slots[idx];
                        return slot ? (
                          <Button
                            key={slot.id}
                            variant={selectedSlotId === slot.id ? "contained" : "outlined"}
                            onClick={() => setSelectedSlotId(slot.id)}
                            size="small"
                          >
                            {slot.startTime}
                          </Button>
                        ) : (
                          <div key={idx} className="h-[36px] w-[80px]" />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <TextField
          label="Reason for Appointment"
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 3 }}
          disabled={
            patientMode === "existing"
              ? !selectedPatient || !selectedDoctor || !selectedSlotId || !reason
              : !newPatientForm.firstName ||
                !newPatientForm.lastName ||
                !newPatientForm.gender ||
                !newPatientForm.age ||
                !selectedDoctor ||
                !selectedSlotId ||
                !reason
          }
        >
          Submit Appointment
        </Button>
      </Paper>
    </Container>
  );
}
