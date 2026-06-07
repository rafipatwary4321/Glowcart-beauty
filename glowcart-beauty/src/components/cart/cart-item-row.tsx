"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import { QuantitySelector } from "@/components/product/quantity-selector";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCartStore, type CartItem } from "@/store/cart-store";

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const setQuantity = useCartStore((s) => s.setQuantity);

  const lineTotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-4 rounded-2xl border border-border/60 bg-white p-4 shadow-sm sm:gap-6 sm:p-5">
      <Link
        href={`/products/${item.product.slug}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-xl sm:size-28"
      >
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br",
            item.product.imageGradient
          )}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {item.product.brand}
          </p>
          <Link
            href={`/products/${item.product.slug}`}
            className="line-clamp-2 font-medium text-foreground transition-colors hover:text-primary"
          >
            {item.product.name}
          </Link>
          <p className="text-sm font-semibold text-foreground">
            {formatPrice(item.product.price)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => setQuantity(item.product.id, qty)}
            max={Math.min(item.product.stockCount, 10)}
          />
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">
              {formatPrice(lineTotal)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remove item"
              onClick={() => removeFromCart(item.product.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
