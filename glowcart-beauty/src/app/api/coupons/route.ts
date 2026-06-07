import { ApiRouteError, apiSuccess, serializeDocuments, withDb } from "@/lib/api";

export const runtime = "nodejs";

import { Coupon } from "@/models";

export const GET = withDb(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const isAdmin = searchParams.get("admin") === "true";

  const filter = isAdmin ? {} : { isActive: true };
  const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

  return apiSuccess(serializeDocuments(coupons));
});

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as Record<string, unknown>;

  if (!body.code || !body.discountType || body.discountValue === undefined) {
    throw new ApiRouteError("Code, discountType, and discountValue are required.", 400);
  }

  const coupon = await Coupon.create({
    ...body,
    code: String(body.code).trim().toUpperCase(),
  });

  return apiSuccess(coupon, {
    status: 201,
    message: "Coupon created.",
  });
});
