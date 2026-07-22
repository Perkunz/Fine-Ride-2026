function RideHistory({ currentUser }) {
  try {
    const [rides, setRides] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const fetchRides = async () => {
        try {
          const res = await trickleListObjects('ride', 100, true, undefined);
          const userRides = res.items.filter(r => 
            r.objectData.RiderId === currentUser.id || r.objectData.DriverId === currentUser.id
          );
          setRides(userRides);
        } catch (error) {
          console.warn('Failed to fetch rides:', error.message);
        } finally {
          setLoading(false);
        }
      };

      if (currentUser) {
        fetchRides();
      }
    }, [currentUser]);

    const formatDate = (isoString) => {
      if (!isoString) return 'Unknown Date';
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
             ' • ' + 
             date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    if (loading) {
      return <div className="py-8 text-center text-gray-500"><div className="icon-loader animate-spin text-2xl mx-auto mb-2"></div>Loading rides...</div>;
    }

    if (rides.length === 0) {
      return (
        <div className="py-12 text-center bg-white rounded-xl border border-gray-200">
          <div className="icon-car text-4xl text-gray-300 mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No rides yet</h3>
          <p className="text-gray-500">Your ride history will appear here once you take your first trip.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4" data-name="ride-history" data-file="profile-components/RideHistory.js">
        <h2 className="text-xl font-bold mb-4">Past Rides</h2>
        {rides.map(ride => (
          <div key={ride.objectId} className="bg-white p-4 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="icon-car text-gray-700"></div>
                </div>
                <div>
                  <div className="font-bold text-lg">{ride.objectData.Fare || 'Est. $12.00'}</div>
                  <div className="text-sm text-gray-500">{formatDate(ride.createdAt)}</div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                ride.objectData.Status === 'completed' ? 'bg-green-100 text-green-700' :
                ride.objectData.Status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {ride.objectData.Status.toUpperCase()}
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <div className="text-sm text-gray-700 font-medium truncate max-w-[200px] md:max-w-[300px]">
                {ride.objectData.Pickup} → {ride.objectData.Dropoff}
              </div>
              <div className="text-xs text-gray-500">
                {currentUser.Role === 'Driver' ? 'Rider ID: ' + (ride.objectData.RiderId || 'N/A').substring(0,6) : 'Driver ID: ' + (ride.objectData.DriverId || 'Searching...').substring(0,6)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('RideHistory error:', error);
    return <div className="text-red-500">Error loading ride history.</div>;
  }
}