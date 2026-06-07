import { adminGet, adminMutate } from "@/lib/admin/api-client";
import {
  getFallbackBanners,
  getFallbackBrands,
  getFallbackCategories,
  getFallbackCoupons,
  getFallbackProductById,
  getFallbackProducts,
  mapApiBanner,
  mapApiBrand,
  mapApiCategory,
  mapApiCoupon,
  mapApiProduct,
  removeFallbackBanner,
  removeFallbackBrand,
  removeFallbackCategory,
  removeFallbackCoupon,
  removeFallbackProduct,
  upsertFallbackBanner,
  upsertFallbackBrand,
  upsertFallbackCategory,
  upsertFallbackCoupon,
  upsertFallbackProduct,
} from "@/lib/admin/mappers";
import type {
  BannerFormValues,
  BrandFormValues,
  CategoryFormValues,
  CouponFormValues,
  ProductFormValues,
} from "@/lib/admin/schemas";
import type {
  AdminBannerRow,
  AdminBrandRow,
  AdminCategoryRow,
  AdminCouponRow,
  AdminProductRow,
} from "@/types/admin";

const ADMIN_QUERY = "?admin=true";

export async function fetchAdminProducts() {
  const result = await adminGet<{ items: Record<string, unknown>[] }>(
    `/api/products${ADMIN_QUERY}&limit=100`,
    () => ({ items: getFallbackProducts() as unknown as Record<string, unknown>[] })
  );

  return {
    ...result,
    data: result.data.items.map(mapApiProduct),
  };
}

export async function fetchAdminProduct(id: string) {
  try {
    const response = await fetch(`/api/products/${id}?admin=true`, { cache: "no-store" });
    const json = await response.json();

    if (response.ok && json.success) {
      return { data: mapApiProduct(json.data as Record<string, unknown>), source: "api" as const };
    }
  } catch {
    // fall through to fallback
  }

  const product = getFallbackProductById(id);
  if (!product) {
    throw new Error("Product not found.");
  }

  return { data: product, source: "fallback" as const };
}

export async function createAdminProduct(values: ProductFormValues) {
  const payload = {
    ...values,
    originalPrice: values.originalPrice === "" ? undefined : values.originalPrice,
    badge: values.badge || undefined,
    skinConcerns: values.skinConcerns,
    imageGradient: values.imageGradient ?? "from-rose-100 to-pink-50",
  };

  return adminMutate<Record<string, unknown>>(
    "/api/products",
    { method: "POST", body: JSON.stringify(payload) },
    () => {
      const created = upsertFallbackProduct({
        id: `p_${Date.now()}`,
        name: values.name,
        slug: values.slug,
        sku: `GC-${Date.now()}`,
        category: values.category,
        brand: values.brand,
        price: values.price,
        originalPrice:
          values.originalPrice === "" ? undefined : Number(values.originalPrice),
        stockCount: values.stockCount,
        inStock: values.inStock,
        skinConcerns: values.skinConcerns?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
        badge: values.badge || undefined,
        imageGradient: values.imageGradient ?? "from-rose-100 to-pink-50",
        isActive: values.isActive,
        updatedAt: new Date().toISOString(),
        categoryId: values.category,
        brandId: values.brand,
      });
      return created as unknown as Record<string, unknown>;
    }
  );
}

