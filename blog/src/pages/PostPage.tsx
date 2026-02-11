import { useMemo } from "react";
import { useParams } from "react-router-dom";
import PostDetail from "../components/post/PostDetail";
import { PostDetailSkeleton } from "../components/ui/Skeleton";
import { useMetadata } from "../hooks/useMetadata";
import { usePostData } from "../hooks/usePostData";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { index } = useMetadata();

  // Find post info from index
  const { postInfo, prevPost, nextPost } = useMemo(() => {
    if (!index || !slug) return { postInfo: null, prevPost: null, nextPost: null };
    const idx = index.posts.findIndex((p) => p.slug === slug);
    if (idx === -1) return { postInfo: null, prevPost: null, nextPost: null };
    return {
      postInfo: index.posts[idx],
      prevPost: idx > 0 ? index.posts[idx - 1] : null,
      nextPost: idx < index.posts.length - 1 ? index.posts[idx + 1] : null,
    };
  }, [index, slug]);

  // Get recent posts excluding the current one (must be before early returns)
  const recentPosts = useMemo(() => {
    if (!index || !slug) return [];
    return index.posts.filter((p) => p.slug !== slug).slice(0, 3);
  }, [index, slug]);

  const { post, loading, error } = usePostData(
    postInfo?.folder,
    postInfo?.postId,
  );

  if (loading) return <PostDetailSkeleton />;

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Post not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {error || "The post you're looking for doesn't exist."}
        </p>
      </div>
    );
  }

  return <PostDetail post={post} prevPost={prevPost} nextPost={nextPost} recentPosts={recentPosts} />;
}
