'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Heading,
  Button,
  Loading,
  InlineNotification
} from '@carbon/react';
import { FavoriteFilled, TrashCan } from '@carbon/icons-react';
import { Theme } from '@/types';
import ThemeCard from './ThemeCard';
import { useThemes } from '@/contexts/ThemeContext';

export default function FavoritesPage() {
  const { themes, setSelectedTheme } = useThemes();
  const [favorites, setFavorites] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load favorites from localStorage
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('vsskin-favorites');
        if (savedFavorites) {
          const favoriteIds = JSON.parse(savedFavorites);
          const favoriteThemes = themes.filter(theme => favoriteIds.includes(theme.id));
          setFavorites(favoriteThemes);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [themes]);

  const removeFavorite = (themeId: string) => {
    try {
      const savedFavorites = localStorage.getItem('vsskin-favorites');
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        const updatedIds = favoriteIds.filter((id: string) => id !== themeId);
        localStorage.setItem('vsskin-favorites', JSON.stringify(updatedIds));
        setFavorites(prev => prev.filter(theme => theme.id !== themeId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const clearAllFavorites = () => {
    try {
      localStorage.removeItem('vsskin-favorites');
      setFavorites([]);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Loading description="Loading your favorite themes..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Grid>
        <Column lg={16}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <Heading style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}>
              <FavoriteFilled size={32} style={{ color: '#da1e28' }} />
              Your Favorite Themes
              <span style={{ 
                fontSize: '1rem', 
                fontWeight: 'normal', 
                color: 'var(--cds-text-secondary)' 
              }}>
                ({favorites.length})
              </span>
            </Heading>
            
            {favorites.length > 0 && (
              <Button
                kind="danger--tertiary"
                size="sm"
                renderIcon={TrashCan}
                onClick={clearAllFavorites}
              >
                Clear All
              </Button>
            )}
          </div>

          {favorites.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 0',
              color: 'var(--cds-text-secondary)'
            }}>
              <FavoriteFilled size={48} style={{ color: '#da1e28', marginBottom: '1rem' }} />
              <h3 style={{ margin: 0 }}>No favorite themes yet</h3>
              <p style={{ margin: '0.5rem 0 1.5rem 0', textAlign: 'center', maxWidth: 320 }}>
                Start browsing themes and click the heart icon to add them to your favorites.
              </p>
              <Button
                kind="primary"
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                Browse Themes
              </Button>
            </div>
          ) : (
            <>
              <InlineNotification
                kind="info"
                title="Tip"
                subtitle="Your favorite themes are saved locally in your browser."
                lowContrast
                style={{ marginBottom: '2rem' }}
              />
              
              <Grid>
                {favorites.map((theme) => (
                  <Column key={theme.id} lg={4} md={8} sm={16}>
                    <div 
                      style={{ position: 'relative', cursor: 'pointer' }}
                      onClick={() => setSelectedTheme(theme)}
                    >
                      <ThemeCard
                        theme={theme}
                        onPreview={() => setSelectedTheme(theme)}
                        onInstall={() => {
                          // Handle theme installation
                          window.location.href = `/preview?theme=${theme.id}`;
                        }}
                      />
                      <Button
                        kind="danger--ghost"
                        size="sm"
                        renderIcon={TrashCan}
                        iconDescription="Remove from favorites"
                        hasIconOnly
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(theme.id);
                        }}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(4px)'
                        }}
                      />
                    </div>
                  </Column>
                ))}
              </Grid>
            </>
          )}
        </Column>
      </Grid>
    </div>
  );
}
