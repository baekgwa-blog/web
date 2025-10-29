import { Skeleton } from '@/components/ui/skeleton';

export function StackDetailComponentLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      {/* 1. 헤더 스켈레톤 */}
      <div className="mb-4">
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="mb-6 flex items-start justify-between">
        <Skeleton className="h-10 w-3/5" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="mb-4 h-6 w-full max-w-lg" />
      <Skeleton className="mb-10 h-6 w-full max-w-md" />

      {/* 2. 게시물 목록 스켈레톤 */}
      <div className="flex flex-col gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-6 rounded-lg border p-4">
            <Skeleton className="relative hidden h-28 w-40 shrink-0 rounded-md sm:block" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-8 w-full max-w-sm" />
              <Skeleton className="mt-4 h-5 w-32" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
