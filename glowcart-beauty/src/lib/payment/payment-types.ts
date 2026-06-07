import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order";

export type GatewayPaymentMethod = Extract<PaymentMethod, "sslcommerz" | "bkash" | "nagad">;

export type PaymentInitRequest = {
  orderId: string;
};

export type PaymentInitResponse = {
  gatewayUrl: string;
  transactionId: string;
  paymentMethod: GatewayPaymentMethod;
};

export type PaymentCallbackResult = {
  orderId: string;
  orderNumber: string;
  transactionId: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  amount: number;
};

export type SSLCommerzInitParams = {
  orderId: string;
  orderNumber: string;
  amount: number;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
  };
  productName: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
};

export type SSLCommerzSessionResult = {
  gatewayUrl: string;
  sessionKey: string;
  transactionId: string;
};

export type SSLCommerzValidationResult = {
  valid: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  cardType?: string;
  bankTransactionId?: string;
  status: string;
  raw: Record<string, string>;
};

export type BkashInitParams = {
  orderId: string;
  amount: number;
  transactionId: string;
  customerPhone: string;
};

export type BkashPaymentResult = {
  paymentId: string;
  transactionId: string;
  gatewayUrl: string;
};

export type NagadInitParams = {
  orderId: string;
  amount: number;
  transactionId: string;
  customerPhone: string;
};

export type NagadPaymentResult = {
  paymentReferenceId: string;
  transactionId: string;
  gatewayUrl: string;
};

export class PaymentConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentConfigError";
  }
}

export class PaymentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentValidationError";
  }
}
