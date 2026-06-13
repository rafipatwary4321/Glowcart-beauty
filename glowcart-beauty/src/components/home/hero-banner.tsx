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

function resolveHeroContent(content?: HeroContent): HeroContent {
  const base = content ?? heroContent;

  return {
    badge: base.badge || heroContent.badge,
    title: base.title || heroContent.title,
    titleAccent: base.titleAccent || heroContent.titleAccent,
    description: base.description || heroContent.description,
    primaryCta: {
      label: base.primaryCta?.label || heroContent.primaryCta.label,
      href: base.primaryCta?.href || heroContent.primaryCta.href,
    },
    secondaryCta: {
      label: base.secondaryCta?.label || heroContent.secondaryCta.label,
      href: base.secondaryCta?.href || heroContent.secondaryCta.href,
    },
    stats: Array.isArray(base.stats) && base.stats.length > 0 ? base.stats : heroContent.stats,
    featured: {
      eyebrow: base.featured?.eyebrow || heroContent.featured.eyebrow,
      title: base.featured?.title || heroContent.featured.title,
      description: base.featured?.description || heroContent.featured.description,
    },
  };
}

export function HeroBanner({ content, className }: HeroBannerProps) {
  const resolved = resolveHeroContent(content);
  const stats = Array.isArray(resolved.stats) ? resolved.stats : [];

  return (
    <PageSection
      id="hero"
      spacing="none"
      variant="default"
      className={cn(
        "relative scroll-mt-28 overflow-hidden bg-gradient-to-br from-rose-50 via-beige-50 to-white py-6 sm:py-8 lg:py-10",
        className
      )}
      containerClassName="relative"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-20 top-0 size-48 rounded-full bg-rose-100/35 blur-3xl sm:size-56" />
        <div className="absolute -bottom-16 -left-16 size-56 rounded-full bg-nude-100/25 blur-3xl sm:size-64" />
      </div>

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4 text-center lg:max-w-4xl lg:items-start lg:gap-5 lg:text-left">
        <Badge
          variant="secondary"
          className="rounded-full border-0 bg-white/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm"
        >
          <Sparkles className="size-3" />
          {resolved.badge}
        </Badge>

        <h1 className="font-heading text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          <span>{resolved.title}</span>
          {resolved.titleAccent ? (
            <span className="mt-1 block text-primary">{resolved.titleAccent}</span>
          ) : null}
        </h1>

        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {resolved.description}
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center lg:justify-start">
          <Link
            href={resolved.primaryCta.href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-7 shadow-sm transition-transform hover:-translate-y-0.5 sm:px-8"
            )}
          >
            {resolved.primaryCta.label}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={resolved.secondaryCta.href}
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "rounded-full border-border/60 bg-white/70 px-7 backdrop-blur-sm transition-transform hover:-translate-y-0.5 sm:px-8"
            )}
          >
            {resolved.secondaryCta.label}
          </Link>
        </div>

        {stats.length > 0 ? (
          <div className="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-border/40 pt-4 sm:gap-x-8 lg:justify-start">
            {stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="min-w-[4.5rem] text-center lg:text-left">
                <p className="font-heading text-lg font-semibold text-foreground sm:text-xl">
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </PageSection>
  );
}
