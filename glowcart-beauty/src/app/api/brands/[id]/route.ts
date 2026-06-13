import { ApiRouteError, apiSuccess, serializeDocument, serializeDocuments, withDb } from "@/lib/api";
export const runtime = "nodejs";
import { isValidObjectId } from "@/lib/db";
import { mapProductDocument } from "@/lib/catalog/mappers";
import { Brand, Product } from "@/models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getQuery(id: string, publicOnly: boolean) {
  const base = isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
  return publicOnly ? { ...base, isActive: true } : base;
}

export const GET = withDb(async (request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";
  const includeProducts = searchParams.get("include") === "products";

  const brand = await Brand.findOne(getQuery(id, !isAdmin));

  if (!brand) {
    throw new ApiRouteError("Brand not found.", 404);
  }

  const payload: Record<string, unknown> = {
    ...serializeDocument(brand),
  };

  if (includeProducts) {
    const products = await Product.find({ brand: brand._id, isActive: true })
      .populate("category", "name slug")
      .populate("brand", "name slug tagline")
      .sort({ createdAt: -1 });
    payload.products = serializeDocuments(products).map((doc) => mapProductDocument(doc));
  }

  return apiSuccess(payload);
});

export const PUT = withDb(async (request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const body = (await request.json()) as Record<string, unknown>;

  const brand = await Brand.findOneAndUpdate(getQuery(id, false), body, {
    new: true,
    runValidators: true,
  });

  if (!brand) {
    throw new ApiRouteError("Brand not found.", 404);
  }

  return apiSuccess(serializeDocument(brand), { message: "Brand updated." });
});

export const DELETE = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;

  const brand = await Brand.findOneAndUpdate(
    getQuery(id, false),
    { isActive: false },
    { new: true }
  );

  if (!brand) {
    throw new ApiRouteError("Brand not found.", 404);
  }

  return apiSuccess({ id: brand._id.toString() }, { message: "Brand archived." });
});
