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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <Link
            to="/"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline mb-4 inline-block"
          >
            &larr; All posts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
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
