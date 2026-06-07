import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

import type { OrderStatus, PaymentMethod } from "@/types/order";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    imageGradient: { type: String },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], required: true, validate: [(v: unknown[]) => v.length > 0, "Order must have items"] },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ] satisfies OrderStatus[],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["sslcommerz", "bkash", "cod"] satisfies PaymentMethod[],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    shippingAddress: { type: shippingAddressSchema, required: true },
    couponCode: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  user: Types.ObjectId;
};

export type OrderModel = Model<OrderDocument>;

export const Order =
  (models.Order as OrderModel | undefined) ?? model<OrderDocument>("Order", orderSchema);
