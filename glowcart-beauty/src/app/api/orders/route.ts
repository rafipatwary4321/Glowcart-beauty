import { ApiRouteError, apiSuccess, serializeDocument, serializeDocuments, withDb } from "@/lib/api";
import { buildPaginationMeta, parsePagination } from "@/lib/api/pagination";
import { isValidObjectId } from "@/lib/db";
import { Order, Product } from "@/models";

import type { PaymentMethod } from "@/types/order";

function generateOrderNumber(): string {
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `GC-${suffix}`;
}

export const GET = withDb(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams, { limit: 10 });

  const filter: Record<string, unknown> = {};

  const userId = searchParams.get("userId");
  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiRouteError("Invalid userId.", 400);
    }
    filter.user = userId;
  }

  const status = searchParams.get("status");
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Order.countDocuments(filter),
  ]);

  return apiSuccess({
    items: serializeDocuments(orders),
    pagination: buildPaginationMeta(total, pagination),
  });
});

type CreateOrderItemInput = {
  productId: string;
  quantity: number;
};

export const POST = withDb(async (request: Request) => {
  const body = (await request.json()) as {
    userId?: string;
    items?: CreateOrderItemInput[];
    paymentMethod?: string;
    shippingAddress?: Record<string, string>;
    couponCode?: string;
    notes?: string;
  };

  if (!body.userId || !isValidObjectId(body.userId)) {
    throw new ApiRouteError("Valid userId is required.", 400);
  }

  if (!body.items?.length) {
    throw new ApiRouteError("Order must include at least one item.", 400);
  }

  if (!body.paymentMethod) {
    throw new ApiRouteError("paymentMethod is required.", 400);
  }

  const paymentMethods: PaymentMethod[] = ["sslcommerz", "bkash", "cod"];
  if (!paymentMethods.includes(body.paymentMethod as PaymentMethod)) {
    throw new ApiRouteError("Invalid paymentMethod.", 400);
  }

  if (!body.shippingAddress?.line1 || !body.shippingAddress.city) {
    throw new ApiRouteError("Complete shippingAddress is required.", 400);
  }

  const productIds = body.items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });

  if (products.length !== body.items.length) {
    throw new ApiRouteError("One or more products were not found.", 404);
  }

  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const orderItems = body.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new ApiRouteError(`Product ${item.productId} not found.`, 404);
    }

    return {
      product: product._id,
      name: product.name,
      slug: product.slug,
      quantity: item.quantity,
      price: product.price,
      imageGradient: product.imageGradient,
    };
  });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 2000 ? 0 : 120;
  const discount = 0;
  const total = subtotal - discount + deliveryFee;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: body.userId,
    items: orderItems,
    subtotal,
    discount,
    deliveryFee,
    total,
    paymentMethod: body.paymentMethod as PaymentMethod,
    shippingAddress: body.shippingAddress,
    couponCode: body.couponCode,
    notes: body.notes,
  });

  const populated = await Order.findById(order._id).populate("user", "name email");

  return apiSuccess(serializeDocument(populated!), {
    status: 201,
    message: "Order created.",
  });
});
