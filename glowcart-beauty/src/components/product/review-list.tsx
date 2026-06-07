import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProductReview } from "@/types";

type ReviewListProps = {
  reviews: ProductReview[];
  averageRating: number;
  totalCount: number;
  className?: string;
};

export function ReviewList({
  reviews,
  averageRating,
  totalCount,
  className,
}: ReviewListProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-medium text-foreground">
            Customer Reviews
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalCount} reviews · {averageRating} average rating
          </p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-5",
                i < Math.floor(averageRating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-beige-200 text-beige-200"
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {review.author}
                </span>
                {review.verified && (
                  <Badge
                    variant="secondary"
                    className="rounded-full text-[10px] uppercase"
                  >
                    Verified
                  </Badge>
                )}
              </div>
              <time className="text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
            <div className="mt-2 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-beige-200 text-beige-200"
                  )}
                />
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {review.comment}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
