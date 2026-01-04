# GitHub Pages Deployment

This guide explains how the 72° AI Labs website is automatically deployed to GitHub Pages and how to troubleshoot deployment issues.

## How Deployment Works

The website uses **GitHub Actions** to automatically build and deploy the site whenever changes are pushed to the `main` branch.

### Deployment Flow

1. **Push to main branch** → Triggers GitHub Actions workflow
2. **Build process** → Astro generates static files
3. **Deploy to GitHub Pages** → Files are published to `gh-pages` branch
4. **Live site update** → Changes appear at https://72ai.in

### Automatic Triggers

Deployment happens automatically when:

- Code is pushed to the `main` branch
- Pull requests are merged into `main`
- Manual workflow dispatch (if needed)

## GitHub Actions Workflow

The deployment is configured in `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]  # Triggers on main branch pushes
  workflow_dispatch:    # Allows manual triggering

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        
      - name: Build and upload site
        uses: withastro/action@v2
        with:
          path: .
          node-version: 20
          package-manager: npm
        env:
          PUBLIC_GA4_ID: ${{ vars.PUBLIC_GA4_ID }}
          PUBLIC_CLARITY_ID: ${{ vars.PUBLIC_CLARITY_ID }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

## Environment Variables

The deployment uses GitHub repository variables for analytics:

### Setting Up Variables

1. Go to **Repository Settings** → **Secrets and variables** → **Actions**
2. Click **Variables** tab
3. Add these variables:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `PUBLIC_GA4_ID` | Google Analytics 4 tracking ID | `G-XXXXXXXXXX` |
| `PUBLIC_CLARITY_ID` | Microsoft Clarity project ID | `alphanumeric_string` |

### Why Variables (Not Secrets)

These are **public variables** because:
- They appear in the client-side JavaScript
- They're not sensitive security credentials
- They need to be accessible during the build process

## Domain Configuration

### Custom Domain Setup

The site is configured to use the custom domain `72ai.in`:

1. **CNAME file**: `/public/CNAME` contains `72ai.in`
2. **Astro config**: `astro.config.mjs` sets `site: 'https://72ai.in'`
3. **DNS settings**: Domain DNS points to GitHub Pages

### GitHub Pages Settings

In the repository settings:

1. **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `gh-pages` (automatically created by Actions)
4. **Custom domain**: `72ai.in`
5. **Enforce HTTPS**: Enabled

## Monitoring Deployments

### GitHub Actions Tab

Check deployment status:

1. Go to repository **Actions** tab
2. Look for "Deploy to GitHub Pages" workflows
3. Green checkmark = successful deployment
4. Red X = failed deployment (click for details)

### Deployment Timeline

Typical deployment takes **2-3 minutes**:

- **Build phase**: 1-2 minutes (install dependencies, build site)
- **Deploy phase**: 30-60 seconds (upload to GitHub Pages)
- **DNS propagation**: Usually instant, can take up to 10 minutes

### Live Site Verification

After deployment:

1. Visit https://72ai.in
2. Check that changes appear
3. Verify no broken links or missing assets
4. Test on mobile and desktop

## Troubleshooting Deployment Issues

### Build Failures

**Symptoms**: Red X in Actions tab, site doesn't update

**Common causes**:

1. **Syntax errors** in Astro files
2. **Missing dependencies** in package.json
3. **TypeScript errors**
4. **Invalid frontmatter** in blog posts
5. **Broken imports** or file paths

**How to fix**:

```bash
# Test locally first
npm run build

# Fix any errors shown
# Then commit and push again
```

### Deployment Failures

**Symptoms**: Build succeeds but deploy fails

**Common causes**:

1. **GitHub Pages permissions** not configured
2. **Repository settings** incorrect
3. **Branch protection rules** blocking deployment

**How to fix**:

1. Check repository **Settings** → **Actions** → **General**
2. Ensure "Read and write permissions" is enabled
3. Verify **Pages** settings point to `gh-pages` branch

### Site Not Updating

**Symptoms**: Deployment succeeds but changes don't appear

**Possible causes**:

1. **Browser cache** - Hard refresh (Ctrl+Shift+R)
2. **CDN cache** - Wait 5-10 minutes
3. **DNS issues** - Check domain configuration

**Debugging steps**:

```bash
# Check if files were actually updated
# Look at the gh-pages branch on GitHub
# Compare timestamps with your changes
```

### Analytics Not Working

**Symptoms**: Site loads but analytics don't track

**Common causes**:

1. **Missing environment variables** in GitHub
2. **Incorrect tracking IDs**
3. **Ad blockers** preventing tracking (normal)

**How to fix**:

1. Verify variables in **Settings** → **Secrets and variables** → **Actions**
2. Check browser console for analytics errors
3. Test in incognito mode

## Manual Deployment

If automatic deployment fails, you can trigger manually:

### Via GitHub Interface

1. Go to **Actions** tab
2. Click "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select `main` branch and run

### Via Local Build (Emergency)

```bash
# Build locally
npm run build

# The dist/ folder contains the built site
# You can manually upload these files if needed
```

## Performance Optimization

### Build Optimization

The deployment automatically:

- **Minifies CSS and JavaScript**
- **Optimizes images** (if configured)
- **Generates sitemap** for SEO
- **Creates static HTML** for fast loading

### Monitoring Performance

After deployment:

1. **Lighthouse audit** - Check Core Web Vitals
2. **GTmetrix** - Monitor loading times
3. **Google Analytics** - Track user experience metrics

## Security Considerations

### HTTPS Enforcement

- GitHub Pages automatically provides SSL certificates
- All traffic is redirected to HTTPS
- Certificate renewal is automatic

### Content Security

- Static site = minimal attack surface
- No server-side code execution
- All content is version-controlled

## Backup and Recovery

### Automatic Backups

- **Git history** preserves all changes
- **GitHub Pages** keeps previous deployments
- **Source code** is the source of truth

### Recovery Process

If the site breaks:

1. **Identify the problematic commit** in git history
2. **Revert the changes** or fix the issue
3. **Push the fix** to trigger new deployment
4. **Verify the site** works correctly

## Cost and Limits

### GitHub Pages Limits

- **Bandwidth**: 100GB per month (soft limit)
- **Storage**: 1GB repository size limit
- **Build time**: 10 minutes maximum per build
- **Builds**: 10 builds per hour

### Cost

- **GitHub Pages**: Free for public repositories
- **Domain**: Cost of `72ai.in` domain registration
- **Analytics**: Free (GA4 and Clarity)

**Total monthly cost**: ~₹0 (excluding domain registration)

## Best Practices

### Before Pushing

1. **Test locally** with `npm run build`
2. **Check for errors** in terminal output
3. **Verify responsive design**
4. **Test all navigation links**

### Monitoring

1. **Watch Actions tab** after pushing
2. **Check live site** within 5 minutes
3. **Monitor analytics** for any issues
4. **Set up alerts** for deployment failures (optional)

### Emergency Procedures

If the site goes down:

1. **Check GitHub Status** - https://www.githubstatus.com/
2. **Review recent commits** - identify potential issues
3. **Revert problematic changes** if needed
4. **Contact team** if infrastructure issues persist

---

**Previous**: [Adding Content Guide](../development/adding-content.md) | **Back to**: [Documentation Home](../README.md)