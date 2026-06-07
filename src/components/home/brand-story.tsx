import Link from "next/link";
import { Leaf } from "lucide-react";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BrandStory() {
  return (
    <section className="border-y border-border/60 bg-gradient-to-b from-white to-beige-50/80 py-14 sm:py-16 lg:py-20">
      <Container as="div">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-nude-100 via-rose-50 to-beige-100 shadow-lg">
              <div className="flex h-full items-center justify-center">
                <Leaf className="size-16 text-nude-400" strokeWidth={1} />
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 rounded-2xl border border-border/60 bg-background p-4 shadow-md sm:-right-8">
              <p className="font-heading text-3xl font-semibold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground">Cruelty-free promise</p>
            </div>
          </div>

          <div className="order-1 space-y-5 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Our Philosophy
            </p>
            <h2 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Beauty that feels as good as it looks
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              At GlowCart Beauty, we believe premium cosmetics should celebrate
              your natural glow — never mask it. Every product is thoughtfully
              selected for quality ingredients, elegant packaging, and results
              you can see and feel.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              From gentle skincare rituals to statement makeup, we bring the
              world&apos;s finest beauty brands to Bangladesh with seamless
              checkout and trusted payment options.
            </p>
            <Link
              href="/about"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
