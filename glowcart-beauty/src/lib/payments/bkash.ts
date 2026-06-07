/**
 * bKash payment gateway integration.
 * @see https://developer.bka.sh/
 */
export async function createBkashPayment(_orderId: string, _amount: number) {
  // TODO: create bKash payment
  throw new Error("bKash not configured");
}

export async function verifyBkashPayment(_paymentId: string) {
  // TODO: verify bKash payment
  throw new Error("bKash not configured");
}
