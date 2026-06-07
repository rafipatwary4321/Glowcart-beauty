"use client";

import { useEffect, useState } from "react";

import { CartEmptyState, CartSummary } from "@/components/cart/cart-summary";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { useCartStore } from "@/store/cart-store";

export function CartPageContent() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-beige-100" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <CartEmptyState />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"} in your cart
        </p>
        {items.map((item) => (
          <CartItemRow key={item.product.id} item={item} />
        ))}
      </div>
      <CartSummary />
    </div>
  );
}
