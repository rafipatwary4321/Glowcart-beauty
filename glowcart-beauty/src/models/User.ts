import bcrypt from "bcryptjs";
import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

import type { UserRole } from "@/types/user";

const addressSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ["customer", "admin"] satisfies UserRole[],
      default: "customer",
    },
    image: { type: String },
    addresses: { type: [addressSchema], default: [] },
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function comparePassword(
  candidate: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export type UserDocument = InferSchemaType<typeof userSchema> & {
  comparePassword(candidate: string): Promise<boolean>;
};

export type UserModel = Model<UserDocument>;

export const User =
  (models.User as UserModel | undefined) ?? model<UserDocument>("User", userSchema);
