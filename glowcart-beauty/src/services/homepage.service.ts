import {
  getPublicBrands,
  getPublicCategories,
  getPublicHeroContent,
  getPublicPromoContent,
} from "@/lib/catalog/service";
import type { Brand } from "@/types/brand";
import type { Category } from "@/types/product";
import type { HeroContent, Promotion } from "@/types/homepage";
import type { SkinConcern } from "@/types/skin-concern";

export async function getFeaturedCategories(): Promise<Category[]> {
  return getPublicCategories();
}

export async function getTopBrands(): Promise<Brand[]> {
  return getPublicBrands();
}

export async function getHeroContent(): Promise<HeroContent> {
  return getPublicHeroContent();
}

export async function getPromoContent(): Promise<Promotion> {
  return getPublicPromoContent();
}

export async function getSkinConcerns(): Promise<SkinConcern[]> {
  const { skinConcerns } = await import("@/data/skin-concerns");
  return skinConcerns;
}
