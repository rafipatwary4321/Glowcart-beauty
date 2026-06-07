import { ApiRouteError, apiSuccess, serializeDocument, withDb } from "@/lib/api";
import { isValidObjectId } from "@/lib/db";
import { Brand, Category, Product } from "@/models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function resolveCategoryRef(value: unknown): Promise<string | undefined> {
  if (value === undefined) return undefined;
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

async function resolveBrandRef(value: unknown): Promise<string | undefined> {
  if (value === undefined) return undefined;
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

function parseSkinConcerns(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

async function findProductByIdOrSlug(id: string, includeInactive = false) {
  const query = isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };

  if (!includeInactive) {
    return Product.findOne({ ...query, isActive: true })
      .populate("category", "name slug description imageGradient")
      .populate("brand", "name slug tagline imageGradient");
  }

  return Product.findOne(query)
    .populate("category", "name slug description imageGradient")
    .populate("brand", "name slug tagline imageGradient");
}

export const GET = withDb(async (request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const isAdmin = new URL(request.url).searchParams.get("admin") === "true";
  const product = await findProductByIdOrSlug(id, isAdmin);

  if (!product) {
    throw new ApiRouteError("Product not found.", 404);
  }

  return apiSuccess(serializeDocument(product));
});

export const PUT = withDb(async (request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const body = (await request.json()) as Record<string, unknown>;

  const update: Record<string, unknown> = { ...body };

  if (body.category !== undefined) {
    update.category = await resolveCategoryRef(body.category);
  }
  if (body.brand !== undefined) {
    update.brand = await resolveBrandRef(body.brand);
  }
  if (body.skinConcerns !== undefined) {
    update.skinConcerns = parseSkinConcerns(body.skinConcerns);
  }
  if (body.slug !== undefined) {
    update.slug = String(body.slug).toLowerCase();
  }
  if (body.price !== undefined) update.price = Number(body.price);
  if (body.originalPrice !== undefined) {
    update.originalPrice = body.originalPrice ? Number(body.originalPrice) : undefined;
  }
  if (body.stockCount !== undefined) update.stockCount = Number(body.stockCount);

  const query = isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
  const product = await Product.findOneAndUpdate(query, update, {
    new: true,
    runValidators: true,
  })
    .populate("category", "name slug")
    .populate("brand", "name slug");

  if (!product) {
    throw new ApiRouteError("Product not found.", 404);
  }

  return apiSuccess(serializeDocument(product), { message: "Product updated." });
});

export const DELETE = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;

  const query = isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
  const product = await Product.findOneAndUpdate(
    query,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new ApiRouteError("Product not found.", 404);
  }

  return apiSuccess({ id: product._id.toString() }, { message: "Product archived." });
});
