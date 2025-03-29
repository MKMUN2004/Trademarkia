import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchParams, Owner, LawFirm, Attorney } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface SearchFormProps {
  initialSearchParams: SearchParams;
  onSearch: (params: SearchParams) => void;
  isSearching: boolean;
}

export default function SearchForm({ initialSearchParams, onSearch, isSearching }: SearchFormProps) {
  const { toast } = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Reset form when initialSearchParams change (e.g., from URL)
  useEffect(() => {
    setSearchParams(initialSearchParams);
    
    // Show advanced search if any advanced fields are filled
    const hasAdvancedFilters = !!initialSearchParams.filingDateFrom || 
                              !!initialSearchParams.filingDateTo || 
                              !!initialSearchParams.registrationNumber;
    setShowAdvanced(hasAdvancedFilters);
  }, [initialSearchParams]);

  // Fetch owners for dropdown
  const { data: owners = [] as Owner[], isLoading: ownersLoading } = useQuery<Owner[]>({
    queryKey: ['/api/owners'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch law firms for dropdown
  const { data: lawFirms = [] as LawFirm[], isLoading: lawFirmsLoading } = useQuery<LawFirm[]>({
    queryKey: ['/api/law-firms'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch attorneys for dropdown
  const { data: attorneys = [] as Attorney[], isLoading: attorneysLoading } = useQuery<Attorney[]>({
    queryKey: ['/api/attorneys'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setShowAdvanced(checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate search query if provided
    if (searchParams.query && searchParams.query.trim().length < 2) {
      toast({
        title: "Search query too short",
        description: "Please enter at least 2 characters for your search",
        variant: "destructive",
      });
      return;
    }
    
    onSearch(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({
      query: "",
      ownerFilter: "",
      lawFirmFilter: "",
      attorneyFilter: "",
      statusFilter: "",
      filingDateFrom: "",
      filingDateTo: "",
      registrationNumber: "",
      sortBy: "relevance",
      page: 1,
      perPage: 10
    });
    setShowAdvanced(false);
    
    toast({
      title: "Filters cleared",
      description: "All search filters have been reset",
    });
    
    // Focus the main search input after clearing
    document.getElementById("query")?.focus();
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden sm:rounded-lg max-w-7xl mx-auto mb-10 px-4 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Trademark Search</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Search through millions of trademarks across all industries.</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <form id="search-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="query" className="block text-sm font-medium text-gray-700">Trademark Search</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 transition-colors duration-200 ${focusedInput === 'query' ? 'text-primary' : 'text-gray-400'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="query"
                  id="query"
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-4"
                  placeholder="Enter trademark name, phrase, or keyword"
                  value={searchParams.query || ""}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedInput('query')}
                  onBlur={() => setFocusedInput(null)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button 
                    type="submit" 
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSearching ? 'bg-gray-400' : 'bg-primary hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-10 mr-2 transition-all duration-200`}
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </span>
                    ) : "Search"}
                  </button>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="ownerFilter" className="block text-sm font-medium text-gray-700">Owner</label>
                  <select 
                    id="ownerFilter" 
                    name="ownerFilter" 
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md transition-shadow duration-200 ${focusedInput === 'ownerFilter' ? 'shadow-md' : ''}`}
                    value={searchParams.ownerFilter || ""}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('ownerFilter')}
                    onBlur={() => setFocusedInput(null)}
                  >
                    <option value="">Any Owner</option>
                    {ownersLoading ? (
                      <option disabled>Loading owners...</option>
                    ) : (
                      owners.map((owner) => (
                        <option key={owner.id} value={owner.name}>{owner.name}</option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="lawFirmFilter" className="block text-sm font-medium text-gray-700">Law Firm</label>
                  <select 
                    id="lawFirmFilter" 
                    name="lawFirmFilter" 
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md transition-shadow duration-200 ${focusedInput === 'lawFirmFilter' ? 'shadow-md' : ''}`}
                    value={searchParams.lawFirmFilter || ""}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('lawFirmFilter')}
                    onBlur={() => setFocusedInput(null)}
                  >
                    <option value="">Any Law Firm</option>
                    {lawFirmsLoading ? (
                      <option disabled>Loading law firms...</option>
                    ) : (
                      lawFirms.map((firm) => (
                        <option key={firm.id} value={firm.name}>{firm.name}</option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="attorneyFilter" className="block text-sm font-medium text-gray-700">Attorney</label>
                  <select 
                    id="attorneyFilter" 
                    name="attorneyFilter" 
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md transition-shadow duration-200 ${focusedInput === 'attorneyFilter' ? 'shadow-md' : ''}`}
                    value={searchParams.attorneyFilter || ""}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('attorneyFilter')}
                    onBlur={() => setFocusedInput(null)}
                  >
                    <option value="">Any Attorney</option>
                    {attorneysLoading ? (
                      <option disabled>Loading attorneys...</option>
                    ) : (
                      attorneys.map((attorney) => (
                        <option key={attorney.id} value={attorney.name}>{attorney.name}</option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Status</label>
                  <select 
                    id="statusFilter" 
                    name="statusFilter" 
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md transition-shadow duration-200 ${focusedInput === 'statusFilter' ? 'shadow-md' : ''}`}
                    value={searchParams.statusFilter || ""}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('statusFilter')}
                    onBlur={() => setFocusedInput(null)}
                  >
                    <option value="">Any Status</option>
                    <option value="Registered">Registered</option>
                    <option value="Pending">Pending</option>
                    <option value="Abandoned">Abandoned</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Expired">Expired</option>
                    <option value="Opposition">Opposition</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      id="advanced-search" 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={showAdvanced}
                      onChange={handleCheckboxChange}
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                  <label htmlFor="advanced-search" className="text-sm text-gray-700 cursor-pointer">Advanced Search Options</label>
                </div>
                <button 
                  type="button" 
                  className="flex items-center text-primary hover:text-blue-700 text-sm font-medium focus:outline-none transition-colors duration-200"
                  onClick={clearFilters}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Advanced search section */}
            <div 
              className={`sm:col-span-6 transition-all duration-500 ease-in-out overflow-hidden ${
                showAdvanced ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label htmlFor="filingDateFrom" className="block text-sm font-medium text-gray-700">Filing Date From</label>
                  <input 
                    type="date" 
                    id="filingDateFrom" 
                    name="filingDateFrom" 
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-shadow duration-200 ${focusedInput === 'filingDateFrom' ? 'shadow-md' : ''}`}
                    value={searchParams.filingDateFrom || ""}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('filingDateFrom')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </div>
                
                <div>
                  <label htmlFor="filingDateTo" className="block text-sm font-medium text-gray-700">Filing Date To</label>
                  <input 
                    type="date" 
                    id="filingDateTo" 
                    name="filingDateTo" 
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-shadow duration-200 ${focusedInput === 'filingDateTo' ? 'shadow-md' : ''}`}
                    value={searchParams.filingDateTo || ""}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('filingDateTo')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </div>
                
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">Registration/Serial Number</label>
                  <input 
                    type="text" 
                    id="registrationNumber" 
                    name="registrationNumber" 
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-shadow duration-200 ${focusedInput === 'registrationNumber' ? 'shadow-md' : ''}`}
                    placeholder="Enter registration or serial number"
                    value={searchParams.registrationNumber || ""}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedInput('registrationNumber')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
