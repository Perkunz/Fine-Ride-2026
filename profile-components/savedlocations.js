function SavedLocations() {
  try {
    const locations = [
      { id: 'home', name: 'Home', address: '123 Main St, Apt 4B', icon: 'icon-house', color: 'text-blue-500', bg: 'bg-blue-100' },
      { id: 'work', name: 'Work', address: '800 Tech Plaza, Suite 100', icon: 'icon-briefcase', color: 'text-orange-500', bg: 'bg-orange-100' },
      { id: 'gym', name: 'Gym', address: 'FitZone, 450 Fitness Blvd', icon: 'icon-map-pin', color: 'text-gray-600', bg: 'bg-gray-100' }
    ];

    return (
      <div className="space-y-6 animate-fade-in" data-name="saved-locations" data-file="profile-components/SavedLocations.js">
        <div>
            <h2 className="text-xl font-bold mb-1">Saved Locations</h2>
            <p className="text-sm text-gray-500 mb-6">Manage your frequently visited places for quicker booking.</p>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
            {locations.map((loc, idx) => (
                <div key={loc.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer ${idx !== locations.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${loc.bg}`}>
                            <div className={`${loc.icon} ${loc.color}`}></div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">{loc.name}</h4>
                            <p className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-[300px]">{loc.address}</p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                        <div className="icon-trash"></div>
                    </button>
                </div>
            ))}
        </div>

        <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-blue-600 font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <div className="icon-plus"></div> Add New Location
        </button>
      </div>
    );
  } catch (error) {
    console.error('SavedLocations error:', error);
    return null;
  }
}