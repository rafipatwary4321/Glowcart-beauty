"use client";

import Link from "next/link";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig } from "@/constants/site-config";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full max-w-xs p-0">
        <SheetHeader className="border-b border-border/60 px-6 py-5 text-left">
          <SheetTitle className="font-heading text-xl">{siteConfig.name}</SheetTitle>
          <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
        </SheetHeader>

        <nav className="flex flex-col px-4 py-4">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onOpenChange(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Separator />

        <div className="flex flex-col gap-2 px-4 py-4">
          <Button variant="outline" className="w-full justify-start rounded-full">
            <User className="size-4" />
            Sign In
          </Button>
          <Button className="w-full rounded-full" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
