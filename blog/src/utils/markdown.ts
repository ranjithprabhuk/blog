import YAML from "yaml";
import { marked, type Tokens } from "marked";
import DOMPurify from "dompurify";
import { getGitHubRawUrl } from "../config";

export interface PostFrontmatter {
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

export interface ParsedPost {
  frontmatter: PostFrontmatter;
  content: string;
  html: string;
  headings: Array<{ id: string; text: string; level: number }>;
}

function extractFrontmatter(raw: string): {
  frontmatter: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: raw };
  }
  const frontmatter = YAML.parse(match[1]) || {};
  // Normalize date fields to strings
  for (const key of ["date", "updated"]) {
    if (frontmatter[key] instanceof Date) {
      frontmatter[key] = frontmatter[key].toISOString().split("T")[0];
    }
  }
  return { frontmatter, content: match[2] };
}

export function parsePost(
  raw: string,
  folder: string,
  postId: string,
): ParsedPost {
  const { frontmatter: data, content } = extractFrontmatter(raw);
  const frontmatter = data as unknown as PostFrontmatter;
  const headings: Array<{ id: string; text: string; level: number }> = [];

  // Custom renderer
  const renderer = new marked.Renderer();

  // Collect headings for TOC
  renderer.heading = ({ text, depth }: Tokens.Heading) => {
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level: depth });
    return `<h${depth} id="${id}"><a href="#${id}" class="anchor-link">${text}</a></h${depth}>`;
  };

  // Transform relative image paths to GitHub raw URLs
  renderer.image = ({ href, title, text }: Tokens.Image) => {
    let src = href;
    if (src.startsWith("./assets/")) {
      src = getGitHubRawUrl(`${folder}/${postId}/assets/${src.slice(9)}`);
    }
    const titleAttr = title ? ` title="${title}"` : "";
    return `<img src="${src}" alt="${text}"${titleAttr} loading="lazy" />`;
  };

  // Custom code block rendering with data attributes for CodeBlock component
  renderer.code = ({ text, lang }: Tokens.Code) => {
    const language = lang || "text";
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
    return `<div class="code-block-wrapper"><div class="code-header"><span class="code-lang">${language}</span><button class="copy-btn" data-code="${encodeURIComponent(text)}">Copy</button></div><pre><code class="language-${language}">${escaped}</code></pre></div>`;
  };

  marked.setOptions({ gfm: true, breaks: false });
  marked.use({ renderer });

  const rawHtml = marked.parse(content) as string;
  const html = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ["data-code", "target"],
    ADD_TAGS: [],
  });

  return { frontmatter, content, html, headings };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
