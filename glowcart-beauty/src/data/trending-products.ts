import { products } from "./products";

export const trendingProducts = products
  .filter((p) => p.badge === "Bestseller" || p.badge === "New" || p.badge === "Sale")
  .slice(0, 8);
