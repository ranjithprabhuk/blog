import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import Badge from "../ui/Badge";
import AuthorAvatar from "../ui/AuthorAvatar";
import { formatDate } from "../../utils/markdown";
import { getAssetUrl } from "../../utils/api";
import type { PostSummary } from "../../utils/api";

interface PostCardProps {
  post: PostSummary;
}

function PostCardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="block aspect-[16/10] overflow-hidden">
      <img
        src={getAssetUrl(src)}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
  );
}

function PostCardCategory({ category }: { category: string }) {
  function handleClick(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div className="mb-3">
      <span onClick={handleClick}>
        <Badge
          label={category}
          to={`/category/${encodeURIComponent(category)}`}
          variant="primary"
        />
      </span>
    </div>
  );
}

function PostCardTitle({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug line-clamp-2 mb-2">
      {title}
      <span className="inline-block ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
        &rarr;
      </span>
    </h2>
  );
}

function PostCardExcerpt({ excerpt }: { excerpt: string }) {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
      {excerpt}
    </p>
  );
}

function PostCardMeta({
  author,
  date,
  readingTime,
}: {
  author: string;
  date: string;
  readingTime: number;
}) {
  return (
    <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2.5">
        <AuthorAvatar name={author} size="sm" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
            {author}
          </p>
          <time
            dateTime={date}
            className="text-xs text-gray-400 dark:text-gray-500"
          >
            {formatDate(date)}
          </time>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-tight">
          Read time
        </p>
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          {readingTime} min
        </p>
      </div>
    </div>
  );
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/post/${post.slug}`);
  }

  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300"
    >
      {post.featuredImage && (
        <PostCardImage src={post.featuredImage} alt={post.title} />
      )}

      <div className="flex flex-col flex-1 p-5">
        <PostCardCategory category={post.category} />
        <PostCardTitle title={post.title} />
        <PostCardExcerpt excerpt={post.excerpt} />
        <PostCardMeta
          author={post.author}
          date={post.date}
          readingTime={post.readingTime}
        />
      </div>
    </article>
  );
}
