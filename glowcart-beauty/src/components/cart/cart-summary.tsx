"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  calculateDeliveryCharge,
  calculateGrandTotal,
  FREE_DELIVERY_THRESHOLD,
} from "@/lib/cart/calculations";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.calculateSubtotal());
  const clearCart = useCartStore((s) => s.clearCart);

  if (items.length === 0) return null;

  const delivery = calculateDeliveryCharge(subtotal);
  const grandTotal = calculateGrandTotal(subtotal);

  return (
    <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm lg:sticky lg:top-28">
      <h2 className="font-heading text-xl font-medium text-foreground">
        Order Summary
      </h2>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium">
            {delivery === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              formatPrice(delivery)
            )}
          </span>
        </div>
        {subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD && (
          <p className="text-xs text-muted-foreground">
            Add {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} more for free
            delivery
          </p>
        )}
      </div>

      <Separator className="my-5" />

      <div className="flex justify-between text-base font-semibold">
        <span>Grand Total</span>
        <span className="font-heading text-lg">{formatPrice(grandTotal)}</span>
      </div>

      <Button className="mt-6 w-full rounded-full" size="lg" asChild>
        <Link href="/checkout">
          Proceed to Checkout
          <ArrowRight className="size-4" />
        </Link>
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="mt-2 w-full rounded-full text-muted-foreground"
        onClick={clearCart}
      >
        Clear cart
      </Button>
    </div>
  );
}

export function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-gradient-to-br from-rose-50/50 via-white to-beige-50 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-rose-100 text-primary">
        <ShoppingBag className="size-7" />
      </div>
      <h2 className="mt-5 font-heading text-2xl font-medium text-foreground">
        Your cart is empty
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Discover our premium skincare, makeup, and fragrances — your glow
        essentials are waiting.
      </p>
      <Button className="mt-6 rounded-full px-8" asChild>
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}
