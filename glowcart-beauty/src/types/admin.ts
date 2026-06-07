export type AdminStat = {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
};

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  itemCount: number;
};

export type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  brand: string;
  categoryId?: string;
  brandId?: string;
  price: number;
  originalPrice?: number;
  stockCount: number;
  inStock: boolean;
  skinConcerns: string[];
  badge?: string;
  imageGradient: string;
  images?: string[];
  isActive: boolean;
  updatedAt: string;
};

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  imageUrl?: string;
  imageGradient: string;
  isActive: boolean;
};

export type AdminBrandRow = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  productCount: number;
  imageUrl?: string;
  imageGradient: string;
  isActive: boolean;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  orderCount: number;
  joinedAt: string;
  status: "active" | "suspended";
};

export type AdminBannerRow = {
  id: string;
  title: string;
  subtitle?: string;
  type: "hero" | "promo" | "announcement";
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  imageGradient: string;
  sortOrder: number;
  isActive: boolean;
};

export type AdminCouponRow = {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  usageCount: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive: boolean;
};

export type AdminReviewRow = {
  id: string;
  productName: string;
  authorName: string;
  rating: number;
  comment: string;
  verified: boolean;
  isApproved: boolean;
  createdAt: string;
};

export type AdminWebsiteSettings = {
  websiteName: string;
  tagline: string;
  description?: string;
  logoUrl?: string;
  faviconUrl?: string;
  logoPlaceholder: string;
  faviconPlaceholder: string;
  footerText: string;
  socialInstagram: string;
  socialFacebook: string;
  socialPinterest: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress?: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  aboutContent?: string;
  contactContent?: string;
  privacyPolicy: string;
  termsAndConditions: string;
  returnPolicy?: string;
};

export type AdminBlogRow = {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt: string;
  author: string;
  category: string;
  status: "draft" | "published";
  publishedAt?: string;
  updatedAt: string;
};

export type AdminProductFormValues = {
  name: string;
  slug: string;
  sku: string;
  price: string;
  originalPrice: string;
  category: string;
  brand: string;
  stockCount: string;
  skinConcerns: string;
  badge: string;
  description: string;
  ingredients: string;
  howToUse: string;
  inStock: boolean;
  isActive: boolean;
};
