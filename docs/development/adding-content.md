# Adding Content

This guide explains how to add and update different types of content on the 72° AI Labs website.

## Blog Posts

Blog posts are managed as Markdown files with frontmatter metadata.

### Creating a New Blog Post

1. **Create the file** in `src/content/blog/`:

```bash
# File naming convention: use-kebab-case.md
src/content/blog/my-new-post.md
```

2. **Add frontmatter** at the top:

```markdown
---
title: "Your Post Title"
description: "Brief description for SEO and previews"
pubDate: 2025-01-15
author: "Your Name"
category: "Technical Insights"
tags: ["AI", "Implementation", "Case Study"]
featured: false
draft: false
image: "optional-image-path.jpg"
---

Your blog content starts here...
```

3. **Write content** in Markdown:

```markdown
## Section Heading

Regular paragraph text with **bold** and *italic* formatting.

### Subsection

- Bullet point lists
- Work great for key points

```code blocks
// Are supported with syntax highlighting
const example = "JavaScript code";
```

[Links work normally](https://example.com)
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title (appears in `<title>` and `<h1>`) |
| `description` | Yes | SEO description and preview text |
| `pubDate` | Yes | Publication date (YYYY-MM-DD format) |
| `author` | No | Author name (defaults to "Mandar Gite") |
| `category` | Yes | Post category for organization |
| `tags` | No | Array of tags for filtering |
| `featured` | No | Whether to highlight on homepage (default: false) |
| `draft` | No | Hide from production if true (default: false) |
| `image` | No | Featured image path (relative to `/public/`) |

### Blog Categories

Use these established categories:

- **"Technical Insights"** - Deep dives into AI implementation
- **"Case Studies"** - Real project examples and results
- **"Company News"** - Announcements and updates
- **"Industry Analysis"** - Market trends and observations

### Publishing Process

1. Create the Markdown file with proper frontmatter
2. Test locally with `npm run dev`
3. Check the blog listing at `/blog`
4. Verify the individual post loads correctly
5. Commit and push to deploy

## Project Portfolio

Project information is stored in `src/data/projects.json`.

### Adding a New Project

1. **Edit the JSON file**:

```json
{
  "id": "unique-project-id",
  "name": "Project Display Name",
  "shortBlurb": "One-line description for cards",
  "tagline": "Compelling tagline for project page",
  "description": "Detailed description for project page",
  "category": "AI Solutions",
  "featured": false,
  "dataTypes": [
    "Input data type 1",
    "Input data type 2"
  ],
  "mlMethods": [
    "Machine learning approach 1",
    "Machine learning approach 2"
  ],
  "challenges": [
    "Technical challenge 1",
    "Technical challenge 2"
  ],
  "tags": ["Tag1", "Tag2", "Tag3"]
}
```

2. **Create a dedicated project page** (optional):

```astro
---
// src/pages/projects/your-project-id.astro
import Layout from '../../layouts/Layout.astro';
import projects from '../../data/projects.json';

const project = projects.find(p => p.id === 'your-project-id');
---

<Layout title={project.name}>
  <main>
    <h1>{project.name}</h1>
    <p>{project.description}</p>
    <!-- Add detailed project content -->
  </main>
</Layout>
```

### Project Categories

Use these established categories:

- **"AI Solutions"** - General AI implementations
- **"Finance Automation"** - Accounting and financial systems
- **"Operational Intelligence"** - Business process optimization
- **"Content & Marketing Intelligence"** - Content and marketing automation
- **"Document & OCR Systems"** - Document processing solutions
- **"Data Engineering & Integration"** - Data pipeline and integration projects
- **"On-Prem LLM Systems"** - Local language model implementations

## Case Studies

Case studies are managed in `src/data/caseStudies.json`.

### Adding a Case Study

```json
{
  "id": "unique-case-id",
  "title": "Case Study Title",
  "client": "Client Name (or 'Confidential')",
  "industry": "Industry Sector",
  "challenge": "Brief description of the problem",
  "solution": "Brief description of our solution",
  "results": [
    "Quantified result 1 (e.g., '40% reduction in processing time')",
    "Quantified result 2"
  ],
  "technologies": ["Tech1", "Tech2"],
  "featured": false
}
```

## Images and Assets

### Adding Images

1. **Place images** in the `/public/` directory:

```
public/
├── images/
│   ├── blog/
│   │   └── my-post-image.jpg
│   └── projects/
│       └── project-screenshot.png
└── logos/
    └── client-logo.svg
```

2. **Reference in content**:

```markdown
<!-- In blog posts -->
![Alt text](/images/blog/my-post-image.jpg)

<!-- In Astro components -->
<img src="/images/projects/project-screenshot.png" alt="Project screenshot" />
```

### Image Guidelines

- **Format**: Use WebP for photos, SVG for logos/icons, PNG for screenshots
- **Size**: Optimize images (aim for <500KB for photos)
- **Alt text**: Always include descriptive alt text for accessibility
- **Naming**: Use kebab-case filenames (`my-image-name.jpg`)

### Social Media Images

Update Open Graph images in `/public/`:

- `og-default.jpg` - Default social preview
- `og-home.jpg` - Homepage preview
- `og-about.jpg` - About page preview
- `og-blog.jpg` - Blog section preview

## Data Files

### Solutions Data

Update service offerings in `src/data/solutions.json`:

```json
{
  "id": "solution-id",
  "name": "Solution Name",
  "description": "What this solution does",
  "benefits": [
    "Key benefit 1",
    "Key benefit 2"
  ],
  "useCases": [
    "Use case 1",
    "Use case 2"
  ]
}
```

### Contact Form Configuration

The contact form uses Formspree. To update the endpoint:

1. **Edit** `src/components/ContactForm.astro`
2. **Replace** the action URL:

```astro
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## SEO and Metadata

### Page-Level SEO

Each page should include proper metadata:

```astro
---
const title = "Page Title - 72° AI Labs";
const description = "Page description for search engines";
---

<Layout title={title} description={description}>
  <!-- Page content -->
</Layout>
```

### Blog Post SEO

Blog posts automatically generate SEO metadata from frontmatter:

- `title` → Page title and H1
- `description` → Meta description
- `tags` → Keywords
- `pubDate` → Published date for search engines

## Content Guidelines

### Writing Style

- **Clear and practical** - Focus on actionable insights
- **Technical but accessible** - Explain complex concepts simply
- **ROI-focused** - Include concrete benefits and results
- **Indian context** - Reference local business realities

### Brand Voice

Follow the [Brand Kit](../../Brand_Kit.md) guidelines:

- **Professional** but approachable
- **Innovative** and forward-thinking
- **Precise** and detail-oriented
- **Trustworthy** and reliable

### Common Mistakes to Avoid

1. **Missing frontmatter** - Blog posts won't render properly
2. **Incorrect date format** - Use YYYY-MM-DD
3. **Broken image paths** - Ensure images exist in `/public/`
4. **Invalid JSON** - Validate JSON syntax in data files
5. **Missing alt text** - Always include for accessibility
6. **Inconsistent categories** - Use established category names

## Testing Content Changes

### Before Publishing

1. **Local preview**: Test with `npm run dev`
2. **Check all pages**: Verify content appears correctly
3. **Test responsive design**: Check mobile and desktop views
4. **Validate links**: Ensure all links work
5. **Proofread**: Check spelling and grammar

### After Publishing

1. **Live site check**: Verify changes appear on production
2. **SEO validation**: Check page titles and descriptions
3. **Social sharing**: Test how pages appear when shared
4. **Analytics**: Monitor for any tracking issues

---

**Next**: [Deployment Guide](../deployment/github-pages.md)