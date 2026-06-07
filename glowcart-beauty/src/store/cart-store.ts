"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types";

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateSubtotal: () => number;
  getCartCount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1) => {
        if (!product.inStock) return;

        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          );
          const maxQty = Math.min(product.stockCount, 10);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + quantity, maxQty),
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { product, quantity: Math.min(quantity, maxQty) },
            ],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      increaseQuantity: (productId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id !== productId) return item;
            const maxQty = Math.min(item.product.stockCount, 10);
            return {
              ...item,
              quantity: Math.min(item.quantity + 1, maxQty),
            };
          }),
        }));
      },

      decreaseQuantity: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        }));
      },

      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id !== productId) return item;
            const maxQty = Math.min(item.product.stockCount, 10);
            return { ...item, quantity: Math.min(quantity, maxQty) };
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      calculateSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),

      getCartCount: () =>
        get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: "glowcart-cart" }
  )
);
