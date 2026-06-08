"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <section className="bg-gradient-to-b from-rose-50/40 via-white to-beige-50/30 py-20 sm:py-24">
          <Container className="max-w-lg text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Application error
            </p>
            <h1 className="mt-3 font-heading text-3xl font-medium text-foreground sm:text-4xl">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              A critical error occurred. Please refresh the page or return home.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button type="button" className="rounded-full" onClick={reset}>
                Try again
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </Container>
        </section>
      </body>
    </html>
  );
}
