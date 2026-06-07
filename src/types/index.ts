export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewCount: number;
  badge?: "Bestseller" | "New" | "Sale";
  imageGradient: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  imageGradient: string;
  description: string;
};
