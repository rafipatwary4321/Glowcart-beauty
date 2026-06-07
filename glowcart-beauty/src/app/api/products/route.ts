import type { QueryFilter, SortOrder } from "mongoose";

import { ApiRouteError, apiSuccess, serializeDocuments, withDb } from "@/lib/api";
import { buildPaginationMeta, parsePagination } from "@/lib/api/pagination";
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

export const GET = withDb(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams);

  const filter: QueryFilter<ProductDocument> = { isActive: true };

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
    if (!body[field]) {
      throw new ApiRouteError(`Missing required field: ${field}`, 400);
    }
  }

  const product = await Product.create(body);

  return apiSuccess(product, {
    status: 201,
    message: "Product created.",
  });
});
