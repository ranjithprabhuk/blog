import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PostList from "../components/post/PostList";
import MetaTags from "../components/seo/MetaTags";
import { useMetadata } from "../hooks/useMetadata";

export default function TagPage() {
  const { name } = useParams<{ name: string }>();
  const { index, loading } = useMetadata();

  const filteredPosts = useMemo(() => {
    if (!index || !name) return [];
    const decoded = decodeURIComponent(name).toLowerCase();
    return index.posts.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === decoded),
    );
  }, [index, name]);

  const decodedName = name ? decodeURIComponent(name) : "";

  return (
    <>
      <MetaTags
        title={`#${decodedName}`}
        description={`All posts tagged with ${decodedName}`}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All posts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            #{decodedName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}{" "}
            with this tag
          </p>
        </header>

        <PostList posts={filteredPosts} loading={loading} />
      </div>
    </>
  );
}
