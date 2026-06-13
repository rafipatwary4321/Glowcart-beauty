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
  _id?: Types.ObjectId | string | { toString(): string };
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
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

function toIdString(value: unknown): string {
  if (value == null) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const objectValue = value as {
      toHexString?: () => string;
      toString?: () => string;
    };

    if (typeof objectValue.toHexString === "function") {
      return objectValue.toHexString();
    }

    if (typeof objectValue.toString === "function") {
      const asString = objectValue.toString();
      if (asString && asString !== "[object Object]") {
        return asString;
      }
    }
  }

  return String(value);
}

function toOptionalString(value: unknown): string | undefined {
  if (value == null) return undefined;
  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toPlainBanner(doc: BannerLike | Document | null): BannerLike | null {
  if (!doc) return null;

  if (typeof (doc as Document).toObject === "function") {
    return (doc as Document).toObject({ virtuals: true }) as BannerLike;
  }

  return doc as BannerLike;
}

export function serializeBanner(doc: BannerLike | Document | null): SerializedBanner | null {
  try {
    const plain = toPlainBanner(doc);
    if (!plain) return null;

    const id = toIdString(plain._id ?? plain.id);
    if (!id) return null;

    return {
      id,
      title: String(plain.title ?? ""),
      subtitle: toOptionalString(plain.subtitle),
      description: String(plain.description ?? ""),
      type: normalizeBannerType(plain.type),
      imageUrl: toOptionalString(plain.imageUrl),
      imageGradient: String(plain.imageGradient ?? "from-rose-100 to-pink-50"),
      ctaLabel: toOptionalString(plain.ctaLabel),
      ctaHref: toOptionalString(plain.ctaHref),
      badge: toOptionalString(plain.badge),
      sortOrder: toNumber(plain.sortOrder, 0),
      isActive: plain.isActive !== false,
      startsAt: toIsoString(plain.startsAt),
      expiresAt: toIsoString(plain.expiresAt),
      createdAt: toIsoString(plain.createdAt),
      updatedAt: toIsoString(plain.updatedAt),
    };
  } catch {
    return null;
  }
}

export function serializeBanners(docs: Array<BannerLike | Document> | null | undefined): SerializedBanner[] {
  if (!Array.isArray(docs) || docs.length === 0) {
    return [];
  }

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
