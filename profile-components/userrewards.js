function UserRewards({ currentUser }) {
  try {
    const [points, setPoints] = React.useState(0);

    React.useEffect(() => {
        const fetchPoints = async () => {
            try {
                const res = await trickleListObjects('ride', 100, true, undefined);
                const myRides = res.items.filter(r => r.objectData.RiderId === currentUser.id && r.objectData.Status === 'completed');
                let totalMins = 0;
                myRides.forEach(r => {
                    if (r.objectData.StartTime && r.objectData.EndTime) {
                        const start = new Date(r.objectData.StartTime);
                        const end = new Date(r.objectData.EndTime);
                        totalMins += Math.max(1, Math.ceil((end - start)/60000));
                    }
                });
                setPoints(totalMins);
            } catch (err) {
                console.warn('Failed to calculate points:', err.message);
            }
        };
        if (currentUser) fetchPoints();
    }, [currentUser]);

    const badges = [
      { id: 1, name: 'Early Bird', desc: 'Took 5 rides before 7 AM', icon: 'icon-sun', color: 'text-orange-500', bg: 'bg-orange-100' },
      { id: 2, name: 'Night Owl', desc: 'Took 10 rides after midnight', icon: 'icon-moon', color: 'text-indigo-500', bg: 'bg-indigo-100' },
      { id: 3, name: '5-Star Rider', desc: 'Maintained 5.0 rating for 20 rides', icon: 'icon-star', color: 'text-yellow-500', bg: 'bg-yellow-100' }
    ];

    const progressPercentage = Math.min(100, (points % 500) / 500 * 100);
    const redemptionsAvailable = Math.floor(points / 500);

    return (
      <div className="space-y-6 animate-fade-in" data-name="user-rewards" data-file="profile-components/UserRewards.js">
        <h2 className="text-xl font-bold mb-4">Rewards & Gamification</h2>
        
        {/* Tier Status */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-blue-400 opacity-30">
            <div className="icon-award text-9xl"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="icon-award text-2xl"></div>
                <h3 className="font-bold text-xl tracking-wide">Fine-ride Member</h3>
              </div>
              {redemptionsAvailable > 0 && (
                <span className="bg-white text-blue-700 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  {redemptionsAvailable} Reward{redemptionsAvailable > 1 ? 's' : ''} Available
                </span>
              )}
            </div>
            <p className="text-blue-100 mb-6">{points} Points <span className="text-xs opacity-80">(1 point per minute of riding)</span></p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Current Progress</span>
                <span>500 pts = Free Ride</span>
              </div>
              <div className="w-full bg-blue-900/50 rounded-full h-2.5">
                <div className="bg-white h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p className="text-xs text-blue-100 mt-2">Earn {500 - (points % 500)} more points to unlock a free ride redemption!</p>
            </div>
          </div>
        </div>

        {/* Active Perks */}
        <h3 className="font-bold text-lg mt-8 mb-4">Your Active Perks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[var(--border-color)] flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="icon-ticket text-xl"></div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">10% Off Next 3 Rides</h4>
              <p className="text-sm text-gray-500 mt-1">Valid until end of the month. Applies automatically.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[var(--border-color)] flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="icon-users text-xl"></div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Referral Bonus Active</h4>
              <p className="text-sm text-gray-500 mt-1">You and your friend get $15 when they take their first ride.</p>
              <button className="text-sm text-blue-600 font-bold mt-2 hover:underline">Share Link</button>
            </div>
          </div>
        </div>

        {/* Badges */}
        <h3 className="font-bold text-lg mt-8 mb-4">Earned Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {badges.map(badge => (
            <div key={badge.id} className="bg-white p-4 rounded-xl border border-[var(--border-color)] flex flex-col items-center text-center shadow-sm">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${badge.bg} ${badge.color}`}>
                <div className={`${badge.icon} text-2xl`}></div>
              </div>
              <h4 className="font-bold text-gray-900">{badge.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('UserRewards error:', error);
    return null;
  }
}