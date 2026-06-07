import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, default: "" },
    imageGradient: { type: String, default: "from-beige-100 to-nude-100" },
    productCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type BrandDocument = InferSchemaType<typeof brandSchema>;
export type BrandModel = Model<BrandDocument>;

export const Brand =
  (models.Brand as BrandModel | undefined) ?? model<BrandDocument>("Brand", brandSchema);
