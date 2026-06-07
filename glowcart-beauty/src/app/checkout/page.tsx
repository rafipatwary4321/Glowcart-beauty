import type { Metadata } from "next";

import { CheckoutPageContent } from "@/components/checkout";
import { Container } from "@/components/common/container";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your GlowCart Beauty order.",
};

export default function CheckoutPage() {
  return (
    <section className="bg-beige-50/30 py-10 sm:py-14 lg:py-16">
      <Container>
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Checkout
          </p>
          <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Secure Checkout
          </h1>
          <p className="text-sm text-muted-foreground">
            Review your details, choose delivery and payment, then place your order.
          </p>
        </div>

        <CheckoutPageContent />
      </Container>
    </section>
  );
}
