import Link from "next/link";

import { cn } from "@/lib/utils";

const adminNavItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Settings", href: "/admin/settings" },
] as const;

type AdminSidebarProps = {
  className?: string;
};

export function AdminSidebar({ className }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-full flex-col gap-1 border-r border-border/60 bg-card p-4 lg:w-64",
        className
      )}
    >
      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Admin Panel
      </p>
      {adminNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
