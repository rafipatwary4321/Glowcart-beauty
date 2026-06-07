import { cn } from "@/lib/utils";

type SkeletonProps = React.ComponentProps<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gradient-to-r from-beige-100 via-rose-50 to-beige-100",
        className
      )}
      {...props}
    />
  );
}
