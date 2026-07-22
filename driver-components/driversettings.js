function DriverSettings({ themeColor, setThemeColor }) {
  try {
    const colors = [
        { name: 'Classic Blue', hex: '#276ef1' },
        { name: 'Vibrant Red', hex: '#ff0000' },
        { name: 'Emerald Green', hex: '#10b981' },
        { name: 'Deep Purple', hex: '#8b5cf6' },
        { name: 'Midnight Dark', hex: '#111827' }
    ];

    return (
      <div className="h-full bg-[var(--bg-color)] overflow-y-auto pb-24 pt-20 px-4" data-name="driver-settings">
        <h2 className="text-2xl font-bold mb-6">Settings & Customization</h2>
        
        <div className="bg-[var(--secondary-color)] rounded-2xl p-6 shadow-sm mb-6 border border-[var(--border-color)]">
            <h3 className="font-bold text-lg mb-4">App Theme Color</h3>
            <p className="text-sm text-gray-500 mb-4">Personalize your driver app experience by selecting a custom accent color.</p>
            
            <div className="space-y-3">
                {colors.map(color => (
                    <div 
                        key={color.hex}
                        onClick={() => setThemeColor(color.hex)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${themeColor === color.hex ? 'border-[' + color.hex + '] bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                        style={{ borderColor: themeColor === color.hex ? color.hex : 'transparent' }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: color.hex }}></div>
                            <span className="font-medium">{color.name}</span>
                        </div>
                        {themeColor === color.hex && <div className="icon-check text-xl" style={{ color: color.hex }}></div>}
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-[var(--secondary-color)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]">
            <h3 className="font-bold text-lg mb-4">Navigation Preferences</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Default Navigation App</p>
                        <p className="text-sm text-gray-500">Used when navigating to pickup/drop-off</p>
                    </div>
                    <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                        <option>Google Maps</option>
                        <option>Waze</option>
                        <option>Apple Maps</option>
                    </select>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <p className="font-medium">Auto-start Navigation</p>
                        <p className="text-sm text-gray-500">Open maps automatically on ride accept</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-[var(--accent-color)] relative transition-colors">
                        <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('DriverSettings component error:', error);
    return null;
  }
}