# Project Structure

This guide explains how the 72° AI Labs website is organized and where to find different types of files.

## Overview

The project is built with **Astro**, a static site generator that allows us to create fast, SEO-friendly websites. Here's how Astro organizes our code:

```
ailabs_website/
├── public/           # Static assets (images, robots.txt, etc.)
├── src/              # Source code
│   ├── components/   # Reusable UI components
│   ├── content/      # Blog posts and content collections
│   ├── data/         # JSON data files
│   ├── layouts/      # Page layout templates
│   ├── pages/        # Website pages (auto-routed)
│   ├── styles/       # CSS files
│   └── utils/        # Utility functions
├── docs/             # This documentation
├── .github/          # GitHub Actions workflows
└── Configuration files
```

## Key Directories

### `/public/` - Static Assets

Files here are served directly without processing:

```
public/
├── favicon.png       # Site icon
├── og-*.jpg         # Social media preview images
├── robots.txt       # Search engine instructions
└── CNAME           # Custom domain configuration
```

**When to use**: Images, fonts, icons, or any file that doesn't need processing.

### `/src/pages/` - Website Pages

Astro automatically creates routes based on file structure:

```
src/pages/
├── index.astro           # Homepage (/)
├── about.astro          # About page (/about)
├── thanks.astro         # Thank you page (/thanks)
├── blog/
│   ├── index.astro      # Blog listing (/blog)
│   └── [slug].astro     # Individual blog posts (/blog/post-name)
├── projects/
│   ├── index.astro      # Projects listing (/projects)
│   ├── callmind.astro   # Project page (/projects/callmind)
│   └── ...              # Other project pages
└── solutions/
    └── index.astro      # Solutions page (/solutions)
```

**File types**:
- `.astro` files become web pages
- File name = URL path
- `[slug].astro` = dynamic routes

### `/src/components/` - Reusable Components

UI components used across multiple pages:

```
src/components/
├── Nav.astro           # Navigation header
├── ContactForm.astro   # Contact form with Formspree
├── ProjectCard.astro   # Project preview cards
├── ProjectTable.astro  # Projects table layout
├── CaseCard.astro      # Case study cards
├── HowItWorks.astro    # Process explanation section
└── IllustrationBars.astro # Visual elements
```

**Usage**: Import and use in pages like `<Nav />` or `<ContactForm />`

### `/src/layouts/` - Page Templates

Base templates that wrap page content:

```
src/layouts/
└── Layout.astro        # Main layout (header, footer, meta tags)
```

**Usage**: Wrap page content to ensure consistent structure and styling.

### `/src/content/` - Content Collections

Structured content managed by Astro's content system:

```
src/content/
├── config.ts           # Content schema definitions
└── blog/
    ├── welcome-to-72ai-blog.md
    └── blog1_martech_technical.md
```

**Features**:
- Type-safe frontmatter (title, date, author, etc.)
- Automatic slug generation
- Built-in validation

### `/src/data/` - JSON Data Files

Structured data for dynamic content:

```
src/data/
├── projects.json       # Project portfolio data
├── caseStudies.json   # Case study information
└── solutions.json     # Service offerings
```

**Usage**: Import in components to render dynamic lists and cards.

### `/src/styles/` - CSS Files

Styling for the website:

```
src/styles/
├── global.css         # Global styles and Tailwind imports
└── home.css          # Homepage-specific styles
```

**Note**: Most styling uses Tailwind CSS classes directly in components.

### `/src/utils/` - Utility Functions

Helper functions and utilities:

```
src/utils/
└── analytics.ts       # Google Analytics and Clarity tracking
```

## Configuration Files

### `astro.config.mjs`

Main Astro configuration:

```javascript
export default defineConfig({
  site: 'https://72ai.in',           # Canonical URL
  integrations: [tailwind(), sitemap()], # Plugins
  // ... other settings
});
```

### `package.json`

Project dependencies and scripts:

```json
{
  "scripts": {
    "dev": "astro dev",      # Development server
    "build": "astro build",  # Production build
    "preview": "astro preview" # Preview build
  }
}
```

### `tailwind.config.mjs`

Tailwind CSS configuration (extends default settings).

### `tsconfig.json`

TypeScript configuration for better development experience.

## How Astro Works

### 1. File-Based Routing

- `src/pages/about.astro` → `/about`
- `src/pages/projects/index.astro` → `/projects`
- `src/pages/blog/[slug].astro` → `/blog/any-post-name`

### 2. Component System

```astro
---
// Component script (runs at build time)
import Nav from '../components/Nav.astro';
const title = "Page Title";
---

<!-- Component template (HTML + components) -->
<html>
  <head><title>{title}</title></head>
  <body>
    <Nav />
    <main>Content here</main>
  </body>
</html>
```

### 3. Content Collections

Blog posts are managed as Markdown files with frontmatter:

```markdown
---
title: "Post Title"
pubDate: 2025-01-01
author: "Author Name"
---

Post content in Markdown...
```

### 4. Data Integration

JSON files provide structured data:

```javascript
// In a component
import projects from '../data/projects.json';

// Render project cards
{projects.map(project => <ProjectCard {...project} />)}
```

## Development Workflow

1. **Pages**: Add new `.astro` files in `/src/pages/`
2. **Components**: Create reusable UI in `/src/components/`
3. **Content**: Add blog posts to `/src/content/blog/`
4. **Data**: Update JSON files in `/src/data/`
5. **Styling**: Use Tailwind classes or add CSS to `/src/styles/`

## Build Process

When you run `npm run build`:

1. Astro processes all `.astro` files
2. Generates static HTML pages
3. Optimizes CSS and JavaScript
4. Creates a `dist/` folder with deployable files

---

**Next**: [Local Development Workflow](../development/local-workflow.md)