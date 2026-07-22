function DriverEarnings({ currentUser, stats }) {
  try {
    const [feedbacks, setFeedbacks] = React.useState([]);

    React.useEffect(() => {
        const fetchFeedback = async () => {
            if (!currentUser) return;
            try {
                // Fetch support messages related to this driver's rides
                const [ridesRes, msgsRes] = await Promise.all([
                    trickleListObjects('ride', 100, true, undefined),
                    trickleListObjects('support_message', 100, true, undefined)
                ]);
                
                if (ridesRes && msgsRes) {
                    const myRideIds = ridesRes.items
                        .filter(r => r.objectData.DriverId === currentUser.id || r.objectData.DriverId === currentUser.objectId)
                        .map(r => r.objectId);
                        
                    const myFeedbacks = msgsRes.items.filter(m => {
                        const content = m.objectData.Content || '';
                        return content.startsWith('Ride Feedback (') && myRideIds.some(id => content.includes(id));
                    });
                    
                    setFeedbacks(myFeedbacks);
                }
            } catch(e) {
                console.warn("Failed to fetch feedback", e.message);
            }
        };
        fetchFeedback();
    }, [currentUser]);

    return (
      <div className="h-full bg-[var(--bg-color)] overflow-y-auto pb-24 pt-20 px-4" data-name="driver-earnings">
        <h2 className="text-2xl font-bold mb-6">Earnings & Feedback</h2>
        
        <div className="bg-[var(--secondary-color)] rounded-2xl p-6 shadow-sm mb-6 border border-[var(--border-color)]">
            <div className="text-center">
                <p className="text-gray-500 font-medium mb-1">Today's Earnings</p>
                <h3 className="text-4xl font-bold text-[var(--accent-color)]">₦{(stats?.daily || 0).toLocaleString()}</h3>
                <p className="text-sm text-gray-400 mt-2">{stats?.trips || 0} Trips</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[var(--border-color)]">
                <div className="text-center">
                    <p className="text-gray-500 text-sm mb-1">This Week</p>
                    <p className="text-xl font-bold">₦{(stats?.weekly || 0).toLocaleString()}</p>
                </div>
                <div className="text-center border-l border-[var(--border-color)]">
                    <p className="text-gray-500 text-sm mb-1">This Month</p>
                    <p className="text-xl font-bold">₦{(stats?.monthly || 0).toLocaleString()}</p>
                </div>
            </div>
        </div>

        <div className="bg-[var(--secondary-color)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Your Rating</h3>
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                    <div className="icon-star text-yellow-500 fill-yellow-500"></div>
                    <span className="font-bold text-yellow-700">{currentUser?.Rating || '5.0'}</span>
                </div>
            </div>
            
            <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Recent Feedback</h4>
                
                {feedbacks.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm border border-gray-100 rounded-xl bg-gray-50">
                        No recent feedback received yet.
                    </div>
                ) : (
                    feedbacks.map((f, i) => {
                        const content = f.objectData.Content.replace(/Ride Feedback \([^)]+\):\s*/, '');
                        return (
                            <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="flex items-center gap-1 mb-2 text-yellow-500 text-sm">
                                    <div className="icon-star fill-yellow-500"></div>
                                    <div className="icon-star fill-yellow-500"></div>
                                    <div className="icon-star fill-yellow-500"></div>
                                    <div className="icon-star fill-yellow-500"></div>
                                    <div className="icon-star fill-yellow-500"></div>
                                </div>
                                <p className="text-sm text-gray-700">"{content}"</p>
                                <p className="text-xs text-gray-400 mt-2">- Rider</p>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DriverEarnings component error:', error);
    return null;
  }
}