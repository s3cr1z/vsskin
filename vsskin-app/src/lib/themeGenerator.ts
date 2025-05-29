/**
 * Service for generating VS Code themes from brand data
 */

import { Brand, Theme, ThemeColors } from '@/types';

export interface ThemeGenerationOptions {
  variant: 'light' | 'dark';
  style: 'minimal' | 'vibrant' | 'professional';
  accentIntensity: 'subtle' | 'medium' | 'bold';
}

// Add interface for theme preview data
export interface ThemePreview {
  editorBackground: string;
  sidebarBackground: string;
  activityBarBackground: string;
  statusBarBackground: string;
}

// Extend ThemeMetadata to include preview property
export interface ExtendedThemeMetadata {
  version: string;
  description: string;
  author: string;
  repository: string;
  tags: string[];
  rating: number;
  downloads: number;
  lastUpdated: string;
  compatibility: string[];
  preview?: string;
}

class ThemeGeneratorService {
  /**
   * Generate a complete VS Code theme from brand data
   */
  generateThemeFromBrand(
    brand: Brand, 
    options: ThemeGenerationOptions = { variant: 'dark', style: 'professional', accentIntensity: 'medium' }
  ): Theme {
    const colors = this.generateThemeColors(brand, options);
    const metadata = this.generateThemeMetadata(brand, options);

    return {
      id: `${brand.id}-${options.variant}-${options.style}`,
      name: `${brand.displayName} ${options.variant === 'dark' ? 'Dark' : 'Light'} ${this.capitalizeFirst(options.style)}`,
      displayName: `${brand.displayName} ${options.variant === 'dark' ? 'Dark' : 'Light'} ${this.capitalizeFirst(options.style)}`,
      description: `A ${options.variant} VS Code theme inspired by ${brand.displayName} brand colors and design language.`,
      type: options.variant,
      brand,
      colors,
      tags: [
        options.variant,
        options.style,
        brand.displayName.toLowerCase(),
        ...this.generateTagsFromBrand(brand)
      ],
      preview: {
        screenshots: [],
        codeSnippets: [],
        miniPreview: `${colors['editor.background']},${colors['sideBar.background']},${colors['activityBar.background']},${colors['statusBar.background']}`
      },
      installation: {
        downloadUrl: '#',
        installInstructions: []
      },
      metadata
    };
  }

