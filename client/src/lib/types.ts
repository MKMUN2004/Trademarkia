import { TrademarkWithRelations, SearchResults } from '@shared/schema';

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SearchApiResponse extends ApiResponse<SearchResults> {}
export interface TrademarkApiResponse extends ApiResponse<TrademarkWithRelations> {}

// Waitlist types
export interface WaitlistSubmission {
  email: string;
}

export interface WaitlistResponse {
  message: string;
  id: number;
}

// UI state types
export interface MobileMenuState {
  isOpen: boolean;
}

export interface AdvancedSearchState {
  isOpen: boolean;
}

// Classification color mapping
export interface ClassificationColor {
  id: number;
  color: string;
}

// Filter option types
export interface FilterOption {
  id: number;
  name: string;
}

export type SortOption = 
  | 'relevance'
  | 'recent'
  | 'oldest'
  | 'name-asc'
  | 'name-desc';
