# Rangit's Blog

A personal tech blog built with React + Vite + TypeScript, deployed on GitHub Pages.

## Architecture

```
blog/          React SPA (UI) - deployed to GitHub Pages
blog-data/     Blog content (markdown + metadata JSON) - fetched at runtime
```

The UI fetches blog data at runtime from GitHub raw URLs. No rebuild is needed when adding new posts — just push content to `blog-data/`.

## Getting Started

### Development

```bash
cd blog
npm install
npm run dev
```

### Adding a New Post

Use the `/create-post` Claude Code skill, or manually:

1. Create a folder in `blog-data/blogs001/postXXX/`
2. Add `post.md` with YAML frontmatter
3. Add images to `assets/`
4. Run `cd blog-data/scripts && npx tsx generate-index.ts`
5. Commit and push

### Publishing

Push to `main` branch. GitHub Actions builds the UI and deploys to Pages automatically.

## Features

- Markdown blog posts with syntax-highlighted code blocks
- Dark/light mode with system preference detection
- Full-text search across posts
- Category and tag filtering
- Pagination
- Responsive mobile-first design
- SEO meta tags and structured data
- Table of contents for long posts
- Previous/next post navigation

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Markdown**: marked + gray-matter
- **Search**: Fuse.js
- **Routing**: React Router (hash)
- **Deploy**: GitHub Pages + GitHub Actions
