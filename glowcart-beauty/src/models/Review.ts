import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const reviewSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    authorName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    verified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export type ReviewDocument = InferSchemaType<typeof reviewSchema> & {
  product: Types.ObjectId;
  user: Types.ObjectId;
};

export type ReviewModel = Model<ReviewDocument>;

export const Review =
  (models.Review as ReviewModel | undefined) ??
  model<ReviewDocument>("Review", reviewSchema);
