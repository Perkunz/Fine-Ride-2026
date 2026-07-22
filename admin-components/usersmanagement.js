function UsersManagement() {
  try {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterType, setFilterType] = React.useState('All Types');

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await trickleListObjects('user', 500, true, undefined);
            if (res && res.items) {
                setUsers(res.items);
            }
        } catch (err) {
            console.warn("Failed to fetch users. Service might be down.");
            const isJsonError = err.message && err.message.includes('not valid JSON');
            const isFetchError = err.message && err.message.includes('Failed to fetch');
            setError(isJsonError ? "Database service is currently unavailable." : isFetchError ? "Network error: Unable to reach the server." : "Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await trickleDeleteObject('user', userId);
                setUsers(users.filter(u => u.objectId !== userId));
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

    const getStatusBadge = (status) => {
      switch(status) {
        case 'Active':
        case 'Online': return <span className="badge badge-success">{status}</span>;
        case 'Offline': return <span className="badge badge-warning text-gray-700 bg-gray-100">{status}</span>;
        case 'Suspended': return <span className="badge bg-red-100 text-red-700">{status}</span>;
        default: return <span className="badge bg-gray-100">{status || 'Unknown'}</span>;
      }
    };

    const filteredUsers = users.filter(user => {
        const data = user.objectData;
        const matchesSearch = (data.Name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (data.Email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All Types' || 
                            (filterType === 'Riders' && data.Role === 'Rider') || 
                            (filterType === 'Drivers' && data.Role === 'Driver') ||
                            (filterType === 'Admins' && data.Role === 'Admin');
        return matchesSearch && matchesType;
    });

    return (
      <div className="space-y-6" data-name="users-management" data-file="admin-components/UsersManagement.js">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <button onClick={fetchUsers} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
            <div className="icon-refresh-cw"></div> Refresh
          </button>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] flex flex-col md:flex-row gap-4 bg-gray-50">
            <div className="relative flex-1 max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <div className="icon-search text-sm"></div>
              </div>
              <input 
                type="text" 
                placeholder="Search users by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
              />
            </div>
            <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none focus:border-blue-500"
            >
              <option>All Types</option>
              <option>Riders</option>
              <option>Drivers</option>
              <option>Admins</option>
            </select>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
                <div className="flex items-center justify-center h-48 text-gray-500">
                    <div className="icon-loader animate-spin text-2xl mr-2"></div> Loading users...
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-48 text-red-500">
                    <div className="icon-wifi-off text-3xl mb-2"></div>
                    <p>Network Error: {error}</p>
                    <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">Try Again</button>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-500">
                    No users found matching your criteria.
                </div>
            ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Joined Date</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredUsers.map((user) => (
                      <tr key={user.objectId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs overflow-hidden">
                              {user.objectData.Avatar ? <img src={user.objectData.Avatar} className="w-full h-full object-cover"/> : (user.objectData.Name || 'U').charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.objectData.Name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{user.objectData.Email || 'No Email'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-bold px-2 py-1 rounded-md ${
                              user.objectData.Role === 'Driver' ? 'bg-blue-100 text-blue-700' : 
                              user.objectData.Role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.objectData.Role || 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(user.objectData.Status)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          <button onClick={() => handleDelete(user.objectId)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Delete User">
                            <div className="icon-trash text-lg"></div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
          </div>
          <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between text-sm text-gray-500 bg-gray-50">
            <span>Showing {filteredUsers.length} entries</span>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('UsersManagement component error:', error);
    return null;
  }
}