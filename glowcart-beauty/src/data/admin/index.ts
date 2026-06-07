import type {
  AdminBannerRow,
  AdminBrandRow,
  AdminCategoryRow,
  AdminCouponRow,
  AdminOrderRow,
  AdminProductRow,
  AdminReviewRow,
  AdminStat,
  AdminUserRow,
  AdminWebsiteSettings,
} from "@/types/admin";
import { topBrands } from "@/data/brands";
import { featuredCategories } from "@/data/categories";
import { products } from "@/data/products";
import { featuredPromotion } from "@/data/promotions";
import { heroContent } from "@/data/hero";
import { siteConfig } from "@/constants/site-config";

export const adminDashboardStats: AdminStat[] = [
  { label: "Total Sales", value: "৳8,42,560", change: "+12.4%", trend: "up" },
  { label: "Total Orders", value: "1,284", change: "+8.2%", trend: "up" },
  { label: "Total Products", value: String(products.length), change: "+3", trend: "neutral" },
  { label: "Total Customers", value: "5,042", change: "+156", trend: "up" },
];

export const adminRecentOrders: AdminOrderRow[] = [
  {
    id: "ord_001",
    orderNumber: "GC-10519",
    customerName: "Ayesha Rahman",
    customerEmail: "demo@glowcart.com",
    total: 4560,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "bKash",
    createdAt: "2026-06-05T10:30:00",
    itemCount: 4,
  },
  {
    id: "ord_002",
    orderNumber: "GC-10501",
    customerName: "Nadia Islam",
    customerEmail: "nadia@example.com",
    total: 1890,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "SSLCommerz",
    createdAt: "2026-06-02T14:15:00",
    itemCount: 2,
  },
  {
    id: "ord_003",
    orderNumber: "GC-10482",
    customerName: "Ayesha Rahman",
    customerEmail: "demo@glowcart.com",
    total: 3240,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "COD",
    createdAt: "2026-05-28T09:00:00",
    itemCount: 3,
  },
  {
    id: "ord_004",
    orderNumber: "GC-10471",
    customerName: "Sara Chowdhury",
    customerEmail: "sara@example.com",
    total: 980,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "bKash",
    createdAt: "2026-05-27T16:45:00",
    itemCount: 1,
  },
  {
    id: "ord_005",
    orderNumber: "GC-10455",
    customerName: "Fatima Khan",
    customerEmail: "fatima@example.com",
    total: 5120,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "SSLCommerz",
    createdAt: "2026-05-25T11:20:00",
    itemCount: 5,
  },
];

export const adminLowStockProducts: AdminProductRow[] = products
  .filter((product) => product.stockCount <= 20)
  .slice(0, 5)
  .map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: `GC-${product.id.toUpperCase()}`,
    category: product.category,
    brand: product.brand,
    price: product.price,
    originalPrice: product.originalPrice,
    stockCount: product.stockCount,
    inStock: product.inStock,
    skinConcerns: product.skinConcerns,
    badge: product.badge,
    imageGradient: product.imageGradient,
    isActive: true,
    updatedAt: product.createdAt,
  }));

export const adminSalesChartData = [
  { month: "Jan", sales: 62000 },
  { month: "Feb", sales: 71000 },
  { month: "Mar", sales: 68000 },
  { month: "Apr", sales: 84000 },
  { month: "May", sales: 92000 },
  { month: "Jun", sales: 88000 },
];

export const adminProducts: AdminProductRow[] = products.map((product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  sku: `GC-${product.id.toUpperCase()}`,
  category: product.category,
  brand: product.brand,
  price: product.price,
  originalPrice: product.originalPrice,
  stockCount: product.stockCount,
  inStock: product.inStock,
  skinConcerns: product.skinConcerns,
  badge: product.badge,
  imageGradient: product.imageGradient,
  isActive: true,
  updatedAt: product.createdAt,
}));

export const adminCategories: AdminCategoryRow[] = featuredCategories.map((category) => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  productCount: category.productCount,
  imageGradient: category.imageGradient,
  isActive: true,
}));

export const adminBrands: AdminBrandRow[] = topBrands.map((brand) => ({
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
  tagline: brand.tagline,
  productCount: brand.productCount,
  imageGradient: brand.imageGradient,
  isActive: true,
}));

export const adminOrders: AdminOrderRow[] = adminRecentOrders;

export const adminUsers: AdminUserRow[] = [
  {
    id: "user_001",
    name: "Ayesha Rahman",
    email: "demo@glowcart.com",
    role: "customer",
    orderCount: 12,
    joinedAt: "2025-11-10",
    status: "active",
  },
  {
    id: "user_002",
    name: "GlowCart Admin",
    email: "admin@glowcart.com",
    role: "admin",
    orderCount: 0,
    joinedAt: "2025-01-01",
    status: "active",
  },
  {
    id: "user_003",
    name: "Nadia Islam",
    email: "nadia@example.com",
    role: "customer",
    orderCount: 8,
    joinedAt: "2026-01-22",
    status: "active",
  },
  {
    id: "user_004",
    name: "Sara Chowdhury",
    email: "sara@example.com",
    role: "customer",
    orderCount: 3,
    joinedAt: "2026-03-05",
    status: "active",
  },
  {
    id: "user_005",
    name: "Fatima Khan",
    email: "fatima@example.com",
    role: "customer",
    orderCount: 15,
    joinedAt: "2025-08-18",
    status: "suspended",
  },
];

