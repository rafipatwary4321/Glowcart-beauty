import type { Metadata } from "next";

import { Container } from "@/components/common/container";
import { ProductListing } from "@/components/product";
import { productCategories, products } from "@/data/products";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse premium skincare, makeup, fragrances, and beauty essentials at GlowCart Beauty.",
};

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    concern?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const uniqueCategories = productCategories.map((name) => ({
    name,
    slug:
      products.find((p) => p.category === name)?.categorySlug ??
      name.toLowerCase().replace(/\s+/g, "-"),
  }));

  return (
    <section className="bg-beige-50/30 py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-8 space-y-2 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Shop All
          </p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Our Collection
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Discover premium cosmetics curated for every skin story — filter by
            category, brand, concern, or price.
          </p>
        </div>

        <ProductListing
          products={products}
          categories={uniqueCategories}
          initialFilters={{
            category: params.category ?? "",
            brand: params.brand ?? "",
            skinConcern: params.concern ?? "",
            sort:
              params.sort === "price-asc" ||
              params.sort === "price-desc" ||
              params.sort === "discount"
                ? params.sort
                : "latest",
          }}
        />
      </Container>
    </section>
  );
}
