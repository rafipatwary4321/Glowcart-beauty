import { CategoryCard, SectionHeader } from "@/components/common";
import { CatalogSectionEmpty } from "@/components/catalog";
import { PageSection } from "@/components/common/section";
import { getFeaturedCategories } from "@/services/homepage.service";
import type { HomeSectionProps } from "@/types";

export async function CategoriesSection({ className }: HomeSectionProps) {
  let categories: Awaited<ReturnType<typeof getFeaturedCategories>> = [];

  try {
    categories = await getFeaturedCategories();
  } catch {
    return (
      <PageSection id="categories" variant="white" className={className}>
        <SectionHeader
          title="Featured Categories"
          subtitle="Explore our curated collections for every beauty ritual"
          href="/products"
        />
        <CatalogSectionEmpty
          title="Unable to load categories"
          description="Please refresh the page to try again."
        />
      </PageSection>
    );
  }

  return (
    <PageSection id="categories" variant="white" className={className}>
      <SectionHeader
        title="Featured Categories"
        subtitle="Explore our curated collections for every beauty ritual"
        href="/products"
      />
      {!categories?.length ? (
        <CatalogSectionEmpty
          title="No categories yet"
          description="Featured categories will appear here once they are added in admin."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} data={category} />
          ))}
        </div>
      )}
    </PageSection>
  );
}
