import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const stockHistorySchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", index: true },
    changeType: {
      type: String,
      enum: ["reserve", "release", "commit", "adjustment"],
      required: true,
    },
    quantity: { type: Number, required: true },
    stockBefore: { type: Number, required: true, min: 0 },
    stockAfter: { type: Number, required: true, min: 0 },
    reservedBefore: { type: Number, required: true, min: 0 },
    reservedAfter: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

stockHistorySchema.index({ createdAt: -1 });

export type StockHistoryDocument = InferSchemaType<typeof stockHistorySchema> & {
  product: Types.ObjectId;
  order?: Types.ObjectId;
  createdBy?: Types.ObjectId;
};

export type StockHistoryModel = Model<StockHistoryDocument>;

export const StockHistory =
  (models.StockHistory as StockHistoryModel | undefined) ??
  model<StockHistoryDocument>("StockHistory", stockHistorySchema);
