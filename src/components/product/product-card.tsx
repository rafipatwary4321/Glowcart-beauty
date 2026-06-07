import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const discount =
    product.originalPrice &&
    Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border-border/60 bg-card py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
            product.imageGradient
          )}
        />
        {product.badge && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm"
          >
            {product.badge}
          </Badge>
        )}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="icon-sm"
            variant="secondary"
            className="rounded-full bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
            aria-label="Add to wishlist"
          >
            <Heart className="size-4" />
          </Button>
        </div>
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
            <ShoppingBag className="size-4" />
            Add to Cart
          </Button>
        </div>
      </div>
      <CardContent className="space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {product.category}
        </p>
        <Link
          href={`/shop/${product.slug}`}
          className="line-clamp-2 font-medium text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {discount && (
                <span className="text-xs font-medium text-rose-600">
                  -{discount}%
                </span>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
