import { Link } from "react-router-dom";
import MetaTags from "../components/seo/MetaTags";

export default function NotFound() {
  return (
    <>
      <MetaTags title="Page Not Found" />
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl font-bold text-gray-200 dark:text-gray-800 mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </>
  );
}
