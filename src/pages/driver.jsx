import React from 'react'

export default function DriverApp() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Driver Dashboard (Dev)</h1>
        <p className="text-gray-600 mb-6">This is a lightweight Vite-powered placeholder for the driver app. Replace with the real driver components from driver-components/ after converting them to ES modules.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg">Earnings panel (placeholder)</div>
          <div className="p-4 bg-gray-100 rounded-lg">Active rides / queue (placeholder)</div>
          <div className="p-4 bg-gray-100 rounded-lg">Vehicle status (placeholder)</div>
        </div>
      </div>
    </div>
  )
}
