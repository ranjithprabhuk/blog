import { useState, useEffect } from "react";
import {
  fetchMetadata,
  fetchIndex,
  type BlogMetadata,
  type BlogIndex,
} from "../utils/api";

interface UseMetadataResult {
  metadata: BlogMetadata | null;
  index: BlogIndex | null;
  loading: boolean;
  error: string | null;
}

export function useMetadata(): UseMetadataResult {
  const [metadata, setMetadata] = useState<BlogMetadata | null>(null);
  const [index, setIndex] = useState<BlogIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [meta, idx] = await Promise.all([
          fetchMetadata(),
          fetchIndex(),
        ]);
        if (!cancelled) {
          setMetadata(meta);
          setIndex(idx);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load blog data",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { metadata, index, loading, error };
}
