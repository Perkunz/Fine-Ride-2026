function UserPreferences() {
  try {
    const [temp, setTemp] = React.useState('warm');
    const [chat, setChat] = React.useState('quiet');
    const [music, setMusic] = React.useState('any');

    return (
      <div className="space-y-6 animate-fade-in" data-name="user-preferences" data-file="profile-components/UserPreferences.js">
        <div>
            <h2 className="text-xl font-bold mb-1">Ride Preferences</h2>
            <p className="text-sm text-gray-500 mb-6">Let drivers know how you like your ride. We'll share these with your driver automatically.</p>
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-xl border border-[var(--border-color)] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="icon-thermometer text-xl text-blue-500"></div>
                <h3 className="font-bold text-lg">Temperature</h3>
            </div>
            <div className="flex flex-wrap gap-3">
                <button onClick={() => setTemp('cool')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${temp === 'cool' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Cool</button>
                <button onClick={() => setTemp('warm')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${temp === 'warm' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Warm</button>
                <button onClick={() => setTemp('any')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${temp === 'any' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>No Preference</button>
            </div>
        </div>

        {/* Conversation */}
        <div className="bg-white rounded-xl border border-[var(--border-color)] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="icon-message-circle text-xl text-green-500"></div>
                <h3 className="font-bold text-lg">Conversation</h3>
            </div>
            <div className="flex flex-wrap gap-3">
                <button onClick={() => setChat('quiet')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${chat === 'quiet' ? 'bg-gray-100 border-gray-400 text-gray-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Quiet ride</button>
                <button onClick={() => setChat('chatty')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${chat === 'chatty' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Happy to chat</button>
                <button onClick={() => setChat('any')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${chat === 'any' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>No Preference</button>
            </div>
        </div>

        {/* Music */}
        <div className="bg-white rounded-xl border border-[var(--border-color)] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="icon-music text-xl text-purple-500"></div>
                <h3 className="font-bold text-lg">Music</h3>
            </div>
            <div className="flex flex-wrap gap-3">
                <button onClick={() => setMusic('pop')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${music === 'pop' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Pop / Top 40</button>
                <button onClick={() => setMusic('jazz')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${music === 'jazz' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Jazz / Chill</button>
                <button onClick={() => setMusic('none')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${music === 'none' ? 'bg-gray-100 border-gray-400 text-gray-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>No Music</button>
                <button onClick={() => setMusic('any')} className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${music === 'any' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Driver's Choice</button>
            </div>
        </div>
        
        <button className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-md hover:bg-gray-800 transition-colors">
            Save Preferences
        </button>
      </div>
    );
  } catch (error) {
    console.error('UserPreferences error:', error);
    return null;
  }
}