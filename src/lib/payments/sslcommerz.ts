/**
 * SSLCommerz payment gateway integration.
 * @see https://developer.sslcommerz.com/
 */
export async function createSSLCommerzSession(_orderId: string, _amount: number) {
  // TODO: POST to SSLCommerz session API
  throw new Error("SSLCommerz not configured");
}

export async function validateSSLCommerzIPN(_payload: unknown) {
  // TODO: validate IPN callback
  throw new Error("SSLCommerz not configured");
}
