import { Skeleton } from "@/components/ui/skeleton";

type AdminTableSkeletonProps = {
  rows?: number;
};

export function AdminTableSkeleton({ rows = 5 }: AdminTableSkeletonProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
