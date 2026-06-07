export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function formatDiscount(price: number, originalPrice: number): number {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
