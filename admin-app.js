class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="icon-circle-alert text-4xl text-red-500 mb-4 mx-auto w-12 h-12 flex items-center justify-center"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel Error</h1>
            <p className="text-gray-600 mb-6">Something unexpected happened in the admin dashboard.</p>
            <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-4 py-2 rounded-lg">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
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

function AdminApp() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [currentView, setCurrentView] = React.useState('overview');
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

    const [loginEmail, setLoginEmail] = React.useState('admin@fineride.com');
    const [loginPassword, setLoginPassword] = React.useState('1111');
    const [loginError, setLoginError] = React.useState('');
    const [isLoggingIn, setIsLoggingIn] = React.useState(false);

    React.useEffect(() => {
        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        if (user && user.Role === 'Admin') {
            setCurrentUser(user);
        }
        setIsCheckingAuth(false);
    }, []);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);
        try {
            const res = await trickleListObjects('user', 100, true, undefined);
            
            if (loginEmail.toLowerCase() === 'admin@fineride.com' && loginPassword === '1111') {
                let adminUser = res && res.items ? res.items.find(u => u.objectData.Role === 'Admin') : null;
                if (!adminUser) {
                    adminUser = await trickleCreateObject('user', {
                        Name: 'Super Admin',
                        Email: 'admin@fineride.com',
                        Phone: '+10000000000',
                        Role: 'Admin',
                        Status: 'Active'
                    });
                }
                const userObj = { id: adminUser.objectId, ...adminUser.objectData };
                localStorage.setItem('fine_ride_user', JSON.stringify(userObj));
                setCurrentUser(userObj);
            } else {
                setLoginError('Invalid admin credentials.');
            }
        } catch (err) {
            console.warn("Login API error:", err.message);
            const isJsonError = err.message && err.message.includes('not valid JSON');
            setLoginError(isJsonError ? 'Database service is currently unavailable.' : err.message?.includes('Failed to fetch') ? 'Network error: Unable to reach the server. Please check your connection.' : 'Login failed. Please try again.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (isCheckingAuth) return null;

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
                        <p className="text-gray-500 mt-2">Sign in to manage Fine-ride</p>
                    </div>
                    {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{loginError}</div>}
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                            <input 
                                type="email" 
                                value={loginEmail} 
                                onChange={e=>setLoginEmail(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                value={loginPassword} 
                                onChange={e=>setLoginPassword(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                required 
                            />
                        </div>
                        <button type="submit" disabled={isLoggingIn} className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 mt-6">
                            {isLoggingIn ? 'Authenticating...' : 'Login as Admin'}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <a href="auth.html" className="text-sm text-blue-600 hover:underline">Back to Rider/Driver Login</a>
                    </div>
                </div>
            </div>
        );
    }

    const renderContent = () => {
      switch (currentView) {
        case 'overview': return <DashboardOverview />;
        case 'users': return <UsersManagement />;
        case 'rides': return <RidesManagement />;
        case 'support': return <SupportManagement />;
        case 'payments': return <PaymentsManagement />;
        case 'analytics': return <AnalyticsManagement />;
        case 'settings': return <SettingsManagement />;
        case 'help': return <AdminHelpCenter />;
        default: return <DashboardOverview />;
      }
    };

    return (
      <div className="flex h-screen overflow-hidden bg-[var(--bg-color)]" data-name="admin-app" data-file="admin-app.js">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen ? (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        ) : null}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-30 w-[var(--sidebar-width)] transform bg-[var(--secondary-color)] border-r border-[var(--border-color)] transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <AdminSidebar currentUser={currentUser} currentView={currentView} setCurrentView={(v) => { setCurrentView(v); setSidebarOpen(false); }} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader toggleSidebar={() => setSidebarOpen(true)} setCurrentView={setCurrentView} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AdminApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <AdminApp />
  </ErrorBoundary>
);