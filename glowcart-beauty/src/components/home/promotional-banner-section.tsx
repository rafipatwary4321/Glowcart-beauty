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

function resolvePromotion(promotion?: Promotion): Promotion {
  const base = promotion ?? featuredPromotion;

  return {
    id: base.id || featuredPromotion.id,
    eyebrow: base.eyebrow || featuredPromotion.eyebrow,
    title: base.title || featuredPromotion.title,
    description: base.description || featuredPromotion.description,
    ctaLabel: base.ctaLabel || featuredPromotion.ctaLabel,
    ctaHref: base.ctaHref || featuredPromotion.ctaHref,
  };
}

export function PromotionalBannerSection({
  promotion,
  className,
}: PromotionalBannerSectionProps) {
  const resolved = resolvePromotion(promotion);

  if (!resolved.title?.trim()) {
    return null;
  }

  return (
    <PageSection spacing="compact" variant="default" className={className}>
      <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-10 shadow-lg sm:px-10 sm:py-12 lg:px-14">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 size-56 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-10 size-64 rounded-full bg-nude-300/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-5 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="max-w-xl space-y-2">
            {resolved.eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
                {resolved.eyebrow}
              </p>
            ) : null}
            <h2 className="font-heading text-2xl font-medium text-white sm:text-3xl lg:text-4xl">
              {resolved.title}
            </h2>
            {resolved.description ? (
              <p className="text-sm text-white/70 sm:text-base">{resolved.description}</p>
            ) : null}
          </div>
          <Link
            href={resolved.ctaHref}
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              "shrink-0 rounded-full bg-white px-8 text-foreground transition-transform hover:-translate-y-0.5 hover:bg-white/90"
            )}
          >
            {resolved.ctaLabel}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </PageSection>
  );
}
