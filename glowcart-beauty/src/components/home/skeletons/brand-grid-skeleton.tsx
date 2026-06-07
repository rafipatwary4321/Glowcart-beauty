import { Skeleton } from "@/components/ui/skeleton";

type BrandGridSkeletonProps = {
  count?: number;
};

export function BrandGridSkeleton({ count = 6 }: BrandGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6"
        >
          <Skeleton className="size-16 rounded-full sm:size-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
