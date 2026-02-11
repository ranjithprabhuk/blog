import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { formatDate } from "../../utils/markdown";
import { getAssetUrl } from "../../utils/api";
import type { PostSummary } from "../../utils/api";

interface PostCardProps {
  post: PostSummary;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
      {/* Featured image */}
      {post.featuredImage && (
        <Link to={`/post/${post.slug}`} className="block aspect-[16/10] overflow-hidden">
          <img
            src={getAssetUrl(post.featuredImage)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
      )}

      <div className="p-5">
        {/* Category badge */}
        <div className="mb-3">
          <Badge
            label={post.category}
            to={`/category/${encodeURIComponent(post.category)}`}
            variant="primary"
          />
        </div>

        {/* Title with arrow */}
        <Link to={`/post/${post.slug}`} className="block mb-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
            {post.title}
            <span className="inline-block ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
              &rarr;
            </span>
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Author + date | Read time */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                {post.author}
              </p>
              <time dateTime={post.date} className="text-xs text-gray-400 dark:text-gray-500">
                {formatDate(post.date)}
              </time>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-tight">
              Read time
            </p>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {post.readingTime} min
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
