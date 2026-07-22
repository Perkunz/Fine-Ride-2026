function SupportManagement() {
    const [threads, setThreads] = React.useState([]);
    const [activeThread, setActiveThread] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [replyText, setReplyText] = React.useState('');
    const [users, setUsers] = React.useState({});
    const [error, setError] = React.useState(null);
    const messagesEndRef = React.useRef(null);

    const loadData = async () => {
        try {
            const [msgRes, userRes] = await Promise.all([
                trickleListObjects('support_message', 200, true, undefined),
                trickleListObjects('user', 500, true, undefined)
            ]);

            const userMap = {};
            if (userRes && userRes.items) {
                userRes.items.forEach(u => userMap[u.objectId] = u);
                setUsers(userMap);
            }

            if (msgRes && msgRes.items) {
                // Group by UserId
                const threadMap = {};
                msgRes.items.forEach(msg => {
                    const uid = msg.objectData.UserId;
                    if (!threadMap[uid]) threadMap[uid] = [];
                    threadMap[uid].push(msg);
                });

                const threadList = Object.keys(threadMap).map(uid => {
                    const msgs = threadMap[uid].sort((a, b) => new Date(a.objectData.Timestamp) - new Date(b.objectData.Timestamp));
                    const unread = msgs.filter(m => !m.objectData.IsReadByAdmin).length;
                    return {
                        userId: uid,
                        user: userMap[uid],
                        lastMessage: msgs[msgs.length - 1],
                        messages: msgs,
                        unreadCount: unread
                    };
                }).sort((a, b) => new Date(b.lastMessage.objectData.Timestamp) - new Date(a.lastMessage.objectData.Timestamp));

                setThreads(threadList);

                if (activeThread) {
                    const updatedThread = threadList.find(t => t.userId === activeThread.userId);
                    if (updatedThread) setMessages(updatedThread.messages);
                }
            }
            setError(null);
        } catch(e) {
            console.warn("Failed to load support data", e.message);
            const isJsonError = e.message && e.message.includes('not valid JSON');
            const isFetchError = e.message && e.message.includes('Failed to fetch');
            if (threads.length === 0) setError(isJsonError ? "Database service is currently unavailable." : isFetchError ? "Network error: Unable to reach the server." : "Failed to fetch data.");
        }
    };

    React.useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, [activeThread]);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const selectThread = async (thread) => {
        try {
            setActiveThread(thread);
            setMessages(thread.messages);
            
            // Mark as read
            const unreadMsgs = thread.messages.filter(m => !m.objectData.IsReadByAdmin);
            for (const msg of unreadMsgs) {
                try { await trickleUpdateObject('support_message', msg.objectId, { IsReadByAdmin: true }); } catch(e){}
            }
            loadData();
        } catch (e) {
            console.warn("Failed to select thread:", e.message);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!replyText.trim() || !activeThread) return;

        const adminUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

        try {
            await trickleCreateObject('support_message', {
                UserId: activeThread.userId,
                SenderId: adminUser.id,
                Content: replyText,
                Timestamp: new Date().toISOString(),
                IsReadByAdmin: true,
                IsReadByUser: false
            });
            setReplyText('');
            loadData();
        } catch (err) {
            console.warn('Failed to send support reply:', err.message);
        }
    };

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" data-name="support-management" data-file="admin-components/SupportManagement.js">
            {/* Sidebar Threads List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <h2 className="font-bold text-gray-900 text-lg">Support Tickets</h2>
                    <div className="relative mt-3">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <div className="icon-search text-sm"></div>
                        </div>
                        <input type="text" placeholder="Search users..." className="w-full bg-gray-100 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {error ? (
                        <div className="text-center p-8 text-red-500 text-sm">
                            <div className="icon-wifi-off text-2xl mb-2 mx-auto"></div>
                            Network Error: {error}
                        </div>
                    ) : threads.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 text-sm">No support tickets found.</div>
                    ) : (
                        threads.map(thread => (
                            <div 
                                key={thread.userId} 
                                onClick={() => selectThread(thread)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors flex gap-3 ${activeThread?.userId === thread.userId ? 'bg-blue-50 border-blue-100' : 'bg-white'}`}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold uppercase overflow-hidden">
                                        {thread.user?.objectData?.Avatar ? (
                                            <img src={thread.user.objectData.Avatar} className="w-full h-full object-cover" />
                                        ) : (
                                            thread.user?.objectData?.Name?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    {thread.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                                            {thread.unreadCount}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-gray-900 text-sm truncate pr-2">{thread.user?.objectData?.Name || 'Unknown User'}</h4>
                                        <span className="text-xs text-gray-500 flex-shrink-0">
                                            {new Date(thread.lastMessage.objectData.Timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${thread.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                                        {thread.lastMessage.objectData.SenderId !== thread.userId ? 'You: ' : ''}{thread.lastMessage.objectData.Content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {activeThread ? (
                    <>
                        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold uppercase overflow-hidden">
                                    {activeThread.user?.objectData?.Avatar ? (
                                        <img src={activeThread.user.objectData.Avatar} className="w-full h-full object-cover" />
                                    ) : (
                                        activeThread.user?.objectData?.Name?.charAt(0) || 'U'
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{activeThread.user?.objectData?.Name || 'Unknown User'}</h3>
                                    <p className="text-xs text-gray-500">{activeThread.user?.objectData?.Email || 'No email'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <div className="icon-phone"></div>
                                </button>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <div className="icon-more-vertical"></div>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                            {messages.map(msg => {
                                const isAdmin = msg.objectData.SenderId !== activeThread.userId;
                                return (
                                    <div key={msg.objectId} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm ${isAdmin ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}>
                                            {msg.objectData.Content}
                                            <div className={`text-[10px] mt-1 text-right ${isAdmin ? 'text-blue-200' : 'text-gray-400'}`}>
                                                {new Date(msg.objectData.Timestamp).toLocaleString([], {month:'short', day:'numeric', hour: '2-digit', minute:'2-digit'})}
                                                {isAdmin && msg.objectData.IsReadByUser && <span className="ml-1 icon-check-check inline-block"></span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white">
                            <form onSubmit={handleSend} className="flex gap-3 items-end">
                                <button type="button" className="p-3 text-gray-400 hover:text-blue-600 transition-colors">
                                    <div className="icon-paperclip text-lg"></div>
                                </button>
                                <textarea 
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="Type a reply to the user..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[44px] max-h-32"
                                    rows="1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend(e);
                                        }
                                    }}
                                ></textarea>
                                <button type="submit" disabled={!replyText.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors shadow-sm mb-0.5">
                                    <div className="icon-send"></div>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200 shadow-inner">
                            <div className="icon-message-square text-3xl"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No conversation selected</h3>
                        <p className="text-sm">Select a support ticket from the list to start replying.</p>
                    </div>
                )}
            </div>
        </div>
    );
}