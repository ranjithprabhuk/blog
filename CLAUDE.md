# Blog Project

A personal tech blog with two main parts:

## Structure

- **`blog/`** — React + Vite + TypeScript SPA deployed to GitHub Pages
- **`blog-data/`** — Blog content (markdown posts + metadata JSON) fetched at runtime via GitHub raw URLs
- **`.claude/skills/`** — Custom skills for blog content management
- **`.github/workflows/`** — CI/CD for deployment and validation

## Key Commands

### Blog UI (in `blog/`)
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

### Blog Data Scripts (in `blog-data/scripts/`)
```bash
npx tsx generate-index.ts   # Rebuild index.json and folder metadata
npx tsx validate-posts.ts   # Validate all post frontmatter
```

## Custom Skills
- `/create-post` — Create a new blog post with proper structure
- `/publish-post` — Validate and publish a draft post
- `/update-metadata` — Regenerate all metadata files
- `/optimize-seo` — Analyze and improve post SEO

## Blog Data Organization
- Posts organized in folders: `blog-data/blogs001/post001/post.md`
- Each blog folder holds up to 10 posts
- Metadata lives at three levels: global (`metadata.json`), folder (`blogs001/metadata.json`), and post (frontmatter in `post.md`)
- `index.json` is the master post index used for pagination, search, and filtering

## Development Notes
- The blog SPA uses hash routing (`/#/post/slug`)
- Data is fetched at runtime from `raw.githubusercontent.com` — no rebuild needed for new posts
- Tailwind CSS with `class` strategy for dark mode
- `gray-matter` for frontmatter parsing, `marked` for markdown rendering
- `fuse.js` for client-side search
