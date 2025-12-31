# Setup Guide

This guide will help you get the 72° AI Labs website running locally on your machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`
- **Git** for version control
  - Download from [git-scm.com](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ailabs_website
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Astro framework
- Tailwind CSS
- Sitemap generation
- TypeScript support

### 3. Environment Setup (Optional)

If you want to test analytics locally, create a `.env` file:

```bash
# Copy the example file
cp .env.example .env
```

Add your analytics IDs (optional for local development):

```env
PUBLIC_GA4_ID=G-XXXXXXXXXX
PUBLIC_CLARITY_ID=your_clarity_project_id
```

> **Note**: Analytics are optional for local development. The site works fine without them.

### 4. Start Development Server

```bash
npm run dev
```

The site will be available at: **http://localhost:4321**

You should see the 72° AI Labs homepage load successfully.

## Available Scripts

The project includes these npm scripts:

```bash
# Start development server with hot reload
npm run dev

# Alternative start command
npm start

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI commands
npm run astro
```

## Verify Installation

After running `npm run dev`, check that:

1. **Homepage loads** at http://localhost:4321
2. **Navigation works** - click through different pages
3. **No console errors** - open browser DevTools > Console
4. **Hot reload works** - make a small text change and see it update

## Common Setup Issues

### Port Already in Use

If port 4321 is busy:

```bash
# Astro will automatically try the next available port
# Or specify a different port:
npm run dev -- --port 3000
```

### Node Version Issues

If you get Node.js version errors:

```bash
# Check your Node version
node --version

# Should be 18.0.0 or higher
# Update Node.js if needed
```

### Permission Errors (Windows)

If you get permission errors on Windows:

```bash
# Run terminal as Administrator, or
# Use PowerShell instead of Command Prompt
```

### npm Install Fails

If `npm install` fails:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

## Production Build Testing

To test a production build locally:

```bash
# Build the site
npm run build

# Preview the built site
npm run preview
```

This creates a `dist/` folder with the static files and serves them locally.

## Next Steps

Once you have the site running locally:

1. **[Understand the project structure](project-structure.md)** - Learn how the code is organized
2. **[Learn the development workflow](../development/local-workflow.md)** - Daily development practices
3. **[Try adding content](../development/adding-content.md)** - Make your first changes

## Getting Help

- **Build errors**: Check the terminal output for specific error messages
- **Page not loading**: Ensure you're using http://localhost:4321 (not https)
- **Analytics issues**: See the [Analytics Setup Guide](../../ANALYTICS_SETUP.md)
- **Styling issues**: Tailwind CSS should work out of the box

---

**Next**: [Project Structure Guide](project-structure.md)