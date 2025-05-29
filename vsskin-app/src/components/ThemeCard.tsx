'use client';

import React from 'react';
import {
  Tile,
  Button,
  Tag,
  ClickableTile
} from '@carbon/react';
import {
  Download,
  View,
  FavoriteFilled,
  Favorite,
  Star
} from '@carbon/icons-react';
import { ThemeCardProps } from '@/types';
import clsx from 'clsx';

export default function ThemeCard({
  theme,
  onPreview,
  onInstall,
  onFavorite,
  isFavorited = false
}: ThemeCardProps) {
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(theme);
  };

  const handleInstall = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInstall(theme);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(theme);
    }
  };

  return (
    <div className={clsx('theme-card-wrapper', 'vsskin-theme-card')}>
      <ClickableTile
        onClick={() => onPreview(theme)}
        className="theme-card"
      >
        {/* Theme Preview */}
        <div className="theme-preview">
          <div 
            className="theme-preview-image"
            style={{
              background: `linear-gradient(135deg, ${theme.colors['editor.background']}, ${theme.colors['sideBar.background']})`
            }}
          >
            <div className="vscode-mockup">
              <div 
                className="vscode-titlebar"
                style={{ backgroundColor: theme.colors['titleBar.activeBackground'] }}
              >
                <div className="vscode-traffic-lights">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span 
                  className="vscode-title"
                  style={{ color: theme.colors['titleBar.activeForeground'] }}
                >
                  VS Code
                </span>
              </div>
              <div className="vscode-body">
                <div 
                  className="vscode-sidebar"
                  style={{ backgroundColor: theme.colors['sideBar.background'] }}
                >
                  <div 
                    className="vscode-activity-bar"
                    style={{ backgroundColor: theme.colors['activityBar.background'] }}
                  ></div>
                </div>
                <div 
                  className="vscode-editor"
                  style={{ backgroundColor: theme.colors['editor.background'] }}
                >
                  <div className="code-lines">
                    <div className="code-line">
                      <span style={{ color: theme.brand.primaryColor }}>function</span>
                      <span style={{ color: theme.colors['editor.foreground'] }}> hello() {`{`}</span>
                    </div>
                    <div className="code-line">
                      <span style={{ color: theme.colors['editor.foreground'] }}>  return </span>
                      <span style={{ color: theme.brand.secondaryColor }}>"Hello World"</span>
                    </div>
                    <div className="code-line">
                      <span style={{ color: theme.colors['editor.foreground'] }}>{`}`}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className="vscode-statusbar"
                style={{ backgroundColor: theme.colors['statusBar.background'] }}
              ></div>
            </div>
          </div>
          
          {/* Favorite Button */}
          {onFavorite && (
            <Button
              kind="ghost"
              size="sm"
              onClick={handleFavorite}
              className="favorite-button"
              hasIconOnly
              iconDescription={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              renderIcon={isFavorited ? FavoriteFilled : Favorite}
            />
          )}
        </div>

        {/* Theme Info */}
        <div className="theme-info">
          <div className="theme-header">
            <h3 className="theme-name">{theme.displayName}</h3>
            <div className="brand-badge" style={{ backgroundColor: `${theme.brand.primaryColor}20`, color: theme.brand.primaryColor }}>
              <img 
                src={theme.brand.logo} 
                alt={theme.brand.displayName}
                className="brand-logo"
                onError={(e) => {
                  // Fallback to text if image fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {theme.brand.displayName}
            </div>
          </div>
          
          <p className="theme-description">{theme.description}</p>
          
          <div className="theme-tags">
            <Tag type={theme.type === 'dark' ? 'cool-gray' : 'warm-gray'} size="sm">
              {theme.type}
            </Tag>
            {theme.metadata.tags.slice(0, 2).map(tag => (
              <Tag key={tag} size="sm" type="outline">
                {tag}
              </Tag>
            ))}
          </div>
          
          <div className="theme-stats">
            <div className="stat">
              <Star size={16} />
              <span>{theme.metadata.rating}</span>
            </div>
            <div className="stat">
              <Download size={16} />
              <span>{theme.metadata.downloads.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="theme-actions">
          <Button
            kind="secondary"
            size="sm"
            onClick={handlePreview}
            renderIcon={View}
          >
            Preview
          </Button>
          <Button
            kind="primary"
            size="sm"
            onClick={handleInstall}
            renderIcon={Download}
          >
            Install
          </Button>
        </div>
      </ClickableTile>

      <style jsx>{`
        .theme-card-wrapper {
          height: 100%;
        }
        
        .theme-card {
          height: 100% !important;
          display: flex;
          flex-direction: column;
          padding: 0 !important;
          overflow: hidden;
        }
        
        .theme-preview {
          position: relative;
          flex-shrink: 0;
        }
        
        .theme-preview-image {
          height: 200px;
          border-radius: 4px 4px 0 0;
          overflow: hidden;
          position: relative;
        }
        
        .vscode-mockup {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
          font-size: 10px;
        }
        
        .vscode-titlebar {
          height: 20px;
          display: flex;
          align-items: center;
          padding: 0 8px;
          position: relative;
        }
        
        .vscode-traffic-lights {
          display: flex;
          gap: 4px;
        }
        
        .vscode-traffic-lights span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff5f57, #ff9500, #28ca42);
        }
        
        .vscode-traffic-lights span:nth-child(1) { background: #ff5f57; }
        .vscode-traffic-lights span:nth-child(2) { background: #ffbd2e; }
        .vscode-traffic-lights span:nth-child(3) { background: #28ca42; }
        
        .vscode-title {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 500;
        }
        
        .vscode-body {
          display: flex;
          flex: 1;
        }
        
        .vscode-sidebar {
          display: flex;
          width: 60px;
        }
        
        .vscode-activity-bar {
          width: 15px;
          height: 100%;
        }
        
        .vscode-editor {
          flex: 1;
          padding: 8px;
        }
        
        .code-lines {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .code-line {
          font-size: 8px;
          line-height: 1.2;
        }
        
        .vscode-statusbar {
          height: 15px;
        }
        
        .favorite-button {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 1;
        }
        
        .theme-info {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .theme-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }
        
        .theme-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.2;
        }
        
        .brand-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          flex-shrink: 0;
        }
        
        .brand-logo {
          width: 12px;
          height: 12px;
          object-fit: contain;
        }
        
        .theme-description {
          font-size: 0.875rem;
          color: var(--cds-text-secondary);
          margin: 0;
          line-height: 1.4;
          flex: 1;
        }
        
        .theme-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .theme-stats {
          display: flex;
          gap: 1rem;
        }
        
        .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--cds-text-secondary);
        }
        
        .theme-actions {
          padding: 1rem;
          border-top: 1px solid var(--cds-border-subtle);
          display: flex;
          gap: 0.5rem;
        }
        
        .theme-actions button {
          flex: 1;
        }
        
        @media (max-width: 672px) {
          .theme-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .theme-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
