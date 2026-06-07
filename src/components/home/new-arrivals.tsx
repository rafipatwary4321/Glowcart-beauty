import { ProductCard } from "@/components/shared/product-card";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
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
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
