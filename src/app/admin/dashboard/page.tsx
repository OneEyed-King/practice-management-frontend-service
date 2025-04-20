// src/pages/admin/dashboard.tsx
import Link from 'next/link';
// import '@/app/globals.css'; 

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Welcome, Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link href="/doctor/create">
          <div className="bg-gray-800 p-6 rounded shadow hover:shadow-md cursor-pointer transition duration-200">
            <h2 className="text-xl font-semibold text-white">Add Doctor</h2>
          </div>
        </Link>

        <Link href="/nurse/create">
          <div className="bg-gray-800 p-6 rounded shadow hover:shadow-md cursor-pointer transition duration-200">
            <h2 className="text-xl font-semibold text-white">Add Nurse</h2>
          </div>
        </Link>

        <Link href="/patient/create">
          <div className="bg-gray-800 p-6 rounded shadow hover:shadow-md cursor-pointer transition duration-200">
            <h2 className="text-xl font-semibold text-white">Add Patient</h2>
          </div>
        </Link>

        <Link href="/reception/create">
          <div className="bg-gray-800 p-6 rounded shadow hover:shadow-md cursor-pointer transition duration-200">
            <h2 className="text-xl font-semibold text-white">Add Receptionist</h2>
          </div>
        </Link>

        <Link href="/admin/create">
          <div className="bg-gray-800 p-6 rounded shadow hover:shadow-md cursor-pointer transition duration-200">
            <h2 className="text-xl font-semibold text-white">Add Admin</h2>
          </div>
        </Link>

        <Link href="/appointment/book-appointment">
          <div className="bg-gray-800 p-6 rounded shadow hover:shadow-md cursor-pointer transition duration-200">
            <h2 className="text-xl font-semibold text-white">Book Appointment</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}
