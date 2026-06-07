import { ProductCard } from "@/components/shared/product-card";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/shared/section-header";
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
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
