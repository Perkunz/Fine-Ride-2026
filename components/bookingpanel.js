function BookingPanel({ step, onSearch, onBack, destination, onConfirm, rideHistory = [], availableDrivers = [] }) {
  try {
    const [searchInput, setSearchInput] = React.useState('');
    const [stopInput, setStopInput] = React.useState('');
    const [showStop, setShowStop] = React.useState(false);
    const [selectedDriverId, setSelectedDriverId] = React.useState(null);
    const [specialRequests, setSpecialRequests] = React.useState('');
    const [scheduleTime, setScheduleTime] = React.useState('');
    const [showSchedule, setShowSchedule] = React.useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (searchInput.trim()) {
        const finalDest = showStop && stopInput.trim() ? `${stopInput} then ${searchInput}` : searchInput;
        onSearch(finalDest);
      }
    };

    if (step === 'options') {
      if (selectedDriverId) {
        const driver = availableDrivers.find(d => d.objectId === selectedDriverId) || availableDrivers[0];
        return (
          <div className="h-[80vh] md:h-full flex flex-col bg-white" data-name="booking-options-review" data-file="components/BookingPanel.js">
            <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-4">
              <button onClick={() => setSelectedDriverId(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <div className="icon-arrow-left text-xl"></div>
              </button>
              <div className="flex-1">
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Review & Book</div>
                <div className="font-semibold text-lg truncate text-gray-900">{destination}</div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Selected Driver Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4 shadow-sm mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden shadow-inner">
                      {driver?.objectData?.Avatar ? (
                          <img src={driver.objectData.Avatar} className="w-full h-full object-cover" />
                      ) : (
                          (driver?.objectData?.Name || 'D').charAt(0).toUpperCase()
                      )}
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 text-lg">{driver?.objectData?.Name || 'Driver'}</h4>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{driver?.objectData?.VehicleType || 'Sedan'}</span>
                          <span>•</span>
                          <span className="flex items-center font-bold text-gray-900">
                              <div className="icon-star text-xs text-yellow-500 mr-1 fill-yellow-500"></div> 
                              {driver?.objectData?.Rating || '5.0'}
                          </span>
                      </div>
                  </div>
              </div>

              <button 
                onClick={() => onConfirm(selectedDriverId)} 
                className="btn-black w-full text-lg shadow-lg py-4 mb-4"
              >
                Book Ride
              </button>
              
              <div className="text-xs text-gray-500 text-center px-4">
                 Fare will be calculated at the end of the ride based on total time and distance.
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="h-[80vh] md:h-full flex flex-col bg-white" data-name="booking-options" data-file="components/BookingPanel.js">
          <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <div className="icon-arrow-left text-xl"></div>
            </button>
            <div className="flex-1">
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Dropoff</div>
              <div className="font-semibold text-lg truncate text-gray-900">{destination}</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Surge Pricing Alert */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-3">
              <div className="icon-triangle-alert text-orange-500 mt-0.5"></div>
              <div>
                <div className="text-sm font-bold text-orange-900">High Demand</div>
                <div className="text-xs text-orange-700 mt-0.5">Fares are slightly higher than usual due to increased demand in your area.</div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <div className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <div className="icon-briefcase text-gray-500"></div> Special Requests / Luggage
              </div>
              <input 
                type="text" 
                placeholder="e.g., 2 large bags, need trunk space..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>

            {/* Schedule Ride */}
            <div>
               <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <div className="icon-calendar text-gray-500"></div> Schedule Ride
                  </div>
                  <button onClick={() => setShowSchedule(!showSchedule)} className="text-xs text-blue-600 font-bold hover:underline">
                    {showSchedule ? 'Cancel' : 'Set Time'}
                  </button>
               </div>
               {showSchedule && (
                  <input 
                    type="datetime-local" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
               )}
            </div>

            <h3 className="font-bold text-gray-900 mb-2 mt-4 border-t border-gray-100 pt-4">Available Drivers</h3>
            {availableDrivers.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <div className="icon-car text-3xl mb-2 mx-auto opacity-50"></div>
                <p>No drivers available right now. Please try again later.</p>
              </div>
            ) : (
              availableDrivers.map((driver) => (
                <div 
                  key={driver.objectId}
                  onClick={() => setSelectedDriverId(driver.objectId)}
                  className={`flex items-center justify-between p-4 rounded-3xl cursor-pointer transition-all border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0 overflow-hidden shadow-inner">
                      {driver.objectData.Avatar ? (
                          <img src={driver.objectData.Avatar} className="w-full h-full object-cover" />
                      ) : (
                          (driver.objectData.Name || 'D').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{driver.objectData.Name || 'Driver'}</h4>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                        <span>{driver.objectData.VehicleType || 'Sedan'}</span>
                        <span>•</span>
                        <span className="flex items-center font-bold text-gray-900 bg-yellow-50 px-1.5 py-0.5 rounded">
                          <div className="icon-star text-xs text-yellow-500 mr-1 fill-yellow-500"></div> 
                          {driver.objectData.Rating || '5.0'} 
                          <span className="text-gray-400 font-normal ml-1">({driver.objectData.RatingCount || 0})</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="icon-chevron-right text-gray-400"></div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="h-[70vh] md:h-full p-5 md:p-6 flex flex-col bg-white" data-name="booking-search" data-file="components/BookingPanel.js">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6 md:hidden cursor-pointer hover:bg-gray-400 transition-colors"></div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-6">Where to?</h2>
        
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          {showStop && (
            <div className="relative flex items-center gap-2">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              </div>
              <input 
                type="text" 
                placeholder="Add a stop" 
                className="input-field pl-12 text-base py-3 bg-gray-100 flex-1"
                value={stopInput}
                onChange={(e) => setStopInput(e.target.value)}
              />
              <button type="button" onClick={() => { setShowStop(false); setStopInput(''); }} className="p-3 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                <div className="icon-x"></div>
              </button>
            </div>
          )}
          
          <div className="relative flex items-center gap-2">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 rounded-sm bg-black"></div>
            </div>
            <input 
              type="text" 
              placeholder={showStop ? "Final destination" : "Input Destination"} 
              className="input-field pl-12 text-lg py-4 bg-gray-100 flex-1"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {!showStop && (
              <button type="button" onClick={() => setShowStop(true)} className="p-3 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors" title="Add a stop">
                <div className="icon-plus"></div>
              </button>
            )}
          </div>
          <button type="submit" className="hidden">Search</button>
        </form>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex-shrink-0 bg-[#1f1f1f] rounded-full p-2 pr-5 flex items-center gap-3 hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]">
            <div className="bg-[#2a2a2a] p-2 rounded-full shadow-sm">
              <div className="icon-house text-white"></div>
            </div>
            <span className="font-bold">Home</span>
          </button>
          <button className="flex-shrink-0 bg-[#1f1f1f] rounded-full p-2 pr-5 flex items-center gap-3 hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]">
            <div className="bg-[#2a2a2a] p-2 rounded-full shadow-sm">
              <div className="icon-briefcase text-white"></div>
            </div>
            <span className="font-bold">Work</span>
          </button>
        </div>

        <div className="mt-2 flex-1 overflow-y-auto">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Ride History</h3>
          {rideHistory.length === 0 ? (
            <p className="text-sm text-gray-500">No past rides yet.</p>
          ) : (
            <ul className="space-y-4">
              {rideHistory.slice(0, 4).map((ride, i) => (
                <li key={i} className="flex items-center gap-4 p-2 -mx-2 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <div className="icon-car text-gray-500"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm truncate">{ride.objectData.Pickup} → {ride.objectData.Dropoff}</div>
                    <div className="text-xs text-gray-500 flex justify-between mt-1">
                      <span className="uppercase font-semibold text-blue-600">{ride.objectData.Status}</span>
                      <span className="font-bold text-black">{ride.objectData.Fare}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('BookingPanel component error:', error);
    return null;
  }
}