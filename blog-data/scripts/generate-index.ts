import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DATA_DIR = path.resolve(import.meta.dirname, "..");
const WORDS_PER_MINUTE = 200;

interface PostFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  updated: string;
  category: string;
  tags: string[];
  featuredImage: string;
  readingTime: number;
  draft: boolean;
  seo?: {
    ogImage?: string;
    canonicalUrl?: string;
  };
}

interface IndexPost {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  updated: string;
  category: string;
  tags: string[];
  readingTime: number;
  folder: string;
  postId: string;
  featuredImage: string;
}

interface FolderMetadata {
  folder: string;
  postCount: number;
  dateRange: { earliest: string; latest: string };
  posts: Array<{
    id: string;
    slug: string;
    title: string;
    date: string;
    status: string;
  }>;
}

function calculateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function scanPosts(): IndexPost[] {
  const posts: IndexPost[] = [];
  const entries = fs.readdirSync(BLOG_DATA_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || !entry.name.startsWith("blogs")) continue;

    const folderName = entry.name;
    const folderPath = path.join(BLOG_DATA_DIR, folderName);
    const postEntries = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const postEntry of postEntries) {
      if (!postEntry.isDirectory() || !postEntry.name.startsWith("post"))
        continue;

      const postId = postEntry.name;
      const postMdPath = path.join(folderPath, postId, "post.md");

      if (!fs.existsSync(postMdPath)) {
        console.warn(`Warning: No post.md found at ${postMdPath}`);
        continue;
      }

      const raw = fs.readFileSync(postMdPath, "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = data as PostFrontmatter;

      if (frontmatter.draft) {
        console.log(`Skipping draft: ${frontmatter.title}`);
        continue;
      }

      const readingTime =
        frontmatter.readingTime || calculateReadingTime(content);

      const featuredImage = frontmatter.featuredImage
        ? `${folderName}/${postId}/assets/${path.basename(frontmatter.featuredImage)}`
        : "";

      posts.push({
        slug: frontmatter.slug,
        title: frontmatter.title,
        excerpt: frontmatter.excerpt,
        author: frontmatter.author,
        date:
          typeof frontmatter.date === "object"
            ? (frontmatter.date as Date).toISOString().split("T")[0]
            : String(frontmatter.date),
        updated:
          typeof frontmatter.updated === "object"
            ? (frontmatter.updated as Date).toISOString().split("T")[0]
            : String(frontmatter.updated),
        category: frontmatter.category,
        tags: frontmatter.tags || [],
        readingTime,
        folder: folderName,
        postId,
        featuredImage,
      });
    }
  }

  // Sort by date descending (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

function buildCategoryAndTagCounts(posts: IndexPost[]) {
  const categories: Record<string, number> = {};
  const tags: Record<string, number> = {};

  // Initialize with predefined categories
  const metadataPath = path.join(BLOG_DATA_DIR, "metadata.json");
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    for (const cat of metadata.categories || []) {
      categories[cat] = 0;
    }
  }

  for (const post of posts) {
    categories[post.category] = (categories[post.category] || 0) + 1;
    for (const tag of post.tags) {
      tags[tag] = (tags[tag] || 0) + 1;
    }
  }

  return { categories, tags };
}

function generateFolderMetadata(
  folderName: string,
  posts: IndexPost[]
): FolderMetadata {
  const folderPosts = posts.filter((p) => p.folder === folderName);
  const dates = folderPosts.map((p) => p.date).sort();

  return {
    folder: folderName,
    postCount: folderPosts.length,
    dateRange: {
      earliest: dates[0] || "",
      latest: dates[dates.length - 1] || "",
    },
    posts: folderPosts.map((p) => ({
      id: p.postId,
      slug: p.slug,
      title: p.title,
      date: p.date,
      status: "published",
    })),
  };
}

function main() {
  console.log("Scanning blog posts...");
  const posts = scanPosts();
  console.log(`Found ${posts.length} published posts`);

  // Build index.json
  const { categories, tags } = buildCategoryAndTagCounts(posts);
  const lastUpdated = posts.length > 0 ? posts[0].date : "";
  const index = {
    version: "1.0",
    totalPosts: posts.length,
    lastUpdated,
    posts,
    categories,
    tags,
  };

  const indexPath = path.join(BLOG_DATA_DIR, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");
  console.log(`Written index.json (${posts.length} posts)`);

  // Build folder-level metadata
  const folders = new Set(posts.map((p) => p.folder));
  for (const folder of folders) {
    const folderMetadata = generateFolderMetadata(folder, posts);
    const folderMetaPath = path.join(BLOG_DATA_DIR, folder, "metadata.json");
    fs.writeFileSync(
      folderMetaPath,
      JSON.stringify(folderMetadata, null, 2) + "\n"
    );
    console.log(
      `Written ${folder}/metadata.json (${folderMetadata.postCount} posts)`
    );
  }

  console.log("Done!");
}

main();
