import Link from "next/link";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="bg-gradient-to-b from-rose-50/40 via-white to-beige-50/30 py-20 sm:py-24">
      <Container className="max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-3 font-heading text-3xl font-medium text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          The page you are looking for may have moved or no longer exists.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="rounded-full">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
