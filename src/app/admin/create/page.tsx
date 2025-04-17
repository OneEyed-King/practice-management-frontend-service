'use client';

import { useState } from 'react';

export default function CreateAdminPage() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    officeNumber: '',
    roleTitle: '',
    contactEmail: '',
    email: '',
    password: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/adminstrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone || undefined,
          officeNumber: form.officeNumber || undefined,
          roleTitle: form.roleTitle || undefined,
          contactEmail: form.contactEmail || undefined,
          user: {
            email: form.email,
            password: form.password,
            role: 'ADMIN',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create admin');
      }

      setSuccess(true);
      setError('');
      setForm({
        fullName: '',
        phone: '',
        officeNumber: '',
        roleTitle: '',
        contactEmail: '',
        email: '',
        password: '',
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create Administrator</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
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
    </div>
  );
}
