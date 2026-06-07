import { env, isBkashConfigured } from "@/config/env";

import {
  PaymentConfigError,
  type BkashInitParams,
  type BkashPaymentResult,
} from "./payment-types";

/**
 * bKash Tokenized Checkout integration scaffold.
 * @see https://developer.bka.sh/docs
 */
export async function createBkashPayment(params: BkashInitParams): Promise<BkashPaymentResult> {
  if (!isBkashConfigured()) {
    throw new PaymentConfigError(
      "bKash is not configured. Set BKASH_APP_KEY, BKASH_APP_SECRET, and related credentials."
    );
  }

  // Production flow:
  // 1. Grant token via /tokenized/checkout/token/grant
  // 2. Create payment via /tokenized/checkout/create
  // 3. Return bkashURL for redirect
  void params;
  void env;

  throw new PaymentConfigError("bKash payment gateway is not yet enabled.");
}

export async function verifyBkashPayment(paymentId: string): Promise<{ valid: boolean; transactionId: string }> {
  if (!isBkashConfigured()) {
    throw new PaymentConfigError("bKash is not configured.");
  }

  if (!paymentId.trim()) {
    throw new PaymentConfigError("Missing bKash payment id.");
  }

  throw new PaymentConfigError("bKash payment verification is not yet enabled.");
}
