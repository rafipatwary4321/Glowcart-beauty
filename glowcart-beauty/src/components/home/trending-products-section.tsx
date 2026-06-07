import { SectionHeader } from "@/components/common";
import { PageSection } from "@/components/common/section";
import { ProductGrid } from "@/components/product";
import { getTrendingProducts } from "@/services/product.service";
import type { HomeSectionProps } from "@/types";

export async function TrendingProductsSection({ className }: HomeSectionProps) {
  const products = await getTrendingProducts();

  return (
    <PageSection id="trending" variant="muted" className={className}>
      <SectionHeader
        title="Trending Now"
        subtitle="The most-loved products this week"
        href="/shop?sort=trending"
      />
      <ProductGrid products={products} />
    </PageSection>
  );
}
