import type { Product } from "@/types/product";

/**
 * Product API service layer.
 * Swap dummy data for fetch/API calls when backend is ready.
 */
export async function getProducts(): Promise<Product[]> {
  const { bestSellers, newArrivals } = await import("@/data/dummy");
  return [...bestSellers, ...newArrivals];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getBestSellers(): Promise<Product[]> {
  const { bestSellers } = await import("@/data/dummy");
  return bestSellers;
}

export async function getNewArrivals(): Promise<Product[]> {
  const { newArrivals } = await import("@/data/dummy");
  return newArrivals;
}
