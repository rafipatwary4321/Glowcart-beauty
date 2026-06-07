import { Container, SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { trendingProducts } from "@/data/trending-products";

export function TrendingProducts() {
  return (
    <section className="bg-beige-50/60 py-14 sm:py-16 lg:py-20">
      <Container as="div">
        <SectionHeader
          title="Trending Now"
          subtitle="The most-loved products this week"
          href="/shop?sort=trending"
        />
        <ProductGrid products={trendingProducts} />
      </Container>
    </section>
  );
}
