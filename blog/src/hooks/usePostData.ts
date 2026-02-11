import { useState, useEffect } from "react";
import { fetchPostContent } from "../utils/api";
import { parsePost, type ParsedPost } from "../utils/markdown";

interface UsePostDataResult {
  post: ParsedPost | null;
  loading: boolean;
  error: string | null;
}

export function usePostData(
  folder: string | undefined,
  postId: string | undefined,
): UsePostDataResult {
  const [post, setPost] = useState<ParsedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!folder || !postId) {
      setLoading(false);
      setError("Post not found");
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const raw = await fetchPostContent(folder!, postId!);
        if (!cancelled) {
          const parsed = parsePost(raw, folder!, postId!);
          setPost(parsed);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load post",
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
  }, [folder, postId]);

  return { post, loading, error };
}
