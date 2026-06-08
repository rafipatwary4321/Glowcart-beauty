export type DeliveryPricing = {
  deliveryCharge: number;
  freeDeliveryThreshold: number;
};

export const DEFAULT_DELIVERY_PRICING: DeliveryPricing = {
  deliveryCharge: 80,
  freeDeliveryThreshold: 2000,
};

/** @deprecated Use DEFAULT_DELIVERY_PRICING.deliveryCharge */
export const DELIVERY_FEE = DEFAULT_DELIVERY_PRICING.deliveryCharge;

/** @deprecated Use DEFAULT_DELIVERY_PRICING.freeDeliveryThreshold */
export const FREE_DELIVERY_THRESHOLD = DEFAULT_DELIVERY_PRICING.freeDeliveryThreshold;

export function calculateDeliveryCharge(
  subtotal: number,
  pricing: DeliveryPricing = DEFAULT_DELIVERY_PRICING
): number {
  return subtotal >= pricing.freeDeliveryThreshold || subtotal === 0
    ? 0
    : pricing.deliveryCharge;
}

export function calculateGrandTotal(
  subtotal: number,
  pricing: DeliveryPricing = DEFAULT_DELIVERY_PRICING
): number {
  return subtotal + calculateDeliveryCharge(subtotal, pricing);
}
