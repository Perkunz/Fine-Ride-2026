function DriverVehicle({ currentUser }) {
  try {
    return (
      <div className="h-full bg-[var(--bg-color)] overflow-y-auto pb-24 pt-20 px-4" data-name="driver-vehicle">
        <h2 className="text-2xl font-bold mb-6">Vehicle Information</h2>
        
        <div className="bg-[var(--secondary-color)] rounded-2xl p-6 shadow-sm mb-6 border border-[var(--border-color)] flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                <div className="icon-car text-3xl"></div>
            </div>
            <div>
                <h3 className="text-xl font-bold">{currentUser?.VehicleType || 'Sedan'}</h3>
                <p className="text-gray-500">Toyota Camry • Black</p>
                <div className="inline-block mt-2 px-2 py-1 bg-gray-100 rounded text-xs font-mono font-bold tracking-widest border border-gray-200">
                    ABC-123-XY
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--secondary-color)] rounded-2xl p-4 shadow-sm border border-[var(--border-color)]">
                <div className="flex justify-between items-start mb-2">
                    <div className="icon-fuel text-gray-400 text-xl"></div>
                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">Good</span>
                </div>
                <p className="text-sm text-gray-500">Fuel Level</p>
                <p className="text-xl font-bold">~ 65%</p>
            </div>
            <div className="bg-[var(--secondary-color)] rounded-2xl p-4 shadow-sm border border-[var(--border-color)]">
                <div className="flex justify-between items-start mb-2">
                    <div className="icon-wrench text-gray-400 text-xl"></div>
                    <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">Soon</span>
                </div>
                <p className="text-sm text-gray-500">Next Service</p>
                <p className="text-xl font-bold">In 450 mi</p>
            </div>
        </div>

        <div className="bg-[var(--secondary-color)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)] space-y-4">
            <h3 className="font-bold text-lg mb-2">Documents & Insurance</h3>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="icon-shield-check text-green-600 text-xl"></div>
                    <div>
                        <p className="font-bold text-green-900 text-sm">Vehicle Insurance</p>
                        <p className="text-xs text-green-700">Valid until Oct 2026</p>
                    </div>
                </div>
                <div className="icon-check text-green-600"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="icon-file-text text-green-600 text-xl"></div>
                    <div>
                        <p className="font-bold text-green-900 text-sm">Driver's License</p>
                        <p className="text-xs text-green-700">Valid until Jan 2028</p>
                    </div>
                </div>
                <div className="icon-check text-green-600"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="icon-search text-yellow-600 text-xl"></div>
                    <div>
                        <p className="font-bold text-yellow-900 text-sm">Vehicle Inspection</p>
                        <p className="text-xs text-yellow-700">Expires in 14 days</p>
                    </div>
                </div>
                <button className="text-xs bg-white border border-yellow-200 px-2 py-1 rounded shadow-sm text-yellow-800 font-bold hover:bg-yellow-100">Renew</button>
            </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DriverVehicle component error:', error);
    return null;
  }
}