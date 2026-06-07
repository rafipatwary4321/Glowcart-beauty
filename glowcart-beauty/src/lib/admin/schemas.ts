import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  price: z.number().min(0, "Price must be zero or greater."),
  originalPrice: z.union([z.number().min(0), z.literal("")]).optional(),
  category: z.string().min(1, "Category is required."),
  brand: z.string().min(1, "Brand is required."),
  stockCount: z.number().int().min(0, "Stock must be zero or greater."),
  skinConcerns: z.string().optional(),
  badge: z.string().optional(),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  howToUse: z.string().optional(),
  imageGradient: z.string().optional(),
  images: z.array(z.string()).optional(),
  inStock: z.boolean(),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  imageGradient: z.string().optional(),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const brandFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  tagline: z.string().optional(),
  imageUrl: z.string().optional(),
  imageGradient: z.string().optional(),
  isActive: z.boolean(),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

export const bannerFormSchema = z.object({
  title: z.string().min(2, "Title is required."),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["hero", "promo", "announcement"]),
  imageUrl: z.string().optional(),
  imageGradient: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean(),
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;

export const couponFormSchema = z.object({
  code: z.string().min(2, "Coupon code is required."),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(0, "Discount value is required."),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(0).optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean(),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;

export const blogFormSchema = z.object({
  title: z.string().min(2, "Title is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  coverImage: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  author: z.string().min(1, "Author is required."),
  category: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
