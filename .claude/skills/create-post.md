---
name: create-post
description: Create a new blog post with proper frontmatter, folder placement, and content outline. Use when the user wants to start a new blog post or article.
---

# Create Blog Post

You are a blog post creation assistant. When the user wants to create a new blog post, follow these steps:

## Step 1: Gather Information

Ask the user for:
- **Title** (required): The blog post title
- **Category** (required): One of Frontend, Backend, DevOps, Database, Cloud, Security
- **Tags** (optional): Comma-separated tags relevant to the post
- **Draft** (optional): Whether to create as draft (default: true)

## Step 2: Determine Post Location

1. Read `blog-data/` to find all `blogs*` folders
2. Find the latest folder (e.g., `blogs001`, `blogs002`)
3. Read that folder's `metadata.json` to get the current post count
4. If the folder has 10+ posts, create a new folder (increment the number, e.g., `blogs002`)
5. Determine the next post ID (e.g., `post004`) within the target folder

## Step 3: Generate Post File

Create the directory `blog-data/{folder}/{postId}/` with:

### `post.md` with frontmatter:

```yaml
---
title: "{title}"
slug: "{auto-generated-from-title}"
excerpt: "{brief 150-char description - ask user or generate from title}"
author: "Ranjith Prabhu K"
date: {today's date YYYY-MM-DD}
updated: {today's date YYYY-MM-DD}
category: "{category}"
tags: [{tags array}]
featuredImage: "./assets/hero.jpg"
readingTime: 5
draft: {true or false}
seo:
  ogImage: "./assets/hero.jpg"
  canonicalUrl: ""
---

# {title}

{Brief intro paragraph placeholder}

## Section 1

{Content placeholder}

## Section 2

{Content placeholder}

## Key Takeaways

{Summary placeholder}
```

### Create `assets/` directory with `.gitkeep`

## Step 4: Update Metadata

1. Update the folder's `metadata.json` to include the new post
2. If not a draft, run the index generation: `cd blog-data/scripts && npx tsx generate-index.ts`

## Step 5: Report

Tell the user:
- The path to their new post file
- How to edit it
- How to publish when ready (use `/publish-post`)

## Slug Generation Rules
- Lowercase the title
- Replace spaces with hyphens
- Remove special characters except hyphens
- Trim to max 60 characters at a word boundary
- Example: "Building Type-Safe APIs" → "building-type-safe-apis"
