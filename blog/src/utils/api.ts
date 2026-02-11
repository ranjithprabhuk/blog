import { getGitHubRawUrl, config } from "../config";
import { getCached, setCache } from "./cache";

export interface BlogMetadata {
  version: string;
  blog: {
    title: string;
    description: string;
    url: string;
    postsPerPage: number;
  };
  author: {
    name: string;
    bio: string;
    avatar: string;
    social: {
      github: string;
      twitter: string;
      linkedin: string;
    };
  };
  categories: string[];
  repo: {
    owner: string;
    name: string;
    branch: string;
  };
}

export interface PostSummary {
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

export interface BlogIndex {
  version: string;
  totalPosts: number;
  lastUpdated: string;
  posts: PostSummary[];
  categories: Record<string, number>;
  tags: Record<string, number>;
}

async function fetchRaw(path: string): Promise<string> {
  const url = getGitHubRawUrl(path);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return response.text();
}

export async function fetchMetadata(): Promise<BlogMetadata> {
  const cached = getCached<BlogMetadata>("metadata");
  if (cached) return cached;

  const raw = await fetchRaw("metadata.json");
  const data: BlogMetadata = JSON.parse(raw);
  setCache("metadata", data, config.cache.metadataTTL);
  return data;
}

export async function fetchIndex(): Promise<BlogIndex> {
  const cached = getCached<BlogIndex>("index");
  if (cached) return cached;

  const raw = await fetchRaw("index.json");
  const data: BlogIndex = JSON.parse(raw);
  setCache("index", data, config.cache.metadataTTL);
  return data;
}

export async function fetchPostContent(
  folder: string,
  postId: string,
): Promise<string> {
  const cacheKey = `post_${folder}_${postId}`;
  const cached = getCached<string>(cacheKey);
  if (cached) return cached;

  const raw = await fetchRaw(`${folder}/${postId}/post.md`);
  setCache(cacheKey, raw, config.cache.postTTL);
  return raw;
}

export function getAssetUrl(relativePath: string): string {
  return getGitHubRawUrl(relativePath);
}