export const adminBanners: AdminBannerRow[] = [
  {
    id: "banner_001",
    title: heroContent.title,
    subtitle: heroContent.titleAccent,
    type: "hero",
    ctaLabel: heroContent.primaryCta.label,
    ctaHref: heroContent.primaryCta.href,
    imageGradient: "from-rose-100 via-pink-50 to-beige-100",
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "banner_002",
    title: featuredPromotion.title,
    subtitle: featuredPromotion.eyebrow,
    type: "promo",
    ctaLabel: featuredPromotion.ctaLabel,
    ctaHref: featuredPromotion.ctaHref,
    imageGradient: "from-rose-200 via-pink-100 to-beige-100",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "banner_003",
    title: "Free delivery over ৳2,000",
    subtitle: "Announcement",
    type: "announcement",
    imageGradient: "from-beige-100 to-nude-100",
    sortOrder: 2,
    isActive: true,
  },
];

export const adminCoupons: AdminCouponRow[] = [
  {
    id: "coupon_001",
    code: "GLOW10",
    description: "10% off your first order",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 1500,
    usageCount: 342,
    usageLimit: 1000,
    expiresAt: "2026-12-31",
    isActive: true,
  },
  {
    id: "coupon_002",
    code: "FREESHIP",
    description: "Flat ৳120 delivery discount",
    discountType: "fixed",
    discountValue: 120,
    minOrderAmount: 1000,
    usageCount: 128,
    isActive: true,
  },
  {
    id: "coupon_003",
    code: "SUMMER25",
    description: "Summer sale — 25% off",
    discountType: "percentage",
    discountValue: 25,
    minOrderAmount: 2500,
    usageCount: 89,
    usageLimit: 500,
    expiresAt: "2026-08-31",
    isActive: false,
  },
];

export const adminReviews: AdminReviewRow[] = [
  {
    id: "rev_001",
    productName: "Velvet Rose Hydrating Serum",
    authorName: "Ayesha Rahman",
    rating: 5,
    comment: "Absolutely love this product. My skin feels hydrated all day!",
    verified: true,
    isApproved: true,
    createdAt: "2026-05-20",
  },
  {
    id: "rev_002",
    productName: "Luminous Silk Foundation",
    authorName: "Nadia Islam",
    rating: 4,
    comment: "Beautiful finish, slightly light for my skin tone.",
    verified: true,
    isApproved: true,
    createdAt: "2026-05-18",
  },
  {
    id: "rev_003",
    productName: "Nude Glow Lip Oil",
    authorName: "Sara Chowdhury",
    rating: 5,
    comment: "Perfect everyday lip product. Not sticky at all.",
    verified: false,
    isApproved: false,
    createdAt: "2026-06-01",
  },
];

export const adminWebsiteSettings: AdminWebsiteSettings = {
  websiteName: siteConfig.name,
  tagline: siteConfig.tagline,
  logoPlaceholder: "/placeholder-logo.png",
  faviconPlaceholder: "/favicon.ico",
  footerText:
    "Premium cosmetics curated for every skin story. Discover skincare, makeup, and fragrances crafted for luminous confidence.",
  socialInstagram: siteConfig.social.instagram,
  socialFacebook: siteConfig.social.facebook,
  socialPinterest: siteConfig.social.pinterest,
  contactPhone: siteConfig.contact.phone,
  contactEmail: siteConfig.contact.email,
  deliveryCharge: 120,
  freeDeliveryThreshold: 2000,
  privacyPolicy:
    "We respect your privacy and protect your personal data in accordance with applicable laws.",
  termsAndConditions:
    "By using GlowCart Beauty, you agree to our terms of service and purchase policies.",
};

export function getAdminProductById(id: string) {
  return adminProducts.find((product) => product.id === id);
}

export function getAdminProductFormDefaults(id?: string) {
  const product = id ? getAdminProductById(id) : undefined;
  const source = product ?? adminProducts[0];

  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    sku: product?.sku ?? "",
    price: product ? String(product.price) : "",
    originalPrice: product?.originalPrice ? String(product.originalPrice) : "",
    category: product?.category ?? source.category,
    brand: product?.brand ?? source.brand,
    stockCount: product ? String(product.stockCount) : "0",
    skinConcerns: product?.skinConcerns.join(", ") ?? "",
    badge: product?.badge ?? "",
    description: "",
    ingredients: "",
    howToUse: "",
    inStock: product?.inStock ?? true,
    isActive: product?.isActive ?? true,
    imageGradient: product?.imageGradient ?? "from-rose-100 to-pink-50",
  };
}
