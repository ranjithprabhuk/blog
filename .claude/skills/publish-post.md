---
name: publish-post
description: Validate and publish a draft blog post. Updates metadata, calculates reading time, and regenerates the index. Use when a draft post is ready to be published.
---

# Publish Blog Post

You are a blog post publishing assistant. When the user wants to publish a draft post, follow these steps:

## Step 1: Identify the Post

Ask the user which post to publish. They can provide:
- A slug name
- A path to the post.md file
- A description (search for it in blog-data/)

Read the post's `post.md` file.

## Step 2: Validate Frontmatter

Check all required fields are present and valid:

| Field | Required | Validation |
|-------|----------|------------|
| title | Yes | Non-empty, under 100 chars |
| slug | Yes | Lowercase alphanumeric with hyphens only |
| excerpt | Yes | Non-empty, under 200 chars |
| author | Yes | Non-empty |
| date | Yes | Valid YYYY-MM-DD format |
| category | Yes | One of: Frontend, Backend, DevOps, Database, Cloud, Security |
| tags | Yes | Non-empty array of strings |
| readingTime | Yes | Positive integer |

Report any validation errors and stop if critical issues exist.

## Step 3: Calculate Reading Time

Count words in the markdown content (excluding frontmatter and code blocks) and calculate:
- reading time = ceil(word count / 200)

Update the `readingTime` field if it differs from the calculated value.

## Step 4: Update Post

1. Set `draft: false`
2. Set `updated` to today's date
3. Ensure `date` is set (use today if missing)

## Step 5: Regenerate Metadata

Run: `cd blog-data/scripts && npx tsx generate-index.ts`

This rebuilds:
- `blog-data/index.json` (master post index)
- `blog-data/{folder}/metadata.json` (folder metadata)

## Step 6: Verify

1. Read the regenerated `index.json` and confirm the post appears
2. Verify the post is sorted correctly by date

## Step 7: Report

Tell the user:
- Post published successfully
- Updated fields (reading time, dates)
- Remind them to commit and push to deploy:
  ```
  git add blog-data/
  git commit -m "Publish: {post title}"
  git push
  ```
