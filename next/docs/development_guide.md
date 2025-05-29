# Development Guide for vsskin Web App

This guide bridges all documentation in the `docs/` folder to provide a unified instruction set for building the vsskin web app.

## 1. Project Overview

- **Key Features**: Refer to [README.md](./readme.md#key-features)
- **Scope**: Defined in [project_plan.md](./project_plan.md#project-scope)

## 2. Architecture

- **High-Level Plan**: Detailed in [vsskin_architecture.md](./vsskin_architecture.md)
- **Core Components**: Theme Data Management, UI Framework, Update Mechanism

## 3. Carbon Design System Integration

- **Component Mapping**: Refer to [carbon-integration.md](./carbon-integration.md)
- **Key Implementations**:
  - Theme Browser (`DataTable`, `Tile`)
  - Theme Preview (`Modal`, `Tabs`)
  - Responsive Layout (`Header`, `SideNav`)

## 4. AI-Driven Components

- **Best Practices**: Follow [carbon-ai-layout-guide.md](./carbon-ai-layout-guide.md)
- **Key Considerations**:
  - AI Label Component
  - AI Layer Styling
  - Explainability

## 5. Implementation Roadmap

- **Step-by-Step Guide**: Refer to [implementation_guide.md](./implementation_guide.md)
- **Critical Path**:
  1. Set Up Project Structure
  2. Implement UI Shell
  3. Integrate Core Features
  4. Add AI-Driven Components

## 6. Project Execution

- **Dependencies**: Listed in [project_plan.md](./project_plan.md#dependencies)
- **Testing**:
  - Responsiveness
  - Accessibility (WCAG 2.1)
  - Compatibility with VS Code versions

## 7. Next Steps for AI Agent

1. **Review Architecture**: Ensure alignment with [vsskin_architecture.md](./vsskin_architecture.md)
2. **Implement Components**: Follow mappings in [carbon-integration.md](./carbon-integration.md)
3. **Integrate AI Features**: Apply guidelines from [carbon-ai-layout-guide.md](./carbon-ai-layout-guide.md)
4. **Test & Iterate**: Validate against requirements in [readme.md](./readme.md)

## 8. Brand Integration

- **Data Source**: Use `docs/assets/api/brandFetchBrands.md` for brand API links
- **Implementation Steps**:
  1. Fetch brand data from provided APIs
  2. Map brand colors/fonts to VS Code theme variables
  3. Generate themes dynamically in the app
  4. Display brands in a slider for user selection

## 9. Project Setup Steps

1. **Set Up Project Structure**: Create the necessary directories and files for the project.
2. **Install Dependencies**: Use npm to install required packages, including React and IBM Carbon Design System.
3. **Initialize Git Repository**: Set up version control for the project using Git.
4. **Configure Build Tools**: Set up build tools like Webpack or Create React App for development and production builds.
5. **Set Up Linting and Formatting**: Configure ESLint and Prettier for code quality and consistency.
6. **Create Initial Components**: Start building the initial components and layout for the application.

## 10. Integration of IBM Carbon Design System

1. **Install Carbon Design System**: Use npm to install Carbon Design System packages.
2. **Import Carbon Styles**: Import Carbon CSS files into the project.
3. **Set Up Theme Provider**: Configure the theme provider to manage light and dark themes.
4. **Use Carbon Components**: Replace default HTML elements with Carbon Design System components.
5. **Customize Carbon Tokens**: Override Carbon Design System tokens to match the vsskin branding.
6. **Test Integration**: Ensure that the Carbon Design System components are working correctly and consistently across the application.

## 11. Implementation of AI-Driven Components

1. **Install AI Components**: Use npm to install Carbon for AI components.
2. **Integrate AI Label Component**: Use the AI label component to indicate AI-generated content.
3. **Apply AI Layer Styling**: Use AI-specific styles for components displaying AI-generated content.
4. **Provide Explainability**: Add explanations for AI-driven features, including how recommendations are generated and what data is used.
5. **Test AI Integration**: Ensure that AI-driven components are working correctly and providing a seamless user experience.
