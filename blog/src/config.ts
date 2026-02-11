export const config = {
  repo: {
    owner: "ranjithprabhuk",
    name: "blog",
    branch: "main",
  },
  blog: {
    title: "Ranjith's Blog",
    description:
      "Thoughts on web development, software engineering, and modern tech",
    postsPerPage: 10,
  },
  githubRawBase: "https://raw.githubusercontent.com",
  cache: {
    metadataTTL: 5 * 60 * 1000, // 5 minutes
    postTTL: 30 * 60 * 1000, // 30 minutes
  },
} as const;

export function getGitHubRawUrl(path: string): string {
  return `${config.githubRawBase}/${config.repo.owner}/${config.repo.name}/${config.repo.branch}/blog-data/${path}`;
}
