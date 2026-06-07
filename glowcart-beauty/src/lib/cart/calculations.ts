export const DELIVERY_FEE = 100;
export const FREE_DELIVERY_THRESHOLD = 2000;

export function calculateDeliveryCharge(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
}

export function calculateGrandTotal(subtotal: number): number {
  return subtotal + calculateDeliveryCharge(subtotal);
}
