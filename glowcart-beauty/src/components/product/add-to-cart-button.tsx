"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type AddToCartButtonProps = {
  product: Product;
  quantity?: number;
  size?: "default" | "sm" | "lg";
  className?: string;
  fullWidth?: boolean;
  showIcon?: boolean;
  label?: string;
};

export function AddToCartButton({
  product,
  quantity = 1,
  size = "lg",
  className,
  fullWidth = false,
  showIcon = true,
  label = "Add to Cart",
}: AddToCartButtonProps) {
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <Button
      type="button"
      size={size}
      className={cn(
        "rounded-full",
        fullWidth && "w-full",
        className
      )}
      disabled={!product.inStock}
      onClick={() => addToCart(product, quantity)}
      data-testid="add-to-cart"
    >
      {showIcon && <ShoppingBag className="size-4" />}
      {label}
    </Button>
  );
}
