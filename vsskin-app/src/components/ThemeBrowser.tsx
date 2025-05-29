'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Search,
  Dropdown,
  MultiSelect,
  Tag,
  Button,
  Loading,
  Toggle
} from '@carbon/react';
import { Filter, Close, Star } from '@carbon/icons-react';
import { ThemeBrowserProps } from '@/types';
import ThemeCard from './ThemeCard';
import ThemeRecommendations from './ThemeRecommendations';
import { useThemes } from '@/contexts/ThemeContext';
import { useUserPreferences } from '@/hooks/useUserPreferences';

export default function ThemeBrowser() {
  const {
    themes,
    brands,
    loading,
    filters,
    sortOptions,
    setFilters,
    setSortOptions,
    setSelectedTheme
  } = useThemes();

  const { addFavorite, removeFavorite, isFavorite, addRecentTheme } = useUserPreferences();

  const [showFilters, setShowFilters] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);

  // Available filter options
  const sortItems = [
    { id: 'downloads-desc', text: 'Most Downloads' },
    { id: 'downloads-asc', text: 'Least Downloads' },
    { id: 'rating-desc', text: 'Highest Rated' },
    { id: 'rating-asc', text: 'Lowest Rated' },
    { id: 'name-asc', text: 'Name A-Z' },
    { id: 'name-desc', text: 'Name Z-A' },
    { id: 'lastUpdated-desc', text: 'Recently Updated' },
    { id: 'lastUpdated-asc', text: 'Oldest Updates' }
  ];

  const brandItems = brands.map(brand => ({
    id: brand.id,
    text: brand.displayName
  }));

  const typeItems = [
    { id: 'light', text: 'Light' },
    { id: 'dark', text: 'Dark' }
  ];

  // Get all unique tags from themes
  const allTags = Array.from(new Set(themes.flatMap(theme => theme.metadata.tags)));
  const tagItems = allTags.map(tag => ({
    id: tag,
    text: tag.charAt(0).toUpperCase() + tag.slice(1)
  }));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      searchQuery: e.target.value
    });
  };

  const handleSortChange = (selectedItem: any) => {
    const [field, direction] = selectedItem.selectedItem.id.split('-');
    setSortOptions({
      field: field as any,
      direction: direction as 'asc' | 'desc'
    });
  };

  const handleBrandFilterChange = (selectedItems: any) => {
    setFilters({
      ...filters,
      brands: selectedItems.selectedItems.map((item: any) => item.id)
    });
  };

  const handleTypeFilterChange = (selectedItems: any) => {
    setFilters({
      ...filters,
      types: selectedItems.selectedItems.map((item: any) => item.id)
    });
  };

  const handleTagFilterChange = (selectedItems: any) => {
    setFilters({
      ...filters,
      tags: selectedItems.selectedItems.map((item: any) => item.id)
    });
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      types: [],
      tags: [],
      searchQuery: ''
    });
  };

  const hasActiveFilters = 
    filters.brands.length > 0 || 
    filters.types.length > 0 || 
    filters.tags.length > 0 || 
    filters.searchQuery.length > 0;

  const handleThemePreview = (theme: any) => {
    setSelectedTheme(theme);
    addRecentTheme(theme.id);
  };

  const handleThemeInstall = (theme: any) => {
    // TODO: Implement theme installation
    console.log('Installing theme:', theme.name);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loading description="Loading themes..." />
      </div>
    );
  }

  return (
    <div className="theme-browser">
      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-section">
          <Search
            size="lg"
            labelText="Search themes"
            placeholder="Search themes, brands, or tags..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="theme-search"
          />
        </div>
        
        <div className="filter-section">
          <Button
            kind="secondary"
            renderIcon={Filter}
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle"
          >
            Filters
            {hasActiveFilters && <Tag type="red" size="sm">Active</Tag>}
          </Button>
          
          <Dropdown
            id="sort-dropdown"
            titleText=""
            label="Sort by"
            items={sortItems}
            selectedItem={sortItems.find(item => 
              item.id === `${sortOptions.field}-${sortOptions.direction}`
            )}
            onChange={handleSortChange}
            size="lg"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            <MultiSelect
              id="brand-filter"
              titleText="Brands"
              label="Select brands"
              items={brandItems}
              selectedItems={brandItems.filter(item => filters.brands.includes(item.id))}
              onChange={handleBrandFilterChange}
            />
            
            <MultiSelect
              id="type-filter"
              titleText="Theme Type"
              label="Select types"
              items={typeItems}
              selectedItems={typeItems.filter(item => filters.types.includes(item.id as 'light' | 'dark'))}
              onChange={handleTypeFilterChange}
            />
            
            <MultiSelect
              id="tag-filter"
              titleText="Tags"
              label="Select tags"
              items={tagItems}
              selectedItems={tagItems.filter(item => filters.tags.includes(item.id))}
              onChange={handleTagFilterChange}
            />
          </div>
          
          {hasActiveFilters && (
            <div className="filter-actions">
              <Button
                kind="secondary"
                size="sm"
                renderIcon={Close}
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <div className="summary-content">
          <h2>
            {themes.length} theme{themes.length !== 1 ? 's' : ''} found
            {hasActiveFilters && ' (filtered)'}
          </h2>
          
          <div className="ai-toggle">
            <Toggle
              id="ai-recommendations-toggle"
              labelText="Show AI Recommendations"
              toggled={showAIRecommendations}
              onToggle={setShowAIRecommendations}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {showAIRecommendations && !hasActiveFilters && (
        <ThemeRecommendations
          onThemeSelect={handleThemePreview}
          onFeedback={(themeId, positive) => {
            console.log('AI feedback:', themeId, positive);
            // TODO: Implement feedback tracking
          }}
          maxRecommendations={6}
        />
      )}

      {/* Theme Grid */}
      <div className="theme-grid">
        <Grid>
          {themes.map(theme => (
            <Column 
              key={theme.id} 
              sm={4} 
              md={4} 
              lg={4} 
              xlg={4}
              className="theme-column"
            >
              <ThemeCard
                theme={theme}
                onPreview={handleThemePreview}
                onInstall={handleThemeInstall}
                onFavorite={(theme) => {
                  if (isFavorite(theme.id)) {
                    removeFavorite(theme.id);
                  } else {
                    addFavorite(theme.id);
                  }
                }}
                isFavorited={isFavorite(theme.id)}
              />
            </Column>
          ))}
        </Grid>
      </div>

      {/* No Results */}
      {themes.length === 0 && (
        <div className="no-results">
          <h3>No themes found</h3>
          <p>Try adjusting your search criteria or filters.</p>
          {hasActiveFilters && (
            <Button kind="primary" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </div>
      )}

      <style jsx>{`
        .theme-browser {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .search-filter-bar {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }
        
        .search-section {
          flex: 1;
          min-width: 300px;
        }
        
        .filter-section {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .advanced-filters {
          padding: 1.5rem;
          border: 1px solid var(--cds-border-subtle);
          border-radius: 4px;
          background: var(--cds-background);
        }
        
        .filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .filter-actions {
          display: flex;
          justify-content: flex-end;
        }
        
        .results-summary h2 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--cds-text-primary);
        }
        
        .theme-grid {
          margin-top: 1rem;
        }
        
        .theme-column {
          margin-bottom: 2rem;
        }
        
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--cds-text-secondary);
        }
        
        .no-results h3 {
          margin: 0 0 1rem;
          color: var(--cds-text-primary);
        }
        
        .no-results p {
          margin: 0 0 2rem;
        }
        
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }
        
        @media (max-width: 768px) {
          .search-filter-bar {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-section {
            min-width: unset;
          }
          
          .filter-section {
            justify-content: space-between;
          }
          
          .filter-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
