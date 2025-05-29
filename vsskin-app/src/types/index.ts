// Core theme types
export interface Theme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  brand: Brand;
  colors: ThemeColors;
  type: 'light' | 'dark';
  tags: string[];
  preview: ThemePreview;
  installation: ThemeInstallation;
  metadata: ThemeMetadata;
}

export interface Brand {
  id: string;
  name: string;
  displayName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  website: string;
  domain: string;
  primary: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  guidelines: {
    colors: {
      primary: string[];
      secondary: string[];
      accent: string[];
    };
    fonts: {
      primary: string;
      secondary: string;
    };
    logoUrl: string;
    brandUrl: string;
  };
}

export interface ThemeColors {
  // VS Code workbench colors
  'editor.background': string;
  'editor.foreground': string;
  'activityBar.background': string;
  'activityBar.foreground': string;
  'sideBar.background': string;
  'sideBar.foreground': string;
  'statusBar.background': string;
  'statusBar.foreground': string;
  'titleBar.activeBackground': string;
  'titleBar.activeForeground': string;
  // Add more VS Code color tokens as needed
  [key: string]: string;
}

export interface ThemePreview {
  screenshots: string[];
  codeSnippets: CodeSnippet[];
  miniPreview: string;
}

export interface CodeSnippet {
  language: string;
  code: string;
  title: string;
}

export interface ThemeInstallation {
  downloadUrl: string;
  installInstructions: string[];
  vsCodeMarketplaceUrl?: string;
  githubUrl?: string;
}

export interface ThemeMetadata {
  version: string;
  author: string;
  tags: string[];
  downloads: number;
  rating: number;
  lastUpdated: string;
  compatibility: string[];
  preview?: string;
  description: string;
  repository: string;
}

// Filter and search types
export interface ThemeFilters {
  brands: string[];
  types: ('light' | 'dark')[];
  tags: string[];
  searchQuery: string;
}

export interface ThemeSortOptions {
  field: 'name' | 'rating' | 'downloads' | 'lastUpdated';
  direction: 'asc' | 'desc';
}

// API response types
export interface BrandFetchResponse {
  name: string;
  domain: string;
  claimed: boolean;
  description: string;
  longDescription: string;
  links: Array<{
    name: string;
    url: string;
  }>;
  logos: Array<{
    theme: string;
    formats: Array<{
      src: string;
      background: string;
      format: string;
      size: number;
    }>;
  }>;
  colors: Array<{
    hex: string;
    type: string;
    brightness: number;
  }>;
  fonts: Array<{
    name: string;
    type: string;
    origin: string;
    originId: string;
  }>;
}

// UI component props
export interface ThemeCardProps {
  theme: Theme;
  onPreview: (theme: Theme) => void;
  onInstall: (theme: Theme) => void;
  onFavorite?: (theme: Theme) => void;
  isFavorited?: boolean;
}

export interface ThemePreviewModalProps {
  theme: Theme | null;
  isOpen: boolean;
  onClose: () => void;
  onInstall: (theme: Theme) => void;
}

export interface ThemeBrowserProps {
  themes: Theme[];
  filters: ThemeFilters;
  sortOptions: ThemeSortOptions;
  onFiltersChange: (filters: ThemeFilters) => void;
  onSortChange: (sortOptions: ThemeSortOptions) => void;
  onThemeSelect: (theme: Theme) => void;
}

// Context types
export interface ThemeContextType {
  themes: Theme[];
  brands: Brand[];
  loading: boolean;
  error: string | null;
  selectedTheme: Theme | null;
  filters: ThemeFilters;
  sortOptions: ThemeSortOptions;
  setSelectedTheme: (theme: Theme | null) => void;
  setFilters: (filters: ThemeFilters) => void;
  setSortOptions: (sortOptions: ThemeSortOptions) => void;
  refreshThemes: () => Promise<void>;
}

export interface AppThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
