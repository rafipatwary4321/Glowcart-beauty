import type { Brand } from "@/types/brand";
import type { Category } from "@/types/product";
import type { SkinConcern } from "@/types/skin-concern";

export async function getFeaturedCategories(): Promise<Category[]> {
  const { featuredCategories } = await import("@/data/categories");
  return featuredCategories;
}

export async function getTopBrands(): Promise<Brand[]> {
  const { topBrands } = await import("@/data/brands");
  return topBrands;
}

export async function getSkinConcerns(): Promise<SkinConcern[]> {
  const { skinConcerns } = await import("@/data/skin-concerns");
  return skinConcerns;
}
