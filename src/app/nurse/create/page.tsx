"use client";

import { useState } from "react";

export default function CreateNursePage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    shift: "",
    department:"",
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/nurse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone || undefined,
          shift: form.shift || undefined,
          user: {
            email: form.email,
            password: form.password,
            role: "NURSE",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create nurse");
      }

      setSuccess(true);
      setError("");
      setForm({
        fullName: "",
        phone: "",
        shift: "",
        department:"",
        email: "",
        password: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Register New Nurse</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
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
            name="shift"
            value={form.shift}
            onChange={handleChange}
            placeholder="Shift (e.g. Morning, Evening)"
            className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          />

          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
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

          {success && (
            <p className="text-green-400">Nurse created successfully!</p>
          )}
          {error && <p className="text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
}
