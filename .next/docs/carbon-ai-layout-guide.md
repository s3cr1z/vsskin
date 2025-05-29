# Best Practices for Designing Web App Main Layout Using Carbon Design System with AI-Driven Components

This guide outlines best practices for implementing a scalable, consistent, and AI-compliant main layout for the vsskin web application using IBM's Carbon Design System.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Layout Structure](#layout-structure)
3. [AI-Driven Components Integration](#ai-driven-components-integration)
4. [Theme Consistency](#theme-consistency)
5. [Scalability Considerations](#scalability-considerations)
6. [Accessibility Compliance](#accessibility-compliance)
7. [Implementation Guidelines](#implementation-guidelines)

## Architecture Overview

The vsskin web application should follow a modular architecture that leverages Carbon Design System's component library while incorporating AI-driven features. The architecture should:

- Separate UI components from business logic
- Implement a theme provider for consistent styling
- Use Carbon's grid system for responsive layouts
- Incorporate Carbon for AI components where AI-generated content is displayed

### Technology Stack

```
- React.js for UI components
- Carbon Design System (@carbon/react)
- Carbon for AI components (@carbon/ai-components)
- Carbon Web Components for framework-agnostic integration
- CSS Modules or Styled Components for component-specific styling
```

## Layout Structure

The main layout should follow Carbon Design System's UI Shell pattern, which provides a consistent framework for navigation and content organization.

### Global Header

The global header should include:

- Product branding (vsskin logo and name)
- Main navigation links (Browse, Preview, Install, Favorites)
- User utilities (profile, notifications, settings)
- Theme switcher (light/dark mode toggle)

```jsx
// Example structure for UI Shell Header
<Header aria-label="vsskin">
  <HeaderName prefix="VS">Skin</HeaderName>
  <HeaderNavigation>
    <HeaderMenuItem href="/browse">Browse</HeaderMenuItem>
    <HeaderMenuItem href="/preview">Preview</HeaderMenuItem>
    <HeaderMenuItem href="/install">Install</HeaderMenuItem>
    <HeaderMenuItem href="/favorites">Favorites</HeaderMenuItem>
  </HeaderNavigation>
  <HeaderGlobalBar>
    <ThemeSwitcher />
    <NotificationsPanel />
    <UserProfileMenu />
  </HeaderGlobalBar>
</Header>
```

### Left Panel Navigation

For deeper navigation within sections, implement a left panel that can be toggled via the hamburger menu:

- Category filters
- Brand filters
- Color palette filters
- Recently viewed themes

### Main Content Area

The main content area should use Carbon's grid system for responsive layouts:

- Implement fluid containers for theme cards/previews
- Use appropriate grid breakpoints for different device sizes
- Apply consistent spacing using Carbon's spacing tokens

## AI-Driven Components Integration

When integrating AI features (such as theme recommendations or generated color palettes), follow Carbon for AI guidelines:

### AI Label Component

Always use the AI label component to clearly indicate AI-generated content:

```jsx
// Example of AI-labeled content
<AILabel>
  <p>This theme was recommended based on your preferences</p>
</AILabel>
```

### AI Layer Styling

Apply the AI layer styling to components that display AI-generated content:

- Use the AI-specific gradient backgrounds
- Implement proper depth and radial edges
- Ensure proper contrast for accessibility

### Explainability

For all AI-driven features, provide clear explanations of:

- How recommendations are generated
- What data is being used
- Limitations of the AI suggestions

## Theme Consistency

Maintain visual consistency across the application by:

### Token-Based Design System

- Use Carbon Design System tokens for colors, spacing, typography, and motion
- Implement a theme provider that supports both light and dark modes
- Create custom theme tokens for vsskin-specific elements that extend Carbon's base tokens

### Fluid vs. Default Components

- Use fluid components for expressive moments and important actions
- Use default components for productive, task-focused interfaces
- Follow Carbon's guidelines for mixing fluid and default components:

```jsx
// Example of mixing fluid and default components
<FluidModal>
  <ModalHeader>Theme Preview</ModalHeader>
  <ModalBody>
    <TextInput labelText="Theme Name" />
    <Select labelText="Category" items={categories} />
    <FluidButton>Install Theme</FluidButton>
  </ModalBody>
</FluidModal>
```

## Scalability Considerations

Design the layout to scale with growing content and features:

### Component Architecture

- Create atomic, reusable components
- Implement lazy loading for heavy components
- Use virtualization for long lists of themes

### Performance Optimization

- Optimize bundle size with code splitting
- Implement efficient state management
- Use memoization for expensive calculations

### Responsive Design

- Use Carbon's responsive grid system
- Implement appropriate breakpoints for different device sizes
- Test layouts across various screen dimensions

## Accessibility Compliance

Ensure the application meets accessibility standards:

### WCAG 2.1 Compliance

- Implement proper heading hierarchy
- Ensure sufficient color contrast (3:1 for UI components, 4.5:1 for text)
- Provide keyboard navigation for all interactive elements

### Screen Reader Support

- Add appropriate ARIA labels
- Implement landmark regions
- Include "Skip to main content" link

### Focus Management

- Maintain visible focus indicators
- Implement logical tab order
- Ensure interactive elements have appropriate focus states

## Implementation Guidelines

Follow these steps to implement the layout:

### 1. Set Up Carbon Design System

```bash
# Install Carbon Design System
npm install @carbon/react @carbon/styles @carbon/icons-react

# For AI components
npm install @carbon/ai-components

# For framework-agnostic components
npm install @carbon/web-components
```

### 2. Configure Theme Provider

```jsx
// src/App.jsx
import { Theme } from '@carbon/react';
import { useThemePreference } from './hooks/useThemePreference';

function App() {
  const { theme, toggleTheme } = useThemePreference();
  
  return (
    <Theme theme={theme}>
      <AppLayout toggleTheme={toggleTheme}>
        {/* Application content */}
      </AppLayout>
    </Theme>
  );
}
```

### 3. Implement Main Layout Structure

```jsx
// src/components/AppLayout/AppLayout.jsx
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
  SkipToContent
} from '@carbon/react';
import { Light, Moon, Notification, User } from '@carbon/icons-react';

function AppLayout({ children, toggleTheme }) {
  return (
    <>
      <SkipToContent />
      <Header aria-label="vsskin">
        <HeaderName prefix="VS">Skin</HeaderName>
        <HeaderNavigation>
          <HeaderMenuItem href="/browse">Browse</HeaderMenuItem>
          <HeaderMenuItem href="/preview">Preview</HeaderMenuItem>
          <HeaderMenuItem href="/install">Install</HeaderMenuItem>
          <HeaderMenuItem href="/favorites">Favorites</HeaderMenuItem>
        </HeaderNavigation>
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Toggle theme" onClick={toggleTheme}>
            {theme === 'g100' ? <Light /> : <Moon />}
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="Notifications">
            <Notification />
          </HeaderGlobalAction>
          <HeaderGlobalAction aria-label="User Profile">
            <User />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <SideNav aria-label="Side navigation">
        <SideNavItems>
          <SideNavLink href="/categories">Categories</SideNavLink>
          <SideNavLink href="/brands">Brands</SideNavLink>
          <SideNavLink href="/colors">Color Palettes</SideNavLink>
          <SideNavLink href="/recent">Recently Viewed</SideNavLink>
        </SideNavItems>
      </SideNav>
      <Content id="main-content">
        {children}
      </Content>
    </>
  );
}
```

### 4. Implement AI-Driven Components

```jsx
// src/components/ThemeRecommendations/ThemeRecommendations.jsx
import { AILabel, AILayer } from '@carbon/ai-components';
import { Grid, Column, Tile } from '@carbon/react';
import { ThemeCard } from '../ThemeCard';

function ThemeRecommendations({ recommendations }) {
  return (
    <AILayer>
      <AILabel>
        <h2>Recommended Themes</h2>
        <p>Based on your browsing history and preferences</p>
      </AILabel>
      <Grid>
        {recommendations.map(theme => (
          <Column sm={4} md={4} lg={4} key={theme.id}>
            <ThemeCard theme={theme} />
          </Column>
        ))}
      </Grid>
    </AILayer>
  );
}
```

## Conclusion

By following these best practices, the vsskin web application will achieve a scalable, consistent, and AI-compliant main layout using Carbon Design System. This approach ensures:

1. **Scalability** through modular components and responsive design
2. **Theme consistency** via token-based styling and proper component usage
3. **AI compliance** by implementing Carbon for AI guidelines for explainability and visual distinction
4. **Accessibility** through proper ARIA implementation and keyboard navigation

Remember to regularly update Carbon Design System dependencies to benefit from the latest improvements and ensure compatibility with evolving AI design standards.