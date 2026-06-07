import { ApiRouteError, apiSuccess, serializeDocument, withDb } from "@/lib/api";
export const runtime = "nodejs";
import { isValidObjectId } from "@/lib/db";
import { Brand } from "@/models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getQuery(id: string) {
  return isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
}

export const GET = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const brand = await Brand.findOne(getQuery(id));

  if (!brand) {
    throw new ApiRouteError("Brand not found.", 404);
  }

  return apiSuccess(serializeDocument(brand));
});

export const PUT = withDb(async (request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const body = (await request.json()) as Record<string, unknown>;

  const brand = await Brand.findOneAndUpdate(getQuery(id), body, {
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
    getQuery(id),
    { isActive: false },
    { new: true }
  );

  if (!brand) {
    throw new ApiRouteError("Brand not found.", 404);
  }

  return apiSuccess({ id: brand._id.toString() }, { message: "Brand archived." });
});
