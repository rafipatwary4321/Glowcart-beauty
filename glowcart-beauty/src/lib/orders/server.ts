import { ApiRouteError } from "@/lib/api/errors";
import { isValidObjectId } from "@/lib/db";
import { calculateOrderTotals } from "@/lib/orders/calculate-totals";
import type { DeliveryMethodValue, PaymentMethodValue } from "@/lib/orders/constants";
import { isOnlinePaymentMethod } from "@/lib/orders/constants";
import { Coupon, Product } from "@/models";
import type { ProductDocument } from "@/models/Product";
import type { OrderStatus, PaymentStatus } from "@/types/order";
import type { Types } from "mongoose";

type CreateOrderItemInput = {
  productId?: string;
  slug: string;
  quantity: number;
};

export function generateOrderNumber(): string {
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `GC-${suffix}`;
}

async function resolveProduct(item: CreateOrderItemInput): Promise<ProductDocument> {
  let product: ProductDocument | null = null;

  if (item.productId && isValidObjectId(item.productId)) {
    product = await Product.findOne({ _id: item.productId, isActive: true });
  }

  if (!product && item.slug) {
    product = await Product.findOne({ slug: item.slug.toLowerCase(), isActive: true });
  }

  if (!product) {
    throw new ApiRouteError(`Product "${item.slug}" was not found.`, 404);
  }

  return product;
}

async function resolveCouponDiscount(code: string | undefined, subtotal: number) {
  if (!code?.trim()) {
    return { discount: 0, couponCode: undefined as string | undefined, couponId: undefined };
  }

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

  if (!coupon || !coupon.isActive) {
    throw new ApiRouteError("Invalid or expired coupon.", 400);
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    throw new ApiRouteError("Coupon is not active yet.", 400);
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    throw new ApiRouteError("Coupon has expired.", 400);
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiRouteError("Coupon usage limit reached.", 400);
  }
  if (subtotal < (coupon.minOrderAmount ?? 0)) {
    throw new ApiRouteError(`Minimum order amount is ৳${coupon.minOrderAmount}.`, 400);
  }

  let discount =
    coupon.discountType === "percentage"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;

  if (coupon.maxDiscountAmount) {
    discount = Math.min(discount, coupon.maxDiscountAmount);
  }

  return {
    discount: Math.round(discount),
    couponCode: coupon.code,
    couponId: coupon._id.toString(),
  };
}

export type BuildOrderInput = {
  items: CreateOrderItemInput[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
  };
  deliveryMethod: DeliveryMethodValue;
  paymentMethod: PaymentMethodValue;
  couponCode?: string;
  notes?: string;
};

export async function buildOrderPayload(input: BuildOrderInput) {
  const orderItems = [];

  for (const item of input.items) {
    const product = await resolveProduct(item);

    if (!product.inStock || product.stockCount < item.quantity) {
      throw new ApiRouteError(`${product.name} is out of stock.`, 400);
    }

    orderItems.push({
      product: (product as ProductDocument & { _id: Types.ObjectId })._id,
      name: product.name,
      slug: product.slug,
      quantity: item.quantity,
      price: product.price,
      imageGradient: product.imageGradient,
    });
  }

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const couponResult = await resolveCouponDiscount(input.couponCode, subtotal);
  const totals = calculateOrderTotals({
    subtotal,
    discount: couponResult.discount,
    deliveryMethod: input.deliveryMethod,
  });

  const initialOrderStatus: OrderStatus =
    input.paymentMethod === "cod" ? "confirmed" : "pending";
  const initialPaymentStatus: PaymentStatus = "pending";
  const shouldFulfillInventory = input.paymentMethod === "cod";

  return {
    orderItems,
    totals,
    couponCode: couponResult.couponCode,
    couponId: couponResult.couponId,
    initialOrderStatus,
    initialPaymentStatus,
    isOnlinePayment: isOnlinePaymentMethod(input.paymentMethod),
    shouldFulfillInventory,
  };
}

export async function incrementCouponUsage(couponId: unknown) {
  if (!couponId) return;
  await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });
}

export async function decrementProductStock(
  items: Array<{ product: unknown; quantity: number }>
) {
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stockCount: -item.quantity },
      })
    )
  );
}
