import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (route: string) => {
    return location === route;
  };

  return (
    <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200">
                  <span className="font-bold text-xl text-primary">Trademarkia</span>
                </div>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-6">
                <Link href="/">
                  <span className={`${isActiveRoute('/') ? 'text-primary' : 'text-gray-500 hover:text-gray-700'} font-medium cursor-pointer transition-colors duration-200 pb-1 ${isActiveRoute('/') ? 'border-b-2 border-primary' : ''}`}>
                    Search
                  </span>
                </Link>
                <Link href="/services">
                  <span className={`${isActiveRoute('/services') ? 'text-primary' : 'text-gray-500 hover:text-gray-700'} font-medium cursor-pointer transition-colors duration-200 pb-1 ${isActiveRoute('/services') ? 'border-b-2 border-primary' : ''}`}>
                    Services
                  </span>
                </Link>
                <Link href="/resources">
                  <span className={`${isActiveRoute('/resources') ? 'text-primary' : 'text-gray-500 hover:text-gray-700'} font-medium cursor-pointer transition-colors duration-200 pb-1 ${isActiveRoute('/resources') ? 'border-b-2 border-primary' : ''}`}>
                    Resources
                  </span>
                </Link>
                <Link href="/pricing">
                  <span className={`${isActiveRoute('/pricing') ? 'text-primary' : 'text-gray-500 hover:text-gray-700'} font-medium cursor-pointer transition-colors duration-200 pb-1 ${isActiveRoute('/pricing') ? 'border-b-2 border-primary' : ''}`}>
                    Pricing
                  </span>
                </Link>
                <Link href="/about">
                  <span className={`${isActiveRoute('/about') ? 'text-primary' : 'text-gray-500 hover:text-gray-700'} font-medium cursor-pointer transition-colors duration-200 pb-1 ${isActiveRoute('/about') ? 'border-b-2 border-primary' : ''}`}>
                    About
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <Link href="/login">
              <span className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium cursor-pointer transition-colors duration-200">Login</span>
            </Link>
            <Link href="/signup">
              <span className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200">
                Sign Up
              </span>
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu with animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/">
            <span className={`${isActiveRoute('/') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} block px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors duration-200`}>
              Search
            </span>
          </Link>
          <Link href="/services">
            <span className={`${isActiveRoute('/services') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} block px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors duration-200`}>
              Services
            </span>
          </Link>
          <Link href="/resources">
            <span className={`${isActiveRoute('/resources') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} block px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors duration-200`}>
              Resources
            </span>
          </Link>
          <Link href="/pricing">
            <span className={`${isActiveRoute('/pricing') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} block px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors duration-200`}>
              Pricing
            </span>
          </Link>
          <Link href="/about">
            <span className={`${isActiveRoute('/about') ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'} block px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors duration-200`}>
              About
            </span>
          </Link>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <Link href="/login">
              <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                Login
              </span>
            </Link>
            <Link href="/signup">
              <span className="mt-1 block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-blue-700 cursor-pointer transition-colors duration-200">
                Sign Up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
