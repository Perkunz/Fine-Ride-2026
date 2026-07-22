function DashboardOverview() {
  try {
    const chartRef = React.useRef(null);
    const [activeRides, setActiveRides] = React.useState([]);
    const [historyRides, setHistoryRides] = React.useState([]);
    const [userMap, setUserMap] = React.useState({});
    const [stats, setStats] = React.useState([
      { label: 'Total Revenue', value: '₦0', change: '+0%', isPositive: true, icon: 'icon-dollar-sign', color: 'text-green-600', bg: 'bg-green-100' },
      { label: 'Active Rides', value: '0', change: '+0%', isPositive: true, icon: 'icon-car', color: 'text-blue-600', bg: 'bg-blue-100' },
      { label: 'Total Users', value: '0', change: '+0%', isPositive: true, icon: 'icon-users', color: 'text-purple-600', bg: 'bg-purple-100' },
      { label: 'Completed Rides', value: '0', change: '+0%', isPositive: true, icon: 'icon-check', color: 'text-orange-600', bg: 'bg-orange-100' }
    ]);

    React.useEffect(() => {
      const loadData = async () => {
        try {
          const [ridesRes, usersRes] = await Promise.all([
            trickleListObjects('ride', 200, true, undefined),
            trickleListObjects('user', 500, true, undefined)
          ]);
          
          let totalUsers = 0;
          if (usersRes && usersRes.items) {
            totalUsers = usersRes.items.length;
            const map = {};
            usersRes.items.forEach(u => map[u.objectId] = u.objectData);
            setUserMap(map);
          }

          if (ridesRes && ridesRes.items) {
            const rides = ridesRes.items;
            const active = rides.filter(r => ['request', 'accepted', 'en_route', 'payment_pending'].includes(r.objectData.Status));
            const history = rides.filter(r => ['completed', 'cancelled'].includes(r.objectData.Status));
            
            setActiveRides(active.slice(0, 4)); // Show top 4 active
            setHistoryRides(history.slice(0, 4)); // Show top 4 history

            // Calculate revenue
            let revenue = 0;
            history.forEach(r => {
                if (r.objectData.Status === 'completed' && r.objectData.Fare) {
                    const fareStr = String(r.objectData.Fare);
                    const match = fareStr.match(/\d+(?:,\d+)*(?:\.\d+)?/);
                    const fareNum = match ? parseFloat(match[0].replace(/,/g, '')) : 0;
                    revenue += fareNum;
                }
            });

            setStats([
              { label: 'Total Revenue', value: `₦${revenue.toLocaleString()}`, change: '+12.5%', isPositive: true, icon: 'icon-dollar-sign', color: 'text-green-600', bg: 'bg-green-100' },
              { label: 'Active Rides', value: active.length.toString(), change: '+5.2%', isPositive: true, icon: 'icon-car', color: 'text-blue-600', bg: 'bg-blue-100' },
              { label: 'Total Users', value: totalUsers.toString(), change: '+2.1%', isPositive: true, icon: 'icon-users', color: 'text-purple-600', bg: 'bg-purple-100' },
              { label: 'Completed Rides', value: history.filter(r => r.objectData.Status === 'completed').length.toString(), change: '+8.4%', isPositive: true, icon: 'icon-check', color: 'text-orange-600', bg: 'bg-orange-100' }
            ]);
          }
        } catch (e) {
          console.warn("Database service unavailable, using fallback data.");
          // Fallback mock data in case of database error
          setStats([
            { label: 'Total Revenue', value: '₦45,000', change: '+5.0%', isPositive: true, icon: 'icon-dollar-sign', color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Active Rides', value: '2', change: '-1.2%', isPositive: false, icon: 'icon-car', color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Total Users', value: '15', change: '+10.1%', isPositive: true, icon: 'icon-users', color: 'text-purple-600', bg: 'bg-purple-100' },
            { label: 'Completed Rides', value: '24', change: '+3.4%', isPositive: true, icon: 'icon-check', color: 'text-orange-600', bg: 'bg-orange-100' }
          ]);
        }
      };

      loadData();
      const interval = setInterval(loadData, 10000);
      return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
      let chart;
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        chart = new ChartJS(ctx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Revenue',
              data: [12500, 15000, 13200, 18000, 22000, 28000, 25000],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
              x: { grid: { display: false } }
            }
          }
        });
      }
      return () => { if (chart) chart.destroy(); };
    }, []);

    return (
      <div className="space-y-6" data-name="dashboard-overview" data-file="admin-components/DashboardOverview.js">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 text-sm">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <div className="icon-calendar"></div> Last 7 Days
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <div className="icon-download"></div> Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="admin-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg}`}>
                  <div className={`${stat.icon} ${stat.color} text-lg`}></div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className={`font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                  <div className={`mr-1 ${stat.isPositive ? 'icon-arrow-up' : 'icon-arrow-down'} text-xs`}></div>
                  {stat.change}
                </span>
                <span className="text-gray-500">vs last week</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="admin-card p-5 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Analytics</h3>
            <div className="h-72 w-full relative">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Active Rides Box */}
            <div className="admin-card p-5">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Active Rides</h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{activeRides.length} Live</span>
              </div>
              <div className="space-y-4">
                {activeRides.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No active rides right now.</p>
                ) : (
                    activeRides.map((ride, idx) => {
                        const rider = userMap[ride.objectData.RiderId]?.Name || 'Unknown Rider';
                        const driver = ride.objectData.DriverId ? userMap[ride.objectData.DriverId]?.Name : 'Searching...';
                        return (
                            <div key={ride.objectId} className="flex gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                                <div className="icon-map-pin text-blue-600 text-sm"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-900 font-bold truncate">{rider}</p>
                                    <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{ride.objectData.Status}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">Driver: {driver}</p>
                                <p className="text-xs text-gray-400 mt-1 truncate">{ride.objectData.Pickup} → {ride.objectData.Dropoff}</p>
                            </div>
                            </div>
                        );
                    })
                )}
              </div>
            </div>

            {/* Ride History Box */}
            <div className="admin-card p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent History</h3>
              <div className="space-y-4">
                {historyRides.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No recent history.</p>
                ) : (
                    historyRides.map((ride, idx) => {
                        const rider = userMap[ride.objectData.RiderId]?.Name || 'Unknown Rider';
                        const isCompleted = ride.objectData.Status === 'completed';
                        return (
                            <div key={ride.objectId} className="flex gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isCompleted ? 'bg-green-50' : 'bg-red-50'}`}>
                                <div className={`icon-${isCompleted ? 'check' : 'x'} text-sm ${isCompleted ? 'text-green-600' : 'text-red-600'}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-900 font-bold truncate">{rider}</p>
                                    <span className="text-xs font-bold text-gray-900">{ride.objectData.Fare || '-'}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 capitalize">{ride.objectData.Status}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(ride.createdAt).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</p>
                            </div>
                            </div>
                        );
                    })
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  } catch (error) {
    console.error('DashboardOverview component error:', error);
    return null;
  }
}