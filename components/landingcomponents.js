function HeroSection() {
  const handleRequest = (e) => {
    e.preventDefault();
    const user = window.getCurrentUser ? window.getCurrentUser() : null;
    if (!user) window.location.href = 'auth.html';
    else window.location.href = 'book.html';
  };

  return (
    <section className="relative h-screen min-h-[600px] flex items-center pt-16">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80" 
          alt="City at night" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-white">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Get a ride,<br/>on-demand</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">Move around the city with ease. Request a ride, hop in, and go.</p>
          
          <div className="bg-white p-4 rounded-xl shadow-2xl mb-8 max-w-md">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 icon-map-pin text-gray-400"></div>
                <input type="text" placeholder="Enter pickup location" className="w-full bg-gray-100 rounded-lg py-3 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 icon-navigation text-gray-400"></div>
                <input type="text" placeholder="Where to?" className="w-full bg-gray-100 rounded-lg py-3 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <button onClick={handleRequest} className="btn-black w-full mt-2">See Prices & Request</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: 'icon-map', title: 'Real-time tracking', desc: 'Watch your driver arrive in real-time on the map.' },
    { icon: 'icon-dollar-sign', title: 'Affordable prices', desc: 'Clear, upfront pricing with no hidden fees.' },
    { icon: 'icon-car', title: 'Variety of options', desc: 'From affordable X to premium Black, choose your style.' },
    { icon: 'icon-calendar', title: 'Scheduled rides', desc: 'Book a ride up to 30 days in advance.' }
  ];

  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-16 text-center">Experience the future of transportation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <div className={`${feature.icon} text-3xl`}></div>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-24 bg-gray-50" id="how-it-works">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-16 text-center">How it works</h2>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Request a ride</h3>
                <p className="text-gray-600 text-lg">Enter your destination, choose your ride type, and confirm. It's that easy.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Get matched</h3>
                <p className="text-gray-600 text-lg">We'll find the nearest available driver. You can track their arrival on the map.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Arrive safely</h3>
                <p className="text-gray-600 text-lg">Hop in and relax. Payment is seamless and you can rate your driver afterwards.</p>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md bg-white p-4 rounded-3xl shadow-xl">
            <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80" alt="App map" className="w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SafetySection() {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <section className="py-24 bg-white" id="safety">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Safety is our priority</h2>
            <p className="text-xl text-gray-600 mb-8">Every ride is tracked from start to finish. We verify all drivers, provide in-app emergency buttons, and offer 24/7 incident support to ensure your peace of mind.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3"><div className="icon-circle-check text-green-500 text-xl"></div> Background-checked drivers</li>
              <li className="flex items-center gap-3"><div className="icon-circle-check text-green-500 text-xl"></div> Live GPS tracking shared with friends</li>
              <li className="flex items-center gap-3"><div className="icon-circle-check text-green-500 text-xl"></div> In-app emergency assistance (SOS)</li>
            </ul>
            <button onClick={() => setShowModal(true)} className="btn-outline !border-black !text-black hover:!bg-black hover:!text-white">Learn more about safety</button>
          </div>
          <div className="flex-1">
            <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" alt="Driver" className="rounded-2xl shadow-xl w-full" />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="icon-shield-check text-green-500"></div> User Safety Guide
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <div className="icon-x text-xl text-gray-500"></div>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-left">
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">1. Comprehensive Driver Screening</h4>
                <p className="text-gray-600">All drivers must pass a rigorous background check before their first trip. This includes reviewing their driving history and criminal records.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">2. Real-time Trip Sharing</h4>
                <p className="text-gray-600">Share your live location and trip status with family and friends directly from the app, so they always know when you'll arrive.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">3. 24/7 Incident Support</h4>
                <p className="text-gray-600">Our dedicated safety team is available around the clock to assist you with any concerns or emergencies that occur during your ride.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">4. In-App Emergency Button</h4>
                <p className="text-gray-600">In the unlikely event of an emergency, use the SOS button in the app to silently connect with local authorities and our safety team.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">5. Two-Way Rating System</h4>
                <p className="text-gray-600">Riders and drivers rate each other after every trip. Consistently low ratings can result in account deactivation to maintain a respectful community.</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-black w-full text-white">Got it</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function FAQSection() {
  const [openFaq, setOpenFaq] = React.useState(null);

  const faqs = [
    {
      q: "How do I know my ride is safe?",
      a: "Safety is our top priority. All our drivers undergo comprehensive background checks before they can accept rides. You can track your ride in real-time, share your trip status with loved ones, and use the in-app emergency SOS button if needed."
    },
    {
      q: "How is the fare calculated?",
      a: "Fares are calculated based on base rates, time, and distance. During times of high demand, prices may temporarily increase (surge pricing) to ensure reliability. You will always see the estimated price before confirming your ride."
    },
    {
      q: "Can I schedule a ride in advance?",
      a: "Yes! You can schedule a ride up to 30 days in advance. Just tap the calendar icon when booking your ride to choose your preferred pickup date and time."
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all major credit and debit cards, Apple Pay, Google Pay, and select digital wallets. You can easily manage your payment methods in the profile section."
    },
    {
      q: "What if I leave an item in the car?",
      a: "If you've left an item behind, you can use the 'Chat with Us' support feature in your profile or access your ride history to contact your driver directly for up to 24 hours after the trip ends."
    }
  ];

  return (
    <section className="py-24 bg-gray-50" id="faq">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600">Got questions? We've got answers.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all hover:shadow-md">
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                >
                  <span className="font-bold text-lg text-gray-900">{faq.q}</span>
                  <div className={`icon-chevron-${isOpen ? 'up' : 'down'} text-xl text-gray-400 transition-transform`}></div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-gray-600 animate-fade-in leading-relaxed border-t border-gray-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <div className="icon-circle-help text-3xl text-blue-600 mb-3 mx-auto"></div>
          <h3 className="font-bold text-xl text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">Our 24/7 support team is always ready to assist you with any issues.</p>
          <a href="auth.html" className="btn-black inline-flex">Contact Support</a>
        </div>
      </div>
    </section>
  );
}

function BusinessSection() {
  return (
    <section className="py-24 bg-gray-900 text-white" id="business">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=800&q=80" alt="Business Meeting" className="rounded-2xl shadow-xl w-full" />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Take your business further</h2>
            <p className="text-xl text-gray-300 mb-8">Manage rides and meals for your employees easily. Fine-ride for Business offers corporate accounts, automated expense management, and dedicated support.</p>
            <button className="btn-white">Explore Business Solutions</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DownloadSection() {
  return (
    <section className="py-24 bg-gray-50 text-center" id="download">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-4xl font-bold mb-6">Get started with Fine-ride</h2>
        <p className="text-xl text-gray-600 mb-12">Scan the QR code to download the app or visit the app stores directly.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="bg-white p-6 rounded-xl shadow-lg inline-block">
            {/* Fake QR code using a div pattern */}
            <div className="w-48 h-48 bg-black flex items-center justify-center text-white text-sm font-bold">
              [ QR CODE ]
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500 text-center">Scan to download</p>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button className="btn-black w-full justify-start text-left px-8 py-4 gap-4">
              <div className="icon-apple text-3xl"></div>
              <div>
                <div className="text-xs text-gray-300">Download on the</div>
                <div className="text-xl font-bold">App Store</div>
              </div>
            </button>
            <button className="btn-black w-full justify-start text-left px-8 py-4 gap-4">
              <div className="icon-chrome text-3xl"></div>
              <div>
                <div className="text-xs text-gray-300">GET IT ON</div>
                <div className="text-xl font-bold">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Fine-ride</h3>
            <p className="text-gray-400">Moving people to better places.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Fine Ride</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Fine Ride</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="book.html" className="hover:text-white transition-colors">Ride</a></li>
              <li><a href="driver.html" className="hover:text-white transition-colors">Drive</a></li>
              <li><a href="#business" className="hover:text-white transition-colors">Business</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-lg">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              <li><a href="admin.html" className="hover:text-white transition-colors">Admin Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Fine-ride Technologies Inc.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}