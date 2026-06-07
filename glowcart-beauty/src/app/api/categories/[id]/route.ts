import { ApiRouteError, apiSuccess, serializeDocument, withDb } from "@/lib/api";
export const runtime = "nodejs";
import { isValidObjectId } from "@/lib/db";
import { Category } from "@/models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getQuery(id: string) {
  return isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
}

export const GET = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const category = await Category.findOne(getQuery(id));

  if (!category) {
    throw new ApiRouteError("Category not found.", 404);
  }

  return apiSuccess(serializeDocument(category));
});

export const PUT = withDb(async (request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const body = (await request.json()) as Record<string, unknown>;

  const category = await Category.findOneAndUpdate(getQuery(id), body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new ApiRouteError("Category not found.", 404);
  }

  return apiSuccess(serializeDocument(category), { message: "Category updated." });
});

export const DELETE = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;

  const category = await Category.findOneAndUpdate(
    getQuery(id),
    { isActive: false },
    { new: true }
  );

  if (!category) {
    throw new ApiRouteError("Category not found.", 404);
  }

  return apiSuccess({ id: category._id.toString() }, { message: "Category archived." });
});
