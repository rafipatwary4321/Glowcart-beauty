import { CatalogSectionEmpty } from "@/components/catalog";
import { SectionHeader } from "@/components/common";
import { PageSection } from "@/components/common/section";
import { ProductGrid } from "@/components/product";
import { getTrendingProducts } from "@/services/product.service";
import type { HomeSectionProps } from "@/types";

export async function TrendingProductsSection({ className }: HomeSectionProps) {
  let products: Awaited<ReturnType<typeof getTrendingProducts>> = [];

  try {
    products = await getTrendingProducts();
  } catch {
    return (
      <PageSection id="trending" variant="muted" className={className}>
        <SectionHeader
          title="Trending Now"
          subtitle="The most-loved products this week"
          href="/products?sort=trending"
        />
        <CatalogSectionEmpty
          title="Unable to load trending products"
          description="Please refresh the page to try again."
        />
      </PageSection>
    );
  }

  return (
    <PageSection id="trending" variant="muted" className={className}>
      <SectionHeader
        title="Trending Now"
        subtitle="The most-loved products this week"
        href="/products?sort=trending"
      />
      {!products?.length ? (
        <CatalogSectionEmpty
          title="No trending products yet"
          description="Popular products will appear here once they are published."
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </PageSection>
  );
}
