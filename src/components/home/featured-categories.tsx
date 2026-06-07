import { CategoryCard, Container, SectionHeader } from "@/components/common";
import { featuredCategories } from "@/data/categories";

export function FeaturedCategories() {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <Container as="div">
        <SectionHeader
          title="Featured Categories"
          subtitle="Explore our curated collections for every beauty ritual"
          href="/shop"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
