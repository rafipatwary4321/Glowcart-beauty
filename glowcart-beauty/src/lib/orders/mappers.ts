import type { AdminOrderRow } from "@/types/admin";
import type { OrderSummary, OrderStatus, PaymentStatus } from "@/types/order";

type ApiOrderRecord = Record<string, unknown>;

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" ? value : Number(value ?? fallback);
}

function mapShippingAddress(value: unknown): OrderSummary["shippingAddress"] {
  const address = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    name: asString(address.name),
    phone: asString(address.phone),
    line1: asString(address.line1),
    line2: asString(address.line2) || undefined,
    city: asString(address.city),
    postalCode: asString(address.postalCode),
  };
}

function mapOrderItems(value: unknown): OrderSummary["items"] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => {
    const record = item as Record<string, unknown>;
    const product = record.product;

    return {
      productId:
        typeof product === "string"
          ? product
          : product && typeof product === "object"
            ? asString((product as Record<string, unknown>).id ?? (product as Record<string, unknown>)._id)
            : asString(record.productId),
      name: asString(record.name),
      slug: asString(record.slug),
      quantity: asNumber(record.quantity, 1),
      price: asNumber(record.price),
      imageGradient: asString(record.imageGradient) || undefined,
    };
  });
}

export function mapApiOrder(record: ApiOrderRecord): OrderSummary {
  const user = record.user && typeof record.user === "object" ? (record.user as Record<string, unknown>) : null;
  const items = mapOrderItems(record.items);

  return {
    id: asString(record.id),
    orderNumber: asString(record.orderNumber),
    customerName: asString(record.customerName, asString(user?.name)),
    customerEmail: asString(record.customerEmail, asString(user?.email)),
    customerPhone: asString(record.customerPhone),
    items,
    subtotal: asNumber(record.subtotal),
    discount: asNumber(record.discount),
    deliveryCharge: asNumber(record.deliveryCharge ?? record.deliveryFee),
    total: asNumber(record.total),
    deliveryMethod: (asString(record.deliveryMethod, "standard") as OrderSummary["deliveryMethod"]),
    paymentMethod: asString(record.paymentMethod) as OrderSummary["paymentMethod"],
    paymentStatus: asString(record.paymentStatus, "pending") as PaymentStatus,
    orderStatus: asString(record.orderStatus ?? record.status, "pending") as OrderStatus,
    shippingAddress: mapShippingAddress(record.shippingAddress),
    couponCode: asString(record.couponCode) || undefined,
    trackingCode: asString(record.trackingCode) || undefined,
    notes: asString(record.notes) || undefined,
    createdAt: asString(record.createdAt, new Date().toISOString()),
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  };
}

export function mapApiOrderToAdminRow(record: ApiOrderRecord): AdminOrderRow {
  const order = mapApiOrder(record);

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    total: order.total,
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    itemCount: order.itemCount,
  };
}

export function mapOrderSummaryToAdminRow(order: OrderSummary): AdminOrderRow {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    total: order.total,
    status: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    itemCount: order.itemCount,
  };
}

export function formatOrderStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
