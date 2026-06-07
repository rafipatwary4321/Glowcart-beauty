import { Schema, model, models, type HydratedDocument, type InferSchemaType, type Model, type Types } from "mongoose";

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
    stock: { type: Number, default: 0, min: 0 },
    reservedStock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10, min: 0 },
    stockCount: { type: Number, default: 0, min: 0 },
    inStock: { type: Boolean, default: true },
    description: { type: String, default: "" },
    ingredients: { type: String, default: "" },
    howToUse: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("availableStock").get(function availableStock() {
  const stock = this.stock ?? this.stockCount ?? 0;
  const reserved = this.reservedStock ?? 0;
  return Math.max(0, stock - reserved);
});

productSchema.pre("save", function syncInventoryFields() {
  if (this.stock == null || this.stock === 0) {
    if (this.stockCount > 0) {
      this.stock = this.stockCount;
    }
  }

  this.stockCount = this.stock;
  const available = Math.max(0, (this.stock ?? 0) - (this.reservedStock ?? 0));
  this.inStock = available > 0;
});

productSchema.pre("init", function migrateLegacyStock(doc) {
  const record = doc as Record<string, unknown>;
  if ((record.stock == null || record.stock === 0) && record.stockCount) {
    record.stock = record.stockCount;
  }
  if (record.reservedStock == null) {
    record.reservedStock = 0;
  }
  if (record.lowStockThreshold == null) {
    record.lowStockThreshold = 10;
  }
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ stock: 1, reservedStock: 1 });

export type ProductDocument = HydratedDocument<
  InferSchemaType<typeof productSchema> & {
    category: Types.ObjectId;
    brand: Types.ObjectId;
    availableStock: number;
  }
>;

export type ProductModel = Model<ProductDocument>;

export const Product =
  (models.Product as ProductModel | undefined) ??
  model<ProductDocument>("Product", productSchema);
