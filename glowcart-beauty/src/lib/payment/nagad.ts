import { env, isNagadConfigured } from "@/config/env";

import {
  PaymentConfigError,
  type NagadInitParams,
  type NagadPaymentResult,
} from "./payment-types";

/**
 * Nagad payment gateway integration scaffold.
 * @see https://developer.mynagad.com/
 */
export async function createNagadPayment(params: NagadInitParams): Promise<NagadPaymentResult> {
  if (!isNagadConfigured()) {
    throw new PaymentConfigError(
      "Nagad is not configured. Set NAGAD_MERCHANT_ID, NAGAD_MERCHANT_PRIVATE_KEY, and related credentials."
    );
  }

  // Production flow:
  // 1. Initialize payment (get paymentReferenceId + challenge)
  // 2. Complete payment and return redirect URL
  void params;
  void env;

  throw new PaymentConfigError("Nagad payment gateway is not yet enabled.");
}

export async function verifyNagadPayment(
  paymentReferenceId: string
): Promise<{ valid: boolean; transactionId: string }> {
  if (!isNagadConfigured()) {
    throw new PaymentConfigError("Nagad is not configured.");
  }

  if (!paymentReferenceId.trim()) {
    throw new PaymentConfigError("Missing Nagad payment reference id.");
  }

  throw new PaymentConfigError("Nagad payment verification is not yet enabled.");
}
