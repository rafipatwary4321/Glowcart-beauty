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

function calculateCouponDiscount(
  coupon: {
    discountType: string;
    discountValue: number;
    maxDiscountAmount?: number | null;
    minOrderAmount?: number | null;
    code: string;
  },
  orderAmount: number
) {
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

  return {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    calculatedDiscount: Math.round(discount),
    minOrderAmount: coupon.minOrderAmount,
  };
}

async function validateCouponRequest(code: string | undefined, orderAmount: number) {
  if (!code?.trim()) {
    throw new ApiRouteError("Coupon code is required.", 400);
  }

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
  });

  if (!coupon || !isCouponValid(coupon)) {
    throw new ApiRouteError("Invalid or expired coupon.", 404);
  }

  return calculateCouponDiscount(coupon, orderAmount);
}

export const GET = withDb(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") ?? undefined;
  const orderAmount = Number(searchParams.get("orderAmount") ?? 0);
  const result = await validateCouponRequest(code, orderAmount);
  return apiSuccess(result);
});

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as {
    code?: string;
    orderAmount?: number;
  };

  const result = await validateCouponRequest(body.code, body.orderAmount ?? 0);
  return apiSuccess(result);
});
