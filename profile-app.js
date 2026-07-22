function PaymentMethodsTab() {
    return (
        <div className="space-y-4 animate-fade-in" data-name="payment-info">
            <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
            <p className="text-sm text-gray-500 mb-4">Bank Transfer is the default and only supported payment method.</p>
            
            <div className="bg-white p-4 rounded-xl border border-[var(--border-color)] shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-8 bg-gray-100 text-gray-800 border border-gray-200 rounded flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <div className="icon-landmark text-lg"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">Bank Transfer (Nigeria)</div>
                    </div>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">Default</div>
                </div>
                
                <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-100 w-full">
                    <div className="font-bold text-gray-900 mb-1 text-sm">Moniepoint MFB</div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-mono text-black tracking-widest">6915829900</span>
                        <button className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => navigator.clipboard.writeText('6915829900')}>Copy</button>
                    </div>
                    <div className="text-sm">De-perkins 094 Global Ltd</div>
                </div>
            </div>
        </div>
    );
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="p-8 text-center"><h1 className="text-red-500 font-bold">Error</h1></div>;
    return this.props.children;
  }
}

// Global handler for network or permission errors
window.addEventListener('unhandledrejection', event => {
    if (event.reason && (event.reason.message?.includes('Failed to fetch') || event.reason.message?.includes('NoPermission'))) {
        event.preventDefault();
        console.warn('Suppressed global unhandled rejection:', event.reason.message);
    }
});

