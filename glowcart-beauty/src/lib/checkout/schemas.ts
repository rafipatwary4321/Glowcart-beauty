import { z } from "zod";

import { DELIVERY_METHODS, PAYMENT_METHODS } from "@/lib/orders/constants";

const paymentValues = PAYMENT_METHODS.map((item) => item.value) as [
  (typeof PAYMENT_METHODS)[number]["value"],
  ...(typeof PAYMENT_METHODS)[number]["value"][],
];

const deliveryValues = DELIVERY_METHODS.map((item) => item.value) as [
  (typeof DELIVERY_METHODS)[number]["value"],
  ...(typeof DELIVERY_METHODS)[number]["value"][],
];

export const shippingAddressSchema = z.object({
  name: z.string().min(2, "Full name is required."),
  phone: z
    .string()
    .min(10, "Enter a valid phone number.")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number."),
  line1: z.string().min(3, "Address line is required."),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required."),
  postalCode: z.string().min(4, "Postal code is required."),
});

export const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name is required."),
  customerEmail: z.string().email("Enter a valid email."),
  customerPhone: z
    .string()
    .min(10, "Enter a valid phone number.")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number."),
  shippingAddress: shippingAddressSchema,
  savedAddressId: z.string().optional(),
  deliveryMethod: z.enum(deliveryValues),
  paymentMethod: z.enum(paymentValues),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const createOrderItemSchema = z.object({
  productId: z.string().optional(),
  slug: z.string().min(1, "Product slug is required."),
  quantity: z.number().int().min(1),
});

export const createOrderSchema = checkoutFormSchema.extend({
  items: z.array(createOrderItemSchema).min(1, "Cart is empty."),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
