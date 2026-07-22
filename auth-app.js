class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
            <div className="icon-circle-alert text-4xl text-red-500 mb-4 mx-auto w-12 h-12 flex items-center justify-center"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="btn-black w-full">Reload Page</button>
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

function AuthApp() {
  try {
    const params = new URLSearchParams(window.location.search);
    const initialRole = params.get('role') === 'driver' ? 'Driver' : 'Rider';
    const msg = params.get('msg');
    
    const [isLogin, setIsLogin] = React.useState(true);
    const [isForgot, setIsForgot] = React.useState(false);
    const [forgotSuccess, setForgotSuccess] = React.useState(false);
    const [authMethod, setAuthMethod] = React.useState('email'); // email, phone

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [vehicleType, setVehicleType] = React.useState('Sedan');
    const [role, setRole] = React.useState(initialRole);
    const [error, setError] = React.useState(
        msg === 'login_required' ? 'Please log in to access the driver dashboard.' : 
        msg === 'driver_required' ? 'A driver account is required. Please sign up as a driver.' : ''
    );
    const [loading, setLoading] = React.useState(false);

    const handleSocialLogin = async (provider) => {
        setLoading(true);
        setError('');
        try {
            await new Promise(r => setTimeout(r, 1000));
            const socialEmail = `${provider.toLowerCase()}_user@fineride.com`;
            const res = await trickleListObjects('user', 100, true, undefined);
            let existingUser = res && res.items ? res.items.find(u => u.objectData.Email.toLowerCase() === socialEmail && u.objectData.Role === role) : null;
            
            if (!existingUser) {
                const newUser = await trickleCreateObject('user', {
                    Name: `${provider} User`,
                    Email: socialEmail,
                    Phone: '+10000000000',
                    Role: role,
                    Status: role === 'Driver' ? 'Online' : 'Active',
                    ...(role === 'Driver' && { VehicleType: vehicleType })
                });
                existingUser = { objectId: newUser.objectId, objectData: newUser.objectData };
            }
            
            if (existingUser.objectData.Role === 'Driver') {
                await trickleUpdateObject('user', existingUser.objectId, { Status: 'Online' });
                existingUser.objectData.Status = 'Online';
            }
            
            const userObj = { id: existingUser.objectId, ...existingUser.objectData };
            localStorage.setItem('fine_ride_user', JSON.stringify(userObj));
            window.location.href = userObj.Role === 'Driver' ? 'driver.html' : 'book.html';
        } catch (err) {
            setError(`Failed to log in with ${provider}.`);
            setLoading(false);
        }
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Mock sending email
            await new Promise(r => setTimeout(r, 1000));
            setForgotSuccess(true);
        } catch (err) {
            setError('Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (msg === 'driver_required') {
            setIsLogin(false);
        }
    }, [msg]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      
      try {
        const res = await trickleListObjects('user', 100, true, undefined);
        // Super Admin Login backdoor
        if (email.toLowerCase() === 'admin@fineride.com' && password === '1111') {
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
            window.location.href = 'admin.html';
            return;
        }

        const existingUser = res && res.items ? res.items.find(u => u.objectData.Email.toLowerCase() === email.toLowerCase() && u.objectData.Role === role) : null;

        if (isLogin) {
            if (existingUser) {
                if (existingUser.objectData.Role === 'Driver') {
                    await trickleUpdateObject('user', existingUser.objectId, { Status: 'Online' });
                    existingUser.objectData.Status = 'Online';
                }
                const userObj = { id: existingUser.objectId, ...existingUser.objectData };
                localStorage.setItem('fine_ride_user', JSON.stringify(userObj));
                if (userObj.Role === 'Admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = userObj.Role === 'Driver' ? 'driver.html' : 'book.html';
                }
            } else {
                setError('Invalid email or user not found.');
            }
        } else {
            if (existingUser) {
                setError('An account with this email already exists.');
                setLoading(false);
                return;
            }

            const newUser = await trickleCreateObject('user', {
                Name: `${firstName} ${lastName}`.trim(),
                Email: email.toLowerCase(),
                Phone: phone || '+10000000000',
                Role: role,
                Status: role === 'Driver' ? 'Online' : 'Active',
                ...(role === 'Driver' && { VehicleType: vehicleType })
            });
            const userObj = { id: newUser.objectId, ...newUser.objectData };
            localStorage.setItem('fine_ride_user', JSON.stringify(userObj));
            if (userObj.Role === 'Admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = userObj.Role === 'Driver' ? 'driver.html' : 'book.html';
            }
        }
      } catch (err) {
        console.warn("Authentication error:", err.message);
        if (err.message?.includes('not valid JSON')) {
            setError('Database service is currently unavailable. Please try again later.');
        } else if (err.message?.includes('Failed to fetch')) {
            setError('Network error: Unable to reach the server. Please check your connection or disable ad-blockers.');
        } else {
            setError('An error occurred during authentication.');
        }
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex flex-col md:flex-row" data-name="auth-app" data-file="auth-app.js">
        {/* Left Side - Branding/Hero (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 50%)' }}></div>
          <div className="z-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Fine-ride</h1>
            <p className="text-xl text-gray-400">Go anywhere, anytime.</p>
          </div>
          <div className="z-10 max-w-md">
            <h2 className="text-4xl font-bold mb-6">Your ride, your way.</h2>
            <p className="text-gray-400 text-lg">Join millions of riders and drivers. Safe, reliable, and affordable rides at your fingertips.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col justify-center p-6 md:p-12 bg-white relative">
          <button onClick={() => {
              const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
              if (user) {
                  window.location.href = user.Role === 'Driver' ? 'driver.html' : 'book.html';
              } else {
                  window.location.href = 'index.html';
              }
          }} className="absolute top-6 left-6 text-gray-500 hover:text-black transition-colors flex items-center gap-2">
            <div className="icon-arrow-left"></div> Back
          </button>

          <div className="w-full max-w-md mx-auto mt-12 md:mt-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p className="text-gray-500 mb-8">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                  <button type="button" onClick={() => setRole('Rider')} className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all ${role === 'Rider' ? 'bg-[var(--accent-color)] text-white shadow-md' : 'text-gray-500 hover:text-black'}`}>Rider</button>
                  <button type="button" onClick={() => setRole('Driver')} className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all ${role === 'Driver' ? 'bg-[var(--accent-color)] text-white shadow-md' : 'text-gray-500 hover:text-black'}`}>Driver</button>
              </div>

              {!isLogin && (
                <>
                    <div className="flex gap-4">
                        <input type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="First Name" className="input-field w-1/2" required />
                        <input type="text" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Last Name" className="input-field w-1/2" required />
                    </div>
                    <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone Number" className="input-field" required />
                    {role === 'Driver' && (
                        <select value={vehicleType} onChange={e=>setVehicleType(e.target.value)} className="input-field bg-gray-100">
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                    )}
                </>
              )}

              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" className="input-field" required />
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="input-field" required />

              <button type="submit" disabled={loading} className="btn-black w-full mt-6 shadow-lg hover:shadow-xl transition-shadow text-lg disabled:opacity-50">
                {loading ? 'Processing...' : (isLogin ? 'Log in' : 'Sign up')}
              </button>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <span className="relative bg-white px-4 text-sm text-gray-500">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="btn-outline flex items-center justify-center gap-2">
                <div className="icon-chrome text-lg"></div> Google
              </button>
              <button className="btn-outline flex items-center justify-center gap-2">
                <div className="icon-apple text-lg"></div> Apple
              </button>
            </div>
            
            <p className="text-xs text-gray-400 text-center mt-8">
              By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from Fine-ride and its affiliates to the number provided.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('AuthApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <AuthApp />
  </ErrorBoundary>
);