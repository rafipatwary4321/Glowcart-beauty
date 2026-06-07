import type { QueryFilter, SortOrder } from "mongoose";

import { ApiRouteError, apiSuccess, serializeDocument, serializeDocuments, withDb } from "@/lib/api";

export const runtime = "nodejs";

import { buildPaginationMeta, parsePagination } from "@/lib/api/pagination";
import { isValidObjectId } from "@/lib/db";
import { Brand, Category, Product } from "@/models";
import type { ProductDocument } from "@/models/Product";

function parseProductSort(sort: string | null): Record<string, SortOrder> {
  switch (sort) {
    case "price-asc":
      return { price: 1 };
    case "price-desc":
      return { price: -1 };
    case "discount":
      return { originalPrice: -1, price: 1 };
    case "latest":
    default:
      return { createdAt: -1 };
  }
}

async function resolveCategoryId(slug: string | null): Promise<string | null> {
  if (!slug) return null;
  const category = await Category.findOne({ slug, isActive: true }).select("_id").lean();
  if (!category) {
    throw new ApiRouteError(`Category "${slug}" not found.`, 404);
  }
  return category._id.toString();
}

async function resolveBrandId(slug: string | null): Promise<string | null> {
  if (!slug) return null;
  const brand = await Brand.findOne({ slug, isActive: true }).select("_id").lean();
  if (!brand) {
    throw new ApiRouteError(`Brand "${slug}" not found.`, 404);
  }
  return brand._id.toString();
}

async function resolveCategoryRef(value: unknown): Promise<string> {
  const raw = String(value);

  if (isValidObjectId(raw)) {
    const doc = await Category.findById(raw).select("_id").lean();
    if (!doc) throw new ApiRouteError("Category not found.", 404);
    return doc._id.toString();
  }

  const bySlug = await Category.findOne({ slug: raw.toLowerCase() }).select("_id").lean();
  if (bySlug) return bySlug._id.toString();

  const byName = await Category.findOne({ name: new RegExp(`^${raw}$`, "i") }).select("_id").lean();
  if (byName) return byName._id.toString();

  throw new ApiRouteError("Category not found.", 404);
}

async function resolveBrandRef(value: unknown): Promise<string> {
  const raw = String(value);

  if (isValidObjectId(raw)) {
    const doc = await Brand.findById(raw).select("_id").lean();
    if (!doc) throw new ApiRouteError("Brand not found.", 404);
    return doc._id.toString();
  }

  const bySlug = await Brand.findOne({ slug: raw.toLowerCase() }).select("_id").lean();
  if (bySlug) return bySlug._id.toString();

  const byName = await Brand.findOne({ name: new RegExp(`^${raw}$`, "i") }).select("_id").lean();
  if (byName) return byName._id.toString();

  throw new ApiRouteError("Brand not found.", 404);
}

function parseSkinConcerns(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export const GET = withDb(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";
  const pagination = parsePagination(searchParams, { limit: isAdmin ? 100 : 20 });

  const filter: QueryFilter<ProductDocument> = {};
  if (!isAdmin) filter.isActive = true;

  const categoryId = await resolveCategoryId(searchParams.get("category"));
  if (categoryId) filter.category = categoryId;

  const brandId = await resolveBrandId(searchParams.get("brand"));
  if (brandId) filter.brand = brandId;

  const skinConcern = searchParams.get("skinConcern");
  if (skinConcern) filter.skinConcerns = skinConcern;

  const search = searchParams.get("search")?.trim();
  if (search) filter.$text = { $search: search };

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const inStock = searchParams.get("inStock");
  if (inStock === "true") filter.inStock = true;

  const sort = parseProductSort(searchParams.get("sort"));

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("brand", "name slug tagline")
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit),
    Product.countDocuments(filter),
  ]);

  return apiSuccess({
    items: serializeDocuments(products),
    pagination: buildPaginationMeta(total, pagination),
  });
});

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as Record<string, unknown>;

  const required = ["name", "slug", "price", "category", "brand"] as const;
  for (const field of required) {
    if (body[field] === undefined || body[field] === "") {
      throw new ApiRouteError(`Missing required field: ${field}`, 400);
    }
  }

  const categoryId = await resolveCategoryRef(body.category);
  const brandId = await resolveBrandRef(body.brand);

  const badge = body.badge ? String(body.badge) : undefined;
  const validBadge =
    badge === "Bestseller" || badge === "New" || badge === "Sale" ? badge : undefined;

  const product = await Product.create({
    name: String(body.name),
    slug: String(body.slug).toLowerCase(),
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    category: categoryId,
    brand: brandId,
    skinConcerns: parseSkinConcerns(body.skinConcerns),
    badge: validBadge,
    imageGradient: body.imageGradient ? String(body.imageGradient) : "from-rose-100 to-pink-50",
    images: Array.isArray(body.images) ? body.images.map(String) : [],
    inStock: body.inStock !== false,
    stockCount: Number(body.stockCount ?? 0),
    description: body.description ? String(body.description) : "",
    ingredients: body.ingredients ? String(body.ingredients) : "",
    howToUse: body.howToUse ? String(body.howToUse) : "",
    isActive: body.isActive !== false,
  });

  const populated = await Product.findById(product._id)
    .populate("category", "name slug")
    .populate("brand", "name slug");

  return apiSuccess(serializeDocument(populated!), {
    status: 201,
    message: "Product created.",
  });
});
