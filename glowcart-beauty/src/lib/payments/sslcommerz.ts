export {
  generatePaymentTransactionId,
  initSSLCommerzSession,
  validateSSLCommerzPayment,
} from "@/lib/payment/sslcommerz";

/** @deprecated Use initSSLCommerzSession from @/lib/payment */
export { initSSLCommerzSession as createSSLCommerzSession } from "@/lib/payment/sslcommerz";

/** @deprecated Use validateSSLCommerzPayment from @/lib/payment */
export async function validateSSLCommerzIPN(payload: unknown) {
  const valId =
    payload && typeof payload === "object" && "val_id" in payload
      ? String((payload as { val_id: string }).val_id)
      : "";
  const { validateSSLCommerzPayment } = await import("@/lib/payment/sslcommerz");
  return validateSSLCommerzPayment(valId);
}
