import type { CheckoutFormValues } from "@/lib/checkout/schemas";
import type { OrderSummary } from "@/types/order";
import { mapApiOrder } from "@/lib/orders/mappers";

type ApiListResponse = {
  success: boolean;
  data?: { items: Record<string, unknown>[] };
  error?: string;
};

type ApiOrderResponse = {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  message?: string;
};

export type CreateOrderPayload = CheckoutFormValues & {
  items: Array<{ productId?: string; slug: string; quantity: number }>;
};

export async function createOrder(payload: CreateOrderPayload): Promise<OrderSummary> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await response.json()) as ApiOrderResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Unable to place order.");
  }

  return mapApiOrder(json.data);
}

export async function fetchOrderById(id: string): Promise<OrderSummary> {
  const response = await fetch(`/api/orders/${id}`, { cache: "no-store" });
  const json = (await response.json()) as ApiOrderResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Order not found.");
  }

  return mapApiOrder(json.data);
}

export async function fetchMyOrders(): Promise<OrderSummary[]> {
  const response = await fetch("/api/orders?mine=true", { cache: "no-store" });
  const json = (await response.json()) as ApiListResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Unable to load orders.");
  }

  return json.data.items.map(mapApiOrder);
}

export async function fetchAdminOrders(): Promise<OrderSummary[]> {
  const response = await fetch("/api/orders?admin=true&limit=100", { cache: "no-store" });
  const json = (await response.json()) as ApiListResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Unable to load orders.");
  }

  return json.data.items.map(mapApiOrder);
}

export async function updateOrderStatus(
  id: string,
  payload: { orderStatus?: string; paymentStatus?: string; trackingCode?: string }
): Promise<OrderSummary> {
  const response = await fetch(`/api/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await response.json()) as ApiOrderResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Unable to update order.");
  }

  return mapApiOrder(json.data);
}

export async function validateCheckoutCoupon(code: string, orderAmount: number) {
  const response = await fetch("/api/coupons/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, orderAmount }),
  });

  const json = (await response.json()) as ApiOrderResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Invalid coupon.");
  }

  return json.data as {
    code: string;
    calculatedDiscount: number;
  };
}
