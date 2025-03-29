import { useState, useEffect } from "react";

export default function Hero() {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="text-center">
          <h1 
            className={`text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl
              transition-all duration-700 ease-in-out transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <span className="block text-primary">Search & Register</span>
            <span className="block">Trademarks</span>
          </h1>
          <p 
            className={`mt-4 text-xl text-gray-500 max-w-2xl mx-auto
              transition-all duration-700 delay-300 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'}`}
          >
            Find, search, and register trademarks with the most comprehensive 
            trademark search engine in the industry.
          </p>
          
          <div 
            className={`mt-8 flex justify-center gap-4
              transition-all duration-700 delay-500 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'}`}
          >
            <button 
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => document.getElementById('query')?.focus()}
            >
              Search Now
            </button>
            <button 
              className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm hover:shadow-md transition-all duration-200"
            >
              Learn More
            </button>
          </div>
          
          <div 
            className={`mt-10 text-center text-sm text-gray-400
              transition-all duration-700 delay-700 ease-in-out ${animate ? 'opacity-100' : 'opacity-0'}`}
          >
            <p>Over 10 million trademarks in our database</p>
            <div className="mt-2 flex justify-center gap-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Live updates</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced filters</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Comprehensive results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
