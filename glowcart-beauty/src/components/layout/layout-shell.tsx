"use client";

import { usePathname } from "next/navigation";

import { StorefrontLayout } from "@/components/layout/storefront-layout";
import type { PublicSiteSettings } from "@/lib/content/settings-service";

type LayoutShellProps = {
  children: React.ReactNode;
  settings: PublicSiteSettings;
};

export function LayoutShell({ children, settings }: LayoutShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return <StorefrontLayout settings={settings}>{children}</StorefrontLayout>;
}
