import { CategoryCard, SectionHeader } from "@/components/common";
import { PageSection } from "@/components/common/section";
import { getFeaturedCategories } from "@/services/homepage.service";
import type { HomeSectionProps } from "@/types";

export async function CategoriesSection({ className }: HomeSectionProps) {
  const categories = await getFeaturedCategories();

  return (
    <PageSection id="categories" variant="white" className={className}>
      <SectionHeader
        title="Featured Categories"
        subtitle="Explore our curated collections for every beauty ritual"
        href="/shop"
      />
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} data={category} />
        ))}
      </div>
    </PageSection>
  );
}
