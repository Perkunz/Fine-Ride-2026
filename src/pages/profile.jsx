import React from 'react'

export default function ProfileApp() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Profile (Dev)</h1>
        <p className="text-gray-600 mb-6">Placeholder for user profile, ride history, saved locations, and rewards.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg">Ride history (placeholder)</div>
          <div className="p-4 bg-gray-100 rounded-lg">Saved locations & rewards (placeholder)</div>
        </div>
      </div>
    </div>
  )
}
