import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const passwordResetTokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

export type PasswordResetTokenDocument = InferSchemaType<typeof passwordResetTokenSchema> & {
  user: Types.ObjectId;
};

export type PasswordResetTokenModel = Model<PasswordResetTokenDocument>;

export const PasswordResetToken =
  (models.PasswordResetToken as PasswordResetTokenModel | undefined) ??
  model<PasswordResetTokenDocument>("PasswordResetToken", passwordResetTokenSchema);
