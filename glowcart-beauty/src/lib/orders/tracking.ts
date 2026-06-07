import { Order } from "@/models";
import type { OrderDocument } from "@/models/Order";
import type { OrderStatus } from "@/types/order";
import type { TrackingEvent, TrackingStatus } from "@/types/tracking";
import { TRACKING_STATUS_LABELS } from "@/types/tracking";
import type { Types } from "mongoose";

import { commitOrderInventory, releaseOrderInventory } from "@/lib/inventory";
import {
  sendOrderDeliveredEmail,
  sendOrderShippedEmail,
} from "@/lib/email";

const statusToOrderStatus: Partial<Record<TrackingStatus, OrderStatus>> = {
  confirmed: "confirmed",
  processing: "processing",
  shipped: "shipped",
  out_for_delivery: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
};

export function formatTrackingStatus(status: TrackingStatus): string {
  return TRACKING_STATUS_LABELS[status] ?? status;
}

export function generateTrackingCode(orderNumber: string): string {
  return `GC-TRK-${orderNumber.replace(/^GC-/, "")}`;
}

export async function appendTrackingEvent(
  orderId: string,
  input: {
    status: TrackingStatus;
    note?: string;
    trackingCode?: string;
    createdBy?: string;
  }
): Promise<OrderDocument> {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found.");
  }

  const event = {
    status: input.status,
    note: input.note?.trim(),
    at: new Date(),
    createdBy: input.createdBy as unknown as Types.ObjectId | undefined,
  };

  order.trackingStatus = input.status;
  order.trackingEvents.push(event);

  if (input.trackingCode?.trim()) {
    order.trackingCode = input.trackingCode.trim();
  } else if (!order.trackingCode && input.status === "shipped") {
    order.trackingCode = generateTrackingCode(order.orderNumber);
  }

  const mappedStatus = statusToOrderStatus[input.status];
  if (mappedStatus) {
    order.status = mappedStatus;
  }

  if (input.status === "cancelled") {
    await releaseOrderInventory(order);
    if (order.paymentStatus === "pending") {
      order.paymentStatus = "cancelled";
    }
  }

  if (input.status === "delivered") {
    await commitOrderInventory(order);
    void sendOrderDeliveredEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      trackingCode: order.trackingCode ?? undefined,
    }).catch(() => undefined);
  }

  if (input.status === "shipped") {
    void sendOrderShippedEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      trackingCode: order.trackingCode ?? generateTrackingCode(order.orderNumber),
    }).catch(() => undefined);
  }

  await order.save();
  return order;
}

export function mapTrackingEvents(order: OrderDocument): TrackingEvent[] {
  return (order.trackingEvents ?? []).map((event) => ({
    status: event.status as TrackingStatus,
    note: event.note ?? undefined,
    at: event.at instanceof Date ? event.at.toISOString() : String(event.at),
    createdBy: event.createdBy?.toString(),
  }));
}
