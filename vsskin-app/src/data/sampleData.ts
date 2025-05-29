import { Brand, Theme } from '@/types';

export const sampleBrands: Brand[] = [
  {
    id: 'spotify',
    name: 'spotify',
    displayName: 'Spotify',
    logo: '/brands/spotify-logo.svg',
    primaryColor: '#1ed760',
    secondaryColor: '#1db954',
    website: 'https://spotify.com',
    guidelines: {
      colors: {
        primary: ['#1ed760', '#1db954', '#1aa34a'],
        secondary: ['#191414', '#121212'],
        accent: ['#ffffff', '#b3b3b3']
      },
      fonts: {
        primary: 'Circular',
        secondary: 'Helvetica Neue'
      },
      logoUrl: '/brands/spotify-logo.svg',
      brandUrl: 'https://spotify.com'
    }
  },
  {
    id: 'apple',
    name: 'apple',
    displayName: 'Apple',
    logo: '/brands/apple-logo.svg',
    primaryColor: '#007aff',
    secondaryColor: '#5856d6',
    website: 'https://apple.com',
    guidelines: {
      colors: {
        primary: ['#007aff', '#5856d6', '#ff9500'],
        secondary: ['#1c1c1e', '#2c2c2e'],
        accent: ['#ffffff', '#f2f2f7']
      },
      fonts: {
        primary: 'SF Pro',
        secondary: 'SF Mono'
      },
      logoUrl: '/brands/apple-logo.svg',
      brandUrl: 'https://apple.com'
    }
  },
  {
    id: 'github',
    name: 'github',
    displayName: 'GitHub',
    logo: '/brands/github-logo.svg',
    primaryColor: '#24292e',
    secondaryColor: '#0366d6',
    website: 'https://github.com',
    guidelines: {
      colors: {
        primary: ['#24292e', '#0366d6', '#28a745'],
        secondary: ['#fafbfc', '#f6f8fa'],
        accent: ['#d73a49', '#6f42c1']
      },
      fonts: {
        primary: 'Inter',
        secondary: 'SF Mono'
      },
      logoUrl: '/brands/github-logo.svg',
      brandUrl: 'https://github.com'
    }
  },
  {
    id: 'discord',
    name: 'discord',
    displayName: 'Discord',
    logo: '/brands/discord-logo.svg',
    primaryColor: '#5865f2',
    secondaryColor: '#4752c4',
    website: 'https://discord.com',
    guidelines: {
      colors: {
        primary: ['#5865f2', '#4752c4', '#3c45a5'],
        secondary: ['#2c2f33', '#23272a'],
        accent: ['#99aab5', '#7289da']
      },
      fonts: {
        primary: 'Whitney',
        secondary: 'Consolas'
      },
      logoUrl: '/brands/discord-logo.svg',
      brandUrl: 'https://discord.com'
    }
  },
  {
    id: 'slack',
    name: 'slack',
    displayName: 'Slack',
    logo: '/brands/slack-logo.svg',
    primaryColor: '#4a154b',
    secondaryColor: '#36c5f0',
    website: 'https://slack.com',
    guidelines: {
      colors: {
        primary: ['#4a154b', '#36c5f0', '#2eb67d'],
        secondary: ['#e01e5a', '#ecb22e'],
        accent: ['#ffffff', '#f8f8f8']
      },
      fonts: {
        primary: 'Lato',
        secondary: 'Monaco'
      },
      logoUrl: '/brands/slack-logo.svg',
      brandUrl: 'https://slack.com'
    }
  }
];

