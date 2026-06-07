import { Schema, model, models, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

const siteSettingsSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true },
    websiteName: { type: String, default: "GlowCart Beauty", trim: true },
    tagline: { type: String, default: "Radiance, refined.", trim: true },
    description: { type: String, default: "", trim: true },
    logoUrl: { type: String, trim: true },
    faviconUrl: { type: String, trim: true },
    footerText: { type: String, default: "", trim: true },
    socialInstagram: { type: String, trim: true },
    socialFacebook: { type: String, trim: true },
    socialPinterest: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    contactAddress: { type: String, trim: true },
    deliveryCharge: { type: Number, default: 80, min: 0 },
    freeDeliveryThreshold: { type: Number, default: 2000, min: 0 },
    aboutContent: { type: String, default: "" },
    contactContent: { type: String, default: "" },
    privacyPolicy: { type: String, default: "" },
    termsAndConditions: { type: String, default: "" },
    returnPolicy: { type: String, default: "" },
  },
  { timestamps: true }
);

export type SiteSettingsDocument = HydratedDocument<InferSchemaType<typeof siteSettingsSchema>>;

export type SiteSettingsModel = Model<SiteSettingsDocument>;

export const SiteSettings =
  (models.SiteSettings as SiteSettingsModel | undefined) ??
  model<SiteSettingsDocument>("SiteSettings", siteSettingsSchema);
