import { Skeleton } from '@/components/ui/skeleton';

export function EditStackFormLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Title Skeleton */}
      <Skeleton className="h-12 w-full" />

      {/* Description Skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Category & Thumbnail Skeletons */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* StackPostManager Skeleton */}
      <div className="space-y-4 rounded-lg border p-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-40 w-full" />
      </div>

      {/* Button Skeleton */}
      <div className="mt-6 flex justify-end">
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  );
}
