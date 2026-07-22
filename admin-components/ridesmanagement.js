function RidesManagement() {
  try {
    const [rides, setRides] = React.useState([]);
    const [userMap, setUserMap] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [statusFilter, setStatusFilter] = React.useState('All Statuses');

    const fetchData = async () => {
        setError(null);
        try {
            const [ridesRes, usersRes] = await Promise.all([
                trickleListObjects('ride', 200, true, undefined),
                trickleListObjects('user', 500, true, undefined)
            ]);
            
            if (usersRes && usersRes.items) {
                const map = {};
                usersRes.items.forEach(u => map[u.objectId] = u.objectData);
                setUserMap(map);
            }

            if (ridesRes && ridesRes.items) {
                setRides(ridesRes.items);
            }
        } catch (err) {
            console.warn("Failed to fetch rides data. Service might be down.");
            const isJsonError = err.message && err.message.includes('not valid JSON');
            const isFetchError = err.message && err.message.includes('Failed to fetch');
            if (loading) setError(isJsonError ? "Database service is currently unavailable." : isFetchError ? "Network error: Unable to reach the server." : "Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Live updates
        return () => clearInterval(interval);
    }, []);

    const getStatusBadge = (status) => {
      switch(status) {
        case 'completed': return <span className="badge badge-success">Completed</span>;
        case 'en_route': 
        case 'accepted': return <span className="badge badge-blue">In Progress</span>;
        case 'request': return <span className="badge badge-warning">Searching</span>;
        case 'cancelled': return <span className="badge bg-red-100 text-red-700">Cancelled</span>;
        default: return <span className="badge bg-gray-100">{status}</span>;
      }
    };

    const filteredRides = rides.filter(ride => {
        if (statusFilter === 'All Statuses') return true;
        const s = ride.objectData.Status;
        if (statusFilter === 'In Progress') return s === 'accepted' || s === 'en_route';
        if (statusFilter === 'Completed') return s === 'completed';
        if (statusFilter === 'Searching') return s === 'request';
        if (statusFilter === 'Cancelled') return s === 'cancelled';
        return true;
    });

    const activeRidesCount = rides.filter(r => ['request', 'accepted', 'en_route'].includes(r.objectData.Status)).length;

    const handleClearRides = async () => {
        if(window.confirm("Are you sure you want to delete ALL ride records? This action cannot be undone.")) {
            setLoading(true);
            try {
                for (const ride of rides) {
                    try { await trickleDeleteObject('ride', ride.objectId); } catch(e){}
                }
                setRides([]);
                alert("All ride records cleared successfully.");
            } catch(e) {
                alert("Failed to clear rides: " + e.message);
            }
            setLoading(false);
        }
    };

    return (
      <div className="space-y-6" data-name="rides-management" data-file="admin-components/RidesManagement.js">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Ride Management</h1>
            <div className="flex gap-2">
                <button onClick={handleClearRides} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center gap-2">
                  <div className="icon-trash"></div> Clear All Rides
                </button>
                <button onClick={fetchData} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <div className="icon-refresh-cw"></div> Sync
                </button>
            </div>
        </div>
        
        {/* Map Placeholder for active tracking */}
        <div className="admin-card overflow-hidden h-48 relative flex items-center justify-center bg-[#e5e3df]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="z-10 bg-white/90 backdrop-blur px-6 py-4 rounded-xl shadow-lg text-center">
            <div className="icon-map text-3xl text-blue-600 mb-2 mx-auto"></div>
            <h3 className="font-bold text-gray-900">Live Tracker</h3>
            <p className="text-sm text-gray-500 mt-1">{activeRidesCount} active rides currently on the map</p>
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] flex gap-4 bg-gray-50">
            <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none focus:border-blue-500"
            >
              <option>All Statuses</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Searching</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
                <div className="flex items-center justify-center h-48 text-gray-500">
                    <div className="icon-loader animate-spin text-2xl mr-2"></div> Loading rides...
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-48 text-red-500">
                    <div className="icon-wifi-off text-3xl mb-2"></div>
                    <p>Network Error: {error}</p>
                    <button onClick={fetchData} className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">Try Again</button>
                </div>
            ) : filteredRides.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-500">
                    No rides found for the selected status.
                </div>
            ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Ride ID & Time</th>
                      <th className="px-6 py-4 font-semibold">Route</th>
                      <th className="px-6 py-4 font-semibold">Rider & Driver</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Fare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredRides.map((ride) => {
                      const rider = userMap[ride.objectData.RiderId] || { Name: 'Unknown Rider' };
                      const driver = ride.objectData.DriverId ? (userMap[ride.objectData.DriverId] || { Name: 'Unknown Driver' }) : { Name: 'Unassigned' };
                      
                      return (
                          <tr key={ride.objectId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-blue-600 text-sm">
                              {ride.objectId.substring(0,8).toUpperCase()}
                              <div className="text-xs text-gray-500 font-normal mt-1">{new Date(ride.createdAt).toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                <span className="text-gray-900 truncate max-w-[150px]" title={ride.objectData.Pickup}>{ride.objectData.Pickup}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 bg-red-500 flex-shrink-0"></div>
                                <span className="text-gray-900 truncate max-w-[150px]" title={ride.objectData.Dropoff}>{ride.objectData.Dropoff}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-bold text-gray-900 flex items-center gap-1"><div className="icon-user text-xs text-gray-400"></div> {rider.Name}</div>
                              <div className="text-sm text-gray-500 mt-1 flex items-center gap-1"><div className="icon-car text-xs text-gray-400"></div> {driver.Name}</div>
                            </td>
                            <td className="px-6 py-4">{getStatusBadge(ride.objectData.Status)}</td>
                            <td className="px-6 py-4 font-bold text-gray-900">{ride.objectData.Fare || '-'}</td>
                          </tr>
                      );
                    })}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('RidesManagement component error:', error);
    return null;
  }
}