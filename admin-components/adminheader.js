function AdminHeader({ toggleSidebar, setCurrentView }) {
  try {
    const [showNotif, setShowNotif] = React.useState(false);
    const [showMsg, setShowMsg] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState({ users: [], rides: [] });
    const [isSearching, setIsSearching] = React.useState(false);

    const [notifications, setNotifications] = React.useState([]);
    const [messages, setMessages] = React.useState([]);

    const searchRef = React.useRef(null);

    // Handle clicking outside to close dropdowns
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Polling for Notifications and Messages
    React.useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const [ridesRes, msgsRes, usersRes] = await Promise.all([
                    trickleListObjects('ride', 100, true, undefined),
                    trickleListObjects('support_message', 100, true, undefined),
                    trickleListObjects('user', 200, true, undefined)
                ]);

                const userMap = {};
                if (usersRes && usersRes.items) {
                    usersRes.items.forEach(u => userMap[u.objectId] = u.objectData);
                }

                // Process Notifications (Rides requiring attention)
                if (ridesRes && ridesRes.items) {
                    const notifs = [];
                    ridesRes.items.forEach(r => {
                        if (r.objectData.Status === 'payment_pending') {
                            notifs.push({
                                id: r.objectId,
                                title: 'Payment Confirmation Required',
                                desc: `Ride fare ₦${r.objectData.Fare || 'Unknown'} awaits confirmation.`,
                                time: new Date(r.objectData.EndTime || r.createdAt).getTime(),
                                type: 'payment',
                                action: () => { setCurrentView('payments'); setShowNotif(false); }
                            });
                        } else if (r.objectData.Status === 'request') {
                            notifs.push({
                                id: r.objectId,
                                title: 'New Ride Request',
                                desc: `Pickup at ${r.objectData.Pickup}`,
                                time: new Date(r.createdAt).getTime(),
                                type: 'ride',
                                action: () => { setCurrentView('rides'); setShowNotif(false); }
                            });
                        }
                    });
                    setNotifications(notifs.sort((a,b) => b.time - a.time));
                }

                // Process Messages (Unread support tickets)
                if (msgsRes && msgsRes.items) {
                    const unread = msgsRes.items.filter(m => !m.objectData.IsReadByAdmin);
                    const msgAlerts = unread.map(m => {
                        const sender = userMap[m.objectData.UserId] || { Name: 'Unknown User' };
                        return {
                            id: m.objectId,
                            userId: m.objectData.UserId,
                            senderName: sender.Name,
                            content: m.objectData.Content,
                            time: new Date(m.objectData.Timestamp).getTime()
                        };
                    });
                    setMessages(msgAlerts.sort((a,b) => b.time - a.time));
                }

            } catch (error) {
                console.warn("Failed to fetch header alerts:", error.message);
            }
        };

        fetchAlerts();
        const interval = setInterval(fetchAlerts, 10000);
        return () => clearInterval(interval);
    }, [setCurrentView]);

    // Handle Global Search
    React.useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults({ users: [], rides: [] });
            setShowSearch(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            setShowSearch(true);
            try {
                const [usersRes, ridesRes] = await Promise.all([
                    trickleListObjects('user', 100, true, undefined),
                    trickleListObjects('ride', 100, true, undefined)
                ]);

                const q = searchQuery.toLowerCase();
                const matchedUsers = (usersRes?.items || []).filter(u => 
                    (u.objectData.Name || '').toLowerCase().includes(q) || 
                    (u.objectData.Email || '').toLowerCase().includes(q) ||
                    (u.objectData.Phone || '').toLowerCase().includes(q)
                ).slice(0, 5);

                const matchedRides = (ridesRes?.items || []).filter(r => 
                    r.objectId.toLowerCase().includes(q) ||
                    (r.objectData.Pickup || '').toLowerCase().includes(q) ||
                    (r.objectData.Dropoff || '').toLowerCase().includes(q)
                ).slice(0, 5);

                setSearchResults({ users: matchedUsers, rides: matchedRides });
            } catch (error) {
                console.warn("Search failed:", error.message);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const formatTimeAgo = (timestamp) => {
        const diff = Math.floor((new Date().getTime() - timestamp) / 60000);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        const hours = Math.floor(diff / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
      <header className="h-16 bg-[var(--secondary-color)] border-b border-[var(--border-color)] flex items-center justify-between px-4 md:px-8 shrink-0 relative z-40" data-name="admin-header" data-file="admin-components/AdminHeader.js">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <div className="icon-menu text-xl"></div>
          </button>
          
          <div className="hidden md:block relative w-full max-w-md" ref={searchRef}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <div className="icon-search text-sm"></div>
            </div>
            <input 
              type="text" 
              placeholder="Search users, drivers, rides..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if(searchQuery) setShowSearch(true); }}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
            />
            
            {/* Search Results Dropdown */}
            {showSearch && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {isSearching ? (
                        <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                            <div className="icon-loader animate-spin"></div> Searching...
                        </div>
                    ) : searchResults.users.length === 0 && searchResults.rides.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No results found for "{searchQuery}"</div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto">
                            {searchResults.users.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">Users & Drivers</div>
                                    {searchResults.users.map(u => (
                                        <div key={u.objectId} onClick={() => { setCurrentView('users'); setShowSearch(false); setSearchQuery(''); }} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                {u.objectData.Avatar ? <img src={u.objectData.Avatar} className="w-full h-full object-cover rounded-full"/> : (u.objectData.Name || 'U').charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-sm text-gray-900 truncate">{u.objectData.Name} <span className="text-xs font-normal text-gray-500 ml-1">({u.objectData.Role})</span></div>
                                                <div className="text-xs text-gray-500 truncate">{u.objectData.Email}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {searchResults.rides.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">Rides</div>
                                    {searchResults.rides.map(r => (
                                        <div key={r.objectId} onClick={() => { setCurrentView('rides'); setShowSearch(false); setSearchQuery(''); }} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                                                <div className="icon-map-pin text-sm"></div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-sm text-gray-900 truncate">{r.objectId.substring(0,8).toUpperCase()} <span className="text-xs font-normal text-gray-500 ml-1">({r.objectData.Status})</span></div>
                                                <div className="text-xs text-gray-500 truncate">{r.objectData.Pickup} → {r.objectData.Dropoff}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5 relative">
          
          {/* Notifications */}
          <div className="relative">
              <button 
                onClick={() => { setShowNotif(!showNotif); setShowMsg(false); }}
                className={`relative p-2 rounded-full transition-colors ${showNotif ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <div className="icon-bell text-xl"></div>
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              {showNotif && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                          <h3 className="font-bold text-gray-900">Notifications</h3>
                          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{notifications.length} New</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                              <div className="p-6 text-center text-gray-500 text-sm">All caught up! No new notifications.</div>
                          ) : (
                              notifications.map((n, i) => (
                                  <div key={i} onClick={n.action} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 items-start">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.type === 'payment' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                          <div className={n.type === 'payment' ? 'icon-landmark text-sm' : 'icon-car text-sm'}></div>
                                      </div>
                                      <div>
                                          <div className="font-semibold text-sm text-gray-900">{n.title}</div>
                                          <p className="text-xs text-gray-500 mt-1">{n.desc}</p>
                                          <p className="text-[10px] text-gray-400 mt-2">{formatTimeAgo(n.time)}</p>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              )}
          </div>

          {/* Messages */}
          <div className="relative">
              <button 
                onClick={() => { setShowMsg(!showMsg); setShowNotif(false); }}
                className={`relative p-2 rounded-full transition-colors ${showMsg ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <div className="icon-message-square text-xl"></div>
                {messages.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white flex items-center justify-center text-[10px] font-bold rounded-full border-2 border-white">
                        {messages.length > 9 ? '9+' : messages.length}
                    </span>
                )}
              </button>
              {showMsg && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                          <h3 className="font-bold text-gray-900">Support Tickets</h3>
                          <button onClick={() => { setCurrentView('support'); setShowMsg(false); }} className="text-xs text-blue-600 hover:underline font-medium">View All</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                          {messages.length === 0 ? (
                              <div className="p-6 text-center text-gray-500 text-sm flex flex-col items-center">
                                  <div className="icon-circle-check text-2xl text-green-400 mb-2"></div>
                                  Inbox zero. No pending messages.
                              </div>
                          ) : (
                              messages.map((m, i) => (
                                  <div key={i} onClick={() => { setCurrentView('support'); setShowMsg(false); }} className="p-4 border-b border-gray-50 hover:bg-blue-50 cursor-pointer flex gap-3 items-start bg-blue-50/20">
                                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 uppercase">
                                          {m.senderName.charAt(0)}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                          <div className="flex justify-between items-start mb-0.5">
                                            <div className="font-semibold text-sm text-gray-900 truncate pr-2">{m.senderName}</div>
                                            <span className="text-[10px] text-gray-400 shrink-0">{formatTimeAgo(m.time)}</span>
                                          </div>
                                          <p className="text-xs text-gray-600 truncate">{m.content}</p>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              )}
          </div>

        </div>
      </header>
    );
  } catch (error) {
    console.error('AdminHeader component error:', error);
    return null;
  }
}