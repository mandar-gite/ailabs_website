# Open Graph Images Guide

## What Are Open Graph Images?

Open Graph (OG) images are preview images that appear when your website is shared on social media platforms like Facebook, LinkedIn, Twitter, WhatsApp, Slack, and more.

## User Benefits

When someone shares your website:
- ✅ **2-3x Higher Engagement** - Posts with images get significantly more clicks
- ✅ **Professional Appearance** - Shows attention to detail and brand polish
- ✅ **Brand Recognition** - Your logo and branding appear in every share
- ✅ **Better Context** - Helps people understand what they're clicking before they click
- ✅ **Platform Support** - Works across all major social platforms

## Technical Specifications

### Recommended Dimensions
- **Size**: 1200 × 630 pixels (aspect ratio 1.91:1)
- **Format**: PNG or JPG
- **File Size**: Under 8MB (ideally under 1MB)
- **Safe Zone**: Keep important content within 1200 × 600 pixels (avoid edges)

### Required Images

Create these OG images for your site:

1. **Default OG Image** (`/public/og-default.jpg`)
   - Used when no specific OG image is set
   - Should include: 72° AI LABS logo + tagline
   - Generic but professional

2. **Homepage** (`/public/og-home.jpg`)
   - "Practical AI Built for Real Business Systems"
   - Highlight key value propositions

3. **About Page** (`/public/og-about.jpg`)
   - "Frugal AI Built for SMEs"
   - Include founder info or team visual

4. **Blog Posts** (`/public/og-blog.jpg`)
   - Generic blog template with 72° branding
   - Can be customized per-post later

5. **Projects/Solutions** (`/public/og-projects.jpg`)
   - Showcase project categories
   - "Real AI Solutions for Real Business Problems"

## Design Elements to Include

### Must Have:
- **72° AI LABS logo** (prominent but not dominating)
- **Page title or key message** (large, readable font)
- **Brand colors** (Blue #0C1A3F, Gold #DDA744, Cream #F2E9D8)

### Should Have:
- **Tagline or description** (supports the main message)
- **Visual element** (icon, pattern, or abstract graphic)
- **Professional typography** (Montserrat or similar)

### Nice to Have:
- **Subtle background pattern** (data flow, geometric)
- **Call to action** (implicit, not explicit)

## Design Tools

### Free Options:
1. **Canva** (easiest)
   - Template: "Facebook Post" (1200×630)
   - Upload your logo
   - Add text and design elements

2. **Figma** (more control)
   - Create 1200×630 artboard
   - Design freely
   - Export as PNG/JPG

3. **GIMP/Photoshop** (professional)
   - Full design control
   - Requires design skills

### Quick Templates:
- Use your existing logo
- Add page title in large text
- Simple gradient background
- Keep it clean and minimal

## Implementation

Once you create the images:

1. Save images to `/public/` folder:
   ```
   /public/og-default.jpg
   /public/og-home.jpg
   /public/og-about.jpg
   /public/og-blog.jpg
   /public/og-projects.jpg
   ```

2. Update page files to use specific OG images:

   **Homepage** (`src/pages/index.astro`):
   ```astro
   <Layout
     title="..."
     description="..."
     ogImage="/og-home.jpg"
   />
   ```

   **About** (`src/pages/about.astro`):
   ```astro
   <Layout
     title="..."
     description="..."
     ogImage="/og-about.jpg"
   />
   ```

3. Update default in `src/layouts/Layout.astro`:
   ```typescript
   const ogImageURL = ogImage || new URL('/og-default.jpg', Astro.site).href;
   ```

## Testing Your OG Images

### Before Publishing:
1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/
3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
4. **Open Graph Check**: https://www.opengraph.xyz/

### How to Test:
1. Build and deploy your site
2. Enter your URL in the debugger
3. Click "Scrape" or "Fetch new information"
4. Verify image appears correctly
5. Check all metadata is correct

## Priority Order

1. **High Priority** (do first):
   - Default OG image
   - Homepage OG image

2. **Medium Priority** (do soon):
   - About page OG image
   - Blog default OG image

3. **Low Priority** (can wait):
   - Individual project OG images
   - Individual blog post OG images

## Current Status

✅ **OG Meta Tags**: Already implemented in Layout.astro
✅ **Infrastructure**: Ready to accept custom OG images
⏳ **Images Needed**: Create actual OG image files

## Quick Start Template

Minimal design to get started:
1. 1200×630 canvas with #0C1A3F (brand blue) background
2. 72° AI LABS logo in top-left (200px wide)
3. Page title in center (white, bold, 72px Montserrat)
4. Tagline below (white, 36px Montserrat)
5. Gold accent line (#DDA744) at bottom

This gives you professional-looking OG images in ~10 minutes per image.

## Resources

- Canva Templates: https://www.canva.com/templates/
- OG Image Examples: https://www.opengraph.xyz/gallery/
- Design Inspiration: Search "open graph image design" on Pinterest/Dribbble
