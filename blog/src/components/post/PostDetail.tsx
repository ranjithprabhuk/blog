import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import PostContent from "./PostContent";
import TableOfContents from "./TableOfContents";
import MetaTags from "../seo/MetaTags";
import { formatDate } from "../../utils/markdown";
import type { ParsedPost } from "../../utils/markdown";
import type { PostSummary } from "../../utils/api";

interface PostDetailProps {
  post: ParsedPost;
  prevPost?: PostSummary | null;
  nextPost?: PostSummary | null;
}

export default function PostDetail({
  post,
  prevPost,
  nextPost,
}: PostDetailProps) {
  const { frontmatter, html, headings } = post;

  return (
    <>
      <MetaTags
        title={frontmatter.title}
        description={frontmatter.excerpt}
        type="article"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to posts
        </Link>

        <div className="flex gap-12">
          {/* Main content */}
          <article className="min-w-0 flex-1 max-w-3xl">
            {/* Header */}
            <header className="mb-10">
              <div className="mb-4">
                <Badge
                  label={frontmatter.category}
                  to={`/category/${encodeURIComponent(frontmatter.category)}`}
                  variant="primary"
                />
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                {frontmatter.title}
              </h1>

              {/* Author row */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {frontmatter.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {frontmatter.author}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <time dateTime={frontmatter.date}>
                      {formatDate(frontmatter.date)}
                    </time>
                    {frontmatter.updated !== frontmatter.date && (
                      <>
                        <span>&middot;</span>
                        <span>Updated {formatDate(frontmatter.updated)}</span>
                      </>
                    )}
                    <span>&middot;</span>
                    <span>{frontmatter.readingTime} min read</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <PostContent html={html} />

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag) => (
                  <Badge
                    key={tag}
                    label={tag}
                    to={`/tag/${encodeURIComponent(tag)}`}
                  />
                ))}
              </div>
            </div>

            {/* Prev/Next navigation */}
            {(prevPost || nextPost) && (
              <nav
                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-4"
                aria-label="Post navigation"
              >
                {prevPost ? (
                  <Link
                    to={`/post/${prevPost.slug}`}
                    className="group p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all"
                  >
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      &larr; Previous
                    </span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 mt-1 line-clamp-2">
                      {prevPost.title}
                    </p>
                  </Link>
                ) : (
                  <div />
                )}
                {nextPost && (
                  <Link
                    to={`/post/${nextPost.slug}`}
                    className="group p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all text-right"
                  >
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Next &rarr;
                    </span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 mt-1 line-clamp-2">
                      {nextPost.title}
                    </p>
                  </Link>
                )}
              </nav>
            )}
          </article>

          {/* Sidebar TOC */}
          <aside className="hidden xl:block w-56 shrink-0">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </div>
    </>
  );
}
