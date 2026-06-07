import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const { products } = await import("@/data/products");
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { getProductBySlug } = await import("@/data/products");
  return getProductBySlug(slug) ?? null;
}

export async function getTrendingProducts(): Promise<Product[]> {
  const { trendingProducts } = await import("@/data/trending-products");
  return trendingProducts;
}

export async function getBestSellers(): Promise<Product[]> {
  const { bestSellers } = await import("@/data/dummy");
  return bestSellers;
}

export async function getNewArrivals(): Promise<Product[]> {
  const { newArrivals } = await import("@/data/dummy");
  return newArrivals;
}