  /**
   * Generate theme colors based on brand colors and options
   */
  private generateThemeColors(brand: Brand, options: ThemeGenerationOptions): ThemeColors {
    const { primary, secondary, accent } = brand.colors;
    const isDark = options.variant === 'dark';
    
    // Base colors
    const baseBackground = isDark ? this.darken(primary, 0.9) : this.lighten(accent, 0.95);
    const baseForeground = isDark ? this.lighten(accent, 0.9) : this.darken(primary, 0.1);
    
    // Calculate intensity multiplier
    const intensityMultiplier = {
      subtle: 0.3,
      medium: 0.6,
      bold: 0.9
    }[options.accentIntensity];

    return {
      // Editor
      'editor.background': baseBackground,
      'editor.foreground': baseForeground,
      'editor.selectionBackground': this.adjustOpacity(primary, 0.3),
      'editor.lineHighlightBackground': this.adjustOpacity(primary, 0.1),
      'editor.findMatchBackground': this.adjustOpacity(primary, 0.4),
      'editor.findMatchHighlightBackground': this.adjustOpacity(primary, 0.2),

      // Activity Bar
      'activityBar.background': isDark ? this.darken(primary, 0.8) : this.lighten(primary, 0.9),
      'activityBar.foreground': this.adjustBrightness(primary, intensityMultiplier),
      'activityBar.inactiveForeground': this.adjustOpacity(
        this.adjustBrightness(primary, intensityMultiplier), 
        0.6
      ),
      'activityBar.activeBorder': primary,
      'activityBarBadge.background': primary,
      'activityBarBadge.foreground': isDark ? '#FFFFFF' : '#000000',

      // Sidebar
      'sideBar.background': isDark ? this.darken(primary, 0.85) : this.lighten(primary, 0.95),
      'sideBar.foreground': baseForeground,
      'sideBar.border': this.adjustOpacity(primary, 0.2),
      'sideBarTitle.foreground': this.adjustBrightness(primary, intensityMultiplier),
      'sideBarSectionHeader.background': this.adjustOpacity(primary, 0.1),
      'sideBarSectionHeader.foreground': this.adjustBrightness(primary, intensityMultiplier),

      // Status Bar
      'statusBar.background': this.adjustBrightness(primary, intensityMultiplier * 0.8),
      'statusBar.foreground': isDark ? '#FFFFFF' : '#000000',
      'statusBar.border': this.adjustOpacity(primary, 0.3),
      'statusBarItem.hoverBackground': this.adjustOpacity('#FFFFFF', 0.1),
      'statusBarItem.prominentBackground': secondary,
      'statusBarItem.prominentForeground': isDark ? '#FFFFFF' : '#000000',

      // Title Bar
      'titleBar.activeBackground': isDark ? this.darken(primary, 0.8) : this.lighten(primary, 0.9),
      'titleBar.activeForeground': baseForeground,
      'titleBar.inactiveBackground': this.adjustOpacity(
        isDark ? this.darken(primary, 0.8) : this.lighten(primary, 0.9),
        0.8
      ),
      'titleBar.inactiveForeground': this.adjustOpacity(baseForeground, 0.6),
      'titleBar.border': this.adjustOpacity(primary, 0.2),

      // Tab Bar
      'tab.activeBackground': baseBackground,
      'tab.activeForeground': baseForeground,
      'tab.activeBorder': primary,
      'tab.inactiveBackground': this.adjustOpacity(baseBackground, 0.8),
      'tab.inactiveForeground': this.adjustOpacity(baseForeground, 0.7),
      'tab.border': this.adjustOpacity(primary, 0.2),

      // Panel
      'panel.background': baseBackground,
      'panel.border': this.adjustOpacity(primary, 0.2),
      'panelTitle.activeForeground': this.adjustBrightness(primary, intensityMultiplier),
      'panelTitle.inactiveForeground': this.adjustOpacity(baseForeground, 0.7),

      // Terminal
      'terminal.background': baseBackground,
      'terminal.foreground': baseForeground,
      'terminal.ansiBlack': isDark ? '#000000' : '#FFFFFF',
      'terminal.ansiRed': this.adjustHue(primary, 0),
      'terminal.ansiGreen': this.adjustHue(primary, 120),
      'terminal.ansiYellow': this.adjustHue(primary, 60),
      'terminal.ansiBlue': this.adjustHue(primary, 240),
      'terminal.ansiMagenta': this.adjustHue(primary, 300),
      'terminal.ansiCyan': this.adjustHue(primary, 180),
      'terminal.ansiWhite': isDark ? '#FFFFFF' : '#000000',

      // Scrollbar
      'scrollbar.shadow': this.adjustOpacity('#000000', 0.3),
      'scrollbarSlider.background': this.adjustOpacity(primary, 0.3),
      'scrollbarSlider.hoverBackground': this.adjustOpacity(primary, 0.5),
      'scrollbarSlider.activeBackground': this.adjustOpacity(primary, 0.7),

      // Buttons
      'button.background': primary,
      'button.foreground': isDark ? '#FFFFFF' : '#000000',
      'button.hoverBackground': this.adjustBrightness(primary, 1.1),
      'button.secondaryBackground': secondary,
      'button.secondaryForeground': isDark ? '#FFFFFF' : '#000000',
      'button.secondaryHoverBackground': this.adjustBrightness(secondary, 1.1),

      // Input
      'input.background': isDark ? this.darken(baseBackground, 0.5) : this.lighten(baseBackground, 0.5),
      'input.foreground': baseForeground,
      'input.border': this.adjustOpacity(primary, 0.3),
      'inputOption.activeBorder': primary,
      'inputValidation.errorBackground': this.adjustOpacity('#FF0000', 0.1),
      'inputValidation.errorBorder': '#FF0000',

      // Dropdown
      'dropdown.background': isDark ? this.darken(baseBackground, 0.5) : this.lighten(baseBackground, 0.5),
      'dropdown.foreground': baseForeground,
      'dropdown.border': this.adjustOpacity(primary, 0.3),

      // Lists
      'list.activeSelectionBackground': this.adjustOpacity(primary, 0.3),
      'list.activeSelectionForeground': baseForeground,
      'list.inactiveSelectionBackground': this.adjustOpacity(primary, 0.2),
      'list.hoverBackground': this.adjustOpacity(primary, 0.1),
      'list.focusBackground': this.adjustOpacity(primary, 0.2),

      // Badges
      'badge.background': primary,
      'badge.foreground': isDark ? '#FFFFFF' : '#000000',

      // Progress Bar
      'progressBar.background': primary,

      // Notifications
      'notificationCenter.border': this.adjustOpacity(primary, 0.3),
      'notificationCenterHeader.background': this.adjustOpacity(primary, 0.1),
      'notificationToast.border': this.adjustOpacity(primary, 0.3),
      'notifications.background': baseBackground,
      'notifications.foreground': baseForeground,
      'notifications.border': this.adjustOpacity(primary, 0.3),

      // Extensions
      'extensionButton.prominentBackground': primary,
      'extensionButton.prominentForeground': isDark ? '#FFFFFF' : '#000000',
      'extensionButton.prominentHoverBackground': this.adjustBrightness(primary, 1.1),

      // Peek View
      'peekView.border': primary,
      'peekViewEditor.background': baseBackground,
      'peekViewTitle.background': this.adjustOpacity(primary, 0.1),

      // Git Colors
      'gitDecoration.modifiedResourceForeground': this.adjustHue(primary, 60),
      'gitDecoration.deletedResourceForeground': this.adjustHue(primary, 0),
      'gitDecoration.addedResourceForeground': this.adjustHue(primary, 120),
      'gitDecoration.untrackedResourceForeground': this.adjustHue(primary, 180),

      // Menu
      'menu.background': baseBackground,
      'menu.foreground': baseForeground,
      'menu.selectionBackground': this.adjustOpacity(primary, 0.2),
      'menu.selectionForeground': baseForeground,
      'menu.separatorBackground': this.adjustOpacity(primary, 0.2),

      // Editor Widget
      'editorWidget.background': isDark ? this.darken(baseBackground, 0.3) : this.lighten(baseBackground, 0.3),
      'editorWidget.border': this.adjustOpacity(primary, 0.3),
      'editorHoverWidget.background': isDark ? this.darken(baseBackground, 0.3) : this.lighten(baseBackground, 0.3),
      'editorHoverWidget.border': this.adjustOpacity(primary, 0.3),

      // Minimap
      'minimap.background': baseBackground,
      'minimapSlider.background': this.adjustOpacity(primary, 0.2),
      'minimapSlider.hoverBackground': this.adjustOpacity(primary, 0.3),
      'minimapSlider.activeBackground': this.adjustOpacity(primary, 0.4)
    };
  }

