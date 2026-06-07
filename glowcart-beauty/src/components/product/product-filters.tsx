"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { topBrands } from "@/data/brands";
import { skinConcerns } from "@/data/skin-concerns";
import { priceRange } from "@/data/products";
import { filterAndSortProducts } from "@/lib/products/filter-products";
import { cn } from "@/lib/utils";
import type { Product, ProductFilterState, ProductSortOption } from "@/types";
import { PRODUCT_SORT_OPTIONS } from "@/types/product";

type ProductFiltersProps = {
  filters: ProductFilterState;
  onChange: (filters: ProductFilterState) => void;
  categories: { name: string; slug: string }[];
  className?: string;
  variant?: "sidebar" | "sheet";
};

function FilterFields({
  filters,
  onChange,
  categories,
}: Omit<ProductFiltersProps, "variant" | "className">) {
  const update = (patch: Partial<ProductFilterState>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium text-foreground">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            type="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="rounded-full bg-white pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium text-foreground">
          Category
        </label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => update({ category: e.target.value })}
          className="h-9 w-full rounded-full border border-border/60 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="brand" className="text-sm font-medium text-foreground">
          Brand
        </label>
        <select
          id="brand"
          value={filters.brand}
          onChange={(e) => update({ brand: e.target.value })}
          className="h-9 w-full rounded-full border border-border/60 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">All brands</option>
          {topBrands.map((b) => (
            <option key={b.slug} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="concern" className="text-sm font-medium text-foreground">
          Skin Concern
        </label>
        <select
          id="concern"
          value={filters.skinConcern}
          onChange={(e) => update({ skinConcern: e.target.value })}
          className="h-9 w-full rounded-full border border-border/60 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        >
          <option value="">All concerns</option>
          {skinConcerns.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Price range</span>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder={`Min (${priceRange.min})`}
            value={filters.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            className="rounded-full bg-white"
            min={0}
          />
          <Input
            type="number"
            placeholder={`Max (${priceRange.max})`}
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            className="rounded-full bg-white"
            min={0}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="sort" className="text-sm font-medium text-foreground">
          Sort by
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) =>
            update({ sort: e.target.value as ProductSortOption })
          }
          className="h-9 w-full rounded-full border border-border/60 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        >
          {PRODUCT_SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function ProductFilters({
  filters,
  onChange,
  categories,
  className,
  variant = "sidebar",
}: ProductFiltersProps) {
  if (variant === "sheet") {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="rounded-full lg:hidden">
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filter Products</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <FilterFields
              filters={filters}
              onChange={onChange}
              categories={categories}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border/60 bg-white p-5 shadow-sm",
        className
      )}
    >
      <h2 className="mb-5 font-heading text-lg font-medium">Filters</h2>
      <FilterFields
        filters={filters}
        onChange={onChange}
        categories={categories}
      />
    </aside>
  );
}

const defaultFilters: ProductFilterState = {
  search: "",
  category: "",
  brand: "",
  skinConcern: "",
  minPrice: "",
  maxPrice: "",
  sort: "latest",
};

type ProductListingProps = {
  products: Product[];
  categories: { name: string; slug: string }[];
  initialFilters?: Partial<ProductFilterState>;
};

export function ProductListing({
  products,
  categories,
  initialFilters = {},
}: ProductListingProps) {
  const [filters, setFilters] = useState<ProductFilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  const filtered = useMemo(
    () => filterAndSortProducts(products, filters),
    [products, filters]
  );

  const clearFilters = useCallback(() => setFilters(defaultFilters), []);

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.skinConcern ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{filtered.length}</span>{" "}
          of {products.length} products
        </p>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground"
              onClick={clearFilters}
            >
              <X className="size-3.5" />
              Clear filters
            </Button>
          )}
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            categories={categories}
            variant="sheet"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <ProductFilters
          filters={filters}
          onChange={setFilters}
          categories={categories}
          className="hidden lg:block"
        />

        {filtered.length > 0 ? (
          <ProductGrid products={filtered} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-beige-50/50 py-16 text-center">
            <p className="font-heading text-lg font-medium text-foreground">
              No products found
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Try adjusting your filters or search term to find what you&apos;re
              looking for.
            </p>
            <Button
              variant="outline"
              className="mt-4 rounded-full"
              onClick={clearFilters}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
