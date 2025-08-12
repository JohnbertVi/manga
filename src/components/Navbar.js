import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <nav className={`sticky top-0 z-50 w-full py-3 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/80 backdrop-blur-md border-b border-indigo-800/30 shadow-lg' 
        : 'bg-black border-b border-indigo-900/10'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-300"></div>
                <div className="relative flex items-center justify-center w-8 h-8 bg-black rounded-full border border-indigo-500/50">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-white">MANGA</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">HINOG</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm font-bold tracking-wide">
              HOME
            </Link>
            <Link href="/library" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm font-bold tracking-wide">
              LIBRARY
            </Link>
            <Link href="/browse" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm font-bold tracking-wide">
              BROWSE
            </Link>
            
            {/* Search bar with glow effect */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-70 transition duration-300"></div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search manga..."
                  className="bg-gray-900/80 text-white text-sm px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-500 w-56 border border-indigo-500/30"
                />
                <button className="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* User actions - visible on desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button className="p-2 rounded-full text-gray-400 hover:text-indigo-400 transition-colors relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-70 transition duration-300"></div>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </div>
            </button>
            <button className="p-2 rounded-full text-gray-400 hover:text-indigo-400 transition-colors relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-70 transition duration-300"></div>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="text-gray-300 hover:text-indigo-400 focus:outline-none transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-indigo-900/20 mt-3">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search manga..."
                className="bg-gray-900/80 text-white text-sm px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full border border-indigo-500/30"
              />
              <button className="absolute right-3 top-3 text-gray-400 hover:text-indigo-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 pb-3">
              <Link href="/" className="block text-gray-300 hover:text-indigo-400 font-bold text-sm py-2 tracking-wide">
                HOME
              </Link>
              <Link href="/library" className="block text-gray-300 hover:text-indigo-400 font-bold text-sm py-2 tracking-wide">
                LIBRARY
              </Link>
              <Link href="/browse" className="block text-gray-300 hover:text-indigo-400 font-bold text-sm py-2 tracking-wide">
                BROWSE
              </Link>
            </div>
            
            {/* Mobile user actions */}
            <div className="pt-3 border-t border-indigo-900/20 flex justify-between">
              <button className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 text-sm py-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Notifications
              </button>
              <button className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 text-sm py-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Favorites
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