function ProfileApp() {
  try {
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') || 'profile';
    const [tab, setTab] = React.useState(initialTab); // profile, history, payment, rewards, preferences, locations
    const [currentUser, setCurrentUser] = React.useState(null);
    const [showSupport, setShowSupport] = React.useState(false);
    const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editName, setEditName] = React.useState('');
    const [editPhone, setEditPhone] = React.useState('');
    const [savingProfile, setSavingProfile] = React.useState(false);
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        const user = getCurrentUser();
        if (!user) window.location.href = 'auth.html';
        else {
            setCurrentUser(user);
            setEditName(user.Name || '');
            setEditPhone(user.Phone || '');
        }
    }, []);

    const handleSaveProfile = async () => {
        if (!editName.trim() || !editPhone.trim()) return;
        setSavingProfile(true);
        try {
            const updatedUser = await trickleUpdateObject('user', currentUser.id, { Name: editName, Phone: editPhone });
            const newUserData = { ...currentUser, Name: editName, Phone: editPhone };
            setCurrentUser(newUserData);
            setCurrentUser(newUserData); // Update util storage
            localStorage.setItem('fine_ride_user', JSON.stringify(newUserData));
            setIsEditing(false);
        } catch(err) {
            console.warn('Profile update failed', err.message);
            alert("Failed to update profile. " + (err.message?.includes('Failed to fetch') ? "Network error." : ""));
        } finally {
            setSavingProfile(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Str = reader.result;
            try {
                const updatedUser = await trickleUpdateObject('user', currentUser.id, { Avatar: base64Str });
                const newUserData = { ...currentUser, Avatar: base64Str };
                setCurrentUser(newUserData);
                setCurrentUser(newUserData); // update utils/auth storage
                localStorage.setItem('fine_ride_user', JSON.stringify(newUserData));
            } catch(err) {
                console.warn('Avatar upload failed', err.message);
                alert("Failed to upload avatar");
            } finally {
                setUploadingAvatar(false);
            }
        };
        reader.readAsDataURL(file);
    };

    if (!currentUser) return null;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row" data-name="profile-app" data-file="profile-app.js">
        
        {/* Sidebar / Top Nav */}
        <div className="w-full md:w-80 bg-white border-b md:border-r border-[var(--border-color)]">
          <div className="p-6 flex items-center gap-4 border-b border-[var(--border-color)] relative">
            <a href={currentUser.Role === 'Admin' ? 'admin.html' : currentUser.Role === 'Driver' ? 'driver.html' : 'book.html'} className="absolute top-4 left-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full md:hidden">
              <div className="icon-arrow-left"></div>
            </a>
            
            <div className="relative mt-8 md:mt-0 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm overflow-hidden border-2 border-transparent group-hover:border-blue-400 transition-all">
                {uploadingAvatar ? (
                    <div className="icon-loader animate-spin text-xl"></div>
                ) : currentUser.Avatar ? (
                    <img src={currentUser.Avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    currentUser.Name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                  <div className="icon-camera text-xs text-gray-600"></div>
              </div>
            </div>

            <div className="mt-8 md:mt-0">
              <h1 className="text-2xl font-bold">{currentUser.Name}</h1>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <div className="icon-star text-yellow-400"></div> {currentUser.Rating || '5.0'} Rating
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col p-2 md:p-4 overflow-x-auto">
            <button onClick={() => setTab('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap ${tab === 'profile' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'}`}>
              <div className="icon-user"></div> Profile Info
            </button>
            <button onClick={() => setTab('history')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap ${tab === 'history' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'}`}>
              <div className="icon-clock"></div> Ride History
            </button>
            <button onClick={() => setTab('payment')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap ${tab === 'payment' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'}`}>
              <div className="icon-credit-card"></div> Payment Methods
            </button>
            <button onClick={() => setTab('rewards')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap ${tab === 'rewards' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'}`}>
              <div className="icon-award"></div> Rewards & Gamification
            </button>
            <button onClick={() => setTab('locations')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap ${tab === 'locations' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'}`}>
              <div className="icon-map-pin"></div> Saved Locations
            </button>
            <button onClick={() => setTab('preferences')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap ${tab === 'preferences' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'}`}>
              <div className="icon-sliders"></div> Ride Preferences
            </button>
            <button onClick={() => setShowSupport(true)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap hover:bg-gray-50 text-blue-600 mt-2">
              <div className="icon-headphones"></div> Chat with Us
            </button>
            <div className="hidden md:block mt-8 pt-4 border-t border-[var(--border-color)]">
              <a href={currentUser.Role === 'Admin' ? 'admin.html' : currentUser.Role === 'Driver' ? 'driver.html' : 'book.html'} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-black">
                <div className="icon-arrow-left"></div> Back to Dashboard
              </a>
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg text-left">
                <div className="icon-log-out"></div> Log out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            
            {tab === 'profile' && (
              <div className="space-y-6 animate-fade-in" data-name="profile-info">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Account Information</h2>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="text-[var(--accent-color)] font-medium hover:underline text-sm flex items-center gap-1">
                            <div className="icon-pencil text-xs"></div> Edit
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="bg-[#1f1f1f] rounded-xl border border-[var(--border-color)] p-6 space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--accent-color)]" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                            <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--accent-color)]" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email (Cannot be changed)</label>
                            <input type="text" value={currentUser.Email} disabled className="w-full bg-black/50 border border-[#2a2a2a] rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-full border border-[#2a2a2a] text-white hover:bg-[#2a2a2a] transition-colors">Cancel</button>
                            <button onClick={handleSaveProfile} disabled={savingProfile} className="px-6 py-2 rounded-full bg-[var(--primary-color)] text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2">
                                {savingProfile && <div className="icon-loader animate-spin text-sm"></div>}
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-[var(--border-color)] overflow-hidden">
                        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                            <div>
                                <div className="text-sm text-gray-500">Name</div>
                                <div className="font-medium text-gray-900">{currentUser.Name}</div>
                            </div>
                        </div>
                        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
                            <div>
                                <div className="text-sm text-gray-500">Phone Number</div>
                                <div className="font-medium text-gray-900">{currentUser.Phone}</div>
                            </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <div>
                                <div className="text-sm text-gray-500">Email</div>
                                <div className="font-medium text-gray-900">{currentUser.Email}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div onClick={() => setTab('rewards')} className="cursor-pointer hover:bg-gray-50 transition-colors bg-white rounded-xl border border-[var(--border-color)] p-4 flex items-center justify-between mt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <div className="icon-award"></div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Fine-ride Rewards</div>
                      <div className="text-sm text-gray-500">View your points balance</div>
                    </div>
                  </div>
                  <div className="icon-chevron-right text-gray-400"></div>
                </div>
              </div>
            )}

            {tab === 'history' && (
              <RideHistory currentUser={currentUser} />
            )}
            
            {tab === 'rewards' && (
              <UserRewards currentUser={currentUser} />
            )}

            {tab === 'preferences' && (
              <UserPreferences />
            )}

            {tab === 'locations' && (
              <SavedLocations />
            )}

            {tab === 'payment' && (
              <PaymentMethodsTab />
            )}

          </div>
        </div>

        {showSupport && currentUser && (
            <SupportChatWindow 
                currentUser={currentUser} 
                onClose={() => setShowSupport(false)} 
            />
        )}

      </div>
    );
  } catch (error) {
    console.error('ProfileApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><ProfileApp /></ErrorBoundary>);