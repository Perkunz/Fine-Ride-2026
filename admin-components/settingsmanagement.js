function SettingsManagement() {
  try {
    const [settings, setSettings] = React.useState({
        appName: 'Fine-ride',
        supportEmail: 'support@fineride.com',
        maintenanceMode: false,
        baseFare: 2.50,
        perMileRate: 1.20,
        platformFee: 20
    });

    const [saving, setSaving] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    React.useEffect(() => {
        const savedSettings = localStorage.getItem('fineride_admin_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            localStorage.setItem('fineride_admin_settings', JSON.stringify(settings));
            setSaving(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 800);
    };

    return (
      <div className="space-y-6 max-w-4xl" data-name="settings-management" data-file="admin-components/SettingsManagement.js">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
            {success && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><div className="icon-circle-check text-xs"></div> Settings Saved</span>}
        </div>
        
        <div className="admin-card overflow-hidden">
            <div className="p-6 space-y-6">
                    <div className="animate-fade-in space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Application Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
                                    <input type="text" name="appName" value={settings.appName} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                    <input type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Mode</label>
                                    <label className="flex items-center mt-2 cursor-pointer w-max">
                                        <div className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}>
                                            <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="hidden" />
                                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                        </div>
                                        <span className="ml-3 text-sm text-gray-500">Disable app access for users during updates</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Base Pricing & Fees</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Fare (₦)</label>
                                    <input type="number" name="baseFare" value={settings.baseFare} onChange={handleChange} step="50" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Per Min Rate (₦)</label>
                                    <input type="number" name="perMileRate" value={settings.perMileRate} onChange={handleChange} step="10" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label>
                                    <input type="number" name="platformFee" value={settings.platformFee} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Configuration</h3>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center text-gray-700">
                                            <div className="icon-landmark"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">Bank Transfer (Static)</h4>
                                            <p className="text-xs text-gray-500">Active receiving account for all riders</p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Active</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Bank Name</label>
                                        <input type="text" value="Moniepoint MFB" disabled className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Account Number</label>
                                        <input type="text" value="6915829900" disabled className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-not-allowed font-mono font-bold" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Account Name</label>
                                        <input type="text" value="De-perkins 094 Global Ltd" disabled className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 cursor-not-allowed" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                <div className="pt-4 flex justify-end border-t border-gray-200 mt-6">
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                        {saving && <div className="icon-loader animate-spin"></div>}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SettingsManagement component error:', error);
    return null;
  }
}