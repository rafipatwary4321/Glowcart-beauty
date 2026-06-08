import { Container } from "@/components/common/container";
import { Skeleton } from "@/components/ui/skeleton";

import { BrandGridSkeleton } from "./brand-grid-skeleton";
import { CategoryGridSkeleton } from "./category-grid-skeleton";
import { HeroSkeleton } from "./hero-skeleton";
import { ProductGridSkeleton } from "./product-grid-skeleton";
import { SkinConcernGridSkeleton } from "./skin-concern-grid-skeleton";

function SectionHeaderSkeleton({ centered = false }: { centered?: boolean }) {
  return (
    <div
      className={`mb-8 space-y-3 sm:mb-10 ${centered ? "mx-auto max-w-md text-center" : ""}`}
    >
      <Skeleton className={`h-8 w-48 ${centered ? "mx-auto" : ""}`} />
      <Skeleton className={`h-4 w-72 max-w-full ${centered ? "mx-auto" : ""}`} />
    </div>
  );
}

export function HomepageSkeleton() {
  return (
    <>
      <HeroSkeleton />

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <Container>
          <SectionHeaderSkeleton />
          <CategoryGridSkeleton />
        </Container>
      </section>

      <section className="border-y border-border/40 bg-white py-14 sm:py-16 lg:py-20">
        <Container>
          <SectionHeaderSkeleton />
          <BrandGridSkeleton />
        </Container>
      </section>

      <section className="bg-beige-50/60 py-14 sm:py-16 lg:py-20">
        <Container>
          <SectionHeaderSkeleton />
          <ProductGridSkeleton />
        </Container>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <Container>
          <SectionHeaderSkeleton centered />
          <SkinConcernGridSkeleton />
        </Container>
      </section>

      <section className="py-8 sm:py-10">
        <Container>
          <Skeleton className="h-48 w-full rounded-3xl sm:h-56" />
        </Container>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <Container>
          <Skeleton className="mx-auto h-72 max-w-2xl rounded-3xl" />
        </Container>
      </section>
    </>
  );
}
