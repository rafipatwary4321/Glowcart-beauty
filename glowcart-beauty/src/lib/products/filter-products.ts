import type { Product, ProductFilterState, ProductSortOption } from "@/types";

export function calcDiscountPercent(product: Product): number {
  if (!product.originalPrice) return 0;
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}

export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilterState
): Product[] {
  let result = [...products];

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (filters.category) {
    result = result.filter((p) => p.categorySlug === filters.category);
  }

  if (filters.brand) {
    result = result.filter((p) => p.brandSlug === filters.brand);
  }

  if (filters.skinConcern) {
    result = result.filter((p) =>
      p.skinConcerns.includes(filters.skinConcern)
    );
  }

  if (filters.minPrice) {
    const min = Number(filters.minPrice);
    if (!Number.isNaN(min)) result = result.filter((p) => p.price >= min);
  }

  if (filters.maxPrice) {
    const max = Number(filters.maxPrice);
    if (!Number.isNaN(max)) result = result.filter((p) => p.price <= max);
  }

  return sortProducts(result, filters.sort);
}

export function sortProducts(
  products: Product[],
  sort: ProductSortOption
): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "discount":
      return sorted.sort(
        (a, b) => calcDiscountPercent(b) - calcDiscountPercent(a)
      );
    case "latest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}
