import { Container, SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { bestSellers } from "@/data/dummy";

export function BestSellers() {
  return (
    <section className="bg-beige-50/50 py-14 sm:py-16 lg:py-20">
      <Container as="div">
        <SectionHeader
          title="Best Sellers"
          subtitle="Customer favorites loved for their results and feel"
          href="/shop?sort=bestsellers"
        />
        <ProductGrid products={bestSellers} />
      </Container>
    </section>
  );
}
