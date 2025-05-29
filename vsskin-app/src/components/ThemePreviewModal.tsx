'use client';

import React, { useState } from 'react';
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  CodeSnippet,
  Tag,
  Grid,
  Column,
  InlineNotification,
  InlineLoading,
  OrderedList,
  ListItem
} from '@carbon/react';
import {
  Download,
  Launch,
  FavoriteFilled,
  Favorite,
  Star,
  LogoGithub,
  Copy,
  CheckmarkFilled
} from '@carbon/icons-react';
import { ThemePreviewModalProps } from '@/types';
import { 
  installTheme, 
  copyInstallCommand, 
  getInstallationInstructions,
  isVSCodeAvailable,
  installThemeDirectly,
  InstallationResult
} from '@/lib/themeInstaller';
import { VSIXExporter, VSIXOptions } from '@/lib/vsixExporter';

export default function ThemePreviewModal({
  theme,
  isOpen,
  onClose,
  onInstall
}: ThemePreviewModalProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installationResult, setInstallationResult] = useState<InstallationResult | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!theme) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    setInstallationResult(null);

    try {
      // Try direct installation first if in VS Code environment
      let result: InstallationResult;
      
      if (isVSCodeAvailable()) {
        result = await installThemeDirectly(theme);
        
        // Fallback to download if direct installation fails
        if (!result.success) {
          result = await installTheme(theme);
        }
      } else {
        result = await installTheme(theme);
      }

      setInstallationResult(result);
      
      if (result.success) {
        onInstall(theme);
        setShowInstructions(true);
      }
    } catch (error) {
      setInstallationResult({
        success: false,
        message: 'Installation failed. Please try again.'
      });
    } finally {
      setIsInstalling(false);
    }
  };

  const handleCopyCommand = async () => {
    const success = await copyInstallCommand(theme);
    setCommandCopied(success);
    
    if (success) {
      setTimeout(() => setCommandCopied(false), 2000);
    }
  };

  const handleExportVSIX = async () => {
    setIsExporting(true);
    setExportResult(null);

    try {
      const options: VSIXOptions = {
        publisher: 'vsskin',
        version: '1.0.0',
        displayName: theme.displayName,
        description: theme.description,
        homepage: 'https://vsskin.com',
        license: 'MIT'
      };

      VSIXExporter.downloadVSIX(theme, options);
      
      setExportResult({
        success: true,
        message: 'VSIX file downloaded successfully! Install it by opening VS Code and running: Extensions > Install from VSIX...'
      });
    } catch (error) {
      console.error('VSIX export failed:', error);
      setExportResult({
        success: false,
        message: 'Failed to export VSIX file. Please try again.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement favorites functionality
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <ComposedModal
      open={isOpen}
      onClose={onClose}
      size="lg"
      className="theme-preview-modal"
    >
      <ModalHeader
        title={theme.displayName}
        label={`${theme.brand.displayName} • ${theme.type} theme`}
      >
        <div className="theme-header-actions">
          <Button
            kind="ghost"
            size="sm"
            onClick={handleFavorite}
            hasIconOnly
            iconDescription={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            renderIcon={isFavorited ? FavoriteFilled : Favorite}
          />
        </div>
      </ModalHeader>
      
      <ModalBody>
        <div className="theme-preview-content">
          {/* Theme Overview */}
          <div className="theme-overview">
            <Grid>
              <Column sm={4} md={6} lg={8}>
                <div className="theme-details">
                  <p className="theme-description">{theme.description}</p>
                  
                  <div className="theme-meta">
                    <div className="meta-item">
                      <strong>Version:</strong> {theme.metadata.version}
                    </div>
                    <div className="meta-item">
                      <strong>Author:</strong> {theme.metadata.author}
                    </div>
                    <div className="meta-item">
                      <strong>Last Updated:</strong> {new Date(theme.metadata.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="meta-item">
                      <strong>Downloads:</strong> {theme.metadata.downloads.toLocaleString()}
                    </div>
                    <div className="meta-item">
                      <strong>Rating:</strong>
                      <span className="rating">
                        <Star size={16} />
                        {theme.metadata.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="theme-tags">
                    {theme.metadata.tags.map(tag => (
                      <Tag key={tag} size="sm" type="outline">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Column>
              
              <Column sm={4} md={2} lg={4}>
                <div className="brand-info">
                  <div 
                    className="brand-card"
                    style={{ 
                      backgroundColor: `${theme.brand.primaryColor}15`,
                      borderColor: theme.brand.primaryColor
                    }}
                  >
                    <div className="brand-header">
                      <img 
                        src={theme.brand.logo} 
                        alt={theme.brand.displayName}
                        className="brand-logo"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <h4>{theme.brand.displayName}</h4>
                    </div>
                    
                    <div className="brand-colors">
                      <div className="color-palette">
                        <div 
                          className="color-swatch primary"
                          style={{ backgroundColor: theme.brand.primaryColor }}
                          title={`Primary: ${theme.brand.primaryColor}`}
                        ></div>
                        <div 
                          className="color-swatch secondary"
                          style={{ backgroundColor: theme.brand.secondaryColor }}
                          title={`Secondary: ${theme.brand.secondaryColor}`}
                        ></div>
                      </div>
                    </div>
                    
                    <Button
                      kind="ghost"
                      size="sm"
                      onClick={() => handleExternalLink(theme.brand.website)}
                      renderIcon={Launch}
                    >
                      Visit Website
                    </Button>
                  </div>
                </div>
              </Column>
            </Grid>
          </div>

          {/* Tabbed Content */}
          <div className="theme-tabs">
            <Tabs selectedIndex={selectedTab} onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}>
              <TabList>
                <Tab>Preview</Tab>
                <Tab>Code Examples</Tab>
                <Tab>Installation</Tab>
                <Tab>Color Palette</Tab>
              </TabList>
              
              <TabPanels>
                {/* Preview Tab */}
                <TabPanel>
                  <div className="preview-panel">
                    <div className="vscode-preview-large">
                      <div 
                        className="vscode-window"
                        style={{
                          backgroundColor: theme.colors['editor.background'],
                          color: theme.colors['editor.foreground']
                        }}
                      >
                        {/* Title Bar */}
                        <div 
                          className="vscode-titlebar-large"
                          style={{ backgroundColor: theme.colors['titleBar.activeBackground'] }}
                        >
                          <div className="traffic-lights">
                            <span className="red"></span>
                            <span className="yellow"></span>
                            <span className="green"></span>
                          </div>
                          <span 
                            className="title-text"
                            style={{ color: theme.colors['titleBar.activeForeground'] }}
                          >
                            main.ts - VSskin Example
                          </span>
                        </div>
                        
                        {/* Body */}
                        <div className="vscode-body-large">
                          {/* Activity Bar */}
                          <div 
                            className="activity-bar-large"
                            style={{ backgroundColor: theme.colors['activityBar.background'] }}
                          >
                            <div className="activity-icons">
                              <div 
                                className="activity-icon active"
                                style={{ color: theme.colors['activityBar.foreground'] }}
                              >📁</div>
                              <div className="activity-icon">🔍</div>
                              <div className="activity-icon">🔀</div>
                              <div className="activity-icon">🐛</div>
                              <div className="activity-icon">🧩</div>
                            </div>
                          </div>
                          
                          {/* Sidebar */}
                          <div 
                            className="sidebar-large"
                            style={{ backgroundColor: theme.colors['sideBar.background'] }}
                          >
                            <div className="sidebar-header">
                              <span style={{ color: theme.colors['sideBar.foreground'] }}>EXPLORER</span>
                            </div>
                            <div className="file-tree">
                              <div className="file-item folder">📁 src</div>
                              <div className="file-item file active">📄 main.ts</div>
                              <div className="file-item file">📄 utils.ts</div>
                              <div className="file-item file">📄 types.ts</div>
                            </div>
                          </div>
                          
                          {/* Editor */}
                          <div 
                            className="editor-large"
                            style={{ backgroundColor: theme.colors['editor.background'] }}
                          >
                            <div className="editor-tabs">
                              <div 
                                className="editor-tab active"
                                style={{ 
                                  backgroundColor: theme.colors['editor.background'],
                                  color: theme.colors['editor.foreground']
                                }}
                              >
                                main.ts
                              </div>
                            </div>
                            <div className="editor-content">
                              <div className="line-numbers">
                                {Array.from({ length: 15 }, (_, i) => (
                                  <div key={i + 1} className="line-number">{i + 1}</div>
                                ))}
                              </div>
                              <div className="code-content">
                                <div className="code-line">
                                  <span style={{ color: theme.brand.primaryColor }}>import</span>
                                  <span> {`{`} ThemeProvider {`}`} </span>
                                  <span style={{ color: theme.brand.primaryColor }}>from</span>
                                  <span style={{ color: theme.brand.secondaryColor }}> './providers'</span>
                                  <span>;</span>
                                </div>
                                <div className="code-line">
                                  <span style={{ color: theme.brand.primaryColor }}>import</span>
                                  <span> {`{`} Theme {`}`} </span>
                                  <span style={{ color: theme.brand.primaryColor }}>from</span>
                                  <span style={{ color: theme.brand.secondaryColor }}> './types'</span>
                                  <span>;</span>
                                </div>
                                <div className="code-line"></div>
                                <div className="code-line">
                                  <span style={{ color: theme.brand.primaryColor }}>interface</span>
                                  <span> AppProps {`{`}</span>
                                </div>
                                <div className="code-line">
                                  <span>  theme: Theme;</span>
                                </div>
                                <div className="code-line">
                                  <span>  children: React.ReactNode;</span>
                                </div>
                                <div className="code-line">
                                  <span>{`}`}</span>
                                </div>
                                <div className="code-line"></div>
                                <div className="code-line">
                                  <span style={{ color: theme.brand.primaryColor }}>export</span>
                                  <span style={{ color: theme.brand.primaryColor }}> function</span>
                                  <span> App({`{`} theme, children {`}`}: AppProps) {`{`}</span>
                                </div>
                                <div className="code-line">
                                  <span>  </span>
                                  <span style={{ color: theme.brand.primaryColor }}>return</span>
                                  <span> (</span>
                                </div>
                                <div className="code-line">
                                  <span>    &lt;</span>
                                  <span style={{ color: theme.brand.secondaryColor }}>ThemeProvider</span>
                                  <span> theme={`{`}theme{`}`}&gt;</span>
                                </div>
                                <div className="code-line">
                                  <span>      {`{`}children{`}`}</span>
                                </div>
                                <div className="code-line">
                                  <span>    &lt;/</span>
                                  <span style={{ color: theme.brand.secondaryColor }}>ThemeProvider</span>
                                  <span>&gt;</span>
                                </div>
                                <div className="code-line">
                                  <span>  );</span>
                                </div>
                                <div className="code-line">
                                  <span>{`}`}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Bar */}
                        <div 
                          className="statusbar-large"
                          style={{ backgroundColor: theme.colors['statusBar.background'] }}
                        >
                          <div className="status-left">
                            <span style={{ color: theme.colors['statusBar.foreground'] }}>TypeScript</span>
                          </div>
                          <div className="status-right">
                            <span style={{ color: theme.colors['statusBar.foreground'] }}>Ln 9, Col 34</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                
                {/* Code Examples Tab */}
                <TabPanel>
                  <div className="code-examples">
                    {theme.preview.codeSnippets.map((snippet, index) => (
                      <div key={index} className="code-example">
                        <h4>{snippet.title}</h4>
                        <CodeSnippet
                          type="multi"
                        >
                          {snippet.code}
                        </CodeSnippet>
                      </div>
                    ))}
                  </div>
                </TabPanel>
                
                {/* Installation Tab */}
                <TabPanel>
                  <div className="installation-panel">
                    {installationResult && installationResult.success && showInstructions && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <InlineNotification
                          kind="success"
                          title="Theme package downloaded!"
                          subtitle="Follow the steps below to complete the installation."
                          lowContrast
                          hideCloseButton
                        />
                      </div>
                    )}
                    
                    <div className="installation-methods">
                      <div className="method">
                        <h4>🚀 Quick Install</h4>
                        <p>Download and install the theme package with one click:</p>
                        <div className="installation-buttons">
                          <Button
                            kind="primary"
                            onClick={handleInstall}
                            renderIcon={isInstalling ? undefined : Download}
                            disabled={isInstalling}
                          >
                            {isInstalling ? (
                              <InlineLoading description="Creating package..." />
                            ) : (
                              'Download Theme Package'
                            )}
                          </Button>
                          
                          <Button
                            kind="ghost"
                            onClick={handleCopyCommand}
                            renderIcon={commandCopied ? CheckmarkFilled : Copy}
                            disabled={isInstalling}
                          >
                            {commandCopied ? 'Command Copied!' : 'Copy Install Command'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="method">
                        <h4>📋 Installation Steps</h4>
                        <OrderedList>
                          {getInstallationInstructions(theme).map((step, index) => (
                            <ListItem key={index}>{step}</ListItem>
                          ))}
                        </OrderedList>
                      </div>
                      
                      <div className="method">
                        <h4>💻 Command Line Installation</h4>
                        <p>Use the VS Code CLI to install this theme:</p>
                        <CodeSnippet type="single">
                          {`code --install-extension vsskin-${theme.brand.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.${theme.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')}-theme`}
                        </CodeSnippet>
                      </div>

                      {theme.installation?.vsCodeMarketplaceUrl && (
                        <div className="method">
                          <h4>🛒 VS Code Marketplace</h4>
                          <p>Install directly from the VS Code Extensions marketplace:</p>
                          <div className="installation-buttons">
                            <Button
                              kind="secondary"
                              onClick={() => handleExternalLink(theme.installation.vsCodeMarketplaceUrl!)}
                              renderIcon={Launch}
                            >
                              Open in Marketplace
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {theme.installation?.githubUrl && (
                        <div className="method">
                          <h4>🔧 GitHub Repository</h4>
                          <p>View the source code and contribute:</p>
                          <Button
                            kind="ghost"
                            onClick={() => handleExternalLink(theme.installation.githubUrl!)}
                            renderIcon={LogoGithub}
                          >
                            View on GitHub
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabPanel>
                
                {/* Color Palette Tab */}
                <TabPanel>
                  <div className="color-palette-panel">
                    <div className="palette-grid">
                      {Object.entries(theme.colors).map(([key, value]) => (
                        <div key={key} className="color-item">
                          <div 
                            className="color-preview"
                            style={{ backgroundColor: value }}
                          ></div>
                          <div className="color-details">
                            <div className="color-name">{key}</div>
                            <div className="color-value">{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </ModalBody>
      
      <ModalFooter>
        {(installationResult || exportResult) && (
          <div style={{ flex: 1, marginRight: '1rem' }}>
            {installationResult && (
              <InlineNotification
                kind={installationResult.success ? 'success' : 'error'}
                title={installationResult.success ? 'Success!' : 'Installation Failed'}
                subtitle={installationResult.message}
                lowContrast
                hideCloseButton
              />
            )}
            {exportResult && (
              <InlineNotification
                kind={exportResult.success ? 'success' : 'error'}
                title={exportResult.success ? 'VSIX Export Success!' : 'Export Failed'}
                subtitle={exportResult.message}
                lowContrast
                hideCloseButton
                style={{ marginTop: installationResult ? '0.5rem' : '0' }}
              />
            )}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button
            kind="ghost"
            size="md"
            onClick={handleCopyCommand}
            renderIcon={commandCopied ? CheckmarkFilled : Copy}
            disabled={isInstalling || isExporting}
          >
            {commandCopied ? 'Copied!' : 'Copy Command'}
          </Button>
          
          <Button
            kind="tertiary"
            size="md"
            onClick={handleExportVSIX}
            renderIcon={isExporting ? undefined : Download}
            disabled={isInstalling || isExporting}
          >
            {isExporting ? (
              <InlineLoading description="Exporting..." />
            ) : (
              'Export VSIX'
            )}
          </Button>
          
          <Button 
            kind="secondary" 
            onClick={onClose}
            disabled={isInstalling || isExporting}
          >
            Close
          </Button>
          
          <Button 
            kind="primary" 
            onClick={handleInstall} 
            renderIcon={isInstalling ? undefined : Download}
            disabled={isInstalling || isExporting}
          >
            {isInstalling ? (
              <InlineLoading description="Installing..." />
            ) : (
              'Install Theme'
            )}
          </Button>
        </div>
      </ModalFooter>
      
      <style jsx>{`
        .theme-header-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .theme-preview-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .theme-overview {
          margin-bottom: 1rem;
        }
        
        .theme-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .theme-description {
          font-size: 1rem;
          margin: 0;
          color: var(--cds-text-primary);
        }
        
        .theme-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .theme-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .brand-info {
          height: 100%;
        }
        
        .brand-card {
          padding: 1rem;
          border: 1px solid;
          border-radius: 8px;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .brand-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .brand-logo {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
        
        .brand-header h4 {
          margin: 0;
          font-size: 1rem;
        }
        
        .color-palette {
          display: flex;
          gap: 0.5rem;
        }
        
        .color-swatch {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid var(--cds-border-subtle);
        }
        
        .vscode-preview-large {
          width: 100%;
          height: 500px;
          border: 1px solid var(--cds-border-subtle);
          border-radius: 8px;
          overflow: hidden;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        }
        
        .vscode-window {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .vscode-titlebar-large {
          height: 30px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          position: relative;
        }
        
        .traffic-lights {
          display: flex;
          gap: 8px;
        }
        
        .traffic-lights span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .traffic-lights .red { background: #ff5f57; }
        .traffic-lights .yellow { background: #ffbd2e; }
        .traffic-lights .green { background: #28ca42; }
        
        .title-text {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          font-weight: 500;
        }
        
        .vscode-body-large {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        
        .activity-bar-large {
          width: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 0;
        }
        
        .activity-icons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .activity-icon {
          font-size: 16px;
          opacity: 0.6;
          cursor: pointer;
        }
        
        .activity-icon.active {
          opacity: 1;
        }
        
        .sidebar-large {
          width: 240px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--cds-border-subtle);
        }
        
        .sidebar-header {
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 600;
          opacity: 0.8;
        }
        
        .file-tree {
          padding: 0 12px;
        }
        
        .file-item {
          padding: 2px 0;
          font-size: 12px;
          cursor: pointer;
          opacity: 0.8;
        }
        
        .file-item.active {
          opacity: 1;
          font-weight: 500;
        }
        
        .editor-large {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .editor-tabs {
          height: 32px;
          display: flex;
          border-bottom: 1px solid var(--cds-border-subtle);
        }
        
        .editor-tab {
          padding: 8px 16px;
          font-size: 12px;
          border-right: 1px solid var(--cds-border-subtle);
        }
        
        .editor-content {
          flex: 1;
          display: flex;
          font-size: 13px;
          line-height: 1.4;
        }
        
        .line-numbers {
          width: 40px;
          padding: 8px 4px;
          text-align: right;
          opacity: 0.5;
          font-size: 11px;
          border-right: 1px solid var(--cds-border-subtle);
        }
        
        .code-content {
          flex: 1;
          padding: 8px 12px;
        }
        
        .code-line {
          height: 18px;
          font-family: inherit;
        }
        
        .statusbar-large {
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          font-size: 11px;
        }
        
        .code-examples {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .code-example h4 {
          margin: 0 0 0.5rem;
        }
        
        .installation-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .installation-methods {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .method h4 {
          margin: 0 0 0.5rem;
          color: var(--cds-text-primary);
        }
        
        .method p {
          margin: 0 0 1rem;
          color: var(--cds-text-secondary);
        }
        
        .installation-steps {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .installation-steps li {
          margin-bottom: 0.5rem;
        }
        
        .installation-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .color-palette-panel {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .palette-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .color-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border: 1px solid var(--cds-border-subtle);
          border-radius: 4px;
        }
        
        .color-preview {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 1px solid var(--cds-border-subtle);
          flex-shrink: 0;
        }
        
        .color-details {
          flex: 1;
          min-width: 0;
        }
        
        .color-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--cds-text-primary);
          margin-bottom: 0.25rem;
        }
        
        .color-value {
          font-size: 0.6875rem;
          font-family: monospace;
          color: var(--cds-text-secondary);
          word-break: break-all;
        }
      `}</style>
    </ComposedModal>
  );
}
