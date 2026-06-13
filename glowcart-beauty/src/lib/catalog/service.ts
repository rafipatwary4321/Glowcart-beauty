import { featuredCategories } from "@/data/categories";
import { heroContent } from "@/data/hero";
import { featuredPromotion } from "@/data/promotions";
import {
  products as staticProducts,
  getProductBySlug as getStaticProductBySlug,
  getRelatedProducts as getStaticRelatedProducts,
} from "@/data/products";
import { topBrands as staticBrands } from "@/data/brands";
import { trendingProducts as staticTrendingProducts } from "@/data/trending-products";
import { serializeDocuments } from "@/lib/api";
import { serializeBanner } from "@/lib/api/banner-serializer";
import { getCatalogDbState } from "@/lib/catalog/db-state";
import {
  mapBrandDocument,
  mapCategoryDocument,
  mapHeroBanner,
  mapProductDocument,
  mapPromoBanner,
} from "@/lib/catalog/mappers";
import { connectDB } from "@/lib/db";
import { Banner, Brand, Category, Product } from "@/models";
import type { Brand as BrandType } from "@/types/brand";
import type { HeroContent, Promotion } from "@/types/homepage";
import type { Product as ProductType, Category as CategoryType } from "@/types/product";

function isActiveBanner(banner: {
  isActive?: boolean;
  startsAt?: Date | null;
  expiresAt?: Date | null;
}) {
  if (!banner.isActive) return false;
  const now = new Date();
  if (banner.startsAt && banner.startsAt > now) return false;
  if (banner.expiresAt && banner.expiresAt < now) return false;
  return true;
}

async function fetchActiveProducts(filter: Record<string, unknown> = {}) {
  await connectDB();
  const docs = await Product.find({ isActive: true, ...filter })
    .populate("category", "name slug description imageGradient")
    .populate("brand", "name slug tagline imageGradient")
    .sort({ createdAt: -1 });
  return serializeDocuments(docs).map((doc) => mapProductDocument(doc));
}

export async function getPublicProducts(): Promise<ProductType[]> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasProducts) {
    return staticProducts;
  }

  try {
    return await fetchActiveProducts();
  } catch {
    return staticProducts;
  }
}

export async function getPublicProductBySlug(slug: string): Promise<ProductType | null> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasProducts) {
    return getStaticProductBySlug(slug) ?? null;
  }

  try {
    await connectDB();
    const doc = await Product.findOne({ slug: slug.toLowerCase(), isActive: true })
      .populate("category", "name slug description imageGradient")
      .populate("brand", "name slug tagline imageGradient");

    if (doc) {
      return mapProductDocument(serializeDocuments([doc])[0]!);
    }
    return null;
  } catch {
    return getStaticProductBySlug(slug) ?? null;
  }
}

export async function getPublicRelatedProducts(
  product: ProductType,
  limit = 4
): Promise<ProductType[]> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasProducts) {
    return getStaticRelatedProducts(product, limit);
  }

  try {
    await connectDB();
    const category = await Category.findOne({ slug: product.categorySlug }).select("_id");
    if (category) {
      const docs = await Product.find({
        isActive: true,
        category: category._id,
        slug: { $ne: product.slug },
      })
        .populate("category", "name slug")
        .populate("brand", "name slug tagline")
        .limit(limit);

      if (docs.length > 0) {
        return serializeDocuments(docs).map((doc) => mapProductDocument(doc));
      }
    }
    return [];
  } catch {
    return getStaticRelatedProducts(product, limit);
  }
}

export async function getPublicProductsByCategorySlug(slug: string): Promise<ProductType[]> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasCategories) {
    return staticProducts.filter(
      (product) =>
        product.categorySlug === slug ||
        product.category.toLowerCase().replace(/\s+/g, "-") === slug
    );
  }

  try {
    await connectDB();
    const category = await Category.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    }).select("_id");
    if (!category) return [];
    return fetchActiveProducts({ category: category._id });
  } catch {
    return staticProducts.filter(
      (product) =>
        product.categorySlug === slug ||
        product.category.toLowerCase().replace(/\s+/g, "-") === slug
    );
  }
}

