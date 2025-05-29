/**
 * Theme Installation Service
 * Handles the installation of VS Code themes
 */

import { Theme } from '@/types';

export interface InstallationResult {
  success: boolean;
  message: string;
  downloadUrl?: string;
  extensionId?: string;
}

export interface ThemePackage {
  name: string;
  displayName: string;
  description: string;
  version: string;
  publisher: string;
  engines: {
    vscode: string;
  };
  categories: string[];
  contributes: {
    themes: Array<{
      label: string;
      uiTheme: string;
      path: string;
    }>;
  };
  keywords: string[];
  repository?: {
    type: string;
    url: string;
  };
}

/**
 * Generate a VS Code extension package.json for a theme
 */
export function generateExtensionPackage(theme: Theme): ThemePackage {
  const sanitizedName = theme.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const publisherName = theme.brand.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return {
    name: `${sanitizedName}-theme`,
    displayName: `${theme.name} Theme`,
    description: `${theme.description || `A VS Code theme inspired by ${theme.brand.name}'s brand colors`}`,
    version: '1.0.0',
    publisher: `vsskin-${publisherName}`,
    engines: {
      vscode: '^1.74.0'
    },
    categories: ['Themes'],
    contributes: {
      themes: [
        {
          label: theme.name,
          uiTheme: theme.type === 'dark' ? 'vs-dark' : 'vs',
          path: `./themes/${sanitizedName}-color-theme.json`
        }
      ]
    },
    keywords: [
      'theme',
      'color-theme',
      theme.brand.name.toLowerCase(),
      theme.type,
      ...theme.tags
    ],
    repository: {
      type: 'git',
      url: 'https://github.com/vsskin/themes'
    }
  };
}

/**
 * Generate the theme JSON file content for VS Code
 */
export function generateThemeJson(theme: Theme) {
  return {
    name: theme.name,
    type: theme.type,
    colors: theme.colors,
    tokenColors: [
      {
        settings: {
          foreground: theme.colors['editor.foreground'],
          background: theme.colors['editor.background']
        }
      },
      {
        name: 'Comment',
        scope: ['comment', 'punctuation.definition.comment'],
        settings: {
          fontStyle: 'italic',
          foreground: theme.colors['editor.foreground'] + '80' // 50% opacity
        }
      },
      {
        name: 'Variables',
        scope: ['variable', 'string constant.other.placeholder'],
        settings: {
          foreground: theme.colors['editor.foreground']
        }
      },
      {
        name: 'Keywords',
        scope: ['keyword', 'storage.type', 'storage.modifier'],
        settings: {
          foreground: theme.colors['textLink.foreground'] || theme.brand.primaryColor
        }
      },
      {
        name: 'Operators',
        scope: ['keyword.operator'],
        settings: {
          foreground: theme.colors['editor.foreground']
        }
      },
      {
        name: 'Numbers',
        scope: ['constant.numeric'],
        settings: {
          foreground: theme.colors['textLink.foreground'] || theme.brand.primaryColor
        }
      },
      {
        name: 'Strings',
        scope: ['string'],
        settings: {
          foreground: theme.colors['gitDecoration.addedResourceForeground'] || '#4CAF50'
        }
      },
      {
        name: 'Functions',
        scope: ['entity.name.function', 'support.function'],
        settings: {
          foreground: theme.colors['textLink.foreground'] || theme.brand.primaryColor
        }
      },
      {
        name: 'Classes',
        scope: ['entity.name.class', 'support.class'],
        settings: {
          foreground: theme.colors['textLink.foreground'] || theme.brand.primaryColor
        }
      }
    ]
  };
}

/**
 * Create a downloadable theme package
 */
export async function createThemePackage(theme: Theme): Promise<Blob> {
  const packageJson = generateExtensionPackage(theme);
  const themeJson = generateThemeJson(theme);
  const sanitizedName = theme.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  // Create a simple package structure as a ZIP-like format
  // In a real implementation, you'd use a proper ZIP library
  const files = {
    'package.json': JSON.stringify(packageJson, null, 2),
    [`themes/${sanitizedName}-color-theme.json`]: JSON.stringify(themeJson, null, 2),
    'README.md': generateReadme(theme),
    'CHANGELOG.md': generateChangelog(theme)
  };

  // Create a simple text-based package for demonstration
  // In production, you'd create a proper VSIX file
  const packageContent = Object.entries(files)
    .map(([filename, content]) => `=== ${filename} ===\n${content}\n`)
    .join('\n\n');

  return new Blob([packageContent], { type: 'text/plain' });
}

/**
 * Generate README.md for the theme package
 */
