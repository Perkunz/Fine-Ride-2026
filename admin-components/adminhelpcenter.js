function AdminHelpCenter() {
  try {
    const [activeFaq, setActiveFaq] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');

    const faqs = [
      {
        category: 'User & Driver Management',
        icon: 'icon-users',
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        questions: [
          { q: 'How do I verify a new driver?', a: 'Navigate to "Users & Drivers", filter by "Drivers", and review their uploaded documents. Once verified, change their status to "Active".' },
          { q: 'How to suspend an account?', a: 'Click the edit or delete icon next to the user in the User Management tab. You can temporarily change their status to "Suspended".' },
          { q: 'Can I reset a user password?', a: 'For security reasons, admins cannot see passwords. Direct the user to use the "Forgot Password" link on the login page.' }
        ]
      },
      {
        category: 'Rides & Tracking',
        icon: 'icon-car',
        color: 'text-green-600',
        bg: 'bg-green-100',
        questions: [
          { q: 'How does the Live Tracker work?', a: 'The Live Tracker in the Ride Management tab automatically polls active rides (In Progress/Searching) every 10 seconds to display their status.' },
          { q: 'Can I cancel an ongoing ride?', a: 'Currently, only Riders and Drivers can cancel an active ride. Admins can manually update a ride status via the database if absolutely necessary for support reasons.' },
          { q: 'How do I handle a safety incident?', a: 'If a user reports an incident, locate the Ride ID in the Ride Management tab, verify the driver and rider details, and follow the platform\'s emergency protocol.' }
        ]
      },
      {
        category: 'Payments & Payouts',
        icon: 'icon-credit-card',
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        questions: [
          { q: 'When are driver payouts processed?', a: 'Payouts can be processed manually via the Payments tab. Standard operating procedure is weekly payouts every Tuesday.' },
          { q: 'How is the platform fee calculated?', a: 'The platform fee is a flat percentage (configurable in Settings) deducted from the total ride fare before driver payout.' },
          { q: 'How do I refund a rider?', a: 'Locate the transaction in the Payments tab. Refunds must currently be processed through your connected payment gateway dashboard (e.g., Stripe) using the Transaction ID.' }
        ]
      }
    ];

    const filteredFaqs = faqs.map(category => ({
      ...category,
      questions: category.questions.filter(item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.questions.length > 0);

    return (
      <div className="space-y-6 max-w-5xl mx-auto" data-name="admin-help-center" data-file="admin-components/AdminHelpCenter.js">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Help Center</h1>
            <p className="text-gray-500 text-sm">Guides, FAQs, and resources for platform administrators.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <div className="icon-search text-sm"></div>
            </div>
            <input 
              type="text" 
              placeholder="Search help articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="icon-circle-help text-4xl text-gray-300 mx-auto mb-3"></div>
            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {filteredFaqs.map((category, idx) => (
                <div key={idx} className="admin-card overflow-hidden">
                  <div className="p-4 border-b border-[var(--border-color)] bg-gray-50 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.bg} ${category.color}`}>
                      <div className={category.icon}></div>
                    </div>
                    <h2 className="font-bold text-gray-900">{category.category}</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {category.questions.map((item, qIdx) => {
                      const id = `${idx}-${qIdx}`;
                      const isOpen = activeFaq === id;
                      return (
                        <div key={qIdx} className="bg-white">
                          <button 
                            onClick={() => setActiveFaq(isOpen ? null : id)}
                            className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none"
                          >
                            <span className="font-medium text-gray-800 text-sm pr-4">{item.q}</span>
                            <div className={`icon-chevron-${isOpen ? 'up' : 'down'} text-gray-400 flex-shrink-0`}></div>
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4 text-sm text-gray-600 animate-fade-in leading-relaxed">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <div className="admin-card p-6 bg-blue-600 text-white border-none relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-blue-500 opacity-30">
                  <div className="icon-headphones text-9xl"></div>
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-xl mb-2">Need escalated support?</h3>
                  <p className="text-blue-100 text-sm mb-6">If you encounter a critical platform issue, contact the engineering team.</p>
                  <button className="w-full bg-white text-blue-600 font-bold py-2.5 rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
                    Contact Engineering
                  </button>
                </div>
              </div>

              <div className="admin-card p-6">
                <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="flex items-center gap-2 text-blue-600 hover:underline"><div className="icon-file-text"></div> Admin Policies Document</a></li>
                  <li><a href="#" className="flex items-center gap-2 text-blue-600 hover:underline"><div className="icon-file-text"></div> Platform Terms of Service</a></li>
                  <li><a href="#" className="flex items-center gap-2 text-blue-600 hover:underline"><div className="icon-external-link"></div> Payment Gateway Dashboard</a></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('AdminHelpCenter component error:', error);
    return null;
  }
}