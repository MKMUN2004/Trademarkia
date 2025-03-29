import { useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import WaitlistSection from "@/components/WaitlistSection";
import Footer from "@/components/Footer";
import useSearch from "@/hooks/useSearch";

export default function Home() {
  const [location, setLocation] = useLocation();
  const { 
    searchParams,
    setSearchParams,
    isSearching,
    hasSearched,
    searchResults,
    searchError,
    performSearch,
    retrySearch,
  } = useSearch();

  // On initial load, parse URL parameters to restore search state
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    const initialParams = {
      query: params.get("query") || "",
      ownerFilter: params.get("owner") || "",
      lawFirmFilter: params.get("lawFirm") || "",
      attorneyFilter: params.get("attorney") || "",
      statusFilter: params.get("status") || "",
      filingDateFrom: params.get("dateFrom") || "",
      filingDateTo: params.get("dateTo") || "",
      registrationNumber: params.get("regNum") || "",
      sortBy: params.get("sortBy") || "relevance",
      page: params.get("page") ? parseInt(params.get("page") as string) : 1,
      perPage: params.get("perPage") ? parseInt(params.get("perPage") as string) : 10
    };
    
    setSearchParams(initialParams);
    
    // If there are search parameters, automatically perform the search
    if (initialParams.query || initialParams.ownerFilter || initialParams.lawFirmFilter || 
        initialParams.attorneyFilter || initialParams.statusFilter || initialParams.filingDateFrom || 
        initialParams.filingDateTo || initialParams.registrationNumber) {
      performSearch(initialParams);
    }
  }, []);

  // Update URL when search params change
  useEffect(() => {
    if (hasSearched) {
      const queryParams = new URLSearchParams();
      
      if (searchParams.query) queryParams.set("query", searchParams.query);
      if (searchParams.ownerFilter) queryParams.set("owner", searchParams.ownerFilter);
      if (searchParams.lawFirmFilter) queryParams.set("lawFirm", searchParams.lawFirmFilter);
      if (searchParams.attorneyFilter) queryParams.set("attorney", searchParams.attorneyFilter);
      if (searchParams.statusFilter) queryParams.set("status", searchParams.statusFilter);
      if (searchParams.filingDateFrom) queryParams.set("dateFrom", searchParams.filingDateFrom);
      if (searchParams.filingDateTo) queryParams.set("dateTo", searchParams.filingDateTo);
      if (searchParams.registrationNumber) queryParams.set("regNum", searchParams.registrationNumber);
      if (searchParams.sortBy && searchParams.sortBy !== "relevance") queryParams.set("sortBy", searchParams.sortBy);
      if (searchParams.page && searchParams.page > 1) queryParams.set("page", searchParams.page.toString());
      if (searchParams.perPage && searchParams.perPage !== 10) queryParams.set("perPage", searchParams.perPage.toString());
      
      const queryString = queryParams.toString();
      const newPath = queryString ? `/?${queryString}` : "/";
      
      // Update URL without reloading page
      window.history.pushState(null, "", newPath);
    }
  }, [searchParams, hasSearched]);

  // Handle search submission
  const handleSearch = (params: any) => {
    performSearch(params);
  };

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    const newParams = { ...searchParams, sortBy, page: 1 };
    setSearchParams(newParams);
    performSearch(newParams);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newParams = { ...searchParams, page };
    setSearchParams(newParams);
    performSearch(newParams);
    
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <Hero />
      <SearchForm 
        initialSearchParams={searchParams}
        onSearch={handleSearch}
        isSearching={isSearching}
      />
      <SearchResults
        isSearching={isSearching}
        hasSearched={hasSearched}
        searchResults={searchResults}
        searchError={searchError}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
        onRetry={retrySearch}
      />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
