# UI Design Specifications

## Overview

The AI-Powered Resume Builder features a modern, intuitive interface designed for optimal user experience across all devices. The design prioritizes functionality while maintaining aesthetic appeal, with a focus on the dashboard-centric approach shown in the reference design.

## Design Philosophy

### Core Principles
- **User-Centric**: Every design decision prioritizes user workflow efficiency
- **AI-Transparent**: Clear indication of AI involvement and capabilities
- **Progressive Disclosure**: Information revealed as needed to avoid overwhelming users
- **Accessibility First**: WCAG 2.1 AA compliance for inclusive design
- **Performance Optimized**: Fast loading and responsive interactions

### Visual Hierarchy
- **Primary Actions**: Prominent placement and distinctive styling
- **Secondary Actions**: Accessible but not competing with primary flows
- **Information Architecture**: Logical grouping and clear navigation paths
- **Content Priority**: Most important information gets visual precedence

## Dashboard Design

### Reference Implementation
Based on the provided reference image, the dashboard follows a modular automation suite approach:

![Dashboard Reference](https://github.com/user-attachments/assets/540430e5-b107-466c-94dc-cab40eb16a99)

### Layout Structure

#### Header Section
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🤖 AI Resume Builder    Dashboard                    🟢 All systems operational │
│     AI-powered automation at your fingertips                                 🔔📊│
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Components:**
- **Brand Identity**: Logo and tagline
- **Page Title**: Current section indicator
- **System Status**: Real-time health indicator
- **User Actions**: Notifications and profile access

#### Sidebar Navigation
```
┌─────────────────┐
│ 📊 Dashboard    │
│ 🔍 Job Analysis │
│ 📝 Resume Build │
│ 🎯 Optimization │
│ 📈 Analytics    │
│ ⚙️  Settings    │
│ 📚 Help Center  │
│ 🚀 Deployment  │
└─────────────────┘
```

**Navigation Categories:**
- **Core Functions**: Primary resume building features
- **Analytics**: Performance tracking and insights
- **Management**: Settings and configuration
- **Support**: Help and documentation

#### Main Content Area

**Welcome Section:**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Welcome to AI Resume Builder                                                    │
│ Streamline your entire job application lifecycle with AI-powered tools         │
│                                                                                 │
│ [+ New Resume Project] [📁 Manage Projects] [🤖 AI Assistant] [⚙️ Configure]   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Statistics Cards:**
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Active Projects │ │   Workflows     │ │ Tasks Completed │ │   Efficiency    │
│       9         │ │       1         │ │       0         │ │      94%        │
│ All operational │ │ +3 from last wk │ │ +12% last month │ │ +2% from last wk│
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Color Scheme & Theme

#### Dark Theme (Primary)
```css
:root {
  /* Background Colors */
  --bg-primary: #0d1117;      /* Main background */
  --bg-secondary: #161b22;    /* Card backgrounds */
  --bg-tertiary: #21262d;     /* Elevated surfaces */
  
  /* Text Colors */
  --text-primary: #f0f6fc;    /* Primary text */
  --text-secondary: #8b949e;  /* Secondary text */
  --text-muted: #6e7681;      /* Muted text */
  
  /* Accent Colors */
  --accent-primary: #2f81f7;  /* Primary actions */
  --accent-success: #3fb950;  /* Success states */
  --accent-warning: #d29922;  /* Warning states */
  --accent-error: #f85149;    /* Error states */
  
  /* Border Colors */
  --border-default: #30363d;  /* Default borders */
  --border-muted: #21262d;    /* Subtle borders */
  --border-emphasis: #f0f6fc; /* High contrast borders */
}
```

#### Light Theme (Alternative)
```css
:root[data-theme="light"] {
  /* Background Colors */
  --bg-primary: #ffffff;      /* Main background */
  --bg-secondary: #f6f8fa;    /* Card backgrounds */
  --bg-tertiary: #eaeef2;     /* Elevated surfaces */
  
  /* Text Colors */
  --text-primary: #24292f;    /* Primary text */
  --text-secondary: #656d76;  /* Secondary text */
  --text-muted: #8c959f;      /* Muted text */
  
  /* Accent Colors */
  --accent-primary: #0969da;  /* Primary actions */
  --accent-success: #1a7f37;  /* Success states */
  --accent-warning: #9a6700;  /* Warning states */
  --accent-error: #cf222e;    /* Error states */
}
```

### Typography System

#### Font Hierarchy
```css
/* Primary Font Stack */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-mono: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', monospace;

/* Font Sizes */
--font-size-xs: 0.75rem;    /* 12px - Small labels */
--font-size-sm: 0.875rem;   /* 14px - Body text */
--font-size-base: 1rem;     /* 16px - Default */
--font-size-lg: 1.125rem;   /* 18px - Subheadings */
--font-size-xl: 1.25rem;    /* 20px - Headings */
--font-size-2xl: 1.5rem;    /* 24px - Page titles */
--font-size-3xl: 1.875rem;  /* 30px - Hero text */

/* Font Weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### Text Styles
```css
.text-hero {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.text-heading {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
}

.text-body {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

.text-caption {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--text-secondary);
}
```

## Component Library

### Automation Modules

#### Module Card Structure
```html
<div class="automation-module">
  <div class="module-header">
    <div class="module-icon">🔍</div>
    <div class="module-info">
      <h3 class="module-title">Job Analysis</h3>
      <p class="module-description">Smart research and job matching</p>
    </div>
    <div class="module-status">
      <span class="status-indicator active">● Active</span>
      <span class="tool-count">2/2 tools</span>
    </div>
  </div>
  
  <div class="module-content">
    <div class="ai-tools">
      <span class="ai-tag">OpenAI GPT-4</span>
      <span class="ai-tag">Perplexity AI</span>
    </div>
  </div>
</div>
```

#### Module Categories
1. **Research Module**
   - **Icon**: 🔍 (Search/Analysis)
   - **AI Tools**: OpenAI GPT-3.5, Perplexity AI
   - **Function**: Smart research and summarization
   - **Status**: Active with 2/2 tools available

2. **Project Planning Module**
   - **Icon**: 📋 (Planning/Organization)
   - **AI Tools**: Notion AI, Taskade AI
   - **Function**: Task and roadmap generation
   - **Status**: Active with 2/2 tools available

3. **Content Creation Module**
   - **Icon**: 💻 (Content/Writing)
   - **AI Tools**: GitHub Copilot
   - **Function**: Code generation and suggestions
   - **Status**: Active with 1/1 tools available

4. **Quality Assurance Module**
   - **Icon**: ✅ (Testing/Validation)
   - **AI Tools**: Auto-generate tests and debug code
   - **Function**: Automated testing and validation
   - **Status**: Active with 2/2 tools available

5. **Design Module**
   - **Icon**: 🎨 (Design/Visual)
   - **AI Tools**: Generate UI/UX prototypes from prompts
   - **Function**: Visual design and prototyping
   - **Status**: Active with 2/2 tools available

6. **Documentation Module**
   - **Icon**: 📄 (Documentation/Reports)
   - **AI Tools**: Docs, slides, technical write-ups
   - **Function**: Automated documentation generation
   - **Status**: Active - Made with Blink

### Interactive Elements

#### Buttons
```css
.btn-primary {
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: color-mix(in srgb, var(--accent-primary) 85%, black);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(47, 129, 247, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: var(--font-weight-medium);
}
```

#### Form Elements
```css
.form-input {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  padding: 12px 16px;
  color: var(--text-primary);
  font-size: var(--font-size-base);
  width: 100%;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(47, 129, 247, 0.1);
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}
```

#### Status Indicators
```css
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.status-indicator.active {
  color: var(--accent-success);
}

.status-indicator.inactive {
  color: var(--text-muted);
}

.status-indicator.warning {
  color: var(--accent-warning);
}
```

## Responsive Design

### Breakpoint System
```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;   /* Small tablets */
  --breakpoint-md: 768px;   /* Large tablets */
  --breakpoint-lg: 1024px;  /* Laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
  --breakpoint-2xl: 1536px; /* Large screens */
}
```

### Layout Adaptations

#### Mobile Layout (< 768px)
```css
@media (max-width: 767px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-areas: 
      "header"
      "main"
      "nav";
  }
  
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    flex-direction: row;
    overflow-x: auto;
  }
  
  .module-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
```

#### Tablet Layout (768px - 1023px)
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .dashboard {
    grid-template-columns: 200px 1fr;
  }
  
  .module-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .sidebar {
    width: 200px;
  }
}
```

#### Desktop Layout (≥ 1024px)
```css
@media (min-width: 1024px) {
  .dashboard {
    grid-template-columns: 240px 1fr;
  }
  
  .module-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  .sidebar {
    width: 240px;
  }
}
```

## User Experience Patterns

### Progressive Web App Features

#### Installation Prompt
```javascript
// PWA installation handling
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});

const showInstallPromotion = () => {
  const installBanner = document.querySelector('.install-banner');
  installBanner.style.display = 'block';
};
```

#### Offline Functionality
```javascript
// Service worker for offline capability
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered: ', registration);
    })
    .catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
}
```

### Loading States

#### Skeleton Screens
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### Progress Indicators
```css
.progress-ring {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-default);
  border-top: 3px solid var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### Animation System

#### Micro-interactions
```css
/* Hover animations */
.interactive-element {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Page transitions */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-out;
}
```

### Accessibility Features

#### Screen Reader Support
```html
<!-- ARIA labels and descriptions -->
<button 
  aria-label="Create new resume project"
  aria-describedby="new-project-help"
>
  + New Project
</button>

<div id="new-project-help" class="sr-only">
  Start a new AI-powered resume optimization project
</div>
```

#### Keyboard Navigation
```css
/* Focus indicators */
.focusable:focus {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

#### Color Contrast
```css
/* Ensure WCAG AA compliance */
.text-primary { color: var(--text-primary); } /* 4.5:1 contrast ratio */
.text-secondary { color: var(--text-secondary); } /* 4.5:1 contrast ratio */
.btn-primary { background: var(--accent-primary); } /* 3:1 contrast ratio */
```

## Implementation Guidelines

### Component Structure
```
src/components/
├── dashboard/
│   ├── Dashboard.tsx
│   ├── Sidebar.tsx
│   ├── ModuleCard.tsx
│   └── StatisticsCard.tsx
├── resume/
│   ├── ResumeEditor.tsx
│   ├── ResumePreview.tsx
│   └── ExportOptions.tsx
├── ai/
│   ├── AIAssistant.tsx
│   ├── ProcessingStatus.tsx
│   └── AIInsights.tsx
└── common/
    ├── Button.tsx
    ├── Input.tsx
    ├── Modal.tsx
    └── LoadingSpinner.tsx
```

### Styling Architecture
```
src/styles/
├── foundations/
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   └── animations.css
├── components/
│   ├── button.css
│   ├── form.css
│   ├── card.css
│   └── navigation.css
├── layouts/
│   ├── dashboard.css
│   ├── grid.css
│   └── responsive.css
└── themes/
    ├── dark.css
    ├── light.css
    └── high-contrast.css
```

### Performance Optimization
- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Route-based bundle splitting
- **Image Optimization**: WebP format with fallbacks
- **Font Loading**: Font-display: swap for better performance
- **CSS Purging**: Remove unused styles in production

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Polyfills**: Core functionality for IE11 (if required)
- **Feature Detection**: Use feature queries for advanced CSS