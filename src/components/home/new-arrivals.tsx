import { Container, SectionHeader } from "@/components/common";
import { ProductGrid } from "@/components/product";
import { newArrivals } from "@/data/dummy";

export function NewArrivals() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container as="div">
        <SectionHeader
          title="New Arrivals"
          subtitle="Fresh drops to elevate your beauty routine"
          href="/shop?sort=newest"
        />
        <ProductGrid products={newArrivals} />
      </Container>
    </section>
  );
}
