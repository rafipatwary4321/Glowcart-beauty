import { ApiRouteError } from "@/lib/api/errors";
import { incrementCouponUsage } from "@/lib/orders/server";
import { Coupon, Order } from "@/models";
import type { OrderDocument } from "@/models/Order";
import type { OrderStatus, PaymentStatus } from "@/types/order";

export async function findPayableOrder(orderId: string, userId?: string): Promise<OrderDocument> {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiRouteError("Order not found.", 404);
  }

  if (userId && order.user.toString() !== userId) {
    throw new ApiRouteError("Forbidden.", 403);
  }

  return order;
}

/** Marks online payment complete. Stock is reserved at order creation. */
export async function fulfillOrderInventory(order: OrderDocument): Promise<void> {
  if (order.stockFulfilled) {
    return;
  }

  if (order.couponCode) {
    const coupon = await Coupon.findOne({ code: order.couponCode });
    if (coupon) {
      await incrementCouponUsage(coupon._id);
    }
  }

  order.stockFulfilled = true;
  await order.save();
}

export async function updateOrderPaymentState(
  order: OrderDocument,
  update: {
    paymentStatus: PaymentStatus;
    orderStatus?: OrderStatus;
    transactionId?: string;
    paymentGatewayResponse?: Record<string, unknown>;
  }
): Promise<OrderDocument> {
  order.paymentStatus = update.paymentStatus;

  if (update.orderStatus) {
    order.status = update.orderStatus;
  }

  if (update.transactionId) {
    order.transactionId = update.transactionId;
  }

  if (update.paymentGatewayResponse) {
    order.paymentGatewayResponse = update.paymentGatewayResponse;
  }

  await order.save();
  return order;
}

export function assertOrderAwaitingPayment(order: OrderDocument): void {
  if (order.paymentStatus !== "pending") {
    throw new ApiRouteError("Order payment is no longer pending.", 409);
  }

  if (order.status === "cancelled") {
    throw new ApiRouteError("Order has been cancelled.", 409);
  }
}

export function buildProductSummary(order: OrderDocument): string {
  const firstItem = order.items[0];
  if (!firstItem) return "GlowCart order";
  if (order.items.length === 1) return firstItem.name;
  return `${firstItem.name} + ${order.items.length - 1} more`;
}
