# Carbon Design System Integration

This document outlines how the IBM Carbon Design System components are mapped to vsskin's features, based on the technical requirements and Context7 documentation.

## Component Mapping

### 1. Theme Browser

- **Carbon Components**: `DataTable`, `Tile`, `Pagination`
- **Implementation**:
  ```jsx
  import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';
  ```
  - Use `DataTable` with server-side pagination for large theme collections
  - `Tile` components display theme previews with hover effects

### 2. Theme Preview

- **Carbon Components**: `Modal`, `Tabs`, `CodeSnippet`
- **Implementation**:
  ```jsx
  import { ComposedModal, ModalHeader, ModalBody, Tabs, Tab } from '@carbon/react';
  ```
  - `ComposedModal` with dynamic theme injection
  - `Tabs` for light/dark mode comparisons

### 3. Theme Installation

- **Carbon Components**: `Button`, `Notification`
- **Implementation**:
  ```jsx
  import { Button } from '@carbon/react';
  ```
  - Primary `Button` with installation handler
  - `Notification` component for success/error feedback

### 4. Favorites Management

- **Carbon Components**: `Checkbox`, `List`
- **Implementation**:
  ```jsx
  import { Checkbox, List, ListItem } from '@carbon/react';
  ```
  - `Checkbox` for theme selection
  - `List` with drag-and-drop reordering

### 5. Theme Sharing

- **Carbon Components**: `Share`, `Button`
- **Implementation**:
  ```jsx
  import { Share } from '@carbon/react';
  ```
  - Integrated `Share` component with platform-specific handlers

### 6. Theme Information

- **Carbon Components**: `Accordion`, `Tooltip`, `Tag`
- **Implementation**:
  ```jsx
  import { Accordion, Tooltip, Tag } from '@carbon/react';
  ```
  - `Accordion` for expandable brand guidelines
  - `Tooltip` for color palette hex codes

### 7. User Interface

- **Carbon Components**: `Header`, `SideNav`, `Breadcrumb`
- **Implementation**:
  ```jsx
  import { Header, SideNav, Breadcrumb } from '@carbon/react';
  ```
  - Responsive layout with collapsible `SideNav`

### 8. Updates & Compatibility

- **Carbon Components**: `ProgressIndicator`, `Notification`
- **Implementation**:
  ```jsx
  import { ProgressIndicator } from '@carbon/react';
  ```
  - `ProgressIndicator` for update tracking
  - `Notification` for compatibility alerts

## Customization Notes

1. **Theme Tokens**: Use Carbon's theme variables for consistent branding
2. **Accessibility**: Ensure all components meet WCAG 2.1 standards
3. **Performance**: Implement virtualization for large DataTables

## Implementation Steps

1. Install Carbon dependencies: `npm install @carbon/react`
2. Update `vsskin-app/src/components/` with mapped components
3. Configure theme settings in `vsskin-app/src/styles/theme.scss`
4. Test layout responsiveness across devices

## Reference Documentation

- [Carbon Design System Components](https://carbondesignsystem.com/components/overview)
- [Context7 Documentation](https://context7.com/docs)
