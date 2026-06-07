import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

import type { ProductBadge } from "@/types/product";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true, index: true },
    skinConcerns: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    badge: {
      type: String,
      enum: ["Bestseller", "New", "Sale"] satisfies ProductBadge[],
    },
    imageGradient: { type: String, default: "from-rose-100 to-pink-50" },
    images: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "" },
    ingredients: { type: String, default: "" },
    howToUse: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  category: Types.ObjectId;
  brand: Types.ObjectId;
};

export type ProductModel = Model<ProductDocument>;

export const Product =
  (models.Product as ProductModel | undefined) ??
  model<ProductDocument>("Product", productSchema);
