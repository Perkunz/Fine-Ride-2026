function EntertainmentWidget() {
  try {
    const [activeTab, setActiveTab] = React.useState('music'); // music, news, preferences
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [mood, setMood] = React.useState('chill');
    const [trackIndex, setTrackIndex] = React.useState(0);
    const audioRef = React.useRef(null);

    const playlists = {
        chill: { 
            gradient: 'from-blue-400 to-indigo-600',
            tracks: [
                { title: 'Chill Vibes', artist: 'Lo-Fi Stream', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
                { title: 'Midnight Chill', artist: 'Ambient Flow', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
                { title: 'Relaxing Beats', artist: 'Chillout', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' }
            ]
        },
        upbeat: { 
            gradient: 'from-pink-500 to-rose-500',
            tracks: [
                { title: 'Upbeat Drive', artist: 'Pop Mix', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
                { title: 'Energy Boost', artist: 'Electro', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
                { title: 'Summer Hits', artist: 'Dance', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
            ]
        },
        focus: { 
            gradient: 'from-emerald-400 to-teal-600',
            tracks: [
                { title: 'Focus Focus', artist: 'Ambient Wave', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
                { title: 'Deep Work', artist: 'Synth', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
                { title: 'Study Flow', artist: 'Instrumental', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' }
            ]
        }
    };

    React.useEffect(() => {
        const audioEl = audioRef.current;
        if (audioEl) {
            if (isPlaying && activeTab === 'music') {
                audioEl.play().catch(e => {
                    console.warn("Audio play prevented:", e);
                    setIsPlaying(false);
                });
            } else {
                audioEl.pause();
            }
        }
        return () => {
            if (audioEl) {
                audioEl.pause();
            }
        };
    }, [isPlaying, activeTab, mood, trackIndex]);

    const handleMoodChange = (newMood) => {
        setMood(newMood);
        setTrackIndex(0);
        setIsPlaying(true);
    };

    const handleNext = () => {
        setTrackIndex((prev) => (prev + 1) % playlists[mood].tracks.length);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        setTrackIndex((prev) => (prev - 1 + playlists[mood].tracks.length) % playlists[mood].tracks.length);
        setIsPlaying(true);
    };

    const currentTrack = playlists[mood].tracks[trackIndex];

    return (
      <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 mt-4 mb-6 shadow-inner w-full" data-name="entertainment-widget" data-file="components/EntertainmentWidget.js">
        <audio ref={audioRef} src={currentTrack.url} onEnded={handleNext} />
        <div className="flex border-b border-gray-200 bg-white">
            <button onClick={() => setActiveTab('music')} className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === 'music' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Music</button>
            <button onClick={() => setActiveTab('news')} className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === 'news' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>News</button>
            <button onClick={() => setActiveTab('preferences')} className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === 'preferences' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>My Prefs</button>
        </div>
        
        <div className="p-4 bg-white">
            {activeTab === 'music' && (
                <div className="animate-fade-in flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${playlists[mood].gradient} rounded-lg flex items-center justify-center shadow-md`}>
                                <div className="icon-music text-white text-xl"></div>
                            </div>
                            <div className="text-left max-w-[120px] md:max-w-xs">
                                <h4 className="font-bold text-gray-900 text-sm truncate">{playlists[mood].title}</h4>
                                <p className="text-xs text-gray-500 truncate">{playlists[mood].artist}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button className="text-gray-400 hover:text-black transition-colors p-1"><div className="icon-skip-back"></div></button>
                            <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 bg-black text-white rounded-full flex flex-shrink-0 items-center justify-center hover:bg-gray-800 transition-colors shadow-md">
                                <div className={isPlaying ? "icon-pause" : "icon-play"}></div>
                            </button>
                            <button className="text-gray-400 hover:text-black transition-colors p-1"><div className="icon-skip-forward"></div></button>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <button onClick={() => handleMoodChange('chill')} className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${mood === 'chill' ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Chill</button>
                        <button onClick={() => handleMoodChange('upbeat')} className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${mood === 'upbeat' ? 'bg-pink-100 text-pink-700 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Upbeat</button>
                        <button onClick={() => handleMoodChange('focus')} className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${mood === 'focus' ? 'bg-emerald-100 text-emerald-700 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Focus</button>
                    </div>
                </div>
            )}

            {activeTab === 'news' && (
                <div className="animate-fade-in text-left">
                    <h4 className="text-xs font-bold text-red-500 mb-2 uppercase tracking-wider flex items-center gap-1"><div className="icon-radio text-sm"></div> Breaking News</h4>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">Global tech markets hit record highs as new AI innovations are announced across major platforms.</p>
                    <button className="text-xs text-blue-600 mt-2 font-medium hover:underline">Read full story</button>
                </div>
            )}

            {activeTab === 'preferences' && (
                <div className="animate-fade-in">
                    <p className="text-xs text-gray-500 mb-3 text-left">The driver has been notified of your preferences:</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"><div className="icon-thermometer text-[10px]"></div> Warm temp</span>
                        <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"><div className="icon-message-circle text-[10px]"></div> Quiet ride</span>
                        <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"><div className="icon-music text-[10px]"></div> Jazz/Chill</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('EntertainmentWidget error:', error);
    return null;
  }
}