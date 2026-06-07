import { Container, SectionHeader, SkinConcernCard } from "@/components/common";
import { skinConcerns } from "@/data/skin-concerns";

export function SkinConcerns() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container as="div">
        <SectionHeader
          title="Shop by Skin Concern"
          subtitle="Targeted solutions for your unique skin needs"
          href="/shop/skincare"
          align="center"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {skinConcerns.map((concern) => (
            <SkinConcernCard key={concern.id} concern={concern} />
          ))}
        </div>
      </Container>
    </section>
  );
}
