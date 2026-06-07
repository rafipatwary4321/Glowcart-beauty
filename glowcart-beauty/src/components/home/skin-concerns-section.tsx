import { SectionHeader, SkinConcernCard } from "@/components/common";
import { PageSection } from "@/components/common/section";
import { getSkinConcerns } from "@/services/homepage.service";
import type { HomeSectionProps } from "@/types";

export async function SkinConcernsSection({ className }: HomeSectionProps) {
  const concerns = await getSkinConcerns();

  return (
    <PageSection id="skin-concerns" variant="default" className={className}>
      <SectionHeader
        title="Shop by Skin Concern"
        subtitle="Targeted solutions for your unique skin needs"
        href="/shop/skincare"
        align="center"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {concerns.map((concern) => (
          <SkinConcernCard key={concern.id} data={concern} />
        ))}
      </div>
    </PageSection>
  );
}
