import { Link } from "react-router-dom";
import MetaTags from "../components/seo/MetaTags";

export default function NotFound() {
  return (
    <>
      <MetaTags title="Page Not Found" />
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-8xl font-bold text-gray-100 dark:text-gray-800 mb-2 select-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
    </>
  );
}
