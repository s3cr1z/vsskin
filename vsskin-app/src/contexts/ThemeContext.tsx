'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Theme, Brand, ThemeFilters, ThemeSortOptions, ThemeContextType } from '@/types';
import { sampleThemes, sampleBrands } from '@/data/sampleData';

// Initial state
const initialFilters: ThemeFilters = {
  brands: [],
  types: [],
  tags: [],
  searchQuery: ''
};

const initialSortOptions: ThemeSortOptions = {
  field: 'downloads',
  direction: 'desc'
};

const initialState = {
  themes: sampleThemes,
  brands: sampleBrands,
  loading: false,
  error: null,
  selectedTheme: null,
  filters: initialFilters,
  sortOptions: initialSortOptions
};

// Action types
type ThemeAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_THEMES'; payload: Theme[] }
  | { type: 'SET_BRANDS'; payload: Brand[] }
  | { type: 'SET_SELECTED_THEME'; payload: Theme | null }
  | { type: 'SET_FILTERS'; payload: ThemeFilters }
  | { type: 'SET_SORT_OPTIONS'; payload: ThemeSortOptions }
  | { type: 'REFRESH_THEMES' };

// Reducer
function themeReducer(state: typeof initialState, action: ThemeAction) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_THEMES':
      return { ...state, themes: action.payload };
    case 'SET_BRANDS':
      return { ...state, brands: action.payload };
    case 'SET_SELECTED_THEME':
      return { ...state, selectedTheme: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_SORT_OPTIONS':
      return { ...state, sortOptions: action.payload };
    case 'REFRESH_THEMES':
      return { ...state, themes: sampleThemes, brands: sampleBrands };
    default:
      return state;
  }
}

// Helper functions
function filterThemes(themes: Theme[], filters: ThemeFilters): Theme[] {
  return themes.filter(theme => {
    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(theme.brand.id)) {
      return false;
    }
    
    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(theme.type)) {
      return false;
    }
    
    // Tags filter
    if (filters.tags.length > 0 && !filters.tags.some(tag => theme.metadata.tags.includes(tag))) {
      return false;
    }
    
    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchFields = [
        theme.name,
        theme.displayName,
        theme.description,
        theme.brand.displayName,
        ...theme.metadata.tags
      ].join(' ').toLowerCase();
      
      if (!searchFields.includes(query)) {
        return false;
      }
    }
    
    return true;
  });
}

function sortThemes(themes: Theme[], sortOptions: ThemeSortOptions): Theme[] {
  const sorted = [...themes].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortOptions.field) {
      case 'name':
        aValue = a.displayName.toLowerCase();
        bValue = b.displayName.toLowerCase();
        break;
      case 'rating':
        aValue = a.metadata.rating;
        bValue = b.metadata.rating;
        break;
      case 'downloads':
        aValue = a.metadata.downloads;
        bValue = b.metadata.downloads;
        break;
      case 'lastUpdated':
        aValue = new Date(a.metadata.lastUpdated);
        bValue = new Date(b.metadata.lastUpdated);
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortOptions.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOptions.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
}

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  
  // Memoized filtered and sorted themes
  const filteredAndSortedThemes = React.useMemo(() => {
    const filtered = filterThemes(state.themes, state.filters);
    return sortThemes(filtered, state.sortOptions);
  }, [state.themes, state.filters, state.sortOptions]);
  
  const contextValue: ThemeContextType = {
    themes: filteredAndSortedThemes,
    brands: state.brands,
    loading: state.loading,
    error: state.error,
    selectedTheme: state.selectedTheme,
    filters: state.filters,
    sortOptions: state.sortOptions,
    
    setSelectedTheme: (theme: Theme | null) => {
      dispatch({ type: 'SET_SELECTED_THEME', payload: theme });
    },
    
    setFilters: (filters: ThemeFilters) => {
      dispatch({ type: 'SET_FILTERS', payload: filters });
    },
    
    setSortOptions: (sortOptions: ThemeSortOptions) => {
      dispatch({ type: 'SET_SORT_OPTIONS', payload: sortOptions });
    },
    
    refreshThemes: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // In a real app, this would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        dispatch({ type: 'REFRESH_THEMES' });
        dispatch({ type: 'SET_ERROR', payload: null });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh themes' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use the theme context
export function useThemes(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemes must be used within a ThemeProvider');
  }
  return context;
}
