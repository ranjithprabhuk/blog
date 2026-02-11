import { Link } from "react-router-dom";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = "/page",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];

  // Build page number array with ellipsis
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  function getPageUrl(page: number): string {
    if (page === 1) return "/";
    return `${basePath}/${page}`;
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-12">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          to={getPageUrl(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Previous page"
        >
          &larr; Prev
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-600">
          &larr; Prev
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-3 py-2 text-sm text-gray-400"
          >
            ...
          </span>
        ) : (
          <Link
            key={page}
            to={getPageUrl(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? "bg-primary-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          to={getPageUrl(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Next page"
        >
          Next &rarr;
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-gray-300 dark:text-gray-600">
          Next &rarr;
        </span>
      )}
    </nav>
  );
}
