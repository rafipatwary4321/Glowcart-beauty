import type { Brand } from "@/types/brand";
import type { HeroContent, Promotion } from "@/types/homepage";
import type { Product, ProductBadge } from "@/types/product";
import type { Category } from "@/types/product";

type PopulatedRef = {
  _id?: { toString(): string };
  id?: string;
  name?: string;
  slug?: string;
  tagline?: string;
  description?: string;
  imageGradient?: string;
};

function asPopulatedRef(value: unknown): PopulatedRef | null {
  if (!value || typeof value !== "object") return null;
  return value as PopulatedRef;
}

function validBadge(value: unknown): ProductBadge | undefined {
  if (value === "Bestseller" || value === "New" || value === "Sale") return value;
  return undefined;
}

export function mapProductDocument(doc: Record<string, unknown>): Product {
  const category = asPopulatedRef(doc.category);
  const brand = asPopulatedRef(doc.brand);
  const id = String(doc.id ?? doc._id);
  const imageGradient = String(doc.imageGradient ?? "from-rose-100 to-pink-50");
  const images = Array.isArray(doc.images)
    ? doc.images.map(String).filter(Boolean)
    : [];

  return {
    id,
    name: String(doc.name),
    slug: String(doc.slug),
    price: Number(doc.price),
    originalPrice: doc.originalPrice ? Number(doc.originalPrice) : undefined,
    category: category?.name ?? "Uncategorized",
    categorySlug: category?.slug ?? "",
    brand: brand?.name ?? "Unknown",
    brandSlug: brand?.slug ?? "",
    skinConcerns: Array.isArray(doc.skinConcerns) ? doc.skinConcerns.map(String) : [],
    rating: Number(doc.rating ?? 0),
    reviewCount: Number(doc.reviewCount ?? 0),
    badge: validBadge(doc.badge),
    imageGradient,
    images: images.length > 0 ? images : [imageGradient],
    inStock: doc.inStock !== false,
    stockCount: Number(doc.stockCount ?? doc.stock ?? 0),
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
    description: String(doc.description ?? ""),
    ingredients: String(doc.ingredients ?? ""),
    howToUse: String(doc.howToUse ?? ""),
  };
}

export function mapCategoryDocument(doc: Record<string, unknown>): Category {
  return {
    id: String(doc.id ?? doc._id),
    name: String(doc.name),
    slug: String(doc.slug),
    productCount: Number(doc.productCount ?? 0),
    imageGradient: String(doc.imageGradient ?? "from-rose-100 to-pink-50"),
    description: String(doc.description ?? ""),
  };
}

export function mapBrandDocument(doc: Record<string, unknown>): Brand {
  return {
    id: String(doc.id ?? doc._id),
    name: String(doc.name),
    slug: String(doc.slug),
    productCount: Number(doc.productCount ?? 0),
    imageGradient: String(doc.imageGradient ?? "from-beige-100 to-nude-100"),
    tagline: String(doc.tagline ?? ""),
  };
}

export function mapHeroBanner(
  banner: Record<string, unknown>,
  fallbackStats: HeroContent["stats"]
): HeroContent {
  const title = String(banner.title ?? "");
  const parts = title.split(/\s+/);
  const splitAt = Math.max(1, Math.ceil(parts.length / 2));
  const titleMain = parts.slice(0, splitAt).join(" ");
  const titleAccent = parts.slice(splitAt).join(" ") || String(banner.subtitle ?? "");

  return {
    badge: String(banner.badge ?? banner.subtitle ?? "Featured"),
    title: titleMain,
    titleAccent,
    description: String(
      banner.description ??
        "Premium skincare, makeup, and fragrances — thoughtfully curated for skin that glows."
    ),
    primaryCta: {
      label: String(banner.ctaLabel ?? "Shop Collection"),
      href: String(banner.ctaHref ?? "/products"),
    },
    secondaryCta: {
      label: "Skincare Essentials",
      href: "/products?category=skincare",
    },
    stats: fallbackStats,
    featured: {
      eyebrow: String(banner.badge ?? "Featured"),
      title: title,
      description: String(banner.subtitle ?? banner.description ?? ""),
    },
  };
}

export function mapPromoBanner(banner: Record<string, unknown>): Promotion {
  return {
    id: String(banner.id ?? banner._id),
    eyebrow: String(banner.badge ?? banner.subtitle ?? "Limited Offer"),
    title: String(banner.title),
    description: String(banner.description ?? banner.subtitle ?? ""),
    ctaLabel: String(banner.ctaLabel ?? "Shop Now"),
    ctaHref: String(banner.ctaHref ?? "/products"),
  };
}