export const sampleThemes: Theme[] = [
  {
    id: 'spotify-dark',
    name: 'Spotify Dark',
    displayName: 'Spotify Dark Theme',
    description: 'A dark theme inspired by Spotify\'s signature green and black design',
    brand: sampleBrands[0], // Spotify
    type: 'dark',
    colors: {
      'editor.background': '#191414',
      'editor.foreground': '#ffffff',
      'activityBar.background': '#121212',
      'activityBar.foreground': '#1ed760',
      'sideBar.background': '#121212',
      'sideBar.foreground': '#b3b3b3',
      'statusBar.background': '#1ed760',
      'statusBar.foreground': '#000000',
      'titleBar.activeBackground': '#191414',
      'titleBar.activeForeground': '#ffffff'
    },
    preview: {
      screenshots: ['/previews/spotify-dark-1.png', '/previews/spotify-dark-2.png'],
      codeSnippets: [
        {
          language: 'typescript',
          title: 'React Component',
          code: `interface SpotifyPlayerProps {
  isPlaying: boolean;
  currentTrack: Track;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ isPlaying, currentTrack }) => {
  return (
    <div className="player">
      <TrackInfo track={currentTrack} />
      <PlayButton isPlaying={isPlaying} />
    </div>
  );
};`
        }
      ],
      miniPreview: '/previews/spotify-dark-mini.png'
    },
    installation: {
      downloadUrl: '/downloads/spotify-dark-theme.vsix',
      installInstructions: [
        'Download the theme file',
        'Open VS Code',
        'Press Ctrl+Shift+P (Cmd+Shift+P on Mac)',
        'Type "Extensions: Install from VSIX"',
        'Select the downloaded file',
        'Reload VS Code when prompted'
      ],
      vsCodeMarketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=vsskin.spotify-dark',
      githubUrl: 'https://github.com/vsskin/themes/tree/main/spotify-dark'
    },
    metadata: {
      version: '1.0.0',
      author: 'VSskin Team',
      tags: ['spotify', 'dark', 'green', 'music'],
      downloads: 1250,
      rating: 4.8,
      lastUpdated: '2024-05-15',
      compatibility: ['1.70.0', '1.80.0', '1.90.0']
    }
  },
  {
    id: 'apple-light',
    name: 'Apple Light',
    displayName: 'Apple Light Theme',
    description: 'A clean, minimalist light theme inspired by Apple\'s design language',
    brand: sampleBrands[1], // Apple
    type: 'light',
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#1c1c1e',
      'activityBar.background': '#f2f2f7',
      'activityBar.foreground': '#007aff',
      'sideBar.background': '#f2f2f7',
      'sideBar.foreground': '#1c1c1e',
      'statusBar.background': '#007aff',
      'statusBar.foreground': '#ffffff',
      'titleBar.activeBackground': '#ffffff',
      'titleBar.activeForeground': '#1c1c1e'
    },
    preview: {
      screenshots: ['/previews/apple-light-1.png', '/previews/apple-light-2.png'],
      codeSnippets: [
        {
          language: 'swift',
          title: 'SwiftUI View',
          code: `struct ContentView: View {
    @State private var username = ""
    
    var body: some View {
        VStack {
            TextField("Username", text: $username)
                .textFieldStyle(RoundedBorderTextFieldStyle())
            
            Button("Sign In") {
                // Handle sign in
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}`
        }
      ],
      miniPreview: '/previews/apple-light-mini.png'
    },
    installation: {
      downloadUrl: '/downloads/apple-light-theme.vsix',
      installInstructions: [
        'Download the theme file',
        'Open VS Code',
        'Press Ctrl+Shift+P (Cmd+Shift+P on Mac)',
        'Type "Extensions: Install from VSIX"',
        'Select the downloaded file',
        'Reload VS Code when prompted'
      ],
      vsCodeMarketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=vsskin.apple-light',
      githubUrl: 'https://github.com/vsskin/themes/tree/main/apple-light'
    },
    metadata: {
      version: '1.2.0',
      author: 'VSskin Team',
      tags: ['apple', 'light', 'minimal', 'clean'],
      downloads: 980,
      rating: 4.6,
      lastUpdated: '2024-05-10',
      compatibility: ['1.70.0', '1.80.0', '1.90.0']
    }
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    displayName: 'GitHub Dark Theme',
    description: 'The familiar GitHub dark theme for your VS Code editor',
    brand: sampleBrands[2], // GitHub
    type: 'dark',
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#e6edf3',
      'activityBar.background': '#010409',
      'activityBar.foreground': '#0969da',
      'sideBar.background': '#010409',
      'sideBar.foreground': '#7d8590',
      'statusBar.background': '#0969da',
      'statusBar.foreground': '#ffffff',
      'titleBar.activeBackground': '#0d1117',
      'titleBar.activeForeground': '#e6edf3'
    },
    preview: {
      screenshots: ['/previews/github-dark-1.png', '/previews/github-dark-2.png'],
      codeSnippets: [
        {
          language: 'javascript',
          title: 'GitHub API Integration',
          code: `async function fetchGitHubRepos(username) {
  try {
    const response = await fetch(\`https://api.github.com/users/\${username}/repos\`);
    const repos = await response.json();
    
    return repos.filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch (error) {
    console.error('Failed to fetch repositories:', error);
    throw error;
  }
}`
        }
      ],
      miniPreview: '/previews/github-dark-mini.png'
    },
    installation: {
      downloadUrl: '/downloads/github-dark-theme.vsix',
      installInstructions: [
        'Download the theme file',
        'Open VS Code',
        'Press Ctrl+Shift+P (Cmd+Shift+P on Mac)',
        'Type "Extensions: Install from VSIX"',
        'Select the downloaded file',
        'Reload VS Code when prompted'
      ],
      vsCodeMarketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=vsskin.github-dark',
      githubUrl: 'https://github.com/vsskin/themes/tree/main/github-dark'
    },
    metadata: {
      version: '2.1.0',
      author: 'VSskin Team',
      tags: ['github', 'dark', 'code', 'familiar'],
      downloads: 2100,
      rating: 4.9,
      lastUpdated: '2024-05-20',
      compatibility: ['1.70.0', '1.80.0', '1.90.0']
    }
  }
];

export const getThemesByBrand = (brandId: string): Theme[] => {
  return sampleThemes.filter(theme => theme.brand.id === brandId);
};

export const getThemesByType = (type: 'light' | 'dark'): Theme[] => {
  return sampleThemes.filter(theme => theme.type === type);
};

export const searchThemes = (query: string): Theme[] => {
  const lowerQuery = query.toLowerCase();
  return sampleThemes.filter(theme => 
    theme.name.toLowerCase().includes(lowerQuery) ||
    theme.description.toLowerCase().includes(lowerQuery) ||
    theme.brand.displayName.toLowerCase().includes(lowerQuery) ||
    theme.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
