'use client';

import { useState } from 'react';

export default function CreateAdminPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    officeNumber: '',
    roleTitle: '',
    contactEmail: '',
    email: '',
    password: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:3001/adminstrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          user: {
            email: form.email,
            password: form.password,
            role: 'ADMIN',
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to create admin');

      setSuccess('Admin created successfully');
      setForm({
        firstName: '',
        lastName: '',
        phone: '',
        officeNumber: '',
        roleTitle: '',
        contactEmail: '',
        email: '',
        password: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-md space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Register Admin</h2>

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


          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="text"
            name="officeNumber"
            value={form.officeNumber}
            onChange={handleChange}
            placeholder="Office Number"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="text"
            name="roleTitle"
            value={form.roleTitle}
            onChange={handleChange}
            placeholder="Role Title"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="email"
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            placeholder="Contact Email"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Login Email"
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold"
          >
            Register Admin
          </button>

          {success && <p className="text-green-400">Administrator created successfully!</p>}
          {error && <p className="text-red-400">{error}</p>}
        </form>
      </div>
  );
}
