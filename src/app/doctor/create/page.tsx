'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

export default function CreateDoctor() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    qualification: '',
    specialization: '',
    phone: '',
    address: '',
    user: {
      email: '',
      password: '',
      role: 'DOCTOR',
    },
    availability: [
      { day: 'monday', startTime: '', endTime: '' },
    ],
  });

  const handleAvailabilityChange = (index: number, field: string, value: string) => {
    const updated = [...form.availability];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, availability: updated });
  };

  const addSlot = () => {
    setForm({
      ...form,
      availability: [...form.availability, { day: 'monday', startTime: '', endTime: '' }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/doctor', {
        ...form,
        fullName: `${form.firstName} ${form.lastName}`,
      });
      alert('Doctor created successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Something went wrong while creating the doctor.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Create Doctor</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          required
        />

        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          required
        />


        <input
          placeholder="Qualification"
          value={form.qualification}
          onChange={(e) => setForm({ ...form, qualification: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          placeholder="Specialization"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />

        <h2 className="text-xl font-semibold mt-6">User Credentials</h2>

        <input
          placeholder="Email"
          type="email"
          value={form.user.email}
          onChange={(e) => setForm({ ...form, user: { ...form.user, email: e.target.value } })}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={form.user.password}
          onChange={(e) => setForm({ ...form, user: { ...form.user, password: e.target.value } })}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          required
        />

        <h2 className="text-xl font-semibold mt-6">Availability Slots</h2>

        {form.availability.map((slot, index) => (
          <div key={index} className="flex space-x-2">
            <select
              value={slot.day}
              onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
              className="p-2 rounded bg-gray-700 border border-gray-600"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
              className="p-2 rounded bg-gray-700 border border-gray-600"
            />

            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
              className="p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addSlot}
          className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          + Add Slot
        </button>

        <button
          type="submit"
          className="mt-6 w-full px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white font-semibold"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
