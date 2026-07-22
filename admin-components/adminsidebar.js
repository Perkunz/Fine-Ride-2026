function AdminSidebar({ currentUser, currentView, setCurrentView }) {
  try {
    const navItems = [
      { id: 'overview', label: 'Overview', icon: 'icon-layout-dashboard' },
      { id: 'users', label: 'Users & Drivers', icon: 'icon-users' },
      { id: 'rides', label: 'Ride Management', icon: 'icon-car' },
      { id: 'payments', label: 'Payments', icon: 'icon-credit-card' },
      { id: 'support', label: 'Customer Support', icon: 'icon-headphones' },
      { id: 'analytics', label: 'Analytics', icon: 'icon-chart-bar' },
      { id: 'settings', label: 'Settings', icon: 'icon-settings' },
      { id: 'help', label: 'Help Center', icon: 'icon-circle-help' },
    ];

    const [unreadSupport, setUnreadSupport] = React.useState(0);

    React.useEffect(() => {
        const checkUnread = async () => {
            try {
                const res = await trickleListObjects('support_message', 200, false, undefined);
                if (res && res.items) {
                    const count = res.items.filter(m => !m.objectData.IsReadByAdmin).length;
                    setUnreadSupport(count);
                }
            } catch(e) {}
        };
        checkUnread();
        const interval = setInterval(checkUnread, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex flex-col h-full" data-name="admin-sidebar" data-file="admin-components/AdminSidebar.js">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
          <div className="font-bold text-2xl tracking-tight text-[var(--primary-color)]">
            Fine-ride <span className="text-[var(--accent-color)] text-sm ml-1 uppercase tracking-widest">Admin</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => (
            <div 
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            >
              <div className={`${item.icon} text-xl`}></div>
              <span className="flex-1">{item.label}</span>
              {item.id === 'support' && unreadSupport > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadSupport}
                  </span>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[var(--border-color)]">
          <a href="index.html" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <div className="icon-external-link text-xl"></div>
            <span>View Rider App</span>
          </a>
          <a href="profile.html" className="flex items-center gap-3 mt-4 px-2 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase overflow-hidden">
              {currentUser?.Avatar ? (
                  <img src={currentUser.Avatar} className="w-full h-full object-cover" />
              ) : (
                  currentUser?.Name?.charAt(0) || 'A'
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">{currentUser?.Name || 'Admin User'}</div>
              <div className="text-xs text-gray-500 hover:text-blue-600 transition-colors">Edit Profile</div>
            </div>
          </a>
          <button onClick={() => typeof logout === 'function' && logout()} className="mt-6 w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100">
            <div className="icon-log-out"></div> Log Out
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdminSidebar component error:', error);
    return null;
  }
}