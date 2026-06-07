import type { Metadata } from "next";

import { Container } from "@/components/common/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        </div>

        <Card className="max-w-2xl border-border/60">
          <CardHeader>
            <CardTitle>Checkout placeholder</CardTitle>
            <CardDescription>
              This route is protected by authentication. Payment and order submission will be
              implemented in a later phase.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You are signed in and can access checkout. Delivery address selection, payment
            methods, and order confirmation UI will be added next.
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
