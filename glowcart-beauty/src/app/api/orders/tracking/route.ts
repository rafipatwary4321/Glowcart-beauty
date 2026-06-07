export const runtime = "nodejs";

import { auth } from "@/auth";
import { ApiRouteError, apiSuccess, serializeDocument, withDb } from "@/lib/api";
import { isAdmin } from "@/lib/auth/roles";
import { isValidObjectId } from "@/lib/db";
import { appendTrackingEvent } from "@/lib/orders/tracking";
import { Order } from "@/models";
import type { TrackingStatus } from "@/types/tracking";
import { z } from "zod";

const trackingStatuses: TrackingStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const updateSchema = z.object({
  orderId: z.string().min(1),
  status: z.string().min(1),
  note: z.string().optional(),
  trackingCode: z.string().optional(),
});

export const GET = withDb(async (request: Request) => {
  const session = await auth();
  const orderId = new URL(request.url).searchParams.get("orderId");

  if (!orderId || !isValidObjectId(orderId)) {
    throw new ApiRouteError("Valid orderId is required.", 400);
  }

  const order = await Order.findById(orderId);
  if (!order) throw new ApiRouteError("Order not found.", 404);

  const isOwner = session?.user?.id === order.user.toString();
  if (!isOwner && session?.user?.role !== "admin") {
    throw new ApiRouteError("Forbidden.", 403);
  }

  return apiSuccess(serializeDocument(order));
});

export const POST = withDb(async (request: Request) => {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new ApiRouteError("Admin access required.", 403);
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) throw new ApiRouteError("Invalid tracking payload.", 400);

  if (!trackingStatuses.includes(parsed.data.status as TrackingStatus)) {
    throw new ApiRouteError("Invalid tracking status.", 400);
  }

  const order = await appendTrackingEvent(parsed.data.orderId, {
    status: parsed.data.status as TrackingStatus,
    note: parsed.data.note,
    trackingCode: parsed.data.trackingCode,
    createdBy: session.user.id,
  });

  return apiSuccess(serializeDocument(order), { message: "Tracking updated." });
});
