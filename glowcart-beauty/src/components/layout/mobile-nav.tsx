"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";

import { UserAvatar } from "@/components/profile/user-avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { siteConfig } from "@/constants/site-config";
import { routes } from "@/constants/routes";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const { data: session } = useSession();
  const user = session?.user;

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
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-3">
                <UserAvatar name={user.name} image={user.image} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start rounded-full" asChild>
                <Link href={routes.profile} onClick={() => onOpenChange(false)}>
                  <User className="size-4" />
                  My Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-full text-destructive"
                onClick={() => {
                  onOpenChange(false);
                  void signOut({ callbackUrl: routes.home });
                }}
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="outline" className="w-full justify-start rounded-full" asChild>
              <Link href={routes.login} onClick={() => onOpenChange(false)}>
                <User className="size-4" />
                Login
              </Link>
            </Button>
          )}
          <Button className="w-full rounded-full" asChild>
            <Link href="/products" onClick={() => onOpenChange(false)}>
              Shop Now
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
