import { BrandCard, Container, SectionHeader } from "@/components/common";
import { topBrands } from "@/data/brands";

export function TopBrands() {
  return (
    <section className="border-y border-border/40 bg-white py-14 sm:py-16 lg:py-20">
      <Container as="div">
        <SectionHeader
          title="Top Brands"
          subtitle="Discover premium beauty houses trusted by thousands"
          href="/shop/brands"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
          {topBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </Container>
    </section>
  );
}