export async function getPublicProductsByBrandSlug(slug: string): Promise<ProductType[]> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasBrands) {
    return staticProducts.filter(
      (product) =>
        product.brandSlug === slug ||
        product.brand.toLowerCase().replace(/\s+/g, "-") === slug
    );
  }

  try {
    await connectDB();
    const brand = await Brand.findOne({ slug: slug.toLowerCase(), isActive: true }).select("_id");
    if (!brand) return [];
    return fetchActiveProducts({ brand: brand._id });
  } catch {
    return staticProducts.filter(
      (product) =>
        product.brandSlug === slug ||
        product.brand.toLowerCase().replace(/\s+/g, "-") === slug
    );
  }
}

export async function getPublicCategories(): Promise<CategoryType[]> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasCategories) {
    return featuredCategories;
  }

  try {
    await connectDB();
    const docs = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    return serializeDocuments(docs).map((doc) => mapCategoryDocument(doc));
  } catch {
    return featuredCategories;
  }
}

export async function getPublicCategoryBySlug(slug: string) {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasCategories) {
    const fallback = featuredCategories.find((item) => item.slug === slug);
    if (!fallback) return null;
    return {
      name: fallback.name,
      slug: fallback.slug,
      description: fallback.description,
    };
  }

  try {
    await connectDB();
    const category = await Category.findOne({ slug: slug.toLowerCase(), isActive: true });
    if (!category) return null;

    return {
      name: category.name,
      slug: category.slug,
      description: category.description || `Shop ${category.name} at GlowCart Beauty.`,
      imageUrl: category.imageUrl,
    };
  } catch {
    const fallback = featuredCategories.find((item) => item.slug === slug);
    if (!fallback) return null;
    return {
      name: fallback.name,
      slug: fallback.slug,
      description: fallback.description,
    };
  }
}

export async function getPublicBrands(): Promise<BrandType[]> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasBrands) {
    return staticBrands;
  }

  try {
    await connectDB();
    const docs = await Brand.find({ isActive: true }).sort({ name: 1 });
    return serializeDocuments(docs).map((doc) => mapBrandDocument(doc));
  } catch {
    return staticBrands;
  }
}

export async function getPublicBrandBySlug(slug: string) {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasBrands) {
    const fallback = staticBrands.find((item) => item.slug === slug);
    if (!fallback) return null;
    return {
      name: fallback.name,
      slug: fallback.slug,
      description: fallback.tagline,
    };
  }

  try {
    await connectDB();
    const brand = await Brand.findOne({ slug: slug.toLowerCase(), isActive: true });
    if (!brand) return null;

    return {
      name: brand.name,
      slug: brand.slug,
      description: brand.tagline || `Discover ${brand.name} at GlowCart Beauty.`,
      imageUrl: brand.imageUrl,
    };
  } catch {
    const fallback = staticBrands.find((item) => item.slug === slug);
    if (!fallback) return null;
    return {
      name: fallback.name,
      slug: fallback.slug,
      description: fallback.tagline,
    };
  }
}

export async function getPublicTrendingProducts(): Promise<ProductType[]> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasProducts) {
    return staticTrendingProducts;
  }

  try {
    const all = await fetchActiveProducts();
    const trending = all.filter(
      (product) => product.badge === "Bestseller" || product.badge === "New"
    );
    return (trending.length > 0 ? trending : all).slice(0, 8);
  } catch {
    return staticTrendingProducts;
  }
}

export async function getPublicHeroContent(): Promise<HeroContent> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasHeroBanners) {
    return heroContent;
  }

  try {
    await connectDB();
    const banner = await Banner.findOne({ type: "hero", isActive: true }).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    if (banner && isActiveBanner(banner)) {
      const serialized = serializeBanner(banner);
      if (serialized) {
        return mapHeroBanner(serialized, heroContent.stats);
      }
    }
    return heroContent;
  } catch {
    return heroContent;
  }
}

export async function getPublicPromoContent(): Promise<Promotion> {
  const db = await getCatalogDbState();
  if (!db.connected || !db.hasPromoBanners) {
    return featuredPromotion;
  }

  try {
    await connectDB();
    const banner = await Banner.findOne({ type: "promo", isActive: true }).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    if (banner && isActiveBanner(banner)) {
      const serialized = serializeBanner(banner);
      if (serialized) {
        return mapPromoBanner(serialized);
      }
    }
    return featuredPromotion;
  } catch {
    return featuredPromotion;
  }
}

export function toCategoryOptions(categories: CategoryType[]) {
  return categories.map((category) => ({
    name: category.name,
    slug: category.slug,
  }));
}

export function toBrandOptions(brands: BrandType[]) {
  return brands.map((brand) => ({
    name: brand.name,
    slug: brand.slug,
  }));
}
