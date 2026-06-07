import type { PaymentInitRequest, PaymentInitResponse } from "@/lib/payment/payment-types";
import { mapApiOrder } from "@/lib/orders/mappers";

type ApiPaymentResponse = {
  success: boolean;
  data?: PaymentInitResponse;
  error?: string;
};

export async function initSSLCommerzPayment(orderId: string): Promise<PaymentInitResponse> {
  const response = await fetch("/api/payment/sslcommerz/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId } satisfies PaymentInitRequest),
  });

  const json = (await response.json()) as ApiPaymentResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Unable to start SSLCommerz payment.");
  }

  return json.data;
}

export async function initBkashPayment(orderId: string): Promise<PaymentInitResponse> {
  const response = await fetch("/api/payment/bkash/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId } satisfies PaymentInitRequest),
  });

  const json = (await response.json()) as ApiPaymentResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Unable to start bKash payment.");
  }

  return json.data;
}

export async function initNagadPayment(orderId: string): Promise<PaymentInitResponse> {
  const response = await fetch("/api/payment/nagad/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId } satisfies PaymentInitRequest),
  });

  const json = (await response.json()) as ApiPaymentResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error ?? "Unable to start Nagad payment.");
  }

  return json.data;
}

export { mapApiOrder };
