"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useState } from "react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { WishlistButton } from "@/components/product/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calcDiscountPercent } from "@/lib/products/filter-products";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ProductInfoProps = {
  product: Product;
  className?: string;
};

export function ProductInfo({ product, className }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const discount = calcDiscountPercent(product);

  return (
    <div className={cn("space-y-6", className)} data-testid="product-info">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/products?brand=${product.brandSlug}`}
            className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
          >
            {product.brand}
          </Link>
          {product.badge && (
            <Badge
              variant="secondary"
              className="rounded-full bg-rose-50 text-primary"
            >
              {product.badge}
            </Badge>
          )}
        </div>

        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-beige-200 text-beige-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">
            ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-heading text-3xl font-semibold text-foreground">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
            {discount > 0 && (
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-sm font-medium text-rose-600">
                Save {discount}%
              </span>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "size-2 rounded-full",
            product.inStock ? "bg-emerald-500" : "bg-rose-400"
          )}
        />
        <span className="text-sm font-medium">
          {product.inStock
            ? `In stock (${product.stockCount} available)`
            : "Out of stock"}
        </span>
      </div>

      <Separator />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={product.inStock ? Math.min(product.stockCount, 10) : 1}
        />
        <div className="flex flex-1 gap-3">
          <AddToCartButton
            product={product}
            quantity={quantity}
            fullWidth
            className="flex-1"
          />
          <WishlistButton product={product} />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>
    </div>
  );
}
