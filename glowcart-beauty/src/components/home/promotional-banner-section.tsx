import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageSection } from "@/components/common/section";
import { buttonVariants } from "@/components/ui/button";
import { featuredPromotion } from "@/data/promotions";
import { cn } from "@/lib/utils";
import type { HomeSectionProps, Promotion } from "@/types";

type PromotionalBannerSectionProps = HomeSectionProps & {
  promotion?: Promotion;
};

export function PromotionalBannerSection({
  promotion = featuredPromotion,
  className,
}: PromotionalBannerSectionProps) {
  return (
    <PageSection spacing="compact" variant="default" className={className}>
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-12 shadow-lg sm:px-10 sm:py-16 lg:px-16">
        <div className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 size-72 rounded-full bg-nude-300/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
              {promotion.eyebrow}
            </p>
            <h2 className="font-heading text-2xl font-medium text-white sm:text-3xl lg:text-4xl">
              {promotion.title}
            </h2>
            <p className="text-sm text-white/70 sm:text-base">
              {promotion.description}
            </p>
          </div>
          <Link
            href={promotion.ctaHref}
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              "shrink-0 rounded-full bg-white px-8 text-foreground transition-transform hover:-translate-y-0.5 hover:bg-white/90"
            )}
          >
            {promotion.ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </PageSection>
  );
}
