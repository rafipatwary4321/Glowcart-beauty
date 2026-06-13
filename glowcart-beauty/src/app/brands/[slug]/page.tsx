import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogEmptyState } from "@/components/catalog";
import { Container } from "@/components/common/container";
import { ProductListing } from "@/components/product";
import {
  getPublicBrandBySlug,
  getPublicBrands,
  getPublicCategories,
  getPublicProductsByBrandSlug,
  toBrandOptions,
  toCategoryOptions,
} from "@/lib/catalog/service";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BrandPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getPublicBrandBySlug(slug);
  if (!brand) return { title: "Brand Not Found" };

  return buildPageMetadata({
    title: `${brand.name} Collection`,
    description: brand.description,
    path: `/brands/${brand.slug}`,
    image: brand.imageUrl ?? undefined,
  });
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = await getPublicBrandBySlug(slug);
  if (!brand) notFound();

  const [products, categories, brands] = await Promise.all([
    getPublicProductsByBrandSlug(brand.slug),
    getPublicCategories(),
    getPublicBrands(),
  ]);

  return (
    <section className="bg-beige-50/30 py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="mb-8 space-y-2 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Brand</p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {brand.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{brand.description}</p>
        </div>
        {products.length === 0 ? (
          <CatalogEmptyState
            title={`No products from ${brand.name} yet`}
            description="Products from this brand will appear here once they are published."
            actionLabel="Browse all products"
            actionHref="/products"
          />
        ) : (
          <ProductListing
            products={products}
            categories={toCategoryOptions(categories)}
            brands={toBrandOptions(brands)}
            initialFilters={{ category: "", brand: brand.slug, skinConcern: "", sort: "latest" }}
          />
        )}
      </Container>
    </section>
  );
}
