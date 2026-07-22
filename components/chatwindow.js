function ChatWindow({ rideId, currentUser, onClose }) {
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const messagesEndRef = React.useRef(null);

    const loadMessages = async () => {
        try {
            const res = await trickleListObjects('chat_message', 100, false, undefined);
            const rideMessages = res.items
                .filter(m => m.objectData.RideId === rideId)
                .sort((a, b) => new Date(a.objectData.Timestamp) - new Date(b.objectData.Timestamp));
            setMessages(rideMessages);
        } catch (err) {
            console.warn('Failed to load messages:', err.message);
        }
    };

    React.useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [rideId]);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await trickleCreateObject('chat_message', {
                RideId: rideId,
                SenderId: currentUser.id,
                Content: newMessage,
                Timestamp: new Date().toISOString()
            });
            setNewMessage('');
            loadMessages();
        } catch (err) {
            console.warn('Failed to send message:', err.message);
        }
    };

    return (
        <div className="fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full md:w-80 bg-white md:rounded-xl shadow-2xl flex flex-col h-96 z-50 border border-gray-200" data-name="chat-window">
            <div className="bg-black text-white p-4 flex justify-between items-center md:rounded-t-xl">
                <h3 className="font-bold">Chat</h3>
                <button onClick={onClose} className="hover:text-gray-300">
                    <div className="icon-x"></div>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 && <div className="text-center text-gray-400 text-sm mt-4">No messages yet. Say hi!</div>}
                {messages.map(msg => {
                    const isMe = msg.objectData.SenderId === currentUser.id;
                    return (
                        <div key={msg.objectId} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-black rounded-bl-none'}`}>
                                {msg.objectData.Content}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 border-t border-gray-200 bg-white md:rounded-b-xl flex gap-2">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button type="submit" className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800">
                    <div className="icon-send text-sm"></div>
                </button>
            </form>
        </div>
    );
}