  /**
   * Generate theme metadata
   */
  private generateThemeMetadata(brand: Brand, options: ThemeGenerationOptions): ExtendedThemeMetadata {
    return {
      version: '1.0.0',
      description: `A ${options.variant} VS Code theme inspired by ${brand.displayName} brand colors and design language.`,
      author: 'vsskin Theme Generator',
      repository: 'https://github.com/vsskin/themes',
      tags: [],
      rating: 0,
      downloads: 0,
      lastUpdated: new Date().toISOString(),
      compatibility: ['1.70.0', '1.80.0', '1.90.0'],
      preview: `#000000,#000000,#000000,#000000`
    };
  }

  /**
   * Generate relevant tags from brand information
   */
  private generateTagsFromBrand(brand: Brand): string[] {
    const tags = [];
    
    // Add category tags based on brand
    if (['spotify.com', 'apple.com', 'youtube.com'].includes(brand.domain)) {
      tags.push('entertainment', 'media');
    }
    
    if (['github.com', 'figma.com', 'linear.app'].includes(brand.domain)) {
      tags.push('development', 'productivity');
    }
    
    if (['slack.com', 'discord.com', 'zoom.com'].includes(brand.domain)) {
      tags.push('communication', 'collaboration');
    }
    
    if (['stripe.com', 'paypal.com', 'coinbase.com'].includes(brand.domain)) {
      tags.push('finance', 'payments');
    }

    return tags;
  }

  // Color utility methods
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  }

  private darken(hex: string, factor: number): string {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHex(
      rgb.r * (1 - factor),
      rgb.g * (1 - factor),
      rgb.b * (1 - factor)
    );
  }

  private lighten(hex: string, factor: number): string {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHex(
      rgb.r + (255 - rgb.r) * factor,
      rgb.g + (255 - rgb.g) * factor,
      rgb.b + (255 - rgb.b) * factor
    );
  }

  private adjustBrightness(hex: string, factor: number): string {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHex(
      Math.min(255, rgb.r * factor),
      Math.min(255, rgb.g * factor),
      Math.min(255, rgb.b * factor)
    );
  }

  private adjustOpacity(hex: string, opacity: number): string {
    const rgb = this.hexToRgb(hex);
    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return `${hex}${alpha}`;
  }

  private adjustHue(hex: string, hueDegrees: number): string {
    const rgb = this.hexToRgb(hex);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + hueDegrees) % 360;
    const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export singleton instance
export const themeGenerator = new ThemeGeneratorService();

// Export utility functions
export function generateThemeVariants(brand: Brand): Theme[] {
  const variants: ThemeGenerationOptions[] = [
    { variant: 'dark', style: 'professional', accentIntensity: 'medium' },
    { variant: 'light', style: 'professional', accentIntensity: 'medium' },
    { variant: 'dark', style: 'vibrant', accentIntensity: 'bold' },
    { variant: 'light', style: 'minimal', accentIntensity: 'subtle' }
  ];

  return variants.map(options => themeGenerator.generateThemeFromBrand(brand, options));
}

export function generateThemePreview(theme: Theme): string {
  // Generate a simple CSS preview for the theme
  return `
    :root {
      --editor-background: ${theme.colors['editor.background']};
      --sidebar-background: ${theme.colors['sideBar.background']};
      --activity-bar-background: ${theme.colors['activityBar.background']};
      --status-bar-background: ${theme.colors['statusBar.background']};
      --primary-color: ${theme.brand.colors.primary};
    }
  `;
}
