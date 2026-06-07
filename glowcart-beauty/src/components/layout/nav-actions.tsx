"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

function NavIconBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function NavWishlistButton() {
  const wishlistCount = useWishlistStore((s) => s.getWishlistCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? wishlistCount : 0;

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="relative hidden sm:inline-flex"
      aria-label={`Wishlist${count ? `, ${count} items` : ""}`}
    >
      <Link href="/wishlist">
        <Heart className="size-5" />
        <NavIconBadge count={count} />
      </Link>
    </Button>
  );
}

export function NavCartButton() {
  const cartCount = useCartStore((s) => s.getCartCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? cartCount : 0;

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={`Shopping cart${count ? `, ${count} items` : ""}`}
    >
      <Link href="/cart">
        <ShoppingBag className="size-5" />
        <NavIconBadge count={count} />
      </Link>
    </Button>
  );
}
