import { Link } from "react-router-dom";
import MetaTags from "../components/seo/MetaTags";
import { useMetadata } from "../hooks/useMetadata";

export default function CategoriesPage() {
  const { index, loading } = useMetadata();

  return (
    <>
      <MetaTags
        title="Categories"
        description="Browse blog posts by category"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Categories
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Browse posts by topic
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Categories grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {index &&
                Object.entries(index.categories).map(([cat, count]) => (
                  <Link
                    key={cat}
                    to={`/category/${encodeURIComponent(cat)}`}
                    className="flex items-center justify-between p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all group"
                  >
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {cat}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
                      {count}
                    </span>
                  </Link>
                ))}
            </div>

            {/* Tags cloud */}
            {index && Object.keys(index.tags).length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(index.tags)
                    .sort((a, b) => b[1] - a[1])
                    .map(([tag, count]) => (
                      <Link
                        key={tag}
                        to={`/tag/${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 rounded-full transition-colors"
                      >
                        {tag}
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {count}
                        </span>
                      </Link>
                    ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
