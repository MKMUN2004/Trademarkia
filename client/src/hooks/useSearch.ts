import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchParams, SearchResults } from "@shared/schema";

export default function useSearch() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<SearchParams>({
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
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Build query key based on search params
  const getQueryKey = (params: SearchParams) => {
    return [
      '/api/search',
      params
    ];
  };

  // This function generates the full API URL with query parameters
  const getSearchUrl = (params: SearchParams) => {
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set("query", params.query);
    if (params.ownerFilter) queryParams.set("ownerFilter", params.ownerFilter);
    if (params.lawFirmFilter) queryParams.set("lawFirmFilter", params.lawFirmFilter);
    if (params.attorneyFilter) queryParams.set("attorneyFilter", params.attorneyFilter);
    if (params.statusFilter) queryParams.set("statusFilter", params.statusFilter);
    if (params.filingDateFrom) queryParams.set("filingDateFrom", params.filingDateFrom);
    if (params.filingDateTo) queryParams.set("filingDateTo", params.filingDateTo);
    if (params.registrationNumber) queryParams.set("registrationNumber", params.registrationNumber);
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params.page) queryParams.set("page", params.page.toString());
    if (params.perPage) queryParams.set("perPage", params.perPage.toString());
    
    return `/api/search?${queryParams.toString()}`;
  };

  // Create query with enabled flag to control when it runs
  const { data: searchResults, isLoading: isSearching, isError, error } = useQuery<SearchResults, Error>({
    queryKey: getQueryKey(searchParams),
    queryFn: async () => {
      const response = await fetch(getSearchUrl(searchParams));
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error searching trademarks");
      }
      return response.json();
    },
    enabled: hasSearched,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Handle search
  const performSearch = useCallback((params: SearchParams) => {
    // Check if at least one field has a value
    const hasSearchCriteria = 
      !!params.query ||
      !!params.ownerFilter ||
      !!params.lawFirmFilter ||
      !!params.attorneyFilter ||
      !!params.statusFilter ||
      !!params.filingDateFrom ||
      !!params.filingDateTo ||
      !!params.registrationNumber;
    
    if (!hasSearchCriteria) {
      setSearchError("Please enter at least one search criteria");
      return;
    }
    
    setSearchError(null);
    setSearchParams(params);
    setHasSearched(true);
    
    // Invalidate the query to force refetch
    queryClient.invalidateQueries({ queryKey: getQueryKey(params) });
  }, [queryClient]);

  // Retry search with current params
  const retrySearch = useCallback(() => {
    setSearchError(null);
    queryClient.invalidateQueries({ queryKey: getQueryKey(searchParams) });
  }, [searchParams, queryClient]);

  // Update error state when query fails
  if (isError && error) {
    console.error("Search error:", error);
    if (!searchError) {
      setSearchError(error.message || "An error occurred while searching. Please try again.");
    }
  }

  return {
    searchParams,
    setSearchParams,
    isSearching,
    hasSearched,
    searchResults,
    searchError,
    performSearch,
    retrySearch,
  };
}
