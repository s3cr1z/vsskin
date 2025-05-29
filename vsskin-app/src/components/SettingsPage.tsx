'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Heading,
  Toggle,
  Button,
  Dropdown,
  NumberInput,
  InlineNotification,
  Tile,
  FormGroup,
  TextInput
} from '@carbon/react';
import { 
  Settings as SettingsIcon,
  Save,
  Reset,
  Download,
  Upload
} from '@carbon/icons-react';
import { useAppTheme } from '@/contexts/AppThemeContext';

interface UserSettings {
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    animations: boolean;
    compactMode: boolean;
  };
  themes: {
    autoInstall: boolean;
    showPreview: boolean;
    defaultSort: string;
    itemsPerPage: number;
  };
  ai: {
    enableRecommendations: boolean;
    personalization: boolean;
    confidenceThreshold: number;
  };
  privacy: {
    analytics: boolean;
    crashReporting: boolean;
    usageData: boolean;
  };
  advanced: {
    apiKey: string;
    debugMode: boolean;
    experimentalFeatures: boolean;
  };
}

const defaultSettings: UserSettings = {
  appearance: {
    theme: 'auto',
    animations: true,
    compactMode: false
  },
  themes: {
    autoInstall: false,
    showPreview: true,
    defaultSort: 'downloads-desc',
    itemsPerPage: 12
  },
  ai: {
    enableRecommendations: true,
    personalization: true,
    confidenceThreshold: 0.7
  },
  privacy: {
    analytics: true,
    crashReporting: true,
    usageData: false
  },
  advanced: {
    apiKey: '',
    debugMode: false,
    experimentalFeatures: false
  }
};

