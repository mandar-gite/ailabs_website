# Local Development Workflow

This guide covers the day-to-day development workflow for the 72° AI Labs website.

## Daily Development Process

### 1. Start Development Server

```bash
# Navigate to project directory
cd ailabs_website

# Start the development server
npm run dev
```

The site will be available at **http://localhost:4321** with hot reload enabled.

### 2. Making Changes

The development server automatically reloads when you save files:

- **Pages**: Edit `.astro` files in `src/pages/`
- **Components**: Modify files in `src/components/`
- **Styles**: Update CSS in `src/styles/` or Tailwind classes
- **Content**: Add/edit blog posts in `src/content/blog/`
- **Data**: Update JSON files in `src/data/`

### 3. Preview Changes

- Save your file
- Browser automatically refreshes
- Check the console for any errors

## Common Development Tasks

### Adding a New Page

1. Create a new `.astro` file in `src/pages/`:

```astro
---
// src/pages/new-page.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="New Page">
  <main>
    <h1>New Page Content</h1>
  </main>
</Layout>
```

2. The page is automatically available at `/new-page`

### Updating Navigation

Edit `src/components/Nav.astro` to add new menu items:

```astro
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/projects">Projects</a>
  <a href="/new-page">New Page</a> <!-- Add this -->
</nav>
```

### Modifying Styles

**Option 1: Tailwind Classes (Recommended)**

```astro
<div class="bg-blue-500 text-white p-4 rounded-lg">
  Content with Tailwind styling
</div>
```

**Option 2: Custom CSS**

Add to `src/styles/global.css`:

```css
.custom-button {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}
```

### Working with Data

Update project information in `src/data/projects.json`:

```json
{
  "id": "new-project",
  "name": "New Project",
  "shortBlurb": "Brief description",
  "category": "AI Solutions",
  "tags": ["AI", "Automation"]
}
```

The changes appear automatically on pages that use this data.

## Testing Your Changes

### 1. Local Development Testing

- **Visual check**: Browse through all pages
- **Responsive design**: Test on different screen sizes
- **Console errors**: Check browser DevTools > Console
- **Network requests**: Verify all resources load correctly

### 2. Production Build Testing

Before pushing changes, test the production build:

```bash
# Build the site
npm run build

# Preview the built site
npm run preview
```

This catches build-time errors and shows how the site performs in production.

### 3. Cross-Browser Testing

Test in multiple browsers:
- Chrome/Edge (Chromium-based)
- Firefox
- Safari (if on Mac)

## Code Quality

### TypeScript Support

The project includes TypeScript for better development experience:

- `.astro` files support TypeScript in the frontmatter
- Type checking happens automatically
- VS Code provides IntelliSense and error highlighting

### Formatting

The project uses standard formatting:

- Use consistent indentation (2 spaces)
- Follow Astro component conventions
- Keep components focused and reusable

## Debugging Common Issues

### Page Not Loading

1. Check the file path matches the URL
2. Ensure the file has proper Astro frontmatter (`---`)
3. Look for syntax errors in the terminal

### Styles Not Applying

1. Verify Tailwind class names are correct
2. Check if custom CSS is imported properly
3. Clear browser cache and hard refresh

### Component Errors

1. Check import paths are correct
2. Ensure components are properly exported
3. Verify prop names and types match

### Build Failures

1. Run `npm run build` to see specific errors
2. Check for TypeScript errors
3. Verify all imports resolve correctly

## Performance Monitoring

### Development Performance

- Use browser DevTools > Lighthouse for performance audits
- Check Network tab for slow-loading resources
- Monitor bundle size with build output

### Analytics (Optional)

If analytics are configured:

- Test event tracking in browser console
- Verify GA4 events in Real-time reports
- Check Clarity recordings for user experience

## Git Workflow

### Before Committing

1. Test changes locally (`npm run dev`)
2. Run production build (`npm run build`)
3. Check for console errors
4. Verify responsive design

### Commit Process

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "Add new project page for AI automation"

# Push to repository
git push origin main
```

### After Pushing

1. GitHub Actions will automatically build and deploy
2. Check the Actions tab for build status
3. Verify changes on the live site (usually takes 2-3 minutes)

## Useful Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check Astro version
npm run astro --version

# Get help with Astro commands
npm run astro --help
```

## VS Code Extensions (Recommended)

For the best development experience:

- **Astro** - Official Astro language support
- **Tailwind CSS IntelliSense** - Tailwind class autocomplete
- **TypeScript Importer** - Auto-import TypeScript modules
- **Prettier** - Code formatting

## Troubleshooting

### Port Issues

If port 4321 is busy:

```bash
# Astro will automatically find the next available port
# Or specify a custom port:
npm run dev -- --port 3000
```

### Cache Issues

If changes aren't appearing:

```bash
# Hard refresh in browser (Ctrl+Shift+R or Cmd+Shift+R)
# Or restart the dev server:
# Ctrl+C to stop, then npm run dev again
```

### Memory Issues

For large projects or slow machines:

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

---

**Next**: [Adding Content Guide](adding-content.md)