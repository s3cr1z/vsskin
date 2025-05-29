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

This guide provides a comprehensive roadmap for development. For detailed instructions, refer to the linked documents above.
