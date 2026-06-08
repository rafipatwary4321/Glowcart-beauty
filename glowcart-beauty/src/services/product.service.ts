import {
  getPublicProductBySlug,
  getPublicProducts,
  getPublicRelatedProducts,
  getPublicTrendingProducts,
} from "@/lib/catalog/service";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  return getPublicProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return getPublicProductBySlug(slug);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return getPublicRelatedProducts(product, limit);
}

export async function getTrendingProducts(): Promise<Product[]> {
  return getPublicTrendingProducts();
}

export async function getBestSellers(): Promise<Product[]> {
  const products = await getPublicProducts();
  return products.filter((product) => product.badge === "Bestseller").slice(0, 8);
}

export async function getNewArrivals(): Promise<Product[]> {
  const products = await getPublicProducts();
  return products.filter((product) => product.badge === "New").slice(0, 8);
}
