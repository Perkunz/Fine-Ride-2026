class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('Driver ErrorBoundary:', error, errorInfo); }
  render() {
    if (this.state.hasError) return <div className="p-8 text-center"><h1 className="text-red-500 font-bold">Error loading driver app</h1></div>;
    return this.props.children;
  }
}

// Global handler for network or permission errors
window.addEventListener('unhandledrejection', event => {
    if (event.reason && (event.reason.message?.includes('Failed to fetch') || event.reason.message?.includes('NoPermission'))) {
        event.preventDefault();
        console.warn('Suppressed global unhandled rejection:', event.reason.message);
    }
});

function DriverApp() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isOnline, setIsOnline] = React.useState(false);
    const [activeRide, setActiveRide] = React.useState(null);
    const [activeRider, setActiveRider] = React.useState(null);
    const [showChat, setShowChat] = React.useState(false);
    const [currentTab, setCurrentTab] = React.useState('home'); // home, earnings, vehicle, settings
    const [themeColor, setThemeColor] = React.useState('#ff0000'); // default red for consistency with redesign
    const [driverStats, setDriverStats] = React.useState({ daily: 0, weekly: 0, monthly: 0, trips: 0 });

    const fetchDriverStats = React.useCallback(async () => {
        if (!currentUser) return;
        try {
            const res = await trickleListObjects('ride', 100, true, undefined);
            if (res && res.items) {
                const uid = currentUser.id || currentUser.objectId;
                const myCompletedRides = res.items.filter(r => r.objectData.DriverId === uid && r.objectData.Status === 'completed');
                
                let daily = 0, weekly = 0, monthly = 0;
                const now = new Date();
                myCompletedRides.forEach(r => {
                    const dateStr = r.objectData.EndTime || r.createdAt;
                    if (!dateStr) return;
                    const date = new Date(dateStr);
                    
                    const fareStr = String(r.objectData.Fare || '0');
                    const match = fareStr.match(/\d+(?:,\d+)*(?:\.\d+)?/);
                    const fare = match ? parseFloat(match[0].replace(/,/g, '')) : 0;
                    
                    if (date.toDateString() === now.toDateString()) daily += fare;
                    
                    const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
                    if (daysDiff <= 7) weekly += fare;
                    if (daysDiff <= 30) monthly += fare;
                });
                
                const todaysRides = myCompletedRides.filter(r => {
                    const dStr = r.objectData.EndTime || r.createdAt;
                    return dStr && new Date(dStr).toDateString() === now.toDateString();
                });
                
                setDriverStats({ daily, weekly, monthly, trips: todaysRides.length });
            }
        } catch(e) { console.warn("Failed to fetch stats", e.message); }
    }, [currentUser]);

    React.useEffect(() => {
        fetchDriverStats();
    }, [fetchDriverStats]);

    React.useEffect(() => {
        document.documentElement.style.setProperty('--accent-color', themeColor);
    }, [themeColor]);

    React.useEffect(() => {
        if (activeRide && activeRide.objectData.RiderId) {
            trickleGetObject('user', activeRide.objectData.RiderId)
                .then(setActiveRider)
                .catch(e => console.warn("Failed to get rider:", e.message));
        } else {
            setActiveRider(null);
        }
    }, [activeRide?.objectId]);

    React.useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'auth.html?role=driver&msg=login_required';
        } else if (user.Role !== 'Driver') {
            window.location.href = 'auth.html?role=driver&msg=driver_required';
        } else {
            setCurrentUser(user);
            setIsOnline(user.Status === 'Online');
        }
    }, []);

    const toggleOnline = async (status) => {
        try {
            const newStatus = status ? 'Online' : 'Offline';
            await trickleUpdateObject('user', currentUser.id, { Status: newStatus });
            setIsOnline(status);
            
            const updatedUser = { ...currentUser, Status: newStatus };
            setCurrentUser(updatedUser);
            if (typeof window.setCurrentUser === 'function') {
                window.setCurrentUser(updatedUser);
            } else {
                localStorage.setItem('fine_ride_user', JSON.stringify(updatedUser));
            }
        } catch(e) { 
            console.warn("Toggle online failed:", e.message);
            alert('Network error: Unable to change status. Please check your connection.');
        }
    };

    const [networkError, setNetworkError] = React.useState(false);

    React.useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }, []);

    const sendNotification = (title, body) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: 'https://resource.trickle.so/coding_trickle/trickle_avatar.png' });
        }
    };

    const pollRides = async () => {
        if (!isOnline || !currentUser) return;
        try {
            const res = await trickleListObjects('ride', 100, true, undefined);
            if (res && res.items) {
                setNetworkError(false);
                // Check if driver has an accepted/en_route/payment_pending ride first
                const uid = currentUser.id || currentUser.objectId;
                let myRide = res.items.find(r => r.objectData.DriverId === uid && ['accepted', 'en_route', 'payment_pending'].includes(r.objectData.Status));
                
                if (!myRide) {
                    // Look for open requests meant for this driver (or broadcasted without driver)
                    myRide = res.items.find(r => r.objectData.Status === 'request' && (!r.objectData.DriverId || r.objectData.DriverId === uid));
                }
                
                if (myRide && (!activeRide || myRide.objectId !== activeRide.objectId || myRide.objectData.Status !== activeRide.objectData.Status || myRide.objectData.DriverId !== activeRide.objectData.DriverId)) {
                    if (activeRide && activeRide.objectData.Status === 'payment_pending' && myRide.objectData.Status === 'completed') {
                        sendNotification('Payment Confirmed!', `Ride payment has been successfully confirmed.`);
                    }
                    setActiveRide(myRide);
                    if (myRide.objectData.Status === 'request' && (!activeRide || activeRide.objectData.Status !== 'request')) {
                        sendNotification('New Ride Request!', `Pickup: ${myRide.objectData.Pickup}`);
                    }
                } else if (!myRide && activeRide && ['request', 'accepted', 'en_route', 'payment_pending'].includes(activeRide.objectData.Status)) {
                    if (activeRide.objectData.Status === 'payment_pending') {
                        sendNotification('Payment Confirmed!', `Ride payment has been successfully confirmed.`);
                    }
                    setActiveRide(null);
                }
            }
        } catch(e) { 
            console.warn("Poll rides failed:", e.message); 
            setNetworkError(true);
        }
    };

    React.useEffect(() => {
        const interval = setInterval(pollRides, 3000);
        return () => clearInterval(interval);
    }, [isOnline, currentUser, activeRide]);

    const updateRideStatus = async (status) => {
        if (!activeRide) return;
        try {
            const updateData = { Status: status };
            if (status === 'accepted') updateData.DriverId = currentUser.id;
            if (status === 'en_route') updateData.StartTime = new Date().toISOString();
            
            if (status === 'payment_pending') {
                updateData.EndTime = new Date().toISOString();
                const startTime = activeRide.objectData.StartTime ? new Date(activeRide.objectData.StartTime) : new Date();
                const endTime = new Date(updateData.EndTime);
                const diffMins = Math.max(1, Math.ceil((endTime - startTime) / 60000));
                updateData.Fare = `₦${diffMins * 250}`;
            }
            
            try { await trickleUpdateObject('ride', activeRide.objectId, updateData); } catch(err) { console.warn('Permission/Network issue updating ride:', err.message); }
            setActiveRide({ ...activeRide, objectData: { ...activeRide.objectData, ...updateData } });
            
            if (status === 'completed') {
                setTimeout(fetchDriverStats, 1000);
            }

            if (status === 'completed' || status === 'cancelled') {
                setTimeout(() => setActiveRide(null), 3000);
            }
        } catch(e) { console.warn("Update ride status failed:", e.message); }
    };

    if (!currentUser) return null;
    
    const rideStatus = activeRide ? activeRide.objectData.Status : 'idle';

    return (
      <div className="relative h-screen w-full flex flex-col bg-[#e5e3df]" data-name="driver-app" data-file="driver-app.js">
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
              <div className="bg-white p-3 rounded-2xl shadow-lg flex flex-col gap-3 min-w-[180px]">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="font-bold text-gray-900 text-sm leading-tight">{currentUser.Name || 'Driver'}</div>
                        <div className="text-xs text-gray-500">{currentUser.VehicleType || 'Sedan'}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {currentUser.Name ? currentUser.Name.charAt(0).toUpperCase() : 'D'}
                    </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                    <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'} flex items-center gap-1`}>
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                    <button 
                        onClick={() => toggleOnline(!isOnline)} 
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOnline ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </button>
                </div>
              </div>
              {networkError && (
                  <div className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full shadow-lg">
                      Network Error
                  </div>
              )}
          </div>
          <div className="flex flex-col gap-2">
            <a href="profile.html" className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 pointer-events-auto text-gray-700" title="View Profile">
              <div className="icon-user text-xl"></div>
            </a>
            <button onClick={logout} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 pointer-events-auto text-red-500" title="Log Out">
              <div className="icon-power-off text-xl"></div>
            </button>
          </div>
        </div>

        {/* Main Content Area based on Tab */}
        <div className="flex-1 relative overflow-hidden z-0 bg-[#0a0a0a]">
            {currentTab === 'home' && (
                <>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                  
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    {isOnline && <div className="w-32 h-32 bg-[var(--accent-color)] opacity-20 rounded-full absolute animate-ping"></div>}
                    <div className="w-10 h-10 bg-[var(--primary-color)] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] border-4 border-black flex items-center justify-center relative z-10">
                       <div className="icon-navigation text-[var(--accent-color)] transform rotate-45 text-sm"></div>
                    </div>
                  </div>

                  {(rideStatus === 'accepted' || rideStatus === 'en_route') && (
                    <svg className="absolute top-1/4 left-1/4 w-full h-full -z-10" stroke="var(--accent-color)" strokeWidth="6" fill="none" strokeDasharray="10 10">
                      <path d="M100,100 Q300,200 400,400" />
                    </svg>
                  )}
                  
                  {/* Bottom Panel (Only shown on home tab) */}
                  <div className="absolute bottom-16 w-full z-10">
                    <DriverPanel 
                      isOnline={isOnline} 
                      setIsOnline={toggleOnline} 
                      rideStatus={rideStatus} 
                      activeRide={activeRide}
                      activeRider={activeRider}
                      updateRideStatus={updateRideStatus}
                      onOpenChat={() => setShowChat(true)}
                      stats={driverStats}
                    />
                  </div>
                </>
            )}
            
            {currentTab === 'earnings' && <DriverEarnings currentUser={currentUser} stats={driverStats} />}
            {currentTab === 'vehicle' && <DriverVehicle currentUser={currentUser} />}
            {currentTab === 'settings' && <DriverSettings themeColor={themeColor} setThemeColor={setThemeColor} />}
        </div>
        
        {/* Bottom Navigation Bar */}
        <div className="h-16 bg-[var(--secondary-color)] border-t border-[var(--border-color)] flex items-center justify-around z-20 px-2 shrink-0">
            <button onClick={() => setCurrentTab('home')} className={`flex flex-col items-center p-2 w-16 transition-colors ${currentTab === 'home' ? 'text-[var(--accent-color)]' : 'text-gray-500 hover:text-white'}`}>
                <div className="icon-map text-xl mb-1"></div>
                <span className="text-[10px] font-medium">Map</span>
            </button>
            <button onClick={() => setCurrentTab('earnings')} className={`flex flex-col items-center p-2 w-16 transition-colors ${currentTab === 'earnings' ? 'text-[var(--accent-color)]' : 'text-gray-500 hover:text-white'}`}>
                <div className="icon-wallet text-xl mb-1"></div>
                <span className="text-[10px] font-medium">Earnings</span>
            </button>
            <button onClick={() => setCurrentTab('vehicle')} className={`flex flex-col items-center p-2 w-16 transition-colors ${currentTab === 'vehicle' ? 'text-[var(--accent-color)]' : 'text-gray-500 hover:text-white'}`}>
                <div className="icon-car text-xl mb-1"></div>
                <span className="text-[10px] font-medium">Vehicle</span>
            </button>
            <button onClick={() => setCurrentTab('settings')} className={`flex flex-col items-center p-2 w-16 transition-colors ${currentTab === 'settings' ? 'text-[var(--accent-color)]' : 'text-gray-500 hover:text-white'}`}>
                <div className="icon-settings text-xl mb-1"></div>
                <span className="text-[10px] font-medium">Settings</span>
            </button>
        </div>

        {showChat && activeRide && (
            <ChatWindow 
                rideId={activeRide.objectId} 
                currentUser={currentUser} 
                onClose={() => setShowChat(false)} 
            />
        )}

      </div>
    );
  } catch (error) {
    console.error('DriverApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <DriverApp />
  </ErrorBoundary>
);