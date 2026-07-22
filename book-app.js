class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="icon-circle-alert text-4xl text-red-500 mb-4 mx-auto w-12 h-12 flex items-center justify-center"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">We're sorry, but something unexpected happened in the application.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-black w-full"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
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

function App() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [destination, setDestination] = React.useState('');
    const [step, setStep] = React.useState('search'); // search, options, booking
    const [activeRide, setActiveRide] = React.useState(null);
    const [activeDriver, setActiveDriver] = React.useState(null);
    const [showChat, setShowChat] = React.useState(false);
    const [showSupport, setShowSupport] = React.useState(false);
    const [completedRideData, setCompletedRideData] = React.useState(null);
    const [unreadMessages, setUnreadMessages] = React.useState(0);
    const [availableDrivers, setAvailableDrivers] = React.useState([]);
    const [rideHistory, setRideHistory] = React.useState([]);
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

    React.useEffect(() => {
        const initData = async () => {
            if (!currentUser) return;
            try {
                const res = await trickleListObjects('ride', 50, true, undefined);
                if (res && res.items) {
                    const uid = currentUser.id || currentUser.objectId;
                    // History
                    setRideHistory(res.items.filter(r => r.objectData.RiderId === uid && ['completed', 'cancelled'].includes(r.objectData.Status)));
                    
                    // Recover active ride if any
                    const ongoing = res.items.find(r => r.objectData.RiderId === uid && ['request', 'accepted', 'en_route', 'payment_pending'].includes(r.objectData.Status));
                    if (ongoing) {
                        setActiveRide(ongoing);
                        setDestination(ongoing.objectData.Dropoff);
                        setStep('booking');
                    }
                }
            } catch(e) {}
        };
        initData();
    }, [currentUser]);

    // Poll chat notifications
    React.useEffect(() => {
        if (!activeRide || showChat) {
            setUnreadMessages(0);
            return;
        }
        const checkMessages = async () => {
            try {
                const res = await trickleListObjects('chat_message', 50, true, undefined);
                if (res && res.items) {
                    const rideMsgs = res.items.filter(m => m.objectData.RideId === activeRide.objectId);
                    if (rideMsgs.length > 0 && rideMsgs[0].objectData.SenderId !== currentUser.id) {
                        setUnreadMessages(1); // Simplification: Just show a dot
                    }
                }
            } catch(e){}
        };
        const interval = setInterval(checkMessages, 4000);
        return () => clearInterval(interval);
    }, [activeRide, showChat, currentUser]);

    React.useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const res = await trickleListObjects('user', 100, true, undefined);
                if (res && res.items) {
                    const onlineDrivers = res.items.filter(u => u.objectData.Role === 'Driver' && u.objectData.Status === 'Online');
                    setAvailableDrivers(onlineDrivers);
                    setNetworkError(false);
                }
            } catch (e) { 
                console.warn("Fetch drivers failed, using fallback data:", e.message); 
                setAvailableDrivers([
                    { objectId: 'mock-drv-1', objectData: { Name: 'John (Fallback)', VehicleType: 'Sedan', Rating: '4.9', Phone: '555-0101' } },
                    { objectId: 'mock-drv-2', objectData: { Name: 'Sarah (Fallback)', VehicleType: 'SUV', Rating: '5.0', Phone: '555-0102' } }
                ]);
                setNetworkError(true);
            }
        };
        fetchDrivers();
        const interval = setInterval(fetchDrivers, 10000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        if (activeRide && activeRide.objectData.DriverId) {
            trickleGetObject('user', activeRide.objectData.DriverId)
                .then(setActiveDriver)
                .catch(e => console.warn("Failed to get driver:", e.message));
        } else {
            setActiveDriver(null);
        }
    }, [activeRide?.objectData?.DriverId]);

    React.useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'auth.html';
        } else {
            setCurrentUser(user);
        }
    }, []);

    const handleSubmitReview = async (rating, feedback, isSkip) => {
        if (completedRideData && completedRideData.driver && !isSkip) {
            try {
                if (feedback && feedback.trim()) {
                    await trickleCreateObject('support_message', {
                        UserId: currentUser.id || currentUser.objectId,
                        SenderId: currentUser.id || currentUser.objectId,
                        Content: `Ride Feedback (${completedRideData.ride.objectId}): ${feedback}`,
                        Timestamp: new Date().toISOString(),
                        IsReadByAdmin: false,
                        IsReadByUser: true
                    });
                }
                const currentDriver = await trickleGetObject('user', completedRideData.driver.objectId);
                const currentRating = currentDriver.objectData.Rating || 5;
                const count = currentDriver.objectData.RatingCount || 1;
                const newRating = ((currentRating * count) + rating) / (count + 1);
                
                await trickleUpdateObject('user', currentDriver.objectId, {
                    Rating: Number(newRating.toFixed(1)),
                    RatingCount: count + 1
                });
                
                await trickleUpdateObject('ride', completedRideData.ride.objectId, { DriverRating: rating });
            } catch(e) { console.warn("Failed to submit review", e.message); }
        }
        setCompletedRideData(null);
    };

    React.useEffect(() => {
        const pollRide = async () => {
            if (!activeRide) return;
            try {
                const ride = await trickleGetObject('ride', activeRide.objectId);
                if (ride.objectData.Status !== activeRide.objectData.Status || ride.objectData.DriverId !== activeRide.objectData.DriverId) {
                    setActiveRide(ride);
                    
                    // Notifications
                    if (ride.objectData.Status === 'accepted') {
                        sendNotification('Ride Accepted!', 'A driver is on their way to pick you up.');
                    } else if (ride.objectData.Status === 'en_route') {
                        sendNotification('En Route', 'You are now en route to your destination.');
                    }

                    if (ride.objectData.Status === 'completed') {
                        sendNotification('Ride Completed', 'You have arrived at your destination.');
                        const skips = parseInt(localStorage.getItem('fineride_rating_skips') || '0', 10);
                        if (skips >= 3) {
                            // Don't show modal if skipped 3 times
                            setActiveRide(null);
                            setStep('search');
                            setDestination('');
                            window.location.href = 'profile.html?tab=history';
                        } else {
                            setCompletedRideData({ ride, driver: activeDriver });
                            setActiveRide(null);
                            setStep('search');
                            setDestination('');
                        }
                    } else if (ride.objectData.Status === 'cancelled') {
                        sendNotification('Ride Cancelled', 'Your ride has been cancelled.');
                        alert(`Ride was cancelled.`);
                        setActiveRide(null);
                        setStep('search');
                        setDestination('');
                    }
                }
            } catch (e) { 
                console.warn("Poll ride failed:", e.message); 
            }
        };

        const interval = setInterval(pollRide, 3000);
        return () => clearInterval(interval);
    }, [activeRide, activeDriver]);

    const handleSearch = (dest) => {
      setDestination(dest);
      setStep('options');
    };
    
    const confirmRide = async (driverId) => {
        try {
            const estimatedFare = '₦' + (Math.floor(Math.random() * 2000) + 1500).toLocaleString();
            const riderId = currentUser.id || currentUser.objectId || 'unknown_rider';
            
            const newRide = await trickleCreateObject('ride', {
                RiderId: riderId,
                DriverId: String(driverId),
                Pickup: 'Current Location',
                Dropoff: destination || 'Unknown Destination',
                Status: 'request',
                Fare: estimatedFare
            });
            
            if (newRide && newRide.objectId) {
                setActiveRide(newRide);
                setStep('booking');
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (e) {
            console.warn("Booking Error details:", e.message);
            alert("Error booking ride: " + (e.message?.includes('Failed to fetch') ? "Network error. Please check your connection." : e.message));
        }
    };

    const handleBack = () => {
      if (step === 'options') setStep('search');
    };

    const handleShareRide = () => {
        const text = `I'm on my way to ${destination} with Fine-ride! Track my ride status here.`;
        if (navigator.share) {
            navigator.share({
                title: 'Track my Fine-ride',
                text: text,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert("Share this link with your friends to track your ride: " + window.location.href);
        }
    };

    return (
      <div className="relative h-screen w-full flex flex-col md:flex-row bg-[var(--bg-color)]" data-name="app" data-file="book-app.js">
        
        {/* Map Background layer (Takes full screen on mobile, right side on desktop) */}
        <div className="absolute inset-0 md:relative md:flex-1 h-full w-full z-0">
          <MapArea destination={destination} availableDrivers={availableDrivers} />
        </div>

        {/* Floating UI Container */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between md:relative md:w-[450px] md:h-full md:bg-white md:shadow-2xl md:pointer-events-auto md:border-r border-[var(--border-color)]">
          
          <div className="pointer-events-auto">
            <Header currentUser={currentUser} />
            {networkError && (
                <div className="bg-red-50 text-red-600 text-xs px-4 py-2 text-center border-b border-red-100">
                    Network error: Unable to connect to the server. Some features may be unavailable.
                </div>
            )}
          </div>

          <div className="flex-1 pointer-events-none md:pointer-events-auto relative">
            {/* Mobile Push-up panel / Desktop Sidebar content */}
            <div className="absolute bottom-0 left-0 right-0 md:relative md:h-full pointer-events-auto panel md:rounded-none md:shadow-none transition-transform duration-300 flex flex-col justify-end md:justify-start">
              {step === 'booking' && activeRide ? (
                  <div className="max-h-[85vh] md:h-full bg-white p-6 flex flex-col items-center justify-start md:justify-center text-center overflow-y-auto pb-24 md:pb-6 w-full">
                      <>
                          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-6 flex-shrink-0"></div>
                          <h2 className="text-2xl font-bold mb-2 text-gray-900 tracking-tight">
                            {activeRide.objectData.Status === 'request' ? 'Ride booked, waiting for driver...' : 
                             activeRide.objectData.Status === 'accepted' ? `${activeDriver?.objectData?.Name || 'Driver'} is on the way!` : 
                             activeRide.objectData.Status === 'payment_pending' ? 'Arrived! Awaiting payment confirmation' : 'En Route to destination'}
                          </h2>
                          <p className="text-gray-500 mb-2 truncate w-full px-4">{destination}</p>
                          
                          {activeRide.objectData.Status !== 'request' && activeRide.objectData.Status !== 'payment_pending' && (
                              <div className="bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-full mb-4 text-sm inline-flex flex-shrink-0 items-center gap-2">
                                  <div className="icon-clock text-blue-600"></div>
                                  {activeRide.objectData.Status === 'accepted' ? 'ETA: 4 mins (1.2 mi away)' : 'ETA: 12 mins to drop-off'}
                              </div>
                          )}
                      </>
                      
                      {activeDriver && activeRide.objectData.Status !== 'payment_pending' && (
                          <div className="bg-gray-50 rounded-xl p-4 w-full mb-1 flex items-center justify-between border border-gray-100 shadow-sm text-left flex-shrink-0">
                              <div className="flex items-center gap-3 overflow-hidden pr-2">
                                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                                      {activeDriver.objectData.Name.charAt(0)}
                                  </div>
                                  <div className="overflow-hidden">
                                      <div className="font-bold text-gray-900 truncate">{activeDriver.objectData.Name}</div>
                                      <div className="text-sm text-gray-500 whitespace-nowrap">{activeDriver.objectData.VehicleType} • {activeDriver.objectData.Rating || '5.0'} ★</div>
                                  </div>
                              </div>
                              <a href={`tel:${activeDriver.objectData.Phone}`} className="w-10 h-10 bg-white rounded-full shadow-md flex flex-shrink-0 items-center justify-center text-blue-600 hover:bg-gray-50 transition-colors">
                                  <div className="icon-phone"></div>
                              </a>
                          </div>
                      )}

                      {activeRide.objectData.Status !== 'request' && activeRide.objectData.Status !== 'payment_pending' && (
                          <div className="w-full flex-shrink-0">
                              <EntertainmentWidget />
                          </div>
                      )}

                      {activeRide.objectData.Status !== 'request' && activeRide.objectData.Status !== 'payment_pending' && (
                          <div className="flex flex-col sm:flex-row gap-3 w-full mb-4 flex-shrink-0">
                              <button onClick={() => setShowChat(true)} className="btn-black flex-1 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all relative px-4 whitespace-nowrap">
                                  <div className="icon-message-square flex-shrink-0"></div> <span>Message</span>
                                  {unreadMessages > 0 && <span className="absolute top-2 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                              </button>
                              <button onClick={handleShareRide} className="btn-light flex-1 flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all px-4 whitespace-nowrap">
                                  <div className="icon-share flex-shrink-0"></div> <span>Share Ride</span>
                              </button>
                          </div>
                      )}
                      
                      {activeRide.objectData.Status === 'request' && (
                          <button onClick={async () => {
                              try {
                                  try { await trickleUpdateObject('ride', activeRide.objectId, { Status: 'cancelled' }); } catch(err) { console.warn('Permission/Network issue cancelling:', err.message); }
                                  setActiveRide(null);
                                  setStep('search');
                              } catch (e) {
                                  console.warn('Failed to cancel ride:', e.message);
                              }
                          }} className="text-red-500 font-medium hover:underline mt-2 flex-shrink-0">
                              Cancel Request
                          </button>
                      )}
                  </div>
              ) : (
                  <BookingPanel 
                    step={step} 
                    onSearch={handleSearch} 
                    onBack={handleBack}
                    destination={destination}
                    onConfirm={confirmRide}
                    rideHistory={rideHistory}
                    availableDrivers={availableDrivers}
                  />
              )}
            </div>
          </div>
          
        </div>
        
        {/* Floating Support Button */}
        {!showChat && !showSupport && (
            <button 
                onClick={() => setShowSupport(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all z-40 md:bottom-10 md:right-10"
            >
                <div className="icon-headphones text-2xl"></div>
            </button>
        )}

        {showChat && activeRide && (
            <ChatWindow 
                rideId={activeRide.objectId} 
                currentUser={currentUser} 
                onClose={() => setShowChat(false)} 
            />
        )}

        {showSupport && currentUser && (
            <SupportChatWindow 
                currentUser={currentUser} 
                onClose={() => setShowSupport(false)} 
            />
        )}

        {completedRideData && (
            <RideCompleteModal 
                ride={completedRideData.ride} 
                driver={completedRideData.driver}
                onClose={() => setCompletedRideData(null)}
                onSubmitReview={handleSubmitReview}
            />
        )}

        {activeRide?.objectData?.Status === 'payment_pending' && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 text-center relative">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <div className="icon-landmark text-3xl"></div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 tracking-tight">Payment Details</h2>
                    <p className="text-gray-500 mb-6">Please transfer the total fare to the account below.</p>
                    
                    <div className="text-4xl font-bold text-black mb-6">
                        {activeRide.objectData.Fare || '₦0'}
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 mb-6 text-left">
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bank Name</div>
                            <div className="font-bold text-gray-900 text-lg">Moniepoint MFB</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Number</div>
                            <div className="flex items-center justify-between">
                                <div className="font-mono text-2xl font-bold tracking-widest text-black">6915829900</div>
                                <button onClick={() => navigator.clipboard.writeText('6915829900')} className="text-blue-600 text-sm font-bold bg-blue-50 px-3 py-1 rounded-lg">Copy</button>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Name</div>
                            <div className="font-bold text-gray-900 text-lg">De-perkins 094 Global Ltd</div>
                        </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 flex items-center justify-center gap-2 bg-gray-100 py-3 rounded-xl">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
                        Waiting for driver/admin to confirm...
                    </div>
                </div>
            </div>
        )}

      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);