function generateReadme(theme: Theme): string {
  return `# ${theme.name} Theme

${theme.description || `A VS Code theme inspired by ${theme.brand.name}'s brand colors.`}

## Installation

1. Download this theme package
2. Open VS Code
3. Go to Extensions (Ctrl+Shift+X)
4. Click on the three dots menu and select "Install from VSIX..."
5. Select the downloaded theme file
6. Reload VS Code when prompted
7. Go to File > Preferences > Color Theme and select "${theme.name}"

## Brand Colors

- Primary: ${theme.brand.primaryColor}
- Secondary: ${theme.brand.secondaryColor || 'N/A'}
- Background: ${theme.colors['editor.background']}
- Foreground: ${theme.colors['editor.foreground']}

## Features

- Optimized for ${theme.type} mode
- Based on ${theme.brand.name} brand guidelines
- Supports all major programming languages
- Carefully selected color palette for readability

## Feedback

Found an issue or have a suggestion? Visit [vsskin.com](https://vsskin.com) to browse more themes or provide feedback.

---

Generated by [vsskin](https://vsskin.com) - VS Code Theme Studio
`;
}

/**
 * Generate CHANGELOG.md for the theme package
 */
function generateChangelog(theme: Theme): string {
  return `# Changelog

All notable changes to the "${theme.name}" theme will be documented in this file.

## [1.0.0] - ${new Date().toISOString().split('T')[0]}

### Added
- Initial release of ${theme.name} theme
- ${theme.type} mode optimized color scheme
- Based on ${theme.brand.name} brand colors
- Support for all major programming languages

### Colors
- Primary brand color: ${theme.brand.primaryColor}
- Secondary brand color: ${theme.brand.secondaryColor || 'N/A'}
- Editor background: ${theme.colors['editor.background']}
- Editor foreground: ${theme.colors['editor.foreground']}

---

Generated by [vsskin](https://vsskin.com)
`;
}

/**
 * Install a theme by downloading it
 */
export async function installTheme(theme: Theme): Promise<InstallationResult> {
  try {
    // Create the theme package
    const packageBlob = await createThemePackage(theme);
    
    // Create download URL
    const downloadUrl = URL.createObjectURL(packageBlob);
    
    // Generate filename
    const sanitizedName = theme.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const filename = `${sanitizedName}-theme-v1.0.0.txt`;
    
    // Trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    
    return {
      success: true,
      message: `${theme.name} theme package downloaded successfully! Open the file to see installation instructions.`,
      downloadUrl,
      extensionId: `vsskin-${theme.brand.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.${sanitizedName}-theme`
    };
  } catch (error) {
    console.error('Theme installation failed:', error);
    return {
      success: false,
      message: 'Failed to create theme package. Please try again later.'
    };
  }
}

/**
 * Copy theme installation command to clipboard
 */
export async function copyInstallCommand(theme: Theme): Promise<boolean> {
  try {
    const sanitizedName = theme.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const publisherName = theme.brand.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const extensionId = `vsskin-${publisherName}.${sanitizedName}-theme`;
    
    const command = `code --install-extension ${extensionId}`;
    
    await navigator.clipboard.writeText(command);
    return true;
  } catch (error) {
    console.error('Failed to copy install command:', error);
    return false;
  }
}

/**
 * Get installation instructions for a theme
 */
export function getInstallationInstructions(theme: Theme): string[] {
  return [
    'Download the theme package by clicking the Install button',
    'Open VS Code on your computer',
    'Press Ctrl+Shift+P (or Cmd+Shift+P on Mac) to open the command palette',
    'Type "Extensions: Install from VSIX" and select it',
    'Browse and select the downloaded theme file',
    'Reload VS Code when prompted',
    'Go to File > Preferences > Color Theme (or Code > Preferences > Color Theme on Mac)',
    `Select "${theme.name}" from the list`,
    'Enjoy your new theme!'
  ];
}

/**
 * Check if VS Code is available for direct installation
 */
export function isVSCodeAvailable(): boolean {
  // Check if we're in a VS Code environment
  return typeof window !== 'undefined' && 
         (window as any).vscode !== undefined;
}

/**
 * Attempt direct installation if in VS Code environment
 */
export async function installThemeDirectly(theme: Theme): Promise<InstallationResult> {
  if (!isVSCodeAvailable()) {
    return {
      success: false,
      message: 'Direct installation only available within VS Code environment'
    };
  }

  try {
    // This would work if the app is running as a VS Code webview
    const vscode = (window as any).vscode;
    const themeJson = generateThemeJson(theme);
    
    await vscode.postMessage({
      command: 'installTheme',
      theme: themeJson,
      name: theme.name
    });

    return {
      success: true,
      message: `${theme.name} theme installed successfully!`
    };
  } catch (error) {
    console.error('Direct installation failed:', error);
    return {
      success: false,
      message: 'Direct installation failed. Please use the download method.'
    };
  }
}
