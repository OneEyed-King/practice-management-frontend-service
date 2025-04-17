'use client';

import { useState } from 'react';

export default function CreatePatient() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    phone: '',
    email: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:3001/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
          user: {}, // Backend will handle user creation (no login fields here)
        }),
      });

      if (!res.ok) throw new Error('Failed to create patient');

      setSuccess('Patient created successfully');
      setForm({
        firstName: '',
        lastName: '',
        gender: '',
        age: '',
        phone: '',
        email: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-md space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Register Patient</h2>

        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Create Patient
        </button>
      </form>
    </div>
  );
}
