import React from 'react'

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = React.useState(false)
  React.useEffect(() => {
    const onUnhandled = (e) => {
      // Keep this minimal — report to console in dev
      console.error('Unhandled error:', e)
    }
    window.addEventListener('error', onUnhandled)
    return () => window.removeEventListener('error', onUnhandled)
  }, [])
  if (hasError) return <div className="p-8 text-center text-red-500">An error occurred loading the page.</div>
  return children
}

function LandingNav() {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="#" className={`text-2xl font-bold tracking-tight ${scrolled || mobileMenuOpen ? 'text-black' : 'text-white'}`}>
            Fine-ride
          </a>
          <div className={`hidden md:flex items-center gap-8 font-medium ${scrolled ? 'text-gray-600' : 'text-gray-200'}`}>
            <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
            <a href="#safety" className="hover:text-blue-500 transition-colors">Safety</a>
            <a href="driver.html" className="hover:text-blue-500 transition-colors">Drive</a>
            <a href="auth.html" className="hover:text-blue-500 transition-colors">Log In</a>
            <a href="auth.html?signup=true" className={`px-5 py-2 rounded-full transition-colors ${scrolled ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-100'}`}>
              Sign Up
            </a>
          </div>
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none">
              <div className={`icon-${mobileMenuOpen ? 'x' : 'menu'} text-2xl ${scrolled || mobileMenuOpen ? 'text-black' : 'text-white'}`}></div>
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 flex flex-col gap-6 text-xl font-medium md:hidden animate-fade-in">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-blue-600">Features</a>
          <a href="#safety" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-blue-600">Safety</a>
          <a href="driver.html" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 hover:text-blue-600">Drive</a>
          <hr className="border-gray-200" />
          <a href="auth.html" className="text-gray-800 hover:text-blue-600">Log In</a>
          <a href="auth.html" className="bg-black text-white text-center py-3 rounded-xl mt-2 hover:bg-gray-800">Sign Up</a>
        </div>
      )}
    </>
  )
}

function HeroSection() {
  return (
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Move around the city with ease</h1>
        <p className="text-lg text-gray-500 mb-6">Get a ride, on-demand. Experience the future of transportation with Fine-ride.</p>
        <div className="flex items-center justify-center gap-4">
          <a href="book.html" className="btn-black">Book a ride</a>
          <a href="auth.html" className="btn-white">Log in</a>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-800 rounded-lg">Fast bookings</div>
          <div className="p-6 bg-gray-800 rounded-lg">Driver tracking</div>
          <div className="p-6 bg-gray-800 rounded-lg">Secure payments</div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-8 mt-12 border-t border-gray-700">
      <div className="container mx-auto px-6 text-center text-sm text-gray-500">© Fine-ride</div>
    </footer>
  )
}

export default function LandingApp() {
  return (
    <div className="font-sans text-gray-900 bg-white" data-name="landing-app" data-file="landingcomponents.jsx">
      <ErrorBoundary>
        <LandingNav />
        <HeroSection />
        <FeaturesSection />
        <Footer />
      </ErrorBoundary>
    </div>
  )
}
