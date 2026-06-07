import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PromoBanner() {
  return (
    <section className="py-8 sm:py-10">
      <Container as="div">
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-10 -top-10 size-64 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 size-72 rounded-full bg-nude-300/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">
                Limited Time Offer
              </p>
              <h2 className="font-heading text-3xl font-medium text-white sm:text-4xl">
                Up to 30% off skincare essentials
              </h2>
              <p className="text-sm text-white/70 sm:text-base">
                Refresh your routine with our bestselling serums, cleansers, and
                moisturizers. Free shipping on orders over ৳2,000.
              </p>
            </div>
            <Link
              href="/shop?tag=sale"
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "rounded-full bg-white px-8 text-foreground hover:bg-white/90"
              )}
            >
              Shop the Sale
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
