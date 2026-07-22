function SupportChatWindow({ currentUser, onClose }) {
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const messagesEndRef = React.useRef(null);

    const loadMessages = async () => {
        try {
            const res = await trickleListObjects('support_message', 100, false, undefined);
            if (res && res.items) {
                const myMessages = res.items
                    .filter(m => m.objectData.UserId === currentUser.id)
                    .sort((a, b) => new Date(a.objectData.Timestamp) - new Date(b.objectData.Timestamp));
                setMessages(myMessages);
                
                // Mark as read by user
                const unread = myMessages.filter(m => !m.objectData.IsReadByUser && m.objectData.SenderId !== currentUser.id);
                for (const msg of unread) {
                    try { await trickleUpdateObject('support_message', msg.objectId, { IsReadByUser: true }); } catch(e) {}
                }
            }
        } catch (err) {
            console.warn('Failed to load support messages:', err.message);
        }
    };

    React.useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await trickleCreateObject('support_message', {
                UserId: currentUser.id,
                SenderId: currentUser.id,
                Content: newMessage,
                Timestamp: new Date().toISOString(),
                IsReadByAdmin: false,
                IsReadByUser: true
            });
            setNewMessage('');
            loadMessages();
        } catch (err) {
            console.warn('Failed to send message:', err.message);
        }
    };

    return (
        <div className="fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full md:w-80 bg-white md:rounded-xl shadow-2xl flex flex-col h-[450px] z-50 border border-gray-200 overflow-hidden animate-slide-up" data-name="support-chat" data-file="components/SupportChatWindow.js">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top right, #fff, transparent)' }}></div>
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="icon-headphones text-xl text-white"></div>
                    </div>
                    <div>
                        <h3 className="font-bold leading-tight">Customer Support</h3>
                        <p className="text-xs text-blue-100">We typically reply in a few minutes</p>
                    </div>
                </div>
                <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors relative z-10">
                    <div className="icon-x"></div>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                <div className="text-center mb-6">
                    <div className="inline-block bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm border border-gray-100">Today</div>
                </div>
                
                <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm">
                        Hi {currentUser.Name.split(' ')[0]}! 👋 How can we help you today?
                    </div>
                </div>

                {messages.map(msg => {
                    const isMe = msg.objectData.SenderId === currentUser.id;
                    return (
                        <div key={msg.objectId} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                                {msg.objectData.Content}
                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                    {new Date(msg.objectData.Timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white flex gap-2">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
                <button type="submit" disabled={!newMessage.trim()} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors shadow-sm">
                    <div className="icon-send text-sm ml-0.5"></div>
                </button>
            </form>
        </div>
    );
}