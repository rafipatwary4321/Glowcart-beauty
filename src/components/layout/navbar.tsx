"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site-config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = 2;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container as="div" className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <div className="flex items-center gap-3 lg:gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>

          <Link href="/" className="group flex flex-col">
            <span className="font-heading text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
              {siteConfig.name}
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
              {siteConfig.tagline}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
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
