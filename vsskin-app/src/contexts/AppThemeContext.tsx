'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppThemeContextType } from '@/types';

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined);

interface AppThemeProviderProps {
  children: ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('vsskin-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Update document attribute and localStorage when theme changes
  useEffect(() => {
    const carbonTheme = theme === 'dark' ? 'g100' : 'white';
    document.documentElement.setAttribute('data-carbon-theme', carbonTheme);
    localStorage.setItem('vsskin-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const contextValue: AppThemeContextType = {
    theme,
    toggleTheme
  };

  return (
    <AppThemeContext.Provider value={contextValue}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme(): AppThemeContextType {
  const context = useContext(AppThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
}
