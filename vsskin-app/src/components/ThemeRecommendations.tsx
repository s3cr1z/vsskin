/**
 * AI-Driven Theme Recommendations Component
 * Provides personalized theme suggestions based on user preferences and behavior
 */
'use client';

import React, { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  SkeletonPlaceholder,
  Tag
} from '@carbon/react';
import { Sparkle, ThumbsUp, ThumbsDown } from '@carbon/icons-react';
import { Theme } from '@/types';
import ThemeCard from '@/components/ThemeCard';

interface RecommendationReason {
  type: 'color_preference' | 'brand_affinity' | 'usage_pattern' | 'trending' | 'similar_themes';
  description: string;
  confidence: number;
}

interface ThemeRecommendation {
  theme: Theme;
  score: number;
  reasons: RecommendationReason[];
  isPersonalized: boolean;
}

interface ThemeRecommendationsProps {
  currentTheme?: Theme;
  userPreferences?: {
    favoriteColors: string[];
    preferredBrands: string[];
    themeType: 'light' | 'dark' | 'auto';
    recentThemes: Theme[];
  };
  onThemeSelect: (theme: Theme) => void;
  onFeedback?: (themeId: string, positive: boolean) => void;
  maxRecommendations?: number;
}

export default function ThemeRecommendations({
  currentTheme,
  userPreferences,
  onThemeSelect,
  onFeedback,
  maxRecommendations = 6
}: ThemeRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<ThemeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  useEffect(() => {
    generateRecommendations();
  }, [currentTheme, userPreferences]);

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock recommendations based on various factors
      const mockRecommendations = generateMockRecommendations();
      setRecommendations(mockRecommendations.slice(0, maxRecommendations));
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockRecommendations = (): ThemeRecommendation[] => {
    // This would be replaced with actual AI logic
    const mockThemes: Theme[] = [
      // Add some mock themes here - in practice, these would come from your theme database
      {
        id: 'ai-rec-1',
        name: 'Spotify Vibrant Dark',
        displayName: 'Spotify Vibrant Dark',
        description: 'A vibrant dark theme inspired by Spotify\'s energetic brand',
        type: 'dark',
        brand: {
          id: 'spotify',
          name: 'Spotify',
          displayName: 'Spotify',
          primaryColor: '#1DB954',
          secondaryColor: '#1ed760',
          logo: '/api/placeholder/32/32'
        },
        colors: {
          'editor.background': '#121212',
          'editor.foreground': '#ffffff',
          'activityBar.background': '#1DB954',
          'statusBar.background': '#1ed760'
        },
        tags: ['music', 'entertainment', 'vibrant'],
        metadata: {
          version: '1.0.0',
          author: 'vsskin AI',
          lastUpdated: new Date().toISOString(),
          downloads: 1250,
          rating: 4.8,
          tags: ['ai-generated', 'personalized']
        },
        preview: {
          screenshotUrl: '/api/placeholder/600/400',
          codeSnippets: []
        },
        installation: {
          installInstructions: [],
          downloadUrl: '#'
        }
      }
      // Add more mock themes...
    ];

    return mockThemes.map((theme, index) => ({
      theme,
      score: 0.9 - (index * 0.1),
      reasons: generateReasons(theme, index),
      isPersonalized: index < 3
    }));
  };

  const generateReasons = (theme: Theme, index: number): RecommendationReason[] => {
    const reasons: RecommendationReason[] = [];
    
    if (userPreferences?.preferredBrands.includes(theme.brand.name)) {
      reasons.push({
        type: 'brand_affinity',
        description: `You've shown interest in ${theme.brand.name} themes`,
        confidence: 0.85
      });
    }
    
    if (userPreferences?.themeType === theme.type) {
      reasons.push({
        type: 'usage_pattern',
        description: `Matches your preferred ${theme.type} mode`,
        confidence: 0.9
      });
    }
    
    if (index < 2) {
      reasons.push({
        type: 'trending',
        description: 'Popular among developers this week',
        confidence: 0.7
      });
    }
    
    return reasons;
  };

  const handleFeedback = (themeId: string, positive: boolean) => {
    setFeedbackGiven(prev => ({ ...prev, [themeId]: true }));
    onFeedback?.(themeId, positive);
  };

  const getReasonIcon = (type: RecommendationReason['type']) => {
    switch (type) {
      case 'color_preference':
        return '🎨';
      case 'brand_affinity':
        return '❤️';
      case 'usage_pattern':
        return '⚡';
      case 'trending':
        return '🔥';
      case 'similar_themes':
        return '🔗';
      default:
        return '✨';
    }
  };

  if (isLoading) {
    return (
      <div className="recommendations-container">
        <div className="ai-header">
          <div className="ai-label">
            <Sparkle size={20} />
            <h2>AI Recommendations</h2>
          </div>
          <p>Analyzing your preferences to find perfect themes...</p>
        </div>
        
        <Grid>
          {Array.from({ length: maxRecommendations }).map((_, index) => (
            <Column key={index} sm={4} md={4} lg={4}>
              <Tile>
                <SkeletonPlaceholder className="theme-skeleton" />
              </Tile>
            </Column>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="ai-header">
        <div className="ai-label">
          <Sparkle size={20} />
          <h2>AI Recommendations</h2>
        </div>
        <p>
          {recommendations.filter(r => r.isPersonalized).length > 0
            ? 'Personalized suggestions based on your preferences and activity'
            : 'Popular themes trending in the community'
          }
        </p>
      </div>
      
      <Grid>
        {recommendations.map((recommendation) => (
          <Column key={recommendation.theme.id} sm={4} md={4} lg={4}>
            <div className="recommendation-card">
              <div className="ai-badge">
                <Tag size="sm" type="purple">
                  AI • {Math.round(recommendation.score * 100)}% match
                </Tag>
              </div>
              
              <ThemeCard
                theme={recommendation.theme}
                onSelect={() => onThemeSelect(recommendation.theme)}
                variant="compact"
              />
              
              <div className="recommendation-details">
                <div className="reasons">
                  {recommendation.reasons.slice(0, 2).map((reason, index) => (
                    <div key={index} className="reason">
                      <span className="reason-icon">
                        {getReasonIcon(reason.type)}
                      </span>
                      <span className="reason-text">
                        {reason.description}
                      </span>
                    </div>
                  ))}
                </div>
                
                {onFeedback && !feedbackGiven[recommendation.theme.id] && (
                  <div className="feedback-buttons">
                    <Button
                      kind="ghost"
                      size="sm"
                      hasIconOnly
                      iconDescription="This is helpful"
                      renderIcon={ThumbsUp}
                      onClick={() => handleFeedback(recommendation.theme.id, true)}
                    />
                    <Button
                      kind="ghost"
                      size="sm"
                      hasIconOnly
                      iconDescription="This is not helpful"
                      renderIcon={ThumbsDown}
                      onClick={() => handleFeedback(recommendation.theme.id, false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </Column>
        ))}
      </Grid>
      
      <style jsx>{`
        .recommendations-container {
          margin: 2rem 0;
        }
        
        .ai-header {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border-radius: 8px;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .ai-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .ai-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        .ai-label h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .ai-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }
        
        .recommendation-card {
          position: relative;
          height: 100%;
        }
        
        .ai-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          z-index: 10;
        }
        
        .recommendation-details {
          padding: 1rem;
          background: var(--cds-layer-01);
          border-radius: 0 0 8px 8px;
          border: 1px solid var(--cds-border-subtle);
          border-top: none;
        }
        
        .reasons {
          margin-bottom: 1rem;
        }
        
        .reason {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.75rem;
          color: var(--cds-text-secondary);
        }
        
        .reason-icon {
          font-size: 0.875rem;
        }
        
        .feedback-buttons {
          display: flex;
          gap: 0.25rem;
          justify-content: flex-end;
        }
        
        .theme-skeleton {
          height: 200px;
          width: 100%;
        }
        
        @media (max-width: 768px) {
          .ai-header {
            margin: 1rem;
            padding: 1rem;
          }
          
          .ai-label h2 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
