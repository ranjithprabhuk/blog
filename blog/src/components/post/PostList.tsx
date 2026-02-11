import PostCard from "./PostCard";
import { PostCardSkeleton } from "../ui/Skeleton";
import type { PostSummary } from "../../utils/api";

interface PostListProps {
  posts: PostSummary[];
  loading?: boolean;
}

export default function PostList({ posts, loading }: PostListProps) {
  if (loading) {
    return (
      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No posts found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
