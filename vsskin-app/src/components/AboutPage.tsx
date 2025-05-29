'use client';

import React from 'react';
import {
  Grid,
  Column,
  Heading,
  Tag,
  Button,
  Tile,
  ProgressIndicator,
  ProgressStep
} from '@carbon/react';
import { 
  ColorPalette, 
  Code, 
  Download, 
  Star,
  LogoGithub,
  Rocket,
  Watson
} from '@carbon/icons-react';

export default function AboutPage() {
  const features = [
    {
      icon: ColorPalette,
      title: 'Brand-Based Themes',
      description: 'Generate beautiful VS Code themes automatically from your favorite brand colors using our intelligent color system.'
    },
    {
      icon: Watson,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized theme suggestions based on your preferences, coding habits, and trending themes in the community.'
    },
    {
      icon: Download,
      title: 'One-Click Installation',
      description: 'Install themes directly into VS Code with our seamless installation system. No manual setup required.'
    },
    {
      icon: Code,
      title: 'Real-Time Preview',
      description: 'See exactly how your code will look with interactive previews featuring multiple programming languages.'
    },
    {
      icon: Star,
      title: 'Curated Collection',
      description: 'Discover professionally crafted themes based on popular brands like Spotify, GitHub, Discord, and more.'
    },
    {
      icon: Rocket,
      title: 'Export & Share',
      description: 'Export themes as VS Code extension packages (.vsix) and share them with the community.'
    }
  ];

  const stats = [
    { label: 'Available Themes', value: '50+' },
    { label: 'Supported Brands', value: '20+' },
    { label: 'Theme Variants', value: '100+' },
    { label: 'Downloads', value: '10K+' }
  ];

  const roadmap = [
    { 
      label: 'Core Features', 
      description: 'Theme browsing, preview, and installation',
      status: 'complete'
    },
    { 
      label: 'AI Recommendations', 
      description: 'Personalized theme suggestions',
      status: 'complete'
    },
    { 
      label: 'Brand Integration', 
      description: 'Automatic theme generation from brand APIs',
      status: 'complete'
    },
    { 
      label: 'Community Features', 
      description: 'User accounts, ratings, and reviews',
      status: 'current'
    },
    { 
      label: 'Advanced Customization', 
      description: 'Theme editor and custom color schemes',
      status: 'current'
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Grid>
        {/* Hero Section */}
        <Column lg={16}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '4rem',
            padding: '3rem 0',
            background: 'linear-gradient(135deg, #0f62fe 0%, #1ed760 100%)',
            borderRadius: '8px',
            color: 'white'
          }}>
            <Heading style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>
              VSskin
            </Heading>
            <p style={{ 
              fontSize: '1.25rem', 
              marginBottom: '2rem', 
              maxWidth: '600px', 
              margin: '0 auto 2rem',
              opacity: 0.9
            }}>
              The ultimate VS Code theme studio. Browse, preview, and install beautiful themes 
              generated from your favorite brand colors with the power of AI.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button kind="secondary" renderIcon={LogoGithub}>
                View on GitHub
              </Button>
              <Button kind="tertiary" renderIcon={Star}>
                Star on GitHub
              </Button>
            </div>
          </div>
        </Column>

        {/* Stats */}
        <Column lg={16}>
          <Grid style={{ marginBottom: '4rem' }}>
            {stats.map((stat, index) => (
              <Column key={index} lg={4} md={8} sm={16}>
                <Tile style={{ 
                  textAlign: 'center', 
                  padding: '2rem',
                  height: '100%'
                }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    color: '#0f62fe',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ color: 'var(--cds-text-secondary)' }}>
                    {stat.label}
                  </div>
                </Tile>
              </Column>
            ))}
          </Grid>
        </Column>

        {/* Features */}
        <Column lg={16}>
          <Heading style={{ marginBottom: '2rem', textAlign: 'center' }}>
            Features
          </Heading>
          <Grid style={{ marginBottom: '4rem' }}>
            {features.map((feature, index) => (
              <Column key={index} lg={8} md={16} sm={16}>
                <Tile style={{ 
                  padding: '2rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <feature.icon size={32} style={{ 
                    color: '#0f62fe', 
                    marginBottom: '1rem' 
                  }} />
                  <Heading style={{ 
                    fontSize: '1.25rem', 
                    marginBottom: '1rem' 
                  }}>
                    {feature.title}
                  </Heading>
                  <p style={{ 
                    color: 'var(--cds-text-secondary)',
                    lineHeight: '1.6',
                    flex: 1
                  }}>
                    {feature.description}
                  </p>
                </Tile>
              </Column>
            ))}
          </Grid>
        </Column>

        {/* Roadmap */}
        <Column lg={16}>
          <Heading style={{ marginBottom: '2rem', textAlign: 'center' }}>
            Development Roadmap
          </Heading>
          <Tile style={{ padding: '2rem', marginBottom: '4rem' }}>
            <ProgressIndicator currentIndex={2}>
              {roadmap.map((item, index) => (
                <ProgressStep
                  key={index}
                  label={item.label}
                  description={item.description}
                  complete={item.status === 'complete'}
                  current={item.status === 'current'}
                />
              ))}
            </ProgressIndicator>
          </Tile>
        </Column>

        {/* Technology Stack */}
        <Column lg={16}>
          <Heading style={{ marginBottom: '2rem', textAlign: 'center' }}>
            Built With
          </Heading>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '4rem'
          }}>
            <Tag type="blue">Next.js 15</Tag>
            <Tag type="cyan">React 19</Tag>
            <Tag type="teal">TypeScript</Tag>
            <Tag type="green">Carbon Design System</Tag>
            <Tag type="purple">Brandfetch API</Tag>
            <Tag type="magenta">VS Code Extensions API</Tag>
          </div>
        </Column>

        {/* Contact */}
        <Column lg={16}>
          <Tile style={{ 
            textAlign: 'center', 
            padding: '3rem',
            background: 'var(--cds-layer-02)'
          }}>
            <Heading style={{ marginBottom: '1rem' }}>
              Questions or Feedback?
            </Heading>
            <p style={{ 
              marginBottom: '2rem',
              color: 'var(--cds-text-secondary)'
            }}>
              We'd love to hear from you! VSskin is an open-source project and we welcome contributions.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button kind="primary" renderIcon={LogoGithub}>
                Report Issue
              </Button>
              <Button kind="secondary">
                Request Feature
              </Button>
              <Button kind="tertiary">
                Join Discord
              </Button>
            </div>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
