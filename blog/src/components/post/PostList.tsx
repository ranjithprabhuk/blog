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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4 text-gray-300 dark:text-gray-700">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0h-3m3 0a3 3 0 01-3-3V5.625" />
          </svg>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
          No posts found
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Check back later for new content
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
