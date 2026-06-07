import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, serializeDocument, serializeDocuments, withDb } from "@/lib/api";
import { buildPaginationMeta, parsePagination } from "@/lib/api/pagination";
import { isAdmin } from "@/lib/auth/roles";
import { isValidObjectId } from "@/lib/db";
import { createOrderSchema } from "@/lib/checkout/schemas";
import {
  buildOrderPayload,
  decrementProductStock,
  generateOrderNumber,
  incrementCouponUsage,
} from "@/lib/orders/server";
import { Order } from "@/models";

export const GET = withDb(async (request: Request) => {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const pagination = parsePagination(searchParams, { limit: 10 });
  const isAdminRequest = searchParams.get("admin") === "true";
  const mine = searchParams.get("mine") === "true";

  if (isAdminRequest && !isAdmin(session)) {
    throw new ApiRouteError("Admin access required.", 403);
  }

  if (!isAdminRequest && !mine && !session?.user?.id) {
    throw new ApiRouteError("Authentication required.", 401);
  }

  const filter: Record<string, unknown> = {};

  const userId = searchParams.get("userId");
  if (isAdminRequest) {
    if (userId) {
      if (!isValidObjectId(userId)) {
        throw new ApiRouteError("Invalid userId.", 400);
      }
      filter.user = userId;
    }
  } else if (mine || userId) {
    const resolvedUserId = mine ? session?.user?.id : userId;
    if (!resolvedUserId || !isValidObjectId(resolvedUserId)) {
      throw new ApiRouteError("Valid user session required.", 401);
    }
    if (!isAdmin(session) && resolvedUserId !== session?.user?.id) {
      throw new ApiRouteError("Forbidden.", 403);
    }
    filter.user = resolvedUserId;
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

export const POST = withDb(async (request: Request) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new ApiRouteError("Sign in to place an order.", 401);
  }

  const body = await request.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    throw new ApiRouteError(parsed.error.issues[0]?.message ?? "Invalid order payload.", 400);
  }

  const input = parsed.data;
  const built = await buildOrderPayload({
    items: input.items,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    shippingAddress: input.shippingAddress,
    deliveryMethod: input.deliveryMethod,
    paymentMethod: input.paymentMethod,
    couponCode: input.couponCode,
    notes: input.notes,
  });

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: session.user.id,
    customerName: input.customerName.trim(),
    customerEmail: input.customerEmail.trim().toLowerCase(),
    customerPhone: input.customerPhone.trim(),
    items: built.orderItems,
    subtotal: built.totals.subtotal,
    discount: built.totals.discount,
    deliveryFee: built.totals.deliveryCharge,
    total: built.totals.total,
    status: built.initialOrderStatus,
    deliveryMethod: input.deliveryMethod,
    paymentMethod: input.paymentMethod,
    paymentStatus: built.initialPaymentStatus,
    shippingAddress: input.shippingAddress,
    couponCode: built.couponCode,
    notes: input.notes?.trim(),
  });

  await decrementProductStock(built.orderItems);
  await incrementCouponUsage(built.couponId);

  const populated = await Order.findById(order._id).populate("user", "name email");

  return apiSuccess(serializeDocument(populated!), {
    status: 201,
    message: built.isOnlinePayment
      ? "Order created. Payment gateway integration coming soon."
      : "Order placed successfully.",
  });
});
