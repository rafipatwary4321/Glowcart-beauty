"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  BarChart3,
  BookOpen,
  FileSpreadsheet,
  Image,
  LayoutDashboard,
  Menu,
  Package,
  PackageSearch,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { routes } from "@/constants/routes";
import { siteConfig } from "@/constants/site-config";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { label: "Dashboard", href: routes.admin.root, icon: LayoutDashboard },
  { label: "Products", href: routes.admin.products, icon: Package },
  { label: "Categories", href: routes.admin.categories, icon: Tag },
  { label: "Brands", href: routes.admin.brands, icon: Store },
  { label: "Orders", href: routes.admin.orders, icon: ShoppingBag },
  { label: "Inventory", href: routes.admin.inventory, icon: PackageSearch },
  { label: "Analytics", href: routes.admin.analytics, icon: BarChart3 },
  { label: "Reports", href: routes.admin.reports, icon: FileSpreadsheet },
  { label: "Users", href: routes.admin.users, icon: Users },
  { label: "Banners", href: routes.admin.banners, icon: Image },
  { label: "Blog", href: routes.admin.blogs, icon: BookOpen },
  { label: "Coupons", href: routes.admin.coupons, icon: BadgePercent },
  { label: "Reviews", href: routes.admin.reviews, icon: Star },
  { label: "Settings", href: routes.admin.settings, icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === routes.admin.root
            ? pathname === routes.admin.root
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

type AdminSidebarProps = {
  className?: string;
};

export function AdminSidebar({ className }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card lg:flex",
        className
      )}
    >
      <div className="border-b border-border/60 px-5 py-5">
        <Link href={routes.admin.root} className="block">
          <p className="font-heading text-lg font-semibold text-foreground">{siteConfig.name}</p>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <NavLinks />
      </div>
      <div className="border-t border-border/60 p-4">
        <Button asChild variant="outline" className="w-full rounded-full" size="sm">
          <Link href={routes.home}>View Storefront</Link>
        </Button>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
      >
        <Menu className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-full max-w-xs p-0">
          <SheetHeader className="border-b border-border/60 px-5 py-5 text-left">
            <SheetTitle className="font-heading text-lg">{siteConfig.name}</SheetTitle>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </SheetHeader>
          <div className="p-4">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
