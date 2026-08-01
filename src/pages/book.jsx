import React from 'react'

export default function BookApp() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Booking (Dev)</h1>
        <p className="text-gray-600 mb-6">Minimal booking placeholder. Replace with components from components/ and utils/ after conversion.</p>

        <div className="bg-gray-100 p-4 rounded-lg max-w-xl">
          <label className="block mb-2 text-sm font-medium">Pickup</label>
          <input className="w-full p-2 rounded border mb-3" placeholder="Enter pickup location" />
          <label className="block mb-2 text-sm font-medium">Destination</label>
          <input className="w-full p-2 rounded border mb-3" placeholder="Where to?" />
          <button className="btn-black w-full">Request Ride (placeholder)</button>
        </div>
      </div>
    </div>
  )
}
