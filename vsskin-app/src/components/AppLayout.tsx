'use client';

import React, { useState } from 'react';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavItems,
  SideNavLink,
  Content,
  SkipToContent,
  Theme
} from '@carbon/react';
import {
  Light,
  AsleepFilled,
  Notification,
  User,
  Menu,
  Search,
  Settings
} from '@carbon/icons-react';
import { useAppTheme } from '@/contexts/AppThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { theme, toggleTheme } = useAppTheme();
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);

  return (
    <Theme theme={theme === 'dark' ? 'g100' : 'white'}>
      <div className="app-layout">
        <SkipToContent />
        
        <Header aria-label="VSskin">
          <HeaderName prefix="VS">
            <span style={{ color: theme === 'dark' ? '#1ed760' : '#0f62fe' }}>
              Skin
            </span>
          </HeaderName>
          
          <HeaderNavigation aria-label="VSskin">
            <HeaderMenuItem href="/">
              Browse
            </HeaderMenuItem>
            <HeaderMenuItem href="/preview">
              Preview
            </HeaderMenuItem>
            <HeaderMenuItem href="/favorites">
              Favorites
            </HeaderMenuItem>
            <HeaderMenuItem href="/about">
              About
            </HeaderMenuItem>
          </HeaderNavigation>
          
          <HeaderGlobalBar>
            <HeaderGlobalAction
              aria-label="Search themes"
              tooltipAlignment="end"
            >
              <Search size={20} />
            </HeaderGlobalAction>
            
            <HeaderGlobalAction
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              onClick={toggleTheme}
              tooltipAlignment="end"
            >
              {theme === 'light' ? <AsleepFilled size={20} /> : <Light size={20} />}
            </HeaderGlobalAction>
            
            <HeaderGlobalAction
              aria-label="Notifications"
              tooltipAlignment="end"
            >
              <Notification size={20} />
            </HeaderGlobalAction>
            
            <HeaderGlobalAction
              aria-label="Settings"
              tooltipAlignment="end"
            >
              <Settings size={20} />
            </HeaderGlobalAction>
            
            <HeaderGlobalAction
              aria-label="User profile"
              tooltipAlignment="end"
            >
              <User size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </Header>

        <SideNav
          aria-label="Side navigation"
          expanded={isSideNavExpanded}
          onOverlayClick={() => setIsSideNavExpanded(false)}
        >
          <SideNavItems>
            <SideNavLink href="/brands">
              All Brands
            </SideNavLink>
            <SideNavLink href="/categories/popular">
              Popular
            </SideNavLink>
            <SideNavLink href="/categories/new">
              New Themes
            </SideNavLink>
            <SideNavLink href="/categories/dark">
              Dark Themes
            </SideNavLink>
            <SideNavLink href="/categories/light">
              Light Themes
            </SideNavLink>
            <SideNavLink href="/recent">
              Recently Viewed
            </SideNavLink>
            <SideNavLink href="/collections">
              Collections
            </SideNavLink>
          </SideNavItems>
        </SideNav>

        <Content id="main-content">
          <div className="app-content">
            {children}
          </div>
        </Content>
      </div>
      
      <style jsx>{`
        .app-layout {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .app-content {
          padding: 2rem;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
        }
        
        @media (max-width: 672px) {
          .app-content {
            padding: 1rem;
          }
        }
      `}</style>
    </Theme>
  );
}
