import { auth } from "@/auth";
export const runtime = "nodejs";
import { ApiRouteError, apiSuccess, serializeDocument, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import { isValidObjectId } from "@/lib/db";
import { commitOrderInventory, releaseOrderInventory } from "@/lib/inventory";
import { appendTrackingEvent } from "@/lib/orders/tracking";
import { Order } from "@/models";
import type { OrderStatus } from "@/types/order";
import type { Session } from "next-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const orderStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatuses = ["pending", "paid", "failed", "cancelled", "refunded"] as const;

async function findOrderById(id: string) {
  if (!isValidObjectId(id)) {
    throw new ApiRouteError("Invalid order id.", 400);
  }

  const order = await Order.findById(id).populate("user", "name email");

  if (!order) {
    throw new ApiRouteError("Order not found.", 404);
  }

  return order;
}

function assertOrderAccess(orderUserId: string, session: Session | null) {
  const isOwner = session?.user?.id === orderUserId;

  if (!isOwner && !isAdmin(session)) {
    throw new ApiRouteError("Forbidden.", 403);
  }
}

export const GET = withDb(async (_request: Request, context?: unknown) => {
  const session = await auth();
  const { id } = await (context as RouteContext).params;
  const order = await findOrderById(id);

  assertOrderAccess(order.user.toString(), session);

  return apiSuccess(serializeDocument(order));
});

export const PATCH = withDb(async (request: Request, context?: unknown) => {
  const session = await auth();

  if (!isAdmin(session)) {
    throw new ApiRouteError("Admin access required.", 403);
  }

  const { id } = await (context as RouteContext).params;
  const body = (await request.json()) as {
    orderStatus?: string;
    paymentStatus?: string;
    trackingCode?: string;
    transactionId?: string;
  };

  const update: Record<string, unknown> = {};

  if (body.orderStatus !== undefined) {
    if (!orderStatuses.includes(body.orderStatus as OrderStatus)) {
      throw new ApiRouteError("Invalid order status.", 400);
    }
    update.status = body.orderStatus;
  }

  if (body.paymentStatus !== undefined) {
    if (!paymentStatuses.includes(body.paymentStatus as (typeof paymentStatuses)[number])) {
      throw new ApiRouteError("Invalid payment status.", 400);
    }
    update.paymentStatus = body.paymentStatus;
  }

  if (body.trackingCode !== undefined) {
    update.trackingCode = body.trackingCode.trim() || undefined;
  }

  if (body.transactionId !== undefined) {
    update.transactionId = body.transactionId.trim() || undefined;
  }

  let order = await Order.findById(id);
  if (!order) {
    throw new ApiRouteError("Order not found.", 404);
  }

  if (body.orderStatus === "cancelled" && order.status !== "cancelled") {
    await releaseOrderInventory(order);
    await appendTrackingEvent(id, { status: "cancelled", note: "Order cancelled by admin" });
  }

  if (body.orderStatus === "delivered" && order.status !== "delivered") {
    await commitOrderInventory(order);
    await appendTrackingEvent(id, { status: "delivered", note: "Order marked delivered" });
  }

  order = await Order.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).populate("user", "name email");

  if (!order) {
    throw new ApiRouteError("Order not found.", 404);
  }

  return apiSuccess(serializeDocument(order), { message: "Order updated." });
});
