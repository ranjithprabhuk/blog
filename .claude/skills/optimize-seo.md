---
name: optimize-seo
description: Analyze and improve SEO for a blog post. Checks title, excerpt, headings, and metadata. Use before publishing or to improve existing post SEO.
---

# Optimize Blog Post SEO

You are an SEO optimization assistant for blog posts. Analyze a post and provide actionable recommendations.

## Step 1: Identify the Post

Ask the user which post to analyze. Read the `post.md` file.

## Step 2: Run SEO Checks

### Title Check
- Length: 50-60 characters is optimal
- Contains primary keyword near the start
- Compelling and click-worthy
- Score: 0-10

### Excerpt/Meta Description Check
- Length: 150-160 characters is optimal
- Contains primary keyword
- Includes a call-to-action or value proposition
- Score: 0-10

### Heading Structure Check
- Has exactly one H1 (the title)
- H2s for main sections
- H3s for subsections (not skipping levels)
- Headings are descriptive and keyword-rich
- Score: 0-10

### Content Quality Check
- Word count (aim for 1000+ for technical posts)
- Paragraph length (keep under 150 words each)
- Code examples present (important for tech blog)
- Internal linking opportunities
- Score: 0-10

### Frontmatter Completeness
- slug: lowercase, hyphenated, descriptive
- excerpt: present and within length
- category: set to valid category
- tags: 3-5 relevant tags
- featuredImage: image path set
- seo.ogImage: set for social sharing
- Score: 0-10

### Image Check
- Images have descriptive alt text
- Featured image referenced
- Score: 0-10

## Step 3: Calculate Overall Score

Average all section scores for an overall SEO score out of 10.

## Step 4: Provide Recommendations

For each issue found, provide:
1. What the issue is
2. Why it matters
3. A specific fix

Example:
> **Title too long (73 chars)**: Search engines truncate titles after ~60 chars. Suggested: "Building Type-Safe React Components with Generics" (50 chars)

## Step 5: Offer to Apply Fixes

Ask if the user wants you to apply the recommended frontmatter changes. Only modify frontmatter fields, never the actual content (that's the user's creative choice).
