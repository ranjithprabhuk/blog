import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PostList from "../components/post/PostList";
import MetaTags from "../components/seo/MetaTags";
import { useMetadata } from "../hooks/useMetadata";
import { useSearch } from "../hooks/useSearch";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const { index, loading } = useMetadata();
  const results = useSearch(index?.posts || [], query);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <>
      <MetaTags
        title={query ? `Search: ${query}` : "Search"}
        description="Search blog posts"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Search
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="relative max-w-2xl">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="Search posts by title, tags, or content..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim()) {
                    setSearchParams({ q: e.target.value.trim() });
                  }
                }}
                className="w-full pl-12 pr-4 py-3.5 text-base bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                autoFocus
              />
            </div>
          </form>
        </header>

        {query.length >= 2 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}

        {query.length >= 2 ? (
          <PostList posts={results} loading={loading} />
        ) : query.length > 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">
            Type at least 2 characters to search
          </p>
        ) : null}
      </div>
    </>
  );
}
