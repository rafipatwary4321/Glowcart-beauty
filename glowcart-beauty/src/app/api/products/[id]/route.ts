import { ApiRouteError, apiSuccess, serializeDocument, withDb } from "@/lib/api";
import { isValidObjectId } from "@/lib/db";
import { Product } from "@/models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function findProductByIdOrSlug(id: string) {
  const query = isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };

  return Product.findOne({ ...query, isActive: true })
    .populate("category", "name slug description imageGradient")
    .populate("brand", "name slug tagline imageGradient");
}

export const GET = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const product = await findProductByIdOrSlug(id);

  if (!product) {
    throw new ApiRouteError("Product not found.", 404);
  }

  return apiSuccess(serializeDocument(product));
});

export const PUT = withDb(async (request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const body = (await request.json()) as Record<string, unknown>;

  const query = isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
  const product = await Product.findOneAndUpdate(query, body, {
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
