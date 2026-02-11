import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import type { PostSummary } from "../utils/api";

export function useSearch(posts: PostSummary[], query: string) {
  const [results, setResults] = useState<PostSummary[]>([]);

  const fuse = useMemo(() => {
    if (!posts.length) return null;
    return new Fuse(posts, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "excerpt", weight: 0.3 },
        { name: "tags", weight: 0.2 },
        { name: "category", weight: 0.1 },
      ],
      threshold: 0.3,
      minMatchCharLength: 2,
      includeScore: true,
    });
  }, [posts]);

  useEffect(() => {
    if (!fuse || !query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query);
    setResults(searchResults.map((r) => r.item));
  }, [query, fuse]);

  return results;
}
