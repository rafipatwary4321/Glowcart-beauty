import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart";
import { Container } from "@/components/common/container";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review items in your GlowCart Beauty shopping cart.",
};

export default function CartPage() {
  return (
    <section className="bg-beige-50/30 py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Your Bag
          </p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Shopping Cart
          </h1>
        </div>
        <CartPageContent />
      </Container>
    </section>
  );
}
