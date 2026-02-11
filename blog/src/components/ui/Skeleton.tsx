interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-10 w-full mb-2" />
      <Skeleton className="h-10 w-3/4 mb-6" />
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-5/6 mb-6" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-4/5 mb-3" />
      <Skeleton className="h-48 w-full mb-6" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-3/4 mb-3" />
    </div>
  );
}
