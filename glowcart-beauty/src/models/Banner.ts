import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const bannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["hero", "promo", "announcement"],
      default: "promo",
      index: true,
    },
    imageUrl: { type: String },
    imageGradient: { type: String, default: "from-rose-100 to-pink-50" },
    ctaLabel: { type: String, trim: true },
    ctaHref: { type: String, trim: true },
    badge: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    startsAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export type BannerDocument = InferSchemaType<typeof bannerSchema>;
export type BannerModel = Model<BannerDocument>;

export const Banner =
  (models.Banner as BannerModel | undefined) ??
  model<BannerDocument>("Banner", bannerSchema);
