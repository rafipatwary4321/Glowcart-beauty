import { Skeleton } from "@/components/ui/skeleton";

type SkinConcernGridSkeletonProps = {
  count?: number;
};

export function SkinConcernGridSkeleton({
  count = 6,
}: SkinConcernGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-2xl border border-border/40 bg-beige-50/50 p-6"
        >
          <Skeleton className="size-11 rounded-xl" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}
