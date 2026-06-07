import { CategoryCard, Container, SectionHeader } from "@/components/common";
import { featuredCategories } from "@/data/dummy";

export function FeaturedCategories() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container as="div">
        <SectionHeader
          title="Shop by Category"
          subtitle="Explore our curated collections for every beauty ritual"
          href="/shop"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
