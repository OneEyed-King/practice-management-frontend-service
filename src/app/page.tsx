// src/pages/index.tsx
'use client';
import Link from 'next/link';
// import '../app/globals.css'; // path might differ if not in src


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-white">Welcome to Bhanu Pratap Clinic</h1>
      <p className="text-lg mb-6 text-gray-300">Your trusted place for quality care.</p>
      <div className="space-x-4">
        <Link href="/signin">
          <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700">
            Sign In
          </button>
        </Link>
        <button className="bg-gray-600 text-white px-6 py-2 rounded cursor-not-allowed" disabled>
          Sign Up (Coming Soon)
        </button>
      </div>
    </div>
  );
}
