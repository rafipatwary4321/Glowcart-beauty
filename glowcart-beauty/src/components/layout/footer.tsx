import Link from "next/link";
import { Mail, MapPin, Phone, Share2 } from "lucide-react";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/constants/site-config";
import { skinConcerns } from "@/data/skin-concerns";

const socialLinks = [
  { label: "IG", href: siteConfig.social.instagram },
  { label: "FB", href: siteConfig.social.facebook },
  { label: "PIN", href: siteConfig.social.pinterest },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-gradient-to-b from-beige-50 to-rose-50/30">
      <Container as="div" className="py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block">
              <span className="font-heading text-xl font-semibold text-foreground">
                {siteConfig.name}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-white text-xs font-semibold text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
              <span className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-white text-muted-foreground">
                <Share2 className="size-4" />
              </span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Skin Concerns
            </h3>
            <ul className="space-y-2.5">
              {skinConcerns.slice(0, 5).map((concern) => (
                <li key={concern.id}>
                  <Link
                    href={`/products?concern=${concern.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {concern.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Support
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Stay in the glow
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Exclusive offers and beauty tips, straight to your inbox.
            </p>
            <form className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-full border-border/60 bg-white"
              />
              <Button type="submit" className="rounded-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5 shrink-0" />
                {siteConfig.contact.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5 shrink-0" />
                {siteConfig.contact.phone}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" />
              {siteConfig.contact.address}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs text-muted-foreground">We accept:</span>
            {siteConfig.paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-full border border-border/60 bg-white px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
