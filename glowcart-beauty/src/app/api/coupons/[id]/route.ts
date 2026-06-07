import { ApiRouteError, apiSuccess, serializeDocument, withDb } from "@/lib/api";
export const runtime = "nodejs";
import { isValidObjectId } from "@/lib/db";
import { Coupon } from "@/models";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const GET = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;

  if (!isValidObjectId(id)) {
    throw new ApiRouteError("Invalid coupon id.", 400);
  }

  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new ApiRouteError("Coupon not found.", 404);
  }

  return apiSuccess(serializeDocument(coupon));
});

export const PUT = withDb(async (request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;
  const body = (await request.json()) as Record<string, unknown>;

  if (!isValidObjectId(id)) {
    throw new ApiRouteError("Invalid coupon id.", 400);
  }

  if (typeof body.code === "string") {
    body.code = body.code.trim().toUpperCase();
  }

  const coupon = await Coupon.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    throw new ApiRouteError("Coupon not found.", 404);
  }

  return apiSuccess(serializeDocument(coupon), { message: "Coupon updated." });
});

export const DELETE = withDb(async (_request: Request, context?: unknown) => {
  const { id } = await (context as RouteContext).params;

  if (!isValidObjectId(id)) {
    throw new ApiRouteError("Invalid coupon id.", 400);
  }

  const coupon = await Coupon.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!coupon) {
    throw new ApiRouteError("Coupon not found.", 404);
  }

  return apiSuccess({ id: coupon._id.toString() }, { message: "Coupon archived." });
});
