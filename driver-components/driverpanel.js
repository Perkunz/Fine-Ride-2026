function DriverPanel({ isOnline, setIsOnline, rideStatus, setRideStatus, activeRide, activeRider, updateRideStatus, onOpenChat, stats }) {
  try {
    // rideStatus: 'idle', 'request', 'accepted', 'en_route'
    const [liveDistance, setLiveDistance] = React.useState(1.5);

    React.useEffect(() => {
        if (rideStatus === 'request') {
            const interval = setInterval(() => {
                setLiveDistance(prev => {
                    const newDist = prev - 0.1;
                    return newDist > 0.1 ? Number(newDist.toFixed(1)) : 0.1;
                });
            }, 3000);
            return () => clearInterval(interval);
        } else {
            setLiveDistance(1.5); // reset
        }
    }, [rideStatus]);

    if (!isOnline) {
      return (
        <div className="panel p-6 flex flex-col items-center text-center h-64" data-name="driver-offline" data-file="driver-components/DriverPanel.js">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <div className="icon-power-off text-2xl text-gray-500"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">You're offline</h2>
          <p className="text-gray-500 mb-6">Toggle your status at the top to start receiving requests.</p>
          <button onClick={() => setIsOnline(true)} className="btn-primary w-full max-w-sm rounded-full py-4 text-lg">
            GO ONLINE
          </button>
        </div>
      );
    }

    if (rideStatus === 'request') {
      return (
        <div className="panel p-6 flex flex-col h-[400px] relative overflow-hidden" data-name="driver-request" data-file="driver-components/DriverPanel.js">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse"></div>
          <h3 className="text-center text-blue-600 font-bold tracking-wider text-sm mb-2">NEW REQUEST</h3>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-3xl font-bold mb-1">{Math.ceil(liveDistance * 3)} min</div>
              <div className="text-gray-500 flex items-center gap-1"><div className="icon-star text-yellow-400"></div> 4.8 Rating</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 font-bold mt-2">{liveDistance.toFixed(1)} mi away</div>
            </div>
          </div>

          {/* Mini Map Placeholder */}
          <div className="w-full h-32 bg-[#e5e3df] rounded-xl border border-gray-200 mb-4 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             <div className="relative z-10 flex flex-col items-center">
                 <div className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full mb-1 font-bold">Rider Pickup</div>
                 <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
             </div>
             {/* Simulated driver position on mini map */}
             <div className="absolute bottom-4 right-4 z-10 flex flex-col items-center">
                 <div className="icon-navigation text-black text-xl transform -rotate-45 drop-shadow-md"></div>
             </div>
          </div>

          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="icon-map-pin text-blue-600 text-sm"></div>
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">Pickup Location</p>
                <p className="font-semibold text-gray-900 truncate text-sm">{activeRide?.objectData?.Pickup || 'Pickup'}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <button onClick={() => updateRideStatus('cancelled')} className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 shadow-sm border border-gray-200">
              <div className="icon-x text-2xl text-gray-600"></div>
            </button>
            <button onClick={() => updateRideStatus('accepted')} className="flex-1 btn-success rounded-full flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-transform">
              ACCEPT RIDE
            </button>
          </div>
        </div>
      );
    }

    if (rideStatus === 'accepted') {
      return (
        <div className="panel p-6 flex flex-col h-72" data-name="driver-accepted" data-file="driver-components/DriverPanel.js">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden text-blue-600 font-bold text-xl">
                {activeRider?.objectData?.Name?.charAt(0) || 'P'}
              </div>
              <div>
                <h3 className="font-bold text-lg">{activeRider?.objectData?.Name || 'Passenger'}</h3>
                <p className="text-sm text-gray-500">{activeRider?.objectData?.Phone || 'Connecting...'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${activeRider?.objectData?.Phone}`} className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200">
                <div className="icon-phone"></div>
              </a>
              <button onClick={onOpenChat} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                <div className="icon-message-square"></div>
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRide?.objectData?.Pickup || '')}`} 
              target="_blank" 
              className="flex-1 bg-gray-100 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors border border-gray-200 text-gray-800 font-bold"
            >
              <div className="icon-map text-[var(--accent-color)]"></div>
              Maps
            </a>
            <a 
              href={`waze://?q=${encodeURIComponent(activeRide?.objectData?.Pickup || '')}&navigate=yes`} 
              className="flex-1 bg-gray-100 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors border border-gray-200 text-gray-800 font-bold"
            >
              <div className="icon-navigation text-[var(--accent-color)]"></div>
              Waze
            </a>
          </div>

          <button onClick={() => updateRideStatus('en_route')} className="bg-[var(--accent-color)] text-white w-full mt-auto py-4 rounded-xl text-lg shadow-lg font-bold hover:opacity-90">
            START RIDE
          </button>
        </div>
      );
    }

    if (rideStatus === 'en_route') {
      return (
        <div className="panel p-6 flex flex-col h-64" data-name="driver-en-route" data-file="driver-components/DriverPanel.js">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden text-blue-600 font-bold text-xl">
                {activeRider?.objectData?.Name?.charAt(0) || 'P'}
              </div>
              <div>
                <h3 className="font-bold text-lg">{activeRider?.objectData?.Name || 'Passenger'}</h3>
                <p className="text-sm text-gray-500">En route to drop-off</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onOpenChat} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                <div className="icon-message-square"></div>
              </button>
            </div>
          </div>

           <div className="bg-blue-50 text-blue-800 rounded-xl p-4 mb-4 flex items-center justify-between border border-blue-100">
            <div className="flex items-center gap-3">
                <div className="icon-map-pin text-[var(--accent-color)]"></div>
                <div>
                  <div className="font-bold text-lg">Heading to Drop-off</div>
                  <div className="text-sm truncate max-w-[180px]">{activeRide?.objectData?.Dropoff || 'Destination'}</div>
                </div>
            </div>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeRide?.objectData?.Dropoff || '')}`} 
              target="_blank"
              className="bg-white p-2 rounded-full shadow text-[var(--accent-color)] hover:bg-gray-50"
            >
                <div className="icon-navigation"></div>
            </a>
          </div>

          <button onClick={() => updateRideStatus('payment_pending')} className="bg-green-600 text-white w-full mt-auto py-4 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg font-bold hover:bg-green-700">
            <div className="icon-circle-check"></div> END RIDE
          </button>
        </div>
      );
    }

    if (rideStatus === 'payment_pending') {
      return (
        <div className="panel p-6 flex flex-col h-64" data-name="driver-payment-pending" data-file="driver-components/DriverPanel.js">
          <div className="flex flex-col items-center text-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold">Awaiting Payment</h2>
            <p className="text-sm text-gray-500 mt-2">Waiting for the rider to complete the bank transfer and admin confirmation.</p>
          </div>
        </div>
      );
    }

    // Idle
    return (
      <div className="panel p-6 flex flex-col h-64" data-name="driver-idle" data-file="driver-components/DriverPanel.js">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Finding rides...</h2>
            <p className="text-sm text-gray-500 mt-1">High demand in your area</p>
          </div>
          <div className="icon-radar text-3xl text-[var(--accent-color)] animate-spin-slow opacity-50"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-sm text-gray-500 mb-1">Today's Earnings</div>
            <div className="text-2xl font-bold text-green-600">₦{(stats?.daily || 0).toLocaleString()}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
            <div className="text-sm text-gray-500 mb-1">Trips</div>
            <div className="text-2xl font-bold">{stats?.trips || 0}</div>
          </div>
        </div>

        {/* Simulate incoming request button for prototype purposes */}
        <button onClick={() => setRideStatus('request')} className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600 underline">
          Simulate Request
        </button>
      </div>
    );
  } catch (error) {
    console.error('DriverPanel error:', error);
    return null;
  }
}