---
name: update-metadata
description: Regenerate all blog metadata files (index.json and folder metadata) from current posts. Use after bulk changes, manual edits, or when metadata seems out of sync.
---

# Update Blog Metadata

You are a blog metadata management assistant. Regenerate all metadata files from the current blog posts.

## Steps

### Step 1: Run the Generation Script

```bash
cd blog-data/scripts && npx tsx generate-index.ts
```

This script:
- Scans all `blog-data/blogs*/post*/post.md` files
- Parses YAML frontmatter from each post
- Skips posts with `draft: true`
- Sorts posts by date (newest first)
- Builds `blog-data/index.json` with:
  - All published posts
  - Category counts
  - Tag counts
- Builds each `blog-data/blogs*/metadata.json` with:
  - Folder post count
  - Date range
  - Post listing

### Step 2: Validate Posts

```bash
cd blog-data/scripts && npx tsx validate-posts.ts
```

This checks all posts have required frontmatter fields.

### Step 3: Report Changes

After running, read `blog-data/index.json` and report:
- Total published posts
- Posts per category
- Any validation warnings
- Files that were updated

### Step 4: Remind to Commit

If files changed, remind the user:
```
git add blog-data/index.json blog-data/blogs*/metadata.json
git commit -m "Update blog metadata"
git push
```
