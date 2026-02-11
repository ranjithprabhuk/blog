import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { PostDetailSkeleton } from "./components/ui/Skeleton";

const Home = lazy(() => import("./pages/Home"));
const PostPage = lazy(() => import("./pages/PostPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const TagPage = lazy(() => import("./pages/TagPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <PostDetailSkeleton />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/page/:page" element={<Home />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/tag/:name" element={<TagPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
