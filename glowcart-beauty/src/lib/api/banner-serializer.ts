import type { Document, Types } from "mongoose";

const BANNER_TYPES = ["hero", "promo", "announcement"] as const;

export type SerializedBanner = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  type: (typeof BANNER_TYPES)[number];
  imageUrl?: string;
  imageGradient: string;
  ctaLabel?: string;
  ctaHref?: string;
  badge?: string;
  sortOrder: number;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

type BannerLike = Record<string, unknown> & {
  _id?: Types.ObjectId | string;
  id?: string;
};

function normalizeBannerType(value: unknown): SerializedBanner["type"] {
  const type = String(value ?? "promo");
  return BANNER_TYPES.includes(type as SerializedBanner["type"])
    ? (type as SerializedBanner["type"])
    : "promo";
}

function toIsoString(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function toPlainBanner(doc: BannerLike | Document | null): BannerLike | null {
  if (!doc) return null;

  if (typeof (doc as Document).toObject === "function") {
    return (doc as Document).toObject({ virtuals: true }) as BannerLike;
  }

  return doc as BannerLike;
}

export function serializeBanner(doc: BannerLike | Document | null): SerializedBanner | null {
  const plain = toPlainBanner(doc);
  if (!plain) return null;

  const id = plain._id ? String(plain._id) : plain.id ? String(plain.id) : "";
  if (!id) return null;

  return {
    id,
    title: String(plain.title ?? ""),
    subtitle: plain.subtitle ? String(plain.subtitle) : undefined,
    description: String(plain.description ?? ""),
    type: normalizeBannerType(plain.type),
    imageUrl: plain.imageUrl ? String(plain.imageUrl) : undefined,
    imageGradient: String(plain.imageGradient ?? "from-rose-100 to-pink-50"),
    ctaLabel: plain.ctaLabel ? String(plain.ctaLabel) : undefined,
    ctaHref: plain.ctaHref ? String(plain.ctaHref) : undefined,
    badge: plain.badge ? String(plain.badge) : undefined,
    sortOrder: Number(plain.sortOrder ?? 0),
    isActive: plain.isActive !== false,
    startsAt: toIsoString(plain.startsAt),
    expiresAt: toIsoString(plain.expiresAt),
    createdAt: toIsoString(plain.createdAt),
    updatedAt: toIsoString(plain.updatedAt),
  };
}

export function serializeBanners(docs: Array<BannerLike | Document>): SerializedBanner[] {
  return docs
    .map((doc) => serializeBanner(doc))
    .filter((banner): banner is SerializedBanner => banner !== null);
}

export function isBannerActive(banner: SerializedBanner, now = new Date()): boolean {
  if (!banner.isActive) return false;
  if (banner.startsAt && new Date(banner.startsAt) > now) return false;
  if (banner.expiresAt && new Date(banner.expiresAt) < now) return false;
  return true;
}
