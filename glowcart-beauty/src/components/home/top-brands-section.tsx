import { BrandCard, SectionHeader } from "@/components/common";
import { CatalogSectionEmpty } from "@/components/catalog";
import { PageSection } from "@/components/common/section";
import { getTopBrands } from "@/services/homepage.service";
import { cn } from "@/lib/utils";
import type { HomeSectionProps } from "@/types";

export async function TopBrandsSection({ className }: HomeSectionProps) {
  let brands: Awaited<ReturnType<typeof getTopBrands>> = [];

  try {
    brands = await getTopBrands();
  } catch {
    return (
      <PageSection
        id="brands"
        variant="white"
        spacing="none"
        className={cn("border-y border-border/40 py-14 sm:py-16 lg:py-20", className)}
      >
        <SectionHeader
          title="Top Brands"
          subtitle="Discover premium beauty houses trusted by thousands"
          href="/products"
        />
        <CatalogSectionEmpty
          title="Unable to load brands"
          description="Please refresh the page to try again."
        />
      </PageSection>
    );
  }

  return (
    <PageSection
      id="brands"
      variant="white"
      spacing="none"
      className={cn("border-y border-border/40 py-14 sm:py-16 lg:py-20", className)}
    >
      <SectionHeader
        title="Top Brands"
        subtitle="Discover premium beauty houses trusted by thousands"
        href="/products"
      />
      {!brands?.length ? (
        <CatalogSectionEmpty
          title="No brands yet"
          description="Top brands will appear here once they are added in admin."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
          {brands.map((brand) => (
            <BrandCard key={brand.id} data={brand} />
          ))}
        </div>
      )}
    </PageSection>
  );
}
