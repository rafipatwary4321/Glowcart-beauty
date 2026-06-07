import {
  adminBanners,
  adminBrands,
  adminCategories,
  adminCoupons,
  adminProducts,
} from "@/data/admin";
import type {
  AdminBannerRow,
  AdminBrandRow,
  AdminCategoryRow,
  AdminCouponRow,
  AdminProductRow,
} from "@/types/admin";

type PopulatedRef = { id?: string; name?: string; slug?: string; tagline?: string };

function asObject(value: unknown): PopulatedRef | null {
  return value && typeof value === "object" ? (value as PopulatedRef) : null;
}

export function mapApiProduct(item: Record<string, unknown>): AdminProductRow {
  const category = asObject(item.category);
  const brand = asObject(item.brand);

  return {
    id: String(item.id),
    name: String(item.name),
    slug: String(item.slug),
    sku: String(item.sku ?? `GC-${String(item.id).slice(-4).toUpperCase()}`),
    category: category?.name ?? String(item.category ?? ""),
    brand: brand?.name ?? String(item.brand ?? ""),
    price: Number(item.price),
    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
    stockCount: Number(item.stockCount ?? 0),
    inStock: Boolean(item.inStock),
    skinConcerns: Array.isArray(item.skinConcerns)
      ? item.skinConcerns.map(String)
      : [],
    badge: item.badge ? String(item.badge) : undefined,
    imageGradient: String(item.imageGradient ?? "from-rose-100 to-pink-50"),
    isActive: item.isActive !== false,
    updatedAt: String(item.updatedAt ?? item.createdAt ?? new Date().toISOString()),
    categoryId: category?.id,
    brandId: brand?.id,
  };
}

export function mapApiCategory(item: Record<string, unknown>): AdminCategoryRow {
  return {
    id: String(item.id),
    name: String(item.name),
    slug: String(item.slug),
    description: String(item.description ?? ""),
    productCount: Number(item.productCount ?? 0),
    imageGradient: String(item.imageGradient ?? "from-rose-100 to-pink-50"),
    isActive: item.isActive !== false,
  };
}

export function mapApiBrand(item: Record<string, unknown>): AdminBrandRow {
  return {
    id: String(item.id),
    name: String(item.name),
    slug: String(item.slug),
    tagline: String(item.tagline ?? ""),
    productCount: Number(item.productCount ?? 0),
    imageGradient: String(item.imageGradient ?? "from-beige-100 to-nude-100"),
    isActive: item.isActive !== false,
  };
}

export function mapApiBanner(item: Record<string, unknown>): AdminBannerRow {
  return {
    id: String(item.id),
    title: String(item.title),
    subtitle: item.subtitle ? String(item.subtitle) : undefined,
    type: item.type as AdminBannerRow["type"],
    ctaLabel: item.ctaLabel ? String(item.ctaLabel) : undefined,
    ctaHref: item.ctaHref ? String(item.ctaHref) : undefined,
    imageGradient: String(item.imageGradient ?? "from-rose-100 to-pink-50"),
    sortOrder: Number(item.sortOrder ?? 0),
    isActive: item.isActive !== false,
  };
}

export function mapApiCoupon(item: Record<string, unknown>): AdminCouponRow {
  return {
    id: String(item.id),
    code: String(item.code),
    description: String(item.description ?? ""),
    discountType: item.discountType as AdminCouponRow["discountType"],
    discountValue: Number(item.discountValue),
    minOrderAmount: Number(item.minOrderAmount ?? 0),
    usageCount: Number(item.usedCount ?? item.usageCount ?? 0),
    usageLimit: item.usageLimit ? Number(item.usageLimit) : undefined,
    expiresAt: item.expiresAt ? String(item.expiresAt).slice(0, 10) : undefined,
    isActive: item.isActive !== false,
  };
}

let fallbackProducts = [...adminProducts];
let fallbackCategories = [...adminCategories];
let fallbackBrands = [...adminBrands];
let fallbackBanners = [...adminBanners];
let fallbackCoupons = [...adminCoupons];

export function getFallbackProducts() {
  return [...fallbackProducts];
}

export function getFallbackCategories() {
  return [...fallbackCategories];
}

export function getFallbackBrands() {
  return [...fallbackBrands];
}

export function getFallbackBanners() {
  return [...fallbackBanners];
}

export function getFallbackCoupons() {
  return [...fallbackCoupons];
}

export function upsertFallbackProduct(product: AdminProductRow) {
  const index = fallbackProducts.findIndex((item) => item.id === product.id);
  if (index >= 0) fallbackProducts[index] = product;
  else fallbackProducts = [product, ...fallbackProducts];
  return product;
}

export function removeFallbackProduct(id: string) {
  fallbackProducts = fallbackProducts.filter((item) => item.id !== id);
}

export function upsertFallbackCategory(category: AdminCategoryRow) {
  const index = fallbackCategories.findIndex((item) => item.id === category.id);
  if (index >= 0) fallbackCategories[index] = category;
  else fallbackCategories = [category, ...fallbackCategories];
  return category;
}

export function removeFallbackCategory(id: string) {
  fallbackCategories = fallbackCategories.filter((item) => item.id !== id);
}

export function upsertFallbackBrand(brand: AdminBrandRow) {
  const index = fallbackBrands.findIndex((item) => item.id === brand.id);
  if (index >= 0) fallbackBrands[index] = brand;
  else fallbackBrands = [brand, ...fallbackBrands];
  return brand;
}

export function removeFallbackBrand(id: string) {
  fallbackBrands = fallbackBrands.filter((item) => item.id !== id);
}

export function upsertFallbackBanner(banner: AdminBannerRow) {
  const index = fallbackBanners.findIndex((item) => item.id === banner.id);
  if (index >= 0) fallbackBanners[index] = banner;
  else fallbackBanners = [banner, ...fallbackBanners];
  return banner;
}

export function removeFallbackBanner(id: string) {
  fallbackBanners = fallbackBanners.filter((item) => item.id !== id);
}

export function upsertFallbackCoupon(coupon: AdminCouponRow) {
  const index = fallbackCoupons.findIndex((item) => item.id === coupon.id);
  if (index >= 0) fallbackCoupons[index] = coupon;
  else fallbackCoupons = [coupon, ...fallbackCoupons];
  return coupon;
}

export function removeFallbackCoupon(id: string) {
  fallbackCoupons = fallbackCoupons.filter((item) => item.id !== id);
}

export function getFallbackProductById(id: string) {
  return fallbackProducts.find((item) => item.id === id);
}
