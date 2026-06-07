"use client";

import type { Product } from "@/types";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

/**
 * Cart store placeholder.
 * Replace with Zustand or Context when cart logic is implemented.
 */
export function useCartStore(): CartState {
  return {
    items: [],
    addItem: () => {},
    removeItem: () => {},
    clearCart: () => {},
    totalItems: () => 0,
    totalPrice: () => 0,
  };
}
