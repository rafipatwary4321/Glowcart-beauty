export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "sslcommerz" | "bkash" | "cod";

export type Order = {
  id: string;
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
};
