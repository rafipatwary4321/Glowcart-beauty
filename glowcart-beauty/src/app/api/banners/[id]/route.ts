import { ApiRouteError, apiSuccess, serializeDocument, withDb } from "@/lib/api";
export const runtime = "nodejs";
import { isValidObjectId } from "@/lib/db";
import { Banner } from "@/models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;

  if (!isValidObjectId(id)) {
    throw new ApiRouteError("Invalid banner id.", 400);
  }

  const banner = await Banner.findById(id);

  if (!banner) {
    throw new ApiRouteError("Banner not found.", 404);
  }

  return apiSuccess(serializeDocument(banner));
});

export const PUT = withDb(async (request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const body = (await request.json()) as Record<string, unknown>;

  if (!isValidObjectId(id)) {
    throw new ApiRouteError("Invalid banner id.", 400);
  }

  const banner = await Banner.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!banner) {
    throw new ApiRouteError("Banner not found.", 404);
  }

  return apiSuccess(serializeDocument(banner), { message: "Banner updated." });
});

export const DELETE = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;

  if (!isValidObjectId(id)) {
    throw new ApiRouteError("Invalid banner id.", 400);
  }

  const banner = await Banner.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!banner) {
    throw new ApiRouteError("Banner not found.", 404);
  }

  return apiSuccess({ id: banner._id.toString() }, { message: "Banner archived." });
});
