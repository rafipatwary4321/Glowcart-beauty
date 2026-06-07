"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calcDiscountPercent } from "@/lib/products/filter-products";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const discount = calcDiscountPercent(product);

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border-border/60 bg-card py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
              product.imageGradient
            )}
          />
        </Link>
        {product.badge && product.inStock && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm"
          >
            {product.badge}
          </Badge>
        )}
        {!product.inStock && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 rounded-full bg-foreground/80 text-background backdrop-blur-sm"
          >
            Sold out
          </Badge>
        )}
        {product.inStock && (
          <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <WishlistButton
              product={product}
              size="icon"
              className="size-9 border-0 bg-white/90 shadow-sm backdrop-blur-sm hover:bg-white"
            />
          </div>
        )}
        {product.inStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <AddToCartButton
              product={product}
              fullWidth
              size="default"
              className="bg-foreground text-background hover:bg-foreground/90"
            />
          </div>
        )}
      </div>
      <CardContent className="space-y-2 p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand} · {product.category}
        </p>
        <Link
          href={`/products/${product.slug}`}
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {discount > 0 && (
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
