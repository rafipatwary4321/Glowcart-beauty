import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <Container as="div">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-gradient-to-br from-rose-50/80 via-white to-beige-50 px-6 py-12 text-center shadow-sm sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Join the Glow
          </p>
          <h2 className="mt-3 font-heading text-2xl font-medium text-foreground sm:text-3xl">
            Get 10% off your first order
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Subscribe to receive exclusive offers, new arrivals, and beauty tips
            straight to your inbox.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="rounded-full bg-background"
              required
            />
            <Button type="submit" className="rounded-full shrink-0 px-6">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </Container>
    </section>
  );
}