export default function SettingsPage() {
  const { theme, toggleTheme } = useAppTheme();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('vsskin-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const updateSetting = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('vsskin-settings', JSON.stringify(settings));
      setHasChanges(false);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vsskin-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings({ ...defaultSettings, ...imported });
          setHasChanges(true);
        } catch (error) {
          console.error('Error importing settings:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const sortOptions = [
    { id: 'downloads-desc', text: 'Most Downloads' },
    { id: 'downloads-asc', text: 'Least Downloads' },
    { id: 'rating-desc', text: 'Highest Rated' },
    { id: 'rating-asc', text: 'Lowest Rated' },
    { id: 'name-asc', text: 'Name A-Z' },
    { id: 'name-desc', text: 'Name Z-A' },
    { id: 'lastUpdated-desc', text: 'Recently Updated' },
    { id: 'lastUpdated-asc', text: 'Oldest Updates' }
  ];

  const itemsPerPageOptions = [
    { id: '6', text: '6 items' },
    { id: '12', text: '12 items' },
    { id: '24', text: '24 items' },
    { id: '48', text: '48 items' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Grid>
        {/* Header */}
        <Column lg={16}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SettingsIcon size={32} />
              <Heading>Settings</Heading>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                style={{ display: 'none' }}
                id="import-settings"
              />
              <Button
                kind="tertiary"
                size="sm"
                renderIcon={Upload}
                onClick={() => document.getElementById('import-settings')?.click()}
              >
                Import
              </Button>
              <Button
                kind="tertiary"
                size="sm"
                renderIcon={Download}
                onClick={exportSettings}
              >
                Export
              </Button>
              <Button
                kind="secondary"
                size="sm"
                renderIcon={Reset}
                onClick={resetSettings}
              >
                Reset
              </Button>
              <Button
                kind="primary"
                size="sm"
                renderIcon={Save}
                onClick={saveSettings}
                disabled={!hasChanges}
              >
                Save Changes
              </Button>
            </div>
          </div>

          {savedNotification && (
            <InlineNotification
              kind="success"
              title="Settings saved successfully!"
              lowContrast
              style={{ marginBottom: '2rem' }}
            />
          )}
        </Column>

        {/* Appearance Settings */}
        <Column lg={8} md={16}>
          <Tile style={{ padding: '2rem', height: '100%' }}>
            <Heading style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              Appearance
            </Heading>
            
            <FormGroup legendText="Theme">
              <Toggle
                id="theme-toggle"
                labelText={`Current theme: ${theme}`}
                toggled={theme === 'dark'}
                onToggle={toggleTheme}
                style={{ marginBottom: '1rem' }}
              />
            </FormGroup>

            <FormGroup legendText="Interface">
              <Toggle
                id="animations"
                labelText="Enable animations"
                toggled={settings.appearance.animations}
                onToggle={(toggled) => updateSetting('appearance', 'animations', toggled)}
                style={{ marginBottom: '1rem' }}
              />
              
              <Toggle
                id="compact-mode"
                labelText="Compact mode"
                toggled={settings.appearance.compactMode}
                onToggle={(toggled) => updateSetting('appearance', 'compactMode', toggled)}
              />
            </FormGroup>
          </Tile>
        </Column>

        {/* Theme Settings */}
        <Column lg={8} md={16}>
          <Tile style={{ padding: '2rem', height: '100%' }}>
            <Heading style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              Themes
            </Heading>
            
            <FormGroup legendText="Installation">
              <Toggle
                id="auto-install"
                labelText="Auto-install themes"
                toggled={settings.themes.autoInstall}
                onToggle={(toggled) => updateSetting('themes', 'autoInstall', toggled)}
                style={{ marginBottom: '1rem' }}
              />
              
              <Toggle
                id="show-preview"
                labelText="Show preview on hover"
                toggled={settings.themes.showPreview}
                onToggle={(toggled) => updateSetting('themes', 'showPreview', toggled)}
                style={{ marginBottom: '1rem' }}
              />
            </FormGroup>

            <FormGroup legendText="Display">
              <Dropdown
                id="default-sort"
                titleText="Default sort order"
                label={sortOptions.find(s => s.id === settings.themes.defaultSort)?.text || 'Most Downloads'}
                items={sortOptions}
                selectedItem={sortOptions.find(s => s.id === settings.themes.defaultSort)}
                onChange={({ selectedItem }) => {
                  if (selectedItem) updateSetting('themes', 'defaultSort', selectedItem.id);
                }}
                style={{ marginBottom: '1rem' }}
              />
              
              <Dropdown
                id="items-per-page"
                titleText="Items per page"
                label={itemsPerPageOptions.find(i => i.id === settings.themes.itemsPerPage.toString())?.text || '12 items'}
                items={itemsPerPageOptions}
                selectedItem={itemsPerPageOptions.find(i => i.id === settings.themes.itemsPerPage.toString())}
                onChange={({ selectedItem }) => {
                  if (selectedItem) updateSetting('themes', 'itemsPerPage', parseInt(selectedItem.id));
                }}
              />
            </FormGroup>
          </Tile>
        </Column>

        {/* AI Settings */}
        <Column lg={8} md={16}>
          <Tile style={{ padding: '2rem', height: '100%' }}>
            <Heading style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              AI Features
            </Heading>
            
            <FormGroup legendText="Recommendations">
              <Toggle
                id="enable-recommendations"
                labelText="Enable AI recommendations"
                toggled={settings.ai.enableRecommendations}
                onToggle={(toggled) => updateSetting('ai', 'enableRecommendations', toggled)}
                style={{ marginBottom: '1rem' }}
              />
              
              <Toggle
                id="personalization"
                labelText="Personalized suggestions"
                toggled={settings.ai.personalization}
                onToggle={(toggled) => updateSetting('ai', 'personalization', toggled)}
                style={{ marginBottom: '1rem' }}
              />
            </FormGroup>

            <FormGroup legendText="Quality">
              <NumberInput
                id="confidence-threshold"
                label="Confidence threshold"
                helperText="Minimum confidence for AI recommendations (0.1 - 1.0)"
                value={settings.ai.confidenceThreshold}
                onChange={(e) => {
                  const value = parseFloat((e.target as HTMLInputElement).value);
                  if (!isNaN(value) && value >= 0.1 && value <= 1.0) {
                    updateSetting('ai', 'confidenceThreshold', value);
                  }
                }}
                min={0.1}
                max={1.0}
                step={0.1}
              />
            </FormGroup>
          </Tile>
        </Column>

        {/* Privacy Settings */}
        <Column lg={8} md={16}>
          <Tile style={{ padding: '2rem', height: '100%' }}>
            <Heading style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              Privacy
            </Heading>
            
            <FormGroup legendText="Data Collection">
              <Toggle
                id="analytics"
                labelText="Anonymous analytics"
                toggled={settings.privacy.analytics}
                onToggle={(toggled) => updateSetting('privacy', 'analytics', toggled)}
                style={{ marginBottom: '1rem' }}
              />
              
              <Toggle
                id="crash-reporting"
                labelText="Crash reporting"
                toggled={settings.privacy.crashReporting}
                onToggle={(toggled) => updateSetting('privacy', 'crashReporting', toggled)}
                style={{ marginBottom: '1rem' }}
              />
              
              <Toggle
                id="usage-data"
                labelText="Usage data sharing"
                toggled={settings.privacy.usageData}
                onToggle={(toggled) => updateSetting('privacy', 'usageData', toggled)}
              />
            </FormGroup>
          </Tile>
        </Column>

        {/* Advanced Settings */}
        <Column lg={16}>
          <Tile style={{ padding: '2rem' }}>
            <Heading style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              Advanced
            </Heading>
            
            <Grid>
              <Column lg={8}>
                <FormGroup legendText="API Configuration">
                  <TextInput
                    id="api-key"
                    labelText="Brandfetch API Key"
                    helperText="Optional: Provide your own API key for enhanced brand data"
                    value={settings.advanced.apiKey}
                    onChange={(e) => updateSetting('advanced', 'apiKey', e.target.value)}
                    type="password"
                    style={{ marginBottom: '1rem' }}
                  />
                </FormGroup>
              </Column>
              
              <Column lg={8}>
                <FormGroup legendText="Developer Options">
                  <Toggle
                    id="debug-mode"
                    labelText="Debug mode"
                    toggled={settings.advanced.debugMode}
                    onToggle={(toggled) => updateSetting('advanced', 'debugMode', toggled)}
                    style={{ marginBottom: '1rem' }}
                  />
                  
                  <Toggle
                    id="experimental-features"
                    labelText="Experimental features"
                    toggled={settings.advanced.experimentalFeatures}
                    onToggle={(toggled) => updateSetting('advanced', 'experimentalFeatures', toggled)}
                  />
                </FormGroup>
              </Column>
            </Grid>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
