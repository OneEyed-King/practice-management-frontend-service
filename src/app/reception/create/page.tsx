'use client';

import { useState } from 'react';

export default function CreateReceptionPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    deskNumber: '',
    shift: '',
    email: '',
    password: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3001/reception', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          fullName: `${form.firstName} ${form.lastName}`,
          user: {
            email: form.email,
            password: form.password,
            role: 'RECEPTION',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create receptionist');
      }

      setSuccess('Receptionist created successfully!');
      setForm({
        firstName: '',
        lastName: '',
        phone: '',
        deskNumber: '',
        shift: '',
        email: '',
        password: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Register Receptionist</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />


          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          <input
            type="text"
            name="deskNumber"
            value={form.deskNumber}
            onChange={handleChange}
            placeholder="Desk Number"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          <input
            type="text"
            name="shift"
            value={form.shift}
            onChange={handleChange}
            placeholder="Shift (e.g. Morning, Evening)"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold"
          >
            Submit
          </button>

          {success && <p className="text-green-400">Receptionist created successfully!</p>}
          {error && <p className="text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
}
