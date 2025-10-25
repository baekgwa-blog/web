import { Skeleton } from '@/components/ui/skeleton';

/**
 * StackPage의 로딩 스켈레톤 UI (업데이트됨)
 */
export function StackListPageLoading() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6 lg:p-8">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm"
        >
          <Skeleton className="h-48 w-full rounded-b-none" />

          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
