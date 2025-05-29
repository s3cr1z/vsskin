/**
 * Service for fetching brand data from Brandfetch API
 * and managing brand-related operations
 */

import type { Brand } from '@/types';

export interface BrandfetchResponse {
  name: string;
  domain: string;
  claimed: boolean;
  description?: string;
  logo?: {
    type: string;
    theme: string;
    formats: {
      src: string;
      background: string;
      format: string;
      height: number;
      width: number;
      size: number;
    }[];
  }[];
  colors?: {
    hex: string;
    type: string;
    brightness: number;
  }[];
  fonts?: {
    name: string;
    type: string;
    origin: string;
    originId: string;
    weights: number[];
  }[];
  images?: {
    type: string;
    formats: {
      src: string;
      format: string;
      height: number;
      width: number;
      size: number;
    }[];
  }[];
}

export interface BrandApiService {
  fetchBrandData(domain: string): Promise<BrandfetchResponse>;
  transformToBrand(brandfetchData: BrandfetchResponse): Brand;
  getAllSupportedBrands(): string[];
}

// Supported brand domains with their API configurations
export const SUPPORTED_BRANDS = {
  'spotify.com': { name: 'Spotify', alias: 'spotify.com' },
  'apple.com': { name: 'Apple', alias: 'apple.com' },
  'github.com': { name: 'GitHub', alias: 'github.com' },
  'slack.com': { name: 'Slack', alias: 'slack.com' },
  'discord.com': { name: 'Discord', alias: 'discord.com' },
  'stripe.com': { name: 'Stripe', alias: 'stripe.com' },
  'figma.com': { name: 'Figma', alias: 'figma.com' },
  'notion.so': { name: 'Notion', alias: 'notion.so' },
  'airtable.com': { name: 'Airtable', alias: 'airtable.com' },
  'cash.app': { name: 'Cash App', alias: 'cash.app' },
  'meta.com': { name: 'Meta', alias: 'meta.com' },
  'zoom.com': { name: 'Zoom', alias: 'zoom.com' },
  'reddit.com': { name: 'Reddit', alias: 'reddit.com' },
  'paypal.com': { name: 'PayPal', alias: 'paypal.com' },
  'youtube.com': { name: 'YouTube', alias: 'youtube.com' },
  'coinbase.com': { name: 'Coinbase', alias: 'coinbase.com' },
  'linear.app': { name: 'Linear', alias: 'linear.app' },
  'tiktok.com': { name: 'TikTok', alias: 'tiktok.com' },
  'netflix.com': { name: 'Netflix', alias: 'netflix.com' }
} as const;

class BrandApiServiceImpl implements BrandApiService {
  private readonly baseUrl = 'https://api.brandfetch.io/v2/brands';
  private readonly apiKey: string | null;

  constructor() {
    // In a real implementation, this would come from environment variables
    this.apiKey = process.env.NEXT_PUBLIC_BRANDFETCH_API_KEY || null;
  }

