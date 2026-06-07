import { Schema, model, models, type HydratedDocument, type InferSchemaType, type Model } from "mongoose";

export type BlogStatus = "draft" | "published";

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    coverImage: { type: String, trim: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, default: "", trim: true },
    author: { type: String, required: true, trim: true, default: "GlowCart Beauty" },
    category: { type: String, default: "Beauty Tips", trim: true, index: true },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "published"] satisfies BlogStatus[],
      default: "draft",
      index: true,
    },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", excerpt: "text", content: "text" });

export type BlogDocument = HydratedDocument<InferSchemaType<typeof blogSchema>>;

export type BlogModel = Model<BlogDocument>;

export const Blog =
  (models.Blog as BlogModel | undefined) ?? model<BlogDocument>("Blog", blogSchema);
