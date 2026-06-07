import { products } from "./products";

export const bestSellers = products.filter((p) => p.badge === "Bestseller");
export const newArrivals = products.filter((p) => p.badge === "New");
