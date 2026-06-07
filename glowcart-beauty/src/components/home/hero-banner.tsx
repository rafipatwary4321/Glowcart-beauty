import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { PageSection } from "@/components/common/section";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { heroContent } from "@/data/hero";
import { cn } from "@/lib/utils";
import type { HeroContent, HomeSectionProps } from "@/types";

type HeroBannerProps = HomeSectionProps & {
  content?: HeroContent;
};

export function HeroBanner({ content = heroContent, className }: HeroBannerProps) {
  return (
    <PageSection
      spacing="none"
      variant="default"
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-rose-50 via-beige-50 to-white py-12 sm:py-16 lg:py-24",
        className
      )}
      containerClassName="relative"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-rose-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-nude-100/50 blur-3xl" />

      <div className="relative grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-5 text-center sm:space-y-6 lg:text-left">
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-white/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="size-3" />
            {content.badge}
          </Badge>

          <h1 className="font-heading text-3xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
            {content.title}
            <span className="block text-primary">{content.titleAccent}</span>
          </h1>

          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:max-w-lg sm:text-base lg:mx-0 lg:text-lg">
            {content.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={content.primaryCta.href}
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-7 shadow-sm transition-transform hover:-translate-y-0.5 sm:px-8"
              )}
            >
              {content.primaryCta.label}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={content.secondaryCta.href}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full border-border/60 bg-white/70 px-7 backdrop-blur-sm transition-transform hover:-translate-y-0.5 sm:px-8"
              )}
            >
              {content.secondaryCta.label}
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 border-t border-border/40 pt-5 sm:gap-8 sm:pt-6 lg:justify-start">
            {content.stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <p className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-rose-200 via-nude-200 to-beige-100 shadow-xl ring-1 ring-border/20 transition-shadow duration-300 hover:shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/50 bg-white/75 p-4 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
                {content.featured.eyebrow}
              </p>
              <p className="mt-1 font-heading text-base font-medium sm:text-lg">
                {content.featured.title}
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {content.featured.description}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-3 -left-3 hidden size-20 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 shadow-lg sm:block lg:-bottom-4 lg:-left-4 lg:size-24" />
          <div className="absolute -right-3 -top-3 hidden size-16 rounded-full bg-gradient-to-br from-beige-200 to-nude-100 shadow-md sm:block lg:-right-4 lg:-top-4 lg:size-20" />
        </div>
      </div>
    </PageSection>
  );
}
