import { PageSection } from "@/components/common/section";
import { cn } from "@/lib/utils";
import type { HomeSectionProps } from "@/types";

export function HeroBannerSkeleton({ className }: HomeSectionProps) {
  return (
    <PageSection
      id="hero"
      spacing="none"
      variant="default"
      className={cn(
        "relative scroll-mt-28 overflow-hidden bg-gradient-to-br from-rose-50 via-beige-50 to-white py-6 sm:py-8 lg:py-10",
        className
      )}
      aria-busy="true"
      aria-label="Loading hero banner"
    >
      <div className="mx-auto flex w-full max-w-3xl animate-pulse flex-col items-center gap-4 lg:max-w-4xl lg:items-start">
        <div className="h-6 w-32 rounded-full bg-muted" />
        <div className="h-12 w-full max-w-lg rounded-lg bg-muted" />
        <div className="h-4 w-full max-w-md rounded bg-muted" />
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="h-11 w-full rounded-full bg-muted sm:w-36" />
          <div className="h-11 w-full rounded-full bg-muted sm:w-36" />
        </div>
      </div>
    </PageSection>
  );
}

export function PromoBannerSkeleton({ className }: HomeSectionProps) {
  return (
    <PageSection spacing="compact" variant="default" className={className} aria-busy="true">
      <div className="h-36 animate-pulse rounded-3xl bg-muted sm:h-40" aria-label="Loading promotional banner" />
    </PageSection>
  );
}
