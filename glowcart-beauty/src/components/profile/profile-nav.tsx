"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Package, Settings, UserRound } from "lucide-react";

import { routes } from "@/constants/routes";
import { cn } from "@/lib/utils";

const profileLinks = [
  { href: routes.profile, label: "Overview", icon: UserRound },
  { href: `${routes.profile}/orders`, label: "Orders", icon: Package },
  { href: `${routes.profile}/addresses`, label: "Addresses", icon: MapPin },
  { href: `${routes.profile}/settings`, label: "Settings", icon: Settings },
] as const;

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {profileLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === routes.profile
            ? pathname === routes.profile
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
