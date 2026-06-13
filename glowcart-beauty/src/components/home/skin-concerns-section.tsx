import { CatalogSectionEmpty } from "@/components/catalog";
import { SectionHeader, SkinConcernCard } from "@/components/common";
import { PageSection } from "@/components/common/section";
import { getSkinConcerns } from "@/services/homepage.service";
import type { HomeSectionProps } from "@/types";

export async function SkinConcernsSection({ className }: HomeSectionProps) {
  let concerns: Awaited<ReturnType<typeof getSkinConcerns>> = [];

  try {
    concerns = await getSkinConcerns();
  } catch {
    return (
      <PageSection id="skin-concerns" variant="default" className={className}>
        <SectionHeader
          title="Shop by Skin Concern"
          subtitle="Targeted solutions for your unique skin needs"
          href="/products?category=skincare"
          align="center"
        />
        <CatalogSectionEmpty
          title="Unable to load skin concerns"
          description="Please refresh the page to try again."
        />
      </PageSection>
    );
  }

  return (
    <PageSection id="skin-concerns" variant="default" className={className}>
      <SectionHeader
        title="Shop by Skin Concern"
        subtitle="Targeted solutions for your unique skin needs"
        href="/products?category=skincare"
        align="center"
      />
      {!concerns?.length ? (
        <CatalogSectionEmpty
          title="No skin concerns available"
          description="Check back soon for curated skincare collections."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {concerns.map((concern) => (
            <SkinConcernCard key={concern.id} data={concern} />
          ))}
        </div>
      )}
    </PageSection>
  );
}
