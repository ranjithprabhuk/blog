import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PostList from "../components/post/PostList";
import Badge from "../components/ui/Badge";
import MetaTags from "../components/seo/MetaTags";
import { useMetadata } from "../hooks/useMetadata";

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const { index, loading } = useMetadata();

  const filteredPosts = useMemo(() => {
    if (!index || !name) return [];
    return index.posts.filter(
      (p) => p.category.toLowerCase() === decodeURIComponent(name).toLowerCase(),
    );
  }, [index, name]);

  const decodedName = name ? decodeURIComponent(name) : "";

  return (
    <>
      <MetaTags
        title={`${decodedName} Posts`}
        description={`All blog posts in the ${decodedName} category`}
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            {decodedName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} in
            this category
          </p>
        </header>

        {/* Category quick links */}
        {index && (
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(index.categories)
              .filter(([, count]) => count > 0)
              .map(([cat, count]) => (
                <Badge
                  key={cat}
                  label={`${cat} (${count})`}
                  to={`/category/${encodeURIComponent(cat)}`}
                  variant={cat === decodedName ? "primary" : "default"}
                />
              ))}
          </div>
        )}

        <PostList posts={filteredPosts} loading={loading} />
      </div>
    </>
  );
}
