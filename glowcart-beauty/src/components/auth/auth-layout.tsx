import Link from "next/link";

import { Container } from "@/components/common/container";
import { siteConfig } from "@/constants/site-config";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
};

export function AuthLayout({ children, title, description, className }: AuthLayoutProps) {
  return (
    <section className="bg-beige-50/40 py-10 sm:py-14 lg:py-16">
      <Container className={cn("max-w-md", className)}>
        <div className="mb-8 space-y-2 text-center">
          <Link
            href="/"
            className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            {siteConfig.name}
          </Link>
          <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </Container>
    </section>
  );
}
