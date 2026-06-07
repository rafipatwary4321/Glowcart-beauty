import { ApiRouteError, apiSuccess, withDb } from "@/lib/api";

export const runtime = "nodejs";

import { Coupon } from "@/models";

function isCouponValid(coupon: {
  isActive: boolean;
  startsAt?: Date | null;
  expiresAt?: Date | null;
  usageLimit?: number | null;
  usedCount: number;
}): boolean {
  if (!coupon.isActive) return false;

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) return false;
  if (coupon.expiresAt && coupon.expiresAt < now) return false;
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false;

  return true;
}

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as {
    code?: string;
    orderAmount?: number;
  };

  if (!body.code?.trim()) {
    throw new ApiRouteError("Coupon code is required.", 400);
  }

  const coupon = await Coupon.findOne({
    code: body.code.trim().toUpperCase(),
  });

  if (!coupon || !isCouponValid(coupon)) {
    throw new ApiRouteError("Invalid or expired coupon.", 404);
  }

  const orderAmount = body.orderAmount ?? 0;

  if (orderAmount < (coupon.minOrderAmount ?? 0)) {
    throw new ApiRouteError(
      `Minimum order amount is ৳${coupon.minOrderAmount}.`,
      400
    );
  }

  let discount =
    coupon.discountType === "percentage"
      ? (orderAmount * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.maxDiscountAmount) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }

  return apiSuccess({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    calculatedDiscount: Math.round(discount),
    minOrderAmount: coupon.minOrderAmount,
  });
});
