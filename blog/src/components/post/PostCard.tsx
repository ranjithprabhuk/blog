import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { formatDate } from "../../utils/markdown";
import type { PostSummary } from "../../utils/api";

interface PostCardProps {
  post: PostSummary;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <Badge
          label={post.category}
          to={`/category/${encodeURIComponent(post.category)}`}
          variant="primary"
        />
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatDate(post.date)}
        </span>
      </div>

      <Link to={`/post/${post.slug}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
          {post.title}
        </h2>
      </Link>

      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} label={tag} to={`/tag/${encodeURIComponent(tag)}`} />
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>
          )}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-2">
          {post.readingTime} min read
        </span>
      </div>
    </article>
  );
}
