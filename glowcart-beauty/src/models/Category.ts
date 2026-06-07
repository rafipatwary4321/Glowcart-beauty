import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String },
    imageGradient: { type: String, default: "from-rose-100 to-pink-50" },
    productCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;
export type CategoryModel = Model<CategoryDocument>;

export const Category =
  (models.Category as CategoryModel | undefined) ??
  model<CategoryDocument>("Category", categorySchema);
