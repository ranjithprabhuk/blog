---
name: create-post
description: Create a new blog post with content, hero image, and updated metadata. Use when the user wants to write a new blog post or article.
---

# Create Blog Post

You are a blog post creation assistant. When the user wants to create a new blog post, follow these steps:

## Step 1: Gather Information

Ask the user for:
- **Topic** (required): What the post should be about
- **Category** (required): One of Frontend, Backend, DevOps, Database, Cloud, Security
- **Tags** (optional): Comma-separated tags relevant to the post
- **Draft** (optional): Whether to create as draft (default: false)

If the user provides a topic directly (e.g., "write a post about WebRTC"), skip asking and proceed.

## Step 2: Determine Post Location

1. Read `blog-data/` to find all `blogs*` folders
2. Find the latest folder (e.g., `blogs001`)
3. Read that folder's `metadata.json` to get the current post count
4. If the folder has 10+ posts, create a new folder (increment number, e.g., `blogs002`)
5. Determine the next post ID (e.g., `post004`) within the target folder
6. Create directory: `blog-data/{folder}/{postId}/assets/`

## Step 3: Write the Post

Create `blog-data/{folder}/{postId}/post.md` with:

### Frontmatter:

```yaml
---
title: "{title}"
slug: "{auto-generated-from-title}"
excerpt: "{compelling 120-160 char description}"
author: "Ranjithprabhu K"
date: {today's date YYYY-MM-DD}
updated: {today's date YYYY-MM-DD}
category: "{category}"
tags: [{tags array}]
featuredImage: "./assets/hero.jpg"
readingTime: {calculated from word count / 200}
draft: {true or false}
seo:
  ogImage: "./assets/hero.jpg"
  canonicalUrl: ""
---
```

### Content:

Write a **complete, production-quality** blog post — not placeholder content. Include:
- An engaging introduction explaining why the topic matters
- Multiple sections with practical code examples
- Real-world patterns and use cases
- A "Key Takeaways" summary section
- A "Further Reading" section with relevant links
- Proper use of code blocks with language tags, tables, lists, and inline code

### Slug Generation Rules
- Lowercase the title
- Replace spaces with hyphens
- Remove special characters except hyphens
- Trim to max 60 characters at a word boundary
- Example: "Building Type-Safe APIs" → "building-type-safe-apis"

## Step 4: Add Hero Image

Download a relevant hero image from Unsplash (free, no attribution required):

```bash
curl -sL "https://images.unsplash.com/photo-{PHOTO_ID}?w=1200&h=630&fit=crop&q=80" \
  -o blog-data/{folder}/{postId}/assets/hero.jpg
```

Search Unsplash for a photo matching the post topic. Verify the image downloaded correctly (file size > 10KB) and visually confirm it's relevant.

## Step 5: Regenerate Metadata

Always run the generation script to keep metadata in sync:

```bash
cd blog-data/scripts && npx tsx generate-index.ts
```

This rebuilds:
- `blog-data/index.json` (master post index)
- `blog-data/{folder}/metadata.json` (folder metadata)

**Do NOT manually edit index.json or folder metadata.json** — always use the script to avoid drift.

## Step 6: Verify

1. Read the regenerated `index.json` and confirm the new post appears
2. Verify the post is sorted correctly by date (newest first)
3. Check the hero image exists and is valid

## Step 7: Commit and Report

Stage and commit all new files:

```bash
git add blog-data/{folder}/{postId}/ blog-data/index.json blog-data/{folder}/metadata.json
git commit -m "feat(blog): add {short post title} post"
```

Tell the user:
- Post created at `blog-data/{folder}/{postId}/post.md`
- Hero image added
- Metadata regenerated and committed
- Remind them to push: `git push origin main`
