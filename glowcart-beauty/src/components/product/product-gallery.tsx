"use client";

import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  name: string;
  className?: string;
};

export function ProductGallery({ images, name, className }: ProductGalleryProps) {
  const displayImages = images.length > 0 ? images : ["from-rose-100 to-beige-100"];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br shadow-lg ring-1 ring-border/20">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br transition-all duration-500",
            displayImages[0]
          )}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
      </div>
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {displayImages.map((gradient, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                "aspect-square overflow-hidden rounded-xl ring-2 transition-all hover:ring-primary/40",
                i === 0 ? "ring-primary/60" : "ring-transparent"
              )}
              aria-label={`${name} view ${i + 1}`}
            >
              <div className={cn("size-full bg-gradient-to-br", gradient)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