export async function updateAdminProduct(id: string, values: ProductFormValues) {
  const payload = {
    ...values,
    originalPrice: values.originalPrice === "" ? undefined : values.originalPrice,
    badge: values.badge || undefined,
  };

  return adminMutate<Record<string, unknown>>(
    `/api/products/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
    () => {
      const existing = getFallbackProductById(id);
      const updated = upsertFallbackProduct({
        ...(existing ?? {
          id,
          sku: `GC-${id.toUpperCase()}`,
          category: values.category,
          brand: values.brand,
          skinConcerns: [],
          imageGradient: "from-rose-100 to-pink-50",
          updatedAt: new Date().toISOString(),
        }),
        name: values.name,
        slug: values.slug,
        price: values.price,
        originalPrice:
          values.originalPrice === "" ? undefined : Number(values.originalPrice),
        stockCount: values.stockCount,
        inStock: values.inStock,
        isActive: values.isActive,
      });
      return updated as unknown as Record<string, unknown>;
    }
  );
}

export async function deleteAdminProduct(id: string) {
  return adminMutate<{ id: string }>(
    `/api/products/${id}`,
    { method: "DELETE" },
    () => {
      removeFallbackProduct(id);
      return { id };
    }
  );
}

export async function fetchAdminCategories() {
  const result = await adminGet<Record<string, unknown>[]>(
    `/api/categories${ADMIN_QUERY}`,
    () => getFallbackCategories() as unknown as Record<string, unknown>[]
  );
  return { ...result, data: result.data.map(mapApiCategory) };
}

export async function createAdminCategory(values: CategoryFormValues) {
  return adminMutate<Record<string, unknown>>(
    "/api/categories",
    { method: "POST", body: JSON.stringify(values) },
    () =>
      upsertFallbackCategory({
        id: `cat_${Date.now()}`,
        name: values.name,
        slug: values.slug,
        description: values.description ?? "",
        productCount: 0,
        imageGradient: values.imageGradient ?? "from-rose-100 to-pink-50",
        isActive: values.isActive,
      }) as unknown as Record<string, unknown>
  );
}

export async function updateAdminCategory(id: string, values: CategoryFormValues) {
  return adminMutate<Record<string, unknown>>(
    `/api/categories/${id}`,
    { method: "PUT", body: JSON.stringify(values) },
    () =>
      upsertFallbackCategory({
        id,
        name: values.name,
        slug: values.slug,
        description: values.description ?? "",
        productCount: 0,
        imageGradient: values.imageGradient ?? "from-rose-100 to-pink-50",
        isActive: values.isActive,
      }) as unknown as Record<string, unknown>
  );
}

export async function deleteAdminCategory(id: string) {
  return adminMutate<{ id: string }>(
    `/api/categories/${id}`,
    { method: "DELETE" },
    () => {
      removeFallbackCategory(id);
      return { id };
    }
  );
}

export async function fetchAdminBrands() {
  const result = await adminGet<Record<string, unknown>[]>(
    `/api/brands${ADMIN_QUERY}`,
    () => getFallbackBrands() as unknown as Record<string, unknown>[]
  );
  return { ...result, data: result.data.map(mapApiBrand) };
}

export async function createAdminBrand(values: BrandFormValues) {
  return adminMutate<Record<string, unknown>>(
    "/api/brands",
    { method: "POST", body: JSON.stringify(values) },
    () =>
      upsertFallbackBrand({
        id: `brand_${Date.now()}`,
        name: values.name,
        slug: values.slug,
        tagline: values.tagline ?? "",
        productCount: 0,
        imageGradient: values.imageGradient ?? "from-beige-100 to-nude-100",
        isActive: values.isActive,
      }) as unknown as Record<string, unknown>
  );
}

export async function updateAdminBrand(id: string, values: BrandFormValues) {
  return adminMutate<Record<string, unknown>>(
    `/api/brands/${id}`,
    { method: "PUT", body: JSON.stringify(values) },
    () =>
      upsertFallbackBrand({
        id,
        name: values.name,
        slug: values.slug,
        tagline: values.tagline ?? "",
        productCount: 0,
        imageGradient: values.imageGradient ?? "from-beige-100 to-nude-100",
        isActive: values.isActive,
      }) as unknown as Record<string, unknown>
  );
}

export async function deleteAdminBrand(id: string) {
  return adminMutate<{ id: string }>(
    `/api/brands/${id}`,
    { method: "DELETE" },
    () => {
      removeFallbackBrand(id);
      return { id };
    }
  );
}

export async function fetchAdminBanners() {
  const result = await adminGet<Record<string, unknown>[]>(
    `/api/banners${ADMIN_QUERY}`,
    () => getFallbackBanners() as unknown as Record<string, unknown>[]
  );
  return { ...result, data: result.data.map(mapApiBanner) };
}

export async function createAdminBanner(values: BannerFormValues) {
  return adminMutate<Record<string, unknown>>(
    "/api/banners",
    { method: "POST", body: JSON.stringify(values) },
    () =>
      upsertFallbackBanner({
        id: `banner_${Date.now()}`,
        title: values.title,
        subtitle: values.subtitle,
        type: values.type,
        ctaLabel: values.ctaLabel,
        ctaHref: values.ctaHref,
        imageGradient: values.imageGradient ?? "from-rose-100 to-pink-50",
        sortOrder: values.sortOrder ?? 0,
        isActive: values.isActive,
      }) as unknown as Record<string, unknown>
  );
}

export async function updateAdminBanner(id: string, values: BannerFormValues) {
  return adminMutate<Record<string, unknown>>(
    `/api/banners/${id}`,
    { method: "PUT", body: JSON.stringify(values) },
    () =>
      upsertFallbackBanner({
        id,
        title: values.title,
        subtitle: values.subtitle,
        type: values.type,
        ctaLabel: values.ctaLabel,
        ctaHref: values.ctaHref,
        imageGradient: values.imageGradient ?? "from-rose-100 to-pink-50",
        sortOrder: values.sortOrder ?? 0,
        isActive: values.isActive,
      }) as unknown as Record<string, unknown>
  );
}

export async function deleteAdminBanner(id: string) {
  return adminMutate<{ id: string }>(
    `/api/banners/${id}`,
    { method: "DELETE" },
    () => {
      removeFallbackBanner(id);
      return { id };
    }
  );
}

export async function fetchAdminCoupons() {
  const result = await adminGet<Record<string, unknown>[]>(
    `/api/coupons${ADMIN_QUERY}`,
    () => getFallbackCoupons() as unknown as Record<string, unknown>[]
  );
  return { ...result, data: result.data.map(mapApiCoupon) };
}

export async function createAdminCoupon(values: CouponFormValues) {
  return adminMutate<Record<string, unknown>>(
    "/api/coupons",
    {
      method: "POST",
      body: JSON.stringify({
        ...values,
        code: values.code.toUpperCase(),
        expiresAt: values.expiresAt || undefined,
      }),
    },
    () =>
      upsertFallbackCoupon({
        id: `coupon_${Date.now()}`,
        code: values.code.toUpperCase(),
        description: values.description ?? "",
        discountType: values.discountType,
        discountValue: values.discountValue,
        minOrderAmount: values.minOrderAmount ?? 0,
        usageCount: 0,
        usageLimit: values.usageLimit,
        expiresAt: values.expiresAt,
        isActive: values.isActive,
      }) as unknown as Record<string, unknown>
  );
}

export async function updateAdminCoupon(id: string, values: CouponFormValues) {
  return adminMutate<Record<string, unknown>>(
    `/api/coupons/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        ...values,
        code: values.code.toUpperCase(),
        expiresAt: values.expiresAt || undefined,
      }),
    },
    () =>
      upsertFallbackCoupon({
        id,
        code: values.code.toUpperCase(),
        description: values.description ?? "",
        discountType: values.discountType,
        discountValue: values.discountValue,
        minOrderAmount: values.minOrderAmount ?? 0,
        usageCount: 0,
        usageLimit: values.usageLimit,
        expiresAt: values.expiresAt,
        isActive: values.isActive,
      }) as unknown as Record<string, unknown>
  );
}

export async function deleteAdminCoupon(id: string) {
  return adminMutate<{ id: string }>(
    `/api/coupons/${id}`,
    { method: "DELETE" },
    () => {
      removeFallbackCoupon(id);
      return { id };
    }
  );
}

export type {
  AdminProductRow,
  AdminCategoryRow,
  AdminBrandRow,
  AdminBannerRow,
  AdminCouponRow,
};
