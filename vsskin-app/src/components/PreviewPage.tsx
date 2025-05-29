'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Heading,
  Button,
  Dropdown,
  CodeSnippet,
  Tile,
  InlineNotification,
  Loading,
  Toggle
} from '@carbon/react';
import { 
  Download, 
  View, 
  Code, 
  ColorPalette,
  Settings,
  Checkmark
} from '@carbon/icons-react';
import { Theme } from '@/types';
import { useThemes } from '@/contexts/ThemeContext';

export default function PreviewPage() {
  const { themes, selectedTheme, setSelectedTheme } = useThemes();
  const [selectedLanguage, setSelectedLanguage] = useState('typescript');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);

  const languages = [
    { id: 'typescript', text: 'TypeScript' },
    { id: 'javascript', text: 'JavaScript' },
    { id: 'python', text: 'Python' },
    { id: 'java', text: 'Java' },
    { id: 'cpp', text: 'C++' },
    { id: 'rust', text: 'Rust' },
    { id: 'go', text: 'Go' },
    { id: 'html', text: 'HTML' },
    { id: 'css', text: 'CSS' },
    { id: 'json', text: 'JSON' }
  ];

  const codeSnippets = {
    typescript: `import React, { useState, useEffect } from 'react';
import { Theme, Brand } from '@/types';

interface ThemePreviewProps {
  theme: Theme;
  onInstall: (theme: Theme) => void;
}

export function ThemePreview({ theme, onInstall }: ThemePreviewProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  
  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await onInstall(theme);
      console.log('Theme installed successfully!');
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="theme-preview">
      <h2>{theme.displayName}</h2>
      <p>{theme.description}</p>
      <button onClick={handleInstall} disabled={isInstalling}>
        {isInstalling ? 'Installing...' : 'Install Theme'}
      </button>
    </div>
  );
}`,
    javascript: `const express = require('express');
const cors = require('cors');
const { Theme, Brand } = require('./types');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Theme installation endpoint
app.post('/api/themes/install', async (req, res) => {
  try {
    const { themeId, userId } = req.body;
    
    // Validate theme exists
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    
    // Install theme for user
    const installation = await installTheme(theme, userId);
    
    res.json({
      success: true,
      installation,
      message: 'Theme installed successfully!'
    });
  } catch (error) {
    console.error('Installation error:', error);
    res.status(500).json({ error: 'Installation failed' });
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    python: `from typing import Dict, List, Optional
import json
import asyncio
from dataclasses import dataclass

@dataclass
class Theme:
    id: str
    name: str
    colors: Dict[str, str]
    type: str
    brand: str

class ThemeInstaller:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.installed_themes: List[Theme] = []
    
    async def install_theme(self, theme: Theme) -> bool:
        """Install a VS Code theme"""
        try:
            # Generate VS Code extension package
            package = self._generate_package(theme)
            
            # Write theme files
            await self._write_theme_files(theme, package)
            
            # Update installed themes
            self.installed_themes.append(theme)
            
            print(f"✅ Successfully installed {theme.name}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to install {theme.name}: {e}")
            return False
    
    def _generate_package(self, theme: Theme) -> Dict:
        """Generate VS Code extension package.json"""
        return {
            "name": f"vsskin-{theme.id}",
            "displayName": theme.name,
            "description": f"VS Code theme based on {theme.brand}",
            "version": "1.0.0",
            "engines": {"vscode": "^1.74.0"},
            "categories": ["Themes"],
            "contributes": {
                "themes": [{
                    "label": theme.name,
                    "uiTheme": "vs-dark" if theme.type == "dark" else "vs",
                    "path": f"./themes/{theme.id}.json"
                }]
            }
        }`,
    java: `package com.vsskin.installer;

import java.util.*;
import java.io.*;
import java.nio.file.*;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ThemeInstaller {
    private final String apiKey;
    private final List<Theme> installedThemes;
    private final ObjectMapper objectMapper;
    
    public ThemeInstaller(String apiKey) {
        this.apiKey = apiKey;
        this.installedThemes = new ArrayList<>();
        this.objectMapper = new ObjectMapper();
    }
    
    public boolean installTheme(Theme theme) {
        try {
            // Generate VS Code extension package
            Map<String, Object> packageJson = generatePackage(theme);
            
            // Create theme directory
            Path themeDir = Paths.get("themes", theme.getId());
            Files.createDirectories(themeDir);
            
            // Write package.json
            writePackageJson(themeDir, packageJson);
            
            // Write theme JSON
            writeThemeJson(themeDir, theme);
            
            installedThemes.add(theme);
            System.out.println("✅ Successfully installed " + theme.getName());
            return true;
            
        } catch (Exception e) {
            System.err.println("❌ Failed to install " + theme.getName() + ": " + e.getMessage());
            return false;
        }
    }
    
    private Map<String, Object> generatePackage(Theme theme) {
        Map<String, Object> pkg = new HashMap<>();
        pkg.put("name", "vsskin-" + theme.getId());
        pkg.put("displayName", theme.getName());
        pkg.put("description", "VS Code theme based on " + theme.getBrand());
        pkg.put("version", "1.0.0");
        
        Map<String, String> engines = new HashMap<>();
        engines.put("vscode", "^1.74.0");
        pkg.put("engines", engines);
        
        pkg.put("categories", Arrays.asList("Themes"));
        
        return pkg;
    }
}`
  };

  const currentTheme = selectedTheme || themes[0];

  useEffect(() => {
    if (!selectedTheme && themes.length > 0) {
      setSelectedTheme(themes[0]);
    }
  }, [themes, selectedTheme, setSelectedTheme]);

  if (!currentTheme) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Loading description="Loading theme preview..." />
      </div>
    );
  }

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
            <div>
              <Heading style={{ marginBottom: '0.5rem' }}>
                Theme Preview
              </Heading>
              <p style={{ color: 'var(--cds-text-secondary)' }}>
                See how your code will look with different themes and languages
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Dropdown
                id="theme-selector"
                titleText="Selected Theme"
                label={currentTheme.displayName}
                items={themes.map(theme => ({
                  id: theme.id,
                  text: theme.displayName
                }))}
                selectedItem={currentTheme ? { id: currentTheme.id, text: currentTheme.displayName } : null}
                onChange={({ selectedItem }) => {
                  if (selectedItem) {
                    const theme = themes.find(t => t.id === selectedItem.id);
                    if (theme) setSelectedTheme(theme);
                  }
                }}
                size="sm"
              />
              
              <Button 
                kind="primary"
                renderIcon={Download}
                size="sm"
              >
                Install Theme
              </Button>
            </div>
          </div>
        </Column>

        {/* Theme Info */}
        <Column lg={16}>
          <Tile style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img 
                src={currentTheme.brand.logo} 
                alt={currentTheme.brand.displayName}
                style={{ width: '32px', height: '32px', borderRadius: '4px' }}
              />
              <div>
                <Heading style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                  {currentTheme.displayName}
                </Heading>
                <p style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>
                  {currentTheme.description}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ColorPalette size={16} />
                <span style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                  {currentTheme.type === 'dark' ? 'Dark Theme' : 'Light Theme'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={16} />
                <span style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                  {currentTheme.metadata.downloads.toLocaleString()} downloads
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Checkmark size={16} />
                <span style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                  v{currentTheme.metadata.version}
                </span>
              </div>
            </div>
          </Tile>
        </Column>

        {/* Preview Controls */}
        <Column lg={16}>
          <Tile style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <Heading style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              Preview Settings
            </Heading>
            
            <div style={{ 
              display: 'flex', 
              gap: '2rem', 
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Dropdown
                id="language-selector"
                titleText="Language"
                label={languages.find(l => l.id === selectedLanguage)?.text || 'TypeScript'}
                items={languages}
                selectedItem={languages.find(l => l.id === selectedLanguage)}
                onChange={({ selectedItem }) => {
                  if (selectedItem) setSelectedLanguage(selectedItem.id);
                }}
                size="sm"
              />
              
              <Toggle
                id="line-numbers"
                labelText="Line Numbers"
                toggled={showLineNumbers}
                onToggle={setShowLineNumbers}
                size="sm"
              />
              
              <Toggle
                id="minimap"
                labelText="Minimap"
                toggled={showMinimap}
                onToggle={setShowMinimap}
                size="sm"
              />
            </div>
          </Tile>
        </Column>

        {/* Code Preview */}
        <Column lg={16}>
          <Tile style={{ 
            padding: 0, 
            overflow: 'hidden',
            border: '1px solid var(--cds-border-subtle)'
          }}>
            <div style={{
              backgroundColor: currentTheme.colors['editor.background'],
              color: currentTheme.colors['editor.foreground'],
              minHeight: '500px'
            }}>
              {/* VS Code-like header */}
              <div style={{
                backgroundColor: currentTheme.colors['titleBar.activeBackground'],
                color: currentTheme.colors['titleBar.activeForeground'],
                padding: '0.5rem 1rem',
                borderBottom: `1px solid ${currentTheme.colors['titleBar.activeBackground']}`,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Code size={16} />
                <span>example.{selectedLanguage === 'typescript' ? 'ts' : selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'python' ? 'py' : selectedLanguage}</span>
              </div>
              
              {/* Code content */}
              <div style={{ 
                padding: '1rem',
                fontFamily: 'IBM Plex Mono, Consolas, Monaco, monospace',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                <div style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'inherit'
                }}>
                  <CodeSnippet
                    type="multi"
                    feedback="Copied to clipboard"
                  >
                    {(selectedLanguage in codeSnippets) 
                      ? codeSnippets[selectedLanguage as keyof typeof codeSnippets] 
                      : codeSnippets.typescript}
                  </CodeSnippet>
                </div>
              </div>
            </div>
          </Tile>
        </Column>

        {/* Installation Instructions */}
        <Column lg={16}>
          <InlineNotification
            kind="info"
            title="Installation"
            subtitle="Click the 'Install Theme' button above to download and install this theme in VS Code."
            lowContrast
            style={{ marginTop: '2rem' }}
          />
        </Column>
      </Grid>
    </div>
  );
}
