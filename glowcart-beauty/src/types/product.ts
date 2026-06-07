export type ProductBadge = "Bestseller" | "New" | "Sale";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  brand: string;
  brandSlug: string;
  skinConcerns: string[];
  rating: number;
  reviewCount: number;
  badge?: ProductBadge;
  imageGradient: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  createdAt: string;
  description: string;
  ingredients: string;
  howToUse: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  imageGradient: string;
  description: string;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified?: boolean;
};

export type ProductSortOption =
  | "latest"
  | "price-asc"
  | "price-desc"
  | "discount";

export type ProductFilterState = {
  search: string;
  category: string;
  brand: string;
  skinConcern: string;
  minPrice: string;
  maxPrice: string;
  sort: ProductSortOption;
};

export const PRODUCT_SORT_OPTIONS: {
  value: ProductSortOption;
  label: string;
}[] = [
  { value: "latest", label: "Latest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
];

export const PRODUCT_CATEGORIES = [
  "Skincare",
  "Makeup",
  "Fragrances",
  "Gift Sets",
  "Hair Care",
  "Body Care",
] as const;
