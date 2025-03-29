import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <span className="font-bold text-xl text-primary">Trademarkia</span>
                </div>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/">
                  <span className="text-primary font-medium cursor-pointer">Search</span>
                </Link>
                <Link href="/services">
                  <span className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer">Services</span>
                </Link>
                <Link href="/resources">
                  <span className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer">Resources</span>
                </Link>
                <Link href="/pricing">
                  <span className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer">Pricing</span>
                </Link>
                <Link href="/about">
                  <span className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer">About</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <Link href="/login">
              <span className="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium cursor-pointer">Login</span>
            </Link>
            <Link href="/signup">
              <span className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                Sign Up
              </span>
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/">
            <span className="bg-primary text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">Search</span>
          </Link>
          <Link href="/services">
            <span className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">Services</span>
          </Link>
          <Link href="/resources">
            <span className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">Resources</span>
          </Link>
          <Link href="/pricing">
            <span className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">Pricing</span>
          </Link>
          <Link href="/about">
            <span className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">About</span>
          </Link>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <Link href="/login">
              <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer">Login</span>
            </Link>
            <Link href="/signup">
              <span className="mt-1 block px-3 py-2 rounded-md text-base font-medium bg-primary text-white cursor-pointer">Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
