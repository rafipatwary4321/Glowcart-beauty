"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/constants/site-config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = 2;

  return (
    <header className="border-b border-border/60 bg-background/90 backdrop-blur-md">
      <Container as="div" className="flex h-14 items-center justify-between gap-4 sm:h-16 lg:h-[4.25rem]">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>

          <Link href="/" className="group shrink-0">
            <span className="font-heading text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg lg:text-xl">
              {siteConfig.name}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:block">
              {siteConfig.tagline}
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-rose-50 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden max-w-sm flex-1 px-4 lg:block xl:max-w-md">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, brands..."
              className="h-9 rounded-full border-border/60 bg-beige-50/80 pl-9 text-sm"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Search">
            <Search className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Account">
            <User className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative" aria-label="Shopping cart">
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </Container>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
