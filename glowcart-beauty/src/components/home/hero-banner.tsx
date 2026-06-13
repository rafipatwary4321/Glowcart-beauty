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
  const stats = resolved.stats ?? [];

  return (
    <PageSection
      spacing="none"
      variant="default"
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-rose-50 via-beige-50 to-white py-8 sm:py-10 lg:py-12",
        className
      )}
      containerClassName="relative"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-0 size-56 rounded-full bg-rose-100/40 blur-3xl lg:size-64" />
        <div className="absolute -bottom-16 -left-12 size-64 rounded-full bg-nude-100/30 blur-3xl lg:size-72" />
      </div>

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div className="space-y-4 text-center lg:text-left">
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-white/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="size-3" />
            {resolved.badge}
          </Badge>

          <h1 className="font-heading text-3xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {resolved.title}
            {resolved.titleAccent ? (
              <span className="block text-primary">{resolved.titleAccent}</span>
            ) : null}
          </h1>

          <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
            {resolved.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
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
            <div className="flex flex-wrap items-center justify-center gap-5 border-t border-border/40 pt-4 sm:gap-8 lg:justify-start">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="hidden lg:block">
          <div
            aria-hidden
            className="aspect-[5/4] overflow-hidden rounded-3xl bg-gradient-to-br from-rose-200 via-nude-200 to-beige-100 shadow-lg ring-1 ring-border/20"
          >
            <div className="h-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.5),transparent_60%)]" />
          </div>
        </div>
      </div>
    </PageSection>
  );
}
