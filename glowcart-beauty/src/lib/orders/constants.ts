export const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on Delivery", description: "Pay when your order arrives." },
  { value: "sslcommerz", label: "SSLCommerz", description: "Cards, mobile banking & internet banking." },
  { value: "bkash", label: "bKash", description: "Pay securely with your bKash wallet." },
  { value: "nagad", label: "Nagad", description: "Pay securely with your Nagad wallet." },
] as const;

export const DELIVERY_METHODS = [
  {
    value: "standard",
    label: "Standard Delivery",
    description: "3–5 business days",
    eta: "3–5 days",
  },
  {
    value: "express",
    label: "Express Delivery",
    description: "1–2 business days",
    eta: "1–2 days",
  },
] as const;

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]["value"];
export type DeliveryMethodValue = (typeof DELIVERY_METHODS)[number]["value"];

export const EXPRESS_DELIVERY_SURCHARGE = 80;

export function getPaymentMethodLabel(method: string): string {
  return PAYMENT_METHODS.find((item) => item.value === method)?.label ?? method;
}

export function getDeliveryMethodLabel(method: string): string {
  return DELIVERY_METHODS.find((item) => item.value === method)?.label ?? method;
}

export function isOnlinePaymentMethod(method: string): boolean {
  return method !== "cod";
}

export function requiresGatewayRedirect(method: string): boolean {
  return method === "sslcommerz" || method === "bkash" || method === "nagad";
}