  async fetchBrandData(domain: string): Promise<BrandfetchResponse> {
    if (!this.apiKey) {
      console.warn('Brandfetch API key not found, using mock data');
      return this.getMockBrandData(domain);
    }

    try {
      const response = await fetch(`${this.baseUrl}/${domain}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Brandfetch API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching brand data:', error);
      // Fallback to mock data
      return this.getMockBrandData(domain);
    }
  }

  private getMockBrandData(domain: string): BrandfetchResponse {
    // Return mock data based on the domain
    const mockData: Record<string, Partial<BrandfetchResponse>> = {
      'spotify.com': {
        name: 'Spotify',
        domain: 'spotify.com',
        claimed: true,
        description: 'Spotify is a Swedish audio streaming and media services provider.',
        colors: [
          { hex: '#1ED760', type: 'accent', brightness: 128 },
          { hex: '#191414', type: 'dark', brightness: 20 },
          { hex: '#FFFFFF', type: 'light', brightness: 255 }
        ],
        fonts: [
          { name: 'Circular', type: 'primary', origin: 'custom', originId: 'circular', weights: [400, 500, 700] }
        ]
      },
      'apple.com': {
        name: 'Apple',
        domain: 'apple.com',
        claimed: true,
        description: 'Apple Inc. is an American multinational technology company.',
        colors: [
          { hex: '#007AFF', type: 'accent', brightness: 128 },
          { hex: '#000000', type: 'dark', brightness: 0 },
          { hex: '#F2F2F7', type: 'light', brightness: 242 }
        ],
        fonts: [
          { name: 'SF Pro', type: 'primary', origin: 'system', originId: 'sf-pro', weights: [400, 500, 600, 700] }
        ]
      },
      'github.com': {
        name: 'GitHub',
        domain: 'github.com',
        claimed: true,
        description: 'GitHub is a provider of Internet hosting for software development and version control.',
        colors: [
          { hex: '#24292E', type: 'dark', brightness: 36 },
          { hex: '#FFFFFF', type: 'light', brightness: 255 },
          { hex: '#0366D6', type: 'accent', brightness: 128 }
        ],
        fonts: [
          { name: 'Inter', type: 'primary', origin: 'google', originId: 'inter', weights: [400, 500, 600] }
        ]
      }
    };

    return {
      name: SUPPORTED_BRANDS[domain as keyof typeof SUPPORTED_BRANDS]?.name || 'Unknown',
      domain,
      claimed: false,
      ...(mockData[domain] || {})
    } as BrandfetchResponse;
  }

  transformToBrand(brandfetchData: BrandfetchResponse): Brand {
    const primaryColor = brandfetchData.colors?.find(c => c.type === 'accent') ||
      brandfetchData.colors?.[0] ||
      { hex: '#000000' };

    const secondaryColor = brandfetchData.colors?.find(c => c.type === 'dark') ||
      brandfetchData.colors?.[1] ||
      { hex: '#666666' };

    const primaryFont = brandfetchData.fonts?.[0]?.name || 'Inter';
    const logoUrl = brandfetchData.logo?.[0]?.formats?.[0]?.src || '';

    return {
      id: brandfetchData.domain.replace('.', '-'),
      name: brandfetchData.name,
      displayName: brandfetchData.name,
      domain: brandfetchData.domain,
      website: `https://${brandfetchData.domain}`,
      primary: primaryColor.hex,
      primaryColor: primaryColor.hex,
      secondaryColor: secondaryColor.hex,
      logo: logoUrl,
      colors: {
        primary: primaryColor.hex,
        secondary: secondaryColor.hex,
        accent: brandfetchData.colors?.find(c => c.type === 'light')?.hex || '#FFFFFF'
      },
      guidelines: {
        colors: {
          primary: [primaryColor.hex],
          secondary: [secondaryColor.hex],
          accent: [brandfetchData.colors?.find(c => c.type === 'light')?.hex || '#FFFFFF']
        },
        fonts: {
          primary: primaryFont,
          secondary: brandfetchData.fonts?.[1]?.name || 'Arial'
        },
        logoUrl,
        brandUrl: `https://${brandfetchData.domain}`
      }
    };
  }

  getAllSupportedBrands(): string[] {
    return Object.keys(SUPPORTED_BRANDS);
  }
}

// Export singleton instance
export const brandApiService = new BrandApiServiceImpl();

// Export utility functions
export async function fetchAllBrands(): Promise<Brand[]> {
  const domains = brandApiService.getAllSupportedBrands();
  const brandPromises = domains.map(async (domain) => {
    try {
      const brandData = await brandApiService.fetchBrandData(domain);
      return brandApiService.transformToBrand(brandData);
    } catch (error) {
      console.error(`Failed to fetch brand data for ${domain}:`, error);
      return null;
    }
  });

  const brands = await Promise.all(brandPromises);
  return brands.filter((brand): brand is Brand => brand !== null);
}

export async function fetchBrandByDomain(domain: string): Promise<Brand | null> {
  try {
    const brandData = await brandApiService.fetchBrandData(domain);
    return brandApiService.transformToBrand(brandData);
  } catch (error) {
    console.error(`Failed to fetch brand data for ${domain}:`, error);
    return null;
  }
}

// Re-export types for convenience
export type { Brand } from '@/types';
