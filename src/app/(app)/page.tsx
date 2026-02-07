'use client'

import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Home() {
  const {user, logout} = useAuth()
  return (
    <div className="px-4 py-12 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {user?.email}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        You&apos;re logged in. This is your dashboard
      </p>
      <button 
        onClick={logout}
        className="mt-6 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
