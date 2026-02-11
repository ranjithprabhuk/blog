import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostList from "../components/post/PostList";
import Pagination from "../components/ui/Pagination";
import MetaTags from "../components/seo/MetaTags";
import { useMetadata } from "../hooks/useMetadata";
import { useTypingEffect } from "../hooks/useTypingEffect";
import { config } from "../config";

const ROTATING_WORDS = [
  "web development",
  "software engineering",
  "modern tech",
  "cloud & DevOps",
  "system design",
];

export default function Home() {
  const { page } = useParams();
  const currentPage = Number(page) || 1;
  const { index, loading, error } = useMetadata();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const typedWord = useTypingEffect({
    words: ROTATING_WORDS,
    typingSpeed: 80,
    deletingSpeed: 50,
    pauseDuration: 2500,
  });

  const { posts, totalPages } = useMemo(() => {
    if (!index) return { posts: [], totalPages: 0 };
    const perPage = config.blog.postsPerPage;
    const total = Math.ceil(index.posts.length / perPage);
    const start = (currentPage - 1) * perPage;
    const pagePosts = index.posts.slice(start, start + perPage);
    return { posts: pagePosts, totalPages: total };
  }, [index, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
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

      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-gray-100 dark:border-gray-800">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.4) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Ranjith&apos;s </span>
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 h-8">
            Thoughts on{" "}
            <span className="text-gray-900 dark:text-white font-medium">
              {typedWord}
            </span>
            <span className="inline-block w-[2px] h-5 bg-primary-500 ml-0.5 align-middle animate-blink" />
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 text-base bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Posts grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <PostList posts={posts} loading={loading} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
