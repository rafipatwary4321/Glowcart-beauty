import { Skeleton } from "@/components/ui/skeleton";

type CategoryGridSkeletonProps = {
  count?: number;
};

export function CategoryGridSkeleton({ count = 6 }: CategoryGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] rounded-2xl sm:aspect-[3/4]" />
      ))}
    </div>
  );
}
