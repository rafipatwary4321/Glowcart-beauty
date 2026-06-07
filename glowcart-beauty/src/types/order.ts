export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "cod" | "bkash" | "nagad" | "sslcommerz" | "card";

export type DeliveryMethod = "standard" | "express";

export type ShippingAddress = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  price: number;
  imageGradient?: string;
};

export type Order = OrderSummary;

export type OrderSummary = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  couponCode?: string;
  trackingCode?: string;
  notes?: string;
  createdAt: string;
  itemCount: number;
};
