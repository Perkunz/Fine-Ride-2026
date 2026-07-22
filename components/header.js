function Header({ currentUser }) {
  try {
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
      <React.Fragment>
        <header className="p-4 flex items-center justify-between bg-transparent md:bg-white" data-name="header" data-file="components/Header.js">
          <div onClick={() => setMenuOpen(true)} className="w-12 h-12 rounded-full bg-white md:bg-gray-100 shadow-md md:shadow-none flex items-center justify-center cursor-pointer hover:bg-gray-50 md:hover:bg-gray-200 transition-colors">
            <div className="icon-menu text-xl text-[var(--primary-color)] md:text-black"></div>
          </div>
          
          <div className="md:hidden bg-white px-4 py-2 rounded-full shadow-md font-bold text-lg tracking-tight text-gray-900">
            Fine-ride
          </div>
          <div className="hidden md:block font-bold text-2xl tracking-tight text-gray-900">
            Fine-ride
          </div>

          <a href="profile.html" className="flex items-center gap-3 bg-white md:bg-gray-50 px-2 py-1.5 md:px-4 md:py-2 rounded-full shadow-md md:shadow-none hover:bg-gray-100 transition-colors border border-transparent md:border-[#2a2a2a]" title="View Profile">
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold text-gray-900 leading-tight">{currentUser?.Name || 'User'}</div>
              <div className="text-xs text-gray-500 font-medium flex items-center justify-end gap-1">{currentUser?.Rating || '5.0'} <div className="icon-star text-[10px] text-yellow-500 fill-yellow-500"></div></div>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden shadow-sm border border-gray-100">
              {currentUser?.Avatar ? (
                  <img src={currentUser.Avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                  (currentUser?.Name || 'U').charAt(0).toUpperCase() || <div className="icon-user text-lg"></div>
              )}
            </div>
          </a>
        </header>

        {menuOpen && (
            <div className="fixed inset-0 z-50 flex" data-name="mobile-menu">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)}></div>
                <div className="relative w-72 bg-[#1f1f1f] h-full shadow-2xl flex flex-col animate-slide-right text-white">
                    <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                        <div className="font-bold text-xl tracking-tight">Fine-ride</div>
                        <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-[#2a2a2a] rounded-full transition-colors text-gray-400 hover:text-white">
                            <div className="icon-x text-xl"></div>
                        </button>
                    </div>
                    <div className="p-6 flex items-center gap-4 border-b border-[#2a2a2a]">
                        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-inner">
                            {currentUser?.Avatar ? (
                                <img src={currentUser.Avatar} className="w-full h-full object-cover" />
                            ) : (
                                (currentUser?.Name || 'U').charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{currentUser?.Name || 'User'}</h3>
                            <p className="text-sm text-gray-400">{currentUser?.Rating || '5.0'} ★ Rating</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4">
                        <a href="profile.html" className="flex items-center gap-4 px-6 py-4 hover:bg-[#2a2a2a] transition-colors text-gray-300 hover:text-white">
                            <div className="icon-user text-xl"></div>
                            <span className="font-medium text-lg">My Profile</span>
                        </a>
                        <a href="profile.html" className="flex items-center gap-4 px-6 py-4 hover:bg-[#2a2a2a] transition-colors text-gray-300 hover:text-white">
                            <div className="icon-clock text-xl"></div>
                            <span className="font-medium text-lg">Ride History</span>
                        </a>
                        <a href="profile.html" className="flex items-center gap-4 px-6 py-4 hover:bg-[#2a2a2a] transition-colors text-gray-300 hover:text-white">
                            <div className="icon-credit-card text-xl"></div>
                            <span className="font-medium text-lg">Payment Methods</span>
                        </a>
                    </div>
                    <div className="p-6 border-t border-[#2a2a2a]">
                        <button onClick={() => typeof logout === 'function' && logout()} className="flex items-center gap-4 text-red-500 hover:text-red-400 font-medium text-lg transition-colors w-full">
                            <div className="icon-log-out text-xl"></div>
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        )}
      </React.Fragment>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}