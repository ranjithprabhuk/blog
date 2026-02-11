import { useMemo } from "react";
import { useParams } from "react-router-dom";
import PostList from "../components/post/PostList";
import Pagination from "../components/ui/Pagination";
import MetaTags from "../components/seo/MetaTags";
import { useMetadata } from "../hooks/useMetadata";
import { config } from "../config";

export default function Home() {
  const { page } = useParams();
  const currentPage = Number(page) || 1;
  const { index, loading, error } = useMetadata();

  const { posts, totalPages } = useMemo(() => {
    if (!index) return { posts: [], totalPages: 0 };
    const perPage = config.blog.postsPerPage;
    const total = Math.ceil(index.posts.length / perPage);
    const start = (currentPage - 1) * perPage;
    const pagePosts = index.posts.slice(start, start + perPage);
    return { posts: pagePosts, totalPages: total };
  }, [index, currentPage]);

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Unable to load posts
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <MetaTags />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Posts
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {config.blog.description}
          </p>
        </header>

        <PostList posts={posts} loading={loading} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
