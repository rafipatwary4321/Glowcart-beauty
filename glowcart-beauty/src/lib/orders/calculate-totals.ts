import {
  calculateDeliveryCharge,
  FREE_DELIVERY_THRESHOLD,
} from "@/lib/cart/calculations";
import { EXPRESS_DELIVERY_SURCHARGE, type DeliveryMethodValue } from "@/lib/orders/constants";

export type OrderTotalsInput = {
  subtotal: number;
  discount?: number;
  deliveryMethod?: DeliveryMethodValue;
};

export type OrderTotals = {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  freeDeliveryThreshold: number;
};

export function calculateOrderTotals({
  subtotal,
  discount = 0,
  deliveryMethod = "standard",
}: OrderTotalsInput): OrderTotals {
  const baseDelivery = calculateDeliveryCharge(subtotal);
  const deliveryCharge =
    deliveryMethod === "express" ? baseDelivery + EXPRESS_DELIVERY_SURCHARGE : baseDelivery;
  const safeDiscount = Math.max(0, Math.min(discount, subtotal));
  const total = Math.max(0, subtotal - safeDiscount + deliveryCharge);

  return {
    subtotal,
    discount: safeDiscount,
    deliveryCharge,
    total,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
  };
}
