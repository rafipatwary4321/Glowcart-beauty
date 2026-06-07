import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Container } from "@/components/common/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-beige-50 to-white">
      <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-rose-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-nude-100/50 blur-3xl" />

      <Container as="div" className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6 text-center lg:text-left">
            <Badge
              variant="secondary"
              className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm"
            >
              <Sparkles className="size-3" />
              Spring Collection 2026
            </Badge>

            <h1 className="font-heading text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Discover your
              <span className="block text-primary"> natural radiance</span>
            </h1>

            <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Premium skincare, makeup, and fragrances curated for luminous skin
              and effortless beauty. Crafted with care, delivered to your door.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/shop"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full px-8"
                )}
              >
                Shop Collection
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-full bg-white/60 px-8 backdrop-blur-sm"
                )}
              >
                Our Story
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 lg:justify-start">
              {[
                { value: "500+", label: "Premium Products" },
                { value: "50K+", label: "Happy Customers" },
                { value: "4.9", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="font-heading text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-rose-200 via-nude-200 to-beige-100 shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_50%)]" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur-md">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Featured
                </p>
                <p className="mt-1 font-heading text-lg font-medium">
                  Velvet Rose Hydrating Serum
                </p>
                <p className="text-sm text-muted-foreground">
                  Deep hydration with a dewy finish
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden size-24 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 shadow-lg sm:block" />
            <div className="absolute -right-4 -top-4 hidden size-20 rounded-full bg-gradient-to-br from-beige-200 to-nude-100 shadow-md sm:block" />
          </div>
        </div>
      </Container>
    </section>
  );
}
