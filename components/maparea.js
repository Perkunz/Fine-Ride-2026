function MapArea({ destination, availableDrivers = [], activeRide }) {
  try {
    return (
      <div className="w-full h-full relative bg-[#121212] overflow-hidden" data-name="map-area" data-file="components/MapArea.js">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border border-gray-800 rounded-full animate-ping opacity-20"></div>
        </div>

        {availableDrivers.map((driver, idx) => (
            <div key={driver.objectId} className="absolute transition-all duration-1000" style={{
                left: `${30 + (idx * 15) % 40}%`,
                top: `${40 + (idx * 20) % 30}%`,
                transform: `rotate(${idx * 45}deg)`
            }}>
                <div className="w-8 h-12 bg-white rounded-lg shadow-xl flex flex-col items-center justify-between border-2 border-gray-800">
                    <div className="w-full h-3 bg-gray-800 rounded-t-sm"></div>
                    <div className="icon-car text-gray-800 text-sm transform -rotate-90"></div>
                    <div className="w-full h-2"></div>
                </div>
            </div>
        ))}
        
        {activeRide && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center justify-center relative z-10 border-4 border-white animate-bounce">
                    <div className="icon-map-pin text-white text-xl"></div>
                </div>
                <div className="bg-black text-white text-xs px-3 py-1 rounded-full mt-2 shadow-lg font-bold">
                    {destination || 'Destination'}
                </div>
            </div>
        )}

        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10 hidden md:flex">
          <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
            <div className="icon-navigation text-xl text-black"></div>
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('MapArea component error:', error);
    return null;
  }
}