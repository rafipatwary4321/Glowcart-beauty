import type { DeliveryPricing } from "@/lib/cart/calculations";
import {
  calculateDeliveryCharge,
  DEFAULT_DELIVERY_PRICING,
} from "@/lib/cart/calculations";
import { EXPRESS_DELIVERY_SURCHARGE, type DeliveryMethodValue } from "@/lib/orders/constants";

export type OrderTotalsInput = {
  subtotal: number;
  discount?: number;
  deliveryMethod?: DeliveryMethodValue;
  deliveryPricing?: DeliveryPricing;
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
  deliveryPricing = DEFAULT_DELIVERY_PRICING,
}: OrderTotalsInput): OrderTotals {
  const baseDelivery = calculateDeliveryCharge(subtotal, deliveryPricing);
  const deliveryCharge =
    deliveryMethod === "express" ? baseDelivery + EXPRESS_DELIVERY_SURCHARGE : baseDelivery;
  const safeDiscount = Math.max(0, Math.min(discount, subtotal));
  const total = Math.max(0, subtotal - safeDiscount + deliveryCharge);

  return {
    subtotal,
    discount: safeDiscount,
    deliveryCharge,
    total,
    freeDeliveryThreshold: deliveryPricing.freeDeliveryThreshold,
  };
}
