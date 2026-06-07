import { Schema, model, models, type HydratedDocument, type InferSchemaType, type Model, type Types } from "mongoose";

import type { DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order";
import type { TrackingEvent, TrackingStatus } from "@/types/tracking";

const trackingEventSchema = new Schema(
  {
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ] satisfies TrackingStatus[],
      required: true,
    },
    note: { type: String, trim: true },
    at: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

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
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true, lowercase: true },
    customerPhone: { type: String, required: true, trim: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(v: unknown[]) => v.length > 0, "Order must have items"],
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ] satisfies OrderStatus[],
      default: "pending",
      index: true,
    },
    deliveryMethod: {
      type: String,
      enum: ["standard", "express"] satisfies DeliveryMethod[],
      default: "standard",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "bkash", "nagad", "sslcommerz", "card"] satisfies PaymentMethod[],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded"] satisfies PaymentStatus[],
      default: "pending",
    },
    transactionId: { type: String, trim: true, index: true },
    stockFulfilled: { type: Boolean, default: false },
    stockReserved: { type: Boolean, default: false },
    stockCommitted: { type: Boolean, default: false },
    paymentGatewayResponse: { type: Schema.Types.Mixed },
    shippingAddress: { type: shippingAddressSchema, required: true },
    couponCode: { type: String, trim: true },
    trackingCode: { type: String, trim: true },
    trackingStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ] satisfies TrackingStatus[],
      default: "pending",
      index: true,
    },
    trackingEvents: { type: [trackingEventSchema], default: [] },
    notes: { type: String, trim: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual("deliveryCharge").get(function deliveryCharge() {
  return this.deliveryFee;
});

orderSchema.virtual("orderStatus").get(function orderStatus() {
  return this.status;
});

export type OrderDocument = HydratedDocument<
  InferSchemaType<typeof orderSchema> & {
    user: Types.ObjectId;
  }
>;

export type OrderModel = Model<OrderDocument>;

export const Order =
  (models.Order as OrderModel | undefined) ?? model<OrderDocument>("Order", orderSchema);
