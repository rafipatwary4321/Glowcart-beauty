"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types";

function WishlistItemActions({ product }: { product: Product }) {
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <div className="flex gap-2 pt-3">
      <Button
        type="button"
        size="sm"
        className="flex-1 rounded-full"
        disabled={!product.inStock}
        onClick={() => addToCart(product, 1)}
      >
        <ShoppingBag className="size-3.5" />
        Move to Cart
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        className="rounded-full"
        aria-label="Remove from wishlist"
        onClick={() => removeFromWishlist(product.id)}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function WishlistCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-transform duration-500 hover:scale-105",
              product.imageGradient
            )}
          />
        </div>
      </Link>
      <div className="p-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 font-medium text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-2 text-base font-semibold">{formatPrice(product.price)}</p>
        <WishlistItemActions product={product} />
      </div>
    </div>
  );
}

function WishlistEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-gradient-to-br from-rose-50/50 via-white to-beige-50 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-rose-100 text-primary">
        <Heart className="size-7" />
      </div>
      <h2 className="mt-5 font-heading text-2xl font-medium text-foreground">
        Your wishlist is empty
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Save your favorite products here and come back anytime to shop your
        glow essentials.
      </p>
      <Button className="mt-6 rounded-full px-8" asChild>
        <Link href="/products">Browse Products</Link>
      </Button>
    </div>
  );
}

export function WishlistPageContent() {
  const items = useWishlistStore((s) => s.items);
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-beige-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <WishlistEmptyState />;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"} saved
      </p>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => (
          <WishlistCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
