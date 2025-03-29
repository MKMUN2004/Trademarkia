import { useState } from "react";
import { TrademarkWithRelations, SearchResults as SearchResultsType } from "@shared/schema";
import TrademarkCard from "./trademark/TrademarkCard";
import Pagination from "./trademark/Pagination";
import { useToast } from "@/hooks/use-toast";

interface SearchResultsProps {
  isSearching: boolean;
  hasSearched: boolean;
  searchResults: SearchResultsType | null;
  searchError: string | null;
  onSortChange: (sortBy: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export default function SearchResults({
  isSearching,
  hasSearched, 
  searchResults,
  searchError,
  onSortChange,
  onPageChange,
  onRetry
}: SearchResultsProps) {
  const { toast } = useToast();
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Function to copy the current URL to clipboard
  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Search results link copied to clipboard!",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Could not copy link to clipboard. Please try again.",
          variant: "destructive",
        });
      });
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      {/* Status bar (always visible when results are shown) */}
      {(hasSearched || isSearching) && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Search Results</h3>
              {searchResults && (
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Found {searchResults.total} trademark{searchResults.total !== 1 ? 's' : ''} 
                  {searchResults.query ? ` matching "${searchResults.query}"` : ''}
                </p>
              )}
            </div>
            <div className="flex items-center">
              <div className="mr-4">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={copyShareLink}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
              <div>
                <label htmlFor="sortBy" className="sr-only">Sort by</label>
                <select
                  id="sortBy"
                  name="sortBy"
                  className="block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  onChange={handleSortChange}
                  value={searchResults?.query || "relevance"}
                  disabled={isSearching}
                >
                  <option value="relevance">Relevance</option>
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isSearching && (
        <div id="loading-state">
          {Array(5).fill(null).map((_, i) => (
            <div key={`skeleton-${i}`} className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
              <div className="px-4 py-5 sm:px-6">
                <div className="skeleton bg-gray-200 h-6 w-3/4 rounded"></div>
                <div className="skeleton bg-gray-200 h-4 w-1/2 rounded mt-2"></div>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="skeleton bg-gray-200 h-20 w-full rounded"></div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
                    <div className="skeleton bg-gray-200 h-4 w-full rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {hasSearched && !isSearching && searchResults && searchResults.trademarks.length === 0 && !searchError && (
        <div id="empty-state">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg py-12">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">No trademarks found</h3>
              <p className="mt-1 text-gray-500">Your search did not match any trademarks. Try using different keywords or filters.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {searchError && (
        <div id="error-state">
          <div className="bg-red-50 shadow overflow-hidden sm:rounded-lg py-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-red-800">An error occurred</h3>
              <p className="mt-1 text-red-700">{searchError || "We couldn't complete your search. Please try again later."}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={onRetry}
              >
                Retry Search
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Results list */}
      {!isSearching && !searchError && searchResults && searchResults.trademarks.length > 0 && (
        <div id="results-list">
          {searchResults.trademarks.map((trademark: TrademarkWithRelations) => (
            <TrademarkCard key={trademark.id} trademark={trademark} />
          ))}
          
          {/* Pagination */}
          {searchResults.total > searchResults.perPage && (
            <Pagination
              currentPage={searchResults.page}
              totalPages={Math.ceil(searchResults.total / searchResults.perPage)}
              totalResults={searchResults.total}
              perPage={searchResults.perPage}
              startIndex={(searchResults.page - 1) * searchResults.perPage + 1}
              endIndex={Math.min(searchResults.page * searchResults.perPage, searchResults.total)}
              onPageChange={onPageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}
