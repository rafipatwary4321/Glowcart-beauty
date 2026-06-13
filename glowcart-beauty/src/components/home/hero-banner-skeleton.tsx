import { PageSection } from "@/components/common/section";
import { cn } from "@/lib/utils";
import type { HomeSectionProps } from "@/types";

export function HeroBannerSkeleton({ className }: HomeSectionProps) {
  return (
    <PageSection
      spacing="none"
      variant="default"
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-rose-50 via-beige-50 to-white py-8 sm:py-10 lg:py-12",
        className
      )}
      aria-busy="true"
      aria-label="Loading hero banner"
    >
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-32 rounded-full bg-muted" />
        <div className="h-12 max-w-lg rounded-lg bg-muted" />
        <div className="h-4 max-w-md rounded bg-muted" />
        <div className="flex gap-3">
          <div className="h-11 w-36 rounded-full bg-muted" />
          <div className="h-11 w-36 rounded-full bg-muted" />
        </div>
      </div>
    </PageSection>
  );
}

export function PromoBannerSkeleton({ className }: HomeSectionProps) {
  return (
    <PageSection spacing="compact" variant="default" className={className} aria-busy="true">
      <div className="h-40 animate-pulse rounded-3xl bg-muted" aria-label="Loading promotional banner" />
    </PageSection>
  );
}
