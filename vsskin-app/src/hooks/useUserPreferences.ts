import { useState, useEffect } from 'react';

export interface UserPreferences {
  favorites: string[];
  recentThemes: string[];
  settings: {
    defaultSort: string;
    showPreview: boolean;
    enableAI: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

const defaultPreferences: UserPreferences = {
  favorites: [],
  recentThemes: [],
  settings: {
    defaultSort: 'downloads-desc',
    showPreview: true,
    enableAI: true,
    theme: 'auto'
  }
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage on mount
    const loadPreferences = () => {
      try {
        const saved = localStorage.getItem('vsskin-preferences');
        if (saved) {
          const parsed = JSON.parse(saved);
          setPreferences({ ...defaultPreferences, ...parsed });
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPreferences();
  }, []);

  const savePreferences = (newPreferences: Partial<UserPreferences>) => {
    try {
      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);
      localStorage.setItem('vsskin-preferences', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };

  const addFavorite = (themeId: string) => {
    const updatedFavorites = [...preferences.favorites];
    if (!updatedFavorites.includes(themeId)) {
      updatedFavorites.push(themeId);
      savePreferences({ favorites: updatedFavorites });
    }
  };

  const removeFavorite = (themeId: string) => {
    const updatedFavorites = preferences.favorites.filter(id => id !== themeId);
    savePreferences({ favorites: updatedFavorites });
  };

  const isFavorite = (themeId: string) => {
    return preferences.favorites.includes(themeId);
  };

  const addRecentTheme = (themeId: string) => {
    let updatedRecent = [...preferences.recentThemes];
    // Remove if already exists
    updatedRecent = updatedRecent.filter(id => id !== themeId);
    // Add to beginning
    updatedRecent.unshift(themeId);
    // Keep only last 10
    updatedRecent = updatedRecent.slice(0, 10);
    
    savePreferences({ recentThemes: updatedRecent });
  };

  const updateSettings = (newSettings: Partial<UserPreferences['settings']>) => {
    const updatedSettings = { ...preferences.settings, ...newSettings };
    savePreferences({ settings: updatedSettings });
  };

  const clearAllData = () => {
    try {
      localStorage.removeItem('vsskin-preferences');
      setPreferences(defaultPreferences);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const exportData = () => {
    try {
      const dataStr = JSON.stringify(preferences, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'vsskin-user-data.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting user data:', error);
    }
  };

  const importData = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          const validated = { ...defaultPreferences, ...imported };
          setPreferences(validated);
          localStorage.setItem('vsskin-preferences', JSON.stringify(validated));
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return {
    preferences,
    isLoaded,
    addFavorite,
    removeFavorite,
    isFavorite,
    addRecentTheme,
    updateSettings,
    savePreferences,
    clearAllData,
    exportData,
    importData
  };
}
