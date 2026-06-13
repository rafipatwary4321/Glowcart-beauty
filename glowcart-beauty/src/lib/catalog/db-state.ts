import { connectDB } from "@/lib/db";
import { Banner, Brand, Category, Product } from "@/models";

export type CatalogDbState = {
  connected: boolean;
  hasProducts: boolean;
  hasCategories: boolean;
  hasBrands: boolean;
  hasHeroBanners: boolean;
  hasPromoBanners: boolean;
};

const emptyState: CatalogDbState = {
  connected: false,
  hasProducts: false,
  hasCategories: false,
  hasBrands: false,
  hasHeroBanners: false,
  hasPromoBanners: false,
};

export async function getCatalogDbState(): Promise<CatalogDbState> {
  try {
    await connectDB();
    const [productCount, categoryCount, brandCount, heroCount, promoCount] =
      await Promise.all([
        Product.countDocuments({ isActive: true }),
        Category.countDocuments({ isActive: true }),
        Brand.countDocuments({ isActive: true }),
        Banner.countDocuments({ type: "hero", isActive: true }),
        Banner.countDocuments({ type: "promo", isActive: true }),
      ]);

    return {
      connected: true,
      hasProducts: productCount > 0,
      hasCategories: categoryCount > 0,
      hasBrands: brandCount > 0,
      hasHeroBanners: heroCount > 0,
      hasPromoBanners: promoCount > 0,
    };
  } catch {
    return emptyState;
  }
}
