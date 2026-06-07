import { env, isSSLCommerzConfigured } from "@/config/env";

import {
  PaymentConfigError,
  PaymentValidationError,
  type SSLCommerzInitParams,
  type SSLCommerzSessionResult,
  type SSLCommerzValidationResult,
} from "./payment-types";

const SANDBOX_API = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const LIVE_API = "https://securepay.sslcommerz.com/gwprocess/v4/api.php";
const SANDBOX_VALIDATION = "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
const LIVE_VALIDATION = "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php";

function getApiBaseUrl(): string {
  return env.sslcommerzIsLive ? LIVE_API : SANDBOX_API;
}

function getValidationBaseUrl(): string {
  return env.sslcommerzIsLive ? LIVE_VALIDATION : SANDBOX_VALIDATION;
}

function assertConfigured(): void {
  if (!isSSLCommerzConfigured()) {
    throw new PaymentConfigError(
      "SSLCommerz is not configured. Set SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD."
    );
  }
}

function parseFormEncodedResponse(body: string): Record<string, string> {
  const params = new URLSearchParams(body);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

export function generatePaymentTransactionId(orderNumber: string): string {
  const suffix = Date.now().toString(36).toUpperCase();
  return `${orderNumber.replace(/[^A-Z0-9]/gi, "")}-${suffix}`.slice(0, 30);
}

export async function initSSLCommerzSession(
  params: SSLCommerzInitParams
): Promise<SSLCommerzSessionResult> {
  assertConfigured();

  const payload = new URLSearchParams({
    store_id: env.sslcommerzStoreId,
    store_passwd: env.sslcommerzStorePassword,
    total_amount: params.amount.toFixed(2),
    currency: "BDT",
    tran_id: params.transactionId,
    success_url: params.successUrl,
    fail_url: params.failUrl,
    cancel_url: params.cancelUrl,
    cus_name: params.customerName,
    cus_email: params.customerEmail,
    cus_phone: params.customerPhone,
    cus_add1: params.shippingAddress.line1,
    cus_add2: params.shippingAddress.line2 ?? "",
    cus_city: params.shippingAddress.city,
    cus_postcode: params.shippingAddress.postalCode,
    cus_country: "Bangladesh",
    shipping_method: "NO",
    product_name: params.productName,
    product_category: "Beauty",
    product_profile: "general",
    value_a: params.orderId,
    value_b: params.orderNumber,
  });

  const response = await fetch(getApiBaseUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
  });

  if (!response.ok) {
    throw new PaymentConfigError(`SSLCommerz session request failed (${response.status}).`);
  }

  const data = parseFormEncodedResponse(await response.text());

  if (data.status !== "SUCCESS" || !data.GatewayPageURL) {
    throw new PaymentConfigError(data.failedreason ?? "Unable to create SSLCommerz session.");
  }

  return {
    gatewayUrl: data.GatewayPageURL,
    sessionKey: data.sessionkey ?? "",
    transactionId: params.transactionId,
  };
}

export async function validateSSLCommerzPayment(
  valId: string
): Promise<SSLCommerzValidationResult> {
  assertConfigured();

  if (!valId.trim()) {
    throw new PaymentValidationError("Missing SSLCommerz validation id.");
  }

  const url = new URL(getValidationBaseUrl());
  url.searchParams.set("val_id", valId);
  url.searchParams.set("store_id", env.sslcommerzStoreId);
  url.searchParams.set("store_passwd", env.sslcommerzStorePassword);
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString(), { method: "GET" });

  if (!response.ok) {
    throw new PaymentValidationError(`SSLCommerz validation failed (${response.status}).`);
  }

  const data = (await response.json()) as Record<string, string>;
  const status = (data.status ?? "").toUpperCase();
  const valid = status === "VALID" || status === "VALIDATED";

  return {
    valid,
    transactionId: data.tran_id ?? "",
    amount: Number(data.amount ?? 0),
    currency: data.currency ?? "BDT",
    cardType: data.card_type,
    bankTransactionId: data.bank_tran_id,
    status,
    raw: data,
  };
}
