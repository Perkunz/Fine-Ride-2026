import React from 'react'

export default function AuthApp() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4">Authentication (Dev)</h1>
        <p className="text-gray-600 mb-4">This page is a placeholder. Implement signup/login forms and wire them to your auth backend.</p>

        <div className="bg-gray-100 p-4 rounded-lg">
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input className="w-full p-2 rounded border" placeholder="you@example.com" />
          <label className="block mt-4 mb-2 text-sm font-medium">Password</label>
          <input className="w-full p-2 rounded border" type="password" placeholder="••••••" />
          <button className="mt-4 btn-black w-full">Log in (placeholder)</button>
        </div>
      </div>
    </div>
  )
}
