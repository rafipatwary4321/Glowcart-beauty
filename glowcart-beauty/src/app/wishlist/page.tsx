import type { Metadata } from "next";

import { Container } from "@/components/common/container";
import { WishlistPageContent } from "@/components/wishlist";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved beauty favorites at GlowCart Beauty.",
};

export default function WishlistPage() {
  return (
    <section className="bg-beige-50/30 py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Saved for Later
          </p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            My Wishlist
          </h1>
        </div>
        <WishlistPageContent />
      </Container>
    </section>
  );
}
