import React from 'react'

export default function AdminApp() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Portal (Dev)</h1>
        <p className="text-gray-600 mb-6">This is a Vite-based placeholder for the admin interface. Convert admin-components/* to ES modules and import them here to restore full functionality.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg">Users management (placeholder)</div>
          <div className="p-4 bg-gray-100 rounded-lg">Rides & payments (placeholder)</div>
        </div>
      </div>
    </div>
  )
}
