"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type WishlistButtonProps = {
  product: Product;
  size?: "default" | "icon";
  className?: string;
};

export function WishlistButton({
  product,
  size = "icon",
  className,
}: WishlistButtonProps) {
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isInWishlist = useWishlistStore((s) =>
    s.items.some((item) => item.id === product.id)
  );

  return (
    <Button
      type="button"
      size={size === "icon" ? "icon-sm" : "lg"}
      variant="outline"
      className={cn(
        "rounded-full transition-colors",
        isInWishlist && "border-primary bg-rose-50 text-primary hover:bg-rose-100",
        className
      )}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isInWishlist}
      onClick={() => toggleWishlist(product)}
      data-testid="wishlist-button"
    >
      <Heart className={cn("size-4", isInWishlist && "fill-primary")} />
      {size === "default" && (isInWishlist ? "Saved" : "Wishlist")}
    </Button>
  );
}
