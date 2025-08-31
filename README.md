
# 72° AI LABS Website

This project is a static website for 72° AI LABS, built using the Astro framework and Tailwind CSS, as per the provided brief. It is designed for optimal performance, SEO, and static deployment on platforms like GitHub Pages.

## Project Structure

- `public/`: Contains static assets like `robots.txt`, `sitemap-index.xml`, and logos. This is where Astro places the final build output.
- `src/components/`: Reusable Astro components for different sections of the website.
- `src/data/`: JSON files for content that can be easily updated without touching the page files.
- `src/layouts/`: Base layout component to maintain a consistent look and feel across all pages.
- `src/pages/`: All of the website's pages. Astro automatically creates a page for each `.astro` file in this directory.
- `src/styles/`: Global CSS file.

## Getting Started

### 1. Installation

First, ensure you have Node.js and npm installed. Then, create a new Astro project and replace the generated files with the ones provided above.

```bash
# Create a new Astro project
npm create astro@latest

# Choose "Just the basics" and follow the prompts.
# After creation, replace the files with the ones provided.
```

### 2. Running Locally

To run the project in development mode with live reloading:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`. The `base` path used for GitHub Pages is applied only during production builds, so local development runs from the root URL.

### 3. Building for Production

To build the static site, ready for deployment:

```bash
npm run build
```

This command will generate the static files in the `dist` directory.

### 4. Deployment to GitHub Pages

The included `.github/workflows/deploy.yml` file automates the deployment process.

1.  **Commit the code:** Push all the project files to the `main` branch of your GitHub repository.
2.  **Go to Settings > Pages:** On your GitHub repository, navigate to the "Settings" tab, then "Pages."
3.  **Choose GitHub Actions:** Under "Source," select "GitHub Actions" to use the provided workflow.

The workflow will automatically build your site and deploy the `dist` folder to the `gh-pages` branch, making it live. Remember to add a `CNAME` file to the `public` directory with `72ai.in` and configure your DNS settings as per GitHub's documentation.

During this build step `NODE_ENV` is set to `production`, which enables the `/ailabs_website` base path required for GitHub Pages in `astro.config.mjs`.

## Customizing Content

-   **Case Studies:** Edit `src/data/caseStudies.json` to update the mini case study snippets.
-   **Page Copy:** Edit the text directly within the `.astro` files in `src/pages/`.
-   **Form Endpoints:** **Important:** Replace the placeholder `https://formspree.io/f/your_unique_id` in `src/components/ContactForm.astro` with your actual Formspree endpoint. Do the same for the newsletter form.

This setup provides a highly performant, SEO-friendly, and maintainable foundation that fully addresses the brief